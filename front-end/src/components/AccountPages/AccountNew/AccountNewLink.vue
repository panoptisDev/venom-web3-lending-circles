<template>
  <div id="account-new-link">
    
    <div class="d-flex flex-column justify-content-center align-items-start my-5 ps-2">
      <button
        type="button" 
        class="back-btn p-0"
        @click="connectedAccount.account_status == 'waiting' ? $router.push('/') : $router.push('/account')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>

		<div v-if="connectedAccount.account_status == 'fresh'" class="account-new-link-body">
      <h3>LINK TO EXISTING ACCOUNT</h3>
      <div class="account-new-link-form">
				<form @submit.prevent>
          <!-- Main Account Address -->
					<label for="mainAccountAddress" class="input-label">MAIN ACCOUNT</label>
					<input
            ref="main_account_address"
						id="mainAccountAddress"
						type="text"
						class="middle-input mb-0"
            :class="hasError['main_account_address'] ? 'has-error' : ''"
            placeholder="e.g. 0xE1aC9bC59F0b0Af0fe6704fCcAc9dB58Cd0b426B"
						aria-describedby="fullnameHelp"
						v-model="mainAccountAddress"
					/>
					<p id="fullnameHelp" class="help-text mb-3">
            Enter the account address you created your profile with.
					</p>
          
					<!-- Save Button -->
					<input
						type="submit"
						value="LINK ACCOUNT"
						@click="linkAccount"
					/>

        </form>
      </div>
      <p class="main-text-small">
        <i class="fa fa-asterisk pe-1" aria-hidden="true"></i>
        If you don't have an account, click
        <span
          role="button"
          @click="$router.push('/account/create')"
          class="front-btn blue-btn fw-bold"
        >
          here
        </span>
        to create one.
      </p>
    </div>
		
    <div v-if="connectedAccount.account_status == 'waiting'" class="account-new-link-body">
      <h3>LINK TO EXISTING ACCOUNT</h3>
      <p class="main-text">
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
        You have asked to link to main account
        <span class="blue-btn">
          {{ `(${utils.truncate(connectedAccount.main_account_address.toUpperCase(), 12)})` }}
        </span>. Your request is pending approval.
      </p>
      
      <!-- Cancel Link Request -->
      <div class="d-inline-flex justify-content-start align-items-center mt-5">
        <button
          @click="cancelLinkRequest"
          class="front-btn red-btn red-border px-3 py-2"
        >
        Cancel Link Request
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import metamask from "@/wallets/metamask";
import venomwallet from '@/wallets/venomwallet';

export default {
  name: "AccountNewLink",
  data() {
    return {
      mainAccountAddress: '',
      wallet: this.defaultchain.wallets[0] == 'venom-connect' ? venomwallet : metamask,
      hasError: {
        main_account_address: false,
      }
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setConnectionStoreByKey', 'setProfileStore']),
    async linkAccount() {
      if(this.checkForm()) {
        let personalSign = await this.personalSign();
        if(personalSign) {
          let apiResponse = await api.post_account_link({main_account_address: this.mainAccountAddress});
          if(apiResponse.data.done) {
            this.setConnectionStoreByKey({
              account_status: 'waiting',
              main_account_address: this.mainAccountAddress
            });
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 5000,
              onClose: () => { this.$router.push("/account/link") }
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
      }
    },
    async cancelLinkRequest() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_link_cancel();
        if(apiResponse.data.done) {
          this.setConnectionStoreByKey({
            account_status: 'fresh',
            main_account_address: null
          });
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.push("/account/link") }
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
        this.connectedAccount.account_address,
        null
      );
      return personalSignResult;
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this.mainAccountAddress == null || this.mainAccountAddress.length != 42) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "The main address is not entered correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
        });
        return true;
      } catch(err) {
        // console.log(err);
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#account-new-link {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
  margin: 20px auto 0;
}
.account-new-link-body {
  text-align: start;
  border: none;
  border-radius: 16px;
  background: var(--ptn-second-bg);
  width: 100%;
  // max-width: 940px;
  // margin: 20px auto 0;
  padding: 50px 30px;
}
.account-new-link-body h3 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 30px;
  color: var(--ptn-third-gray);
  margin: 0;
  padding: 10px 0 30px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .account-new-link-body {
    padding: 30px 15px;
  }
  .account-new-link-body h3 {
    font-size: 20px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
