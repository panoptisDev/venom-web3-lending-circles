<template>
  <div v-if="connectedAccount?.is_connected" id="connected">
    <el-dialog :title="venomProvider ? '🟢' : '🟡'" v-model="showWallet" class="connected-dialog">
      <!-- Wallet -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-3">
        <h5 class="fw-bold">
          <img
            src="@/assets/icons/venom-logo.svg"
            height="35"
            class="me-2"
          />
          <span class="top-text connected-text">Venom Wallet Connected</span>
        </h5>
      </div>
      <!-- Account Address -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="top-text-small ms-2">Address:</span>
        <span class="main-text-small ps-2">{{ utils.truncate(connectedAccount.account_address?.toUpperCase(), 13) }}</span>
        <span class="note-text">
          <!-- Copy Icon -->
          <el-tooltip
            :content="this.copyAddressTooltip"
            placement="top"
            :hide-after="0"
          >
            <a id="copy-account" role="button" @click="copyAccount('copy-account')">
              <i class="far fa-copy ms-2" aria-hidden="true"></i>
            </a>
          </el-tooltip>
          <!-- Explore Icon -->
          <el-tooltip
            content="View in Explorer"
            placement="top"
            :hide-after="0"
          >
            <a :href="`${defaultchain.explorer}accounts/${connectedAccount.account_address}`" target="_blank">
              <i class="fa fa-external-link ms-2" aria-hidden="true"></i>
            </a>
          </el-tooltip>
        </span>
      </div>
      
      <!-- Account Balance -->
      <div class="d-flex flex-row justify-content-start align-items-start mb-2">
        <div class="d-flex flex-row justify-content-start align-items-center">
          <span class="top-text-small ms-2">Balance:</span>
        </div>
        <div class="d-flex flex-column justify-content-start align-items-start">
          <div class="d-flex flex-row justify-content-start align-items-center mb-1">
            <el-tooltip
                :content="defaultchain.nativeToken.symbol"
                placement="top"
                :hide-after="0"
            >
              <img :src="defaultchain.nativeToken.logo" class="token-logo-small mx-2" />
            </el-tooltip>
            <span v-if="connectedAccount.account_balance === undefined" class="main-text-small"><i class="fa fa-sync fa-spin"></i></span>
            <span v-else class="main-text-small">
              {{ utils.fixedNumber(connectedAccount.account_balance / 10 ** defaultchain.nativeToken.decimals, 5, 2) }}
            </span>
          </div>
          <div v-if="defaultchain.supportedTokens.length > 0" class="d-flex flex-row justify-content-start align-items-center">
            <el-tooltip
                :content="defaultchain.supportedTokens[0].symbol"
                placement="top"
                :hide-after="0"
            >
              <img :src="defaultchain.supportedTokens[0].logo" class="token-logo-small mx-2" />
            </el-tooltip>
            <span v-if="connectedAccount.token_balance === undefined" class="main-text-small"><i class="fa fa-sync fa-spin"></i></span>
            <span v-else class="main-text-small">
              {{ utils.fixedNumber(connectedAccount.token_balance / 10 ** defaultchain.supportedTokens[0].decimals, 5, 2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Current Chain -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-4">
        <span class="top-text-small ms-2">Network:</span>
        <span class="main-text-small ps-2">{{ currentChain || 'Undefined' }}</span>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="venomProvider" type="success" @click="showWallet = false">Great Let's Go</el-button>
          <el-button v-else type="warning">loading</el-button>
          <el-button type="danger" @click="onDisconnectButtonClick">Logout</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import { EverscaleStandaloneClient } from "everscale-standalone-client";
// import { VenomConnect } from "venom-connect";
import venomwallet from "@/wallets/venomwallet"
import { mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus'

export default {
  name: "VenomConnectModal",
  data() {
    return {
      venomConnect: undefined,
      venomProvider: undefined,
      venomTheme: 'light',
      showWallet: false,
      copyAddressTooltip: "Copy Address",
      loadings: []
    }
  },
  computed: {
    ...mapGetters(["getDarkModeStore", 'getConnectionStore']),
    darkMode() {
      return this.getDarkModeStore;
    },
    currentChain() {
      return this.venomConnect?.checkNetworkName || undefined;
    },
    connectedAccount() {
      return this.getConnectionStore;
    }
  },
  watch: {
    venomConnect() {
      const off = this.venomConnect?.on("connect", this.onConnect);
      const close = this.venomConnect?.on("close", this.onClose);
      return () => {
        off?.() || close?.();
      }
    },
    darkMode() {
      this.updateTheme(this.darkMode ? 'dark' : 'light');
    }
  },
  async mounted() {
    this.venomConnect = await venomwallet.initConnection();
    if(this.venomConnect) await venomwallet.checkAuth(this.venomConnect);
  },
  methods: {
    ...mapActions(["logoutAccount"]),
    
    async onConnectButtonClick() {
      if(!this.connectedAccount?.is_connected) {
        await this.connectWallet();
      } else {
        this.showWallet = true;
      }
    },

    async connectWallet() {
      this.venomConnect = await venomwallet.initVenomConnect();
      if(this.venomConnect) {
        await venomwallet.checkAuth(this.venomConnect);
        this.venomConnect?.connect();
        document.body.style.overflow = 'hidden';
      }
    },

    async onConnect(provider) {
      this.venomProvider = provider;
      await venomwallet.checkConnection(provider);
    },
    
    async onClose() {
      document.body.style.overflow = '';
    },

    async onDisconnectButtonClick() {
      if(this.connectedAccount.is_connected) {
        this.showWallet = false;
        await venomwallet.disconnectWallet(this.venomProvider);
        if(this.$router.currentRoute?._value?.meta?.auth) this.$router.push('/');
      }
    },

    async updateTheme(newTheme) {
      await this.venomConnect?.updateTheme(newTheme);
    },

    async copyAccount(elementId) {
      navigator.clipboard.writeText(this.connectedAccount.account_address);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2"></i>';
        }, 2000);
    },

    showLoading() {
      const randomId = Date.now();
      this.loadings[randomId] = undefined;
      this.loadings[randomId] = ElLoading.service({
        lock: true,
        text: '',
        fullscreen: true,
      });
      return randomId;
    }
  }
};
</script>

<style lang="scss" scoped>
.connected-text {
  border-bottom: solid 2px rgba(var(--ptn-blue-rgb), 0.5);
  padding-bottom: 3px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
