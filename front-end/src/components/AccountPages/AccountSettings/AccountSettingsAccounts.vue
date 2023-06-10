<template>
  <div id="account-settings-accounts">
    <div class="d-flex flex-column justify-content-center align-items-start ms-3 ms-xl-5 py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/profile')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="main-section">
      <h3>MAIN ACCOUNT</h3>
      <p class="main-text-small">
        {{ utils.truncate(accountWalletsProps.main_account_address, 17) }}
        <el-tooltip
          :content="this.copyAddressTooltip"
          placement="top"
          :hide-after="0"
        >
          <a id="copy-main-address" role="button" class="ms-2" @click="copyAddress('copy-main-address', accountWalletsProps.account_address)">
            <i class="far fa-copy blue-btn" aria-hidden="true"></i>
          </a>
        </el-tooltip>
      </p>
    </div>
    <div v-if="accountWalletsProps.waiting_accounts" class="main-section">
      <h3 class="pt-0">WAITING ACCOUNTS</h3>
      <div>
        <p v-for="(waiting_account_address, index) in accountWalletsProps.waiting_accounts"
          :key="waiting_account_address"
          class="main-text-small"
          :class="index > 0 ? 'mt-2' : ''"
        >
          {{ utils.truncate(waiting_account_address, 17) }}
          <el-tooltip
            :content="this.copyAddressTooltip"
            placement="top"
            :hide-after="0"
          >
            <a :id="`copy-waiting-address-${waiting_account_address}`" role="button" class="ms-2" @click="copyAddress(`copy-waiting-address-${waiting_account_address}`, waiting_account_address)">
              <i class="far fa-copy blue-btn" aria-hidden="true"></i>
            </a>
          </el-tooltip>
          <button
            @click="acceptLinkRequest(waiting_account_address)"
            class="front-btn green-btn ms-3"
          >
            Accept
          </button>
          <button
            @click="rejectLinkedAccount(waiting_account_address)"
            class="front-btn red-btn ms-3"
          >
            Reject
          </button>
        </p>
      </div>
    </div>
    <div class="main-section">
      <h3 class="pt-0">LINKED ACCOUNTS</h3>
      <div v-if="accountWalletsProps.linked_accounts">
        <p v-for="(linked_account_address, index) in accountWalletsProps.linked_accounts"
          :key="linked_account_address"
          class="main-text-small"
          :class="index > 0 ? 'mt-2' : ''"
        >
          {{ utils.truncate(linked_account_address, 17) }}
          <el-tooltip
            :content="this.copyAddressTooltip"
            placement="top"
            :hide-after="0"
          >
            <a :id="`copy-linked-address-${linked_account_address}`" role="button" class="ms-2" @click="copyAddress(`copy-linked-address-${linked_account_address}`, linked_account_address)">
              <i class="far fa-copy blue-btn" aria-hidden="true"></i>
            </a>
          </el-tooltip>
          <button
            @click="removeLinkedAccount(linked_account_address)"
            class="front-btn red-btn ms-4"
          >
            Remove
          </button>
        </p>
      </div>
      <div v-else>
        <p class="note-text">No address is linked to your account.</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import metamask from "@/wallets/metamask";
import venomwallet from '@/wallets/venomwallet';

export default {
  name: "AccountSettingsAccounts",
  props: {
    connectedAccountProps: Object,
    accountWalletsProps: Object
  },
  data() {
    return {
      accountIsMain: false,
      shareLink: null,
      showShareLinkModal: false,
      copyLinkTooltip: "Copy Link",
      copyAddressTooltip: "Copy Address",
      networkExplorerUrl: `${this.defaultchain.explorer}accounts`,
      wallet: this.defaultchain.wallets[0] == 'venom-connect' ? venomwallet : metamask,
      hasError: {
        accept_waiting: false
      }
    };
  },
  mounted() {
    // console.log(this.accountWalletsProps);
  },
  methods: {
    async acceptLinkRequest(waiting_account_address) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_link_accept({waiting_account_address: waiting_account_address});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
          })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ isConnect: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    async rejectLinkedAccount(waiting_account_address) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_link_reject({waiting_account_address: waiting_account_address});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
          })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ isConnect: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    async removeLinkedAccount(linked_account_address) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_link_remove({linked_account_address: linked_account_address});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
          })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ isConnect: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    async personalSign() {
      let personalSignResult = await this.wallet.personalSign(
        "This request requires your signature. It costs you nothing." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccountProps.account_address,
        null
      );
      return personalSignResult;
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy blue-btn" aria-hidden="true"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
#account-settings-accounts {
  width: 96%;
  min-height: calc(100vh - 240px);
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
