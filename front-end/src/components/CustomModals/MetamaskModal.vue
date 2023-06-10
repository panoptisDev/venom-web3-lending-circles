<template>
  <div v-if="isConnected" id="connected">
    <el-dialog :title="connectionStatus == 'connected' ? '🟢' : '🟡'" v-model="showModal" class="connected-dialog">
      <div class="mb-4">
        <h5 class="fw-bold">
          <img
            src="@/assets/icons/metamask-logo.svg"
            height="45"
            class="me-2"
          />
          <span class="connected-text">MetaMask Connected</span>
        </h5>
      </div>
      <p class="mb-2 mt-4">
        Current Account: <strong>{{ utils.truncate(accountAddress, 12) }}</strong>
        <el-tooltip
          :content="this.copyAddressTooltip"
          placement="top"
          :hide-after="0"
        >
          <a id="copy-account" role="button" @click="copyAccount('copy-account')">
            <i class="far fa-copy ms-2"></i>
          </a>
        </el-tooltip>
      </p>
      <p class="mb-4 mt-0">
        Current Network: <strong>{{ `${currentChain || 'Undefined'} ${currentChain ? '('+symbol+')' : ''}` }}</strong>
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="connectionStatus == 'connected'" type="success" @click="showModal = false">Great Let's Go</el-button>
          <el-button v-if="connectionStatus == 'wrong-network'" type="warning" @click="switchNetwork">Switch Network</el-button>
          <el-button type="danger" @click="onDisconnectButtonClick">Logout</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <div v-else id="disconnect">
    <el-dialog v-model="showModal" class="disconnect-dialog">
      <p class="text-center mb-4">Connect your wallet to get started.</p>
      <div
        role="button"
        @click="connectMetamaskWallet"
        class="d-flex flex-row justify-content-center align-items-center connect-btn mx-4 p-2"
      >
        <img src="@/assets/icons/metamask-logo.svg" height="37" class="pe-4" />
        <span class="fw-bold">MetaMask Wallet</span>
      </div>
      
      <!-- To Do -->
      <div
        v-if="false"
        role="button"
        @click="custodialAccount"
        class="d-flex flex-row justify-content-center align-items-center connect-btn mx-4 mt-2 p-2"
      >
        <img src="@/assets/icons/custodial-logo.svg" height="37" class="pe-2" />
        <span class="fw-bold">Custodial Account</span>
      </div>
      
      <!-- To Do -->
      <div v-if="false"
        role="button"
        @click="connectMetamaskWallet"
        class="connect-btn mt-3 mx-4 p-2"
      >
        <img
          src="@/assets/icons/walletconnect-logo.svg"
          height="40"
          class="py-2 me-4"
        />
        <span class="fw-bold">WalletConnect</span>
      </div>
      <template #footer>
        <!-- To Do -->
        <!-- <p class="text-center my-3">
          By connecting your wallet, you agree to our terms of use and privacy
          policy
        </p> -->
        <p class="text-center mt-4">
          New to MetaMask?
          <a href="https://metamask.io/" target="_blank">
            <span class="border-bottom ms-1">
              Click Here
            </span>
          </a>
        </p>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import metamask from "@/wallets/metamask"
import { mapGetters } from "vuex";

export default {
  name: "MetamaskModal",
  data() {
    return {
      showModal: false,
      connectionStatus: "disconnect",
      copyAddressTooltip: "Copy Address"
    }
  },
  computed: {
    ...mapGetters(["getConnectionStoreByKey"]),
    isConnected() {
      return this.getConnectionStoreByKey("is_connected") || false;
    },
    accountAddress() {
      return this.getConnectionStoreByKey("account_address") || null;
    },
    chainId() {
      return this.provider.provider && this.provider.provider.network ? this.provider.provider.network.chainId : null;
    },
    currentChain() {
      return this.provider.provider && this.provider.provider.network ? this.provider.provider.network.chainName : null;
    },
    symbol() {
      return this.provider.provider && this.provider.provider.network ? this.provider.provider.network.nativeCurrency.symbol : null;
    }
  },
  methods: {
    async onConnectButtonClick() {
      this.showModal = metamask.detectMetamask();
      this.connectionStatus = this.isConnected ? this.provider.provider ? this.provider.provider.network ? 
      this.provider.provider.network.chainId === '0x' + this.defaultchain.chainId.toString(16) ? 'connected' : 'wrong-network' : 'wrong-network'
      : 'disconnect' : 'disconnect';
    },

    async connectMetamaskWallet() {
      let connectMetamaskWallet = await metamask.connectMetamaskWallet();
      this.showModal = !connectMetamaskWallet || false;
    },

    async switchNetwork() {
      if(this.isConnected) {
        await metamask.switchNetwork(this.defaultchain.chainId);
      }
    },

    async onDisconnectButtonClick() {
      this.showModal = false;
      await metamask.disconnectWallet();
    },
    async copyAccount(elementId) {
      navigator.clipboard.writeText(this.accountAddress);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2"></i>';
        }, 2000);
    },
    reload() {
      this.$router.go();
    }
  }
}
</script>

<style lang="scss" scoped>
.connect-btn {
  background: rgba(var(--ptn-btn-bg-rgb), 0.9);
  color: var(--ptn-btn-color);
  border: 0 !important;
  border-radius: 16px;
  height: 55px;
}
.connected-text {
  border-bottom: solid 2px rgba(var(--ptn-blue-rgb), 0.5);
  padding-bottom: 3px;
}
</style>
