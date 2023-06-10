<template>
  <div id="account-new-create">
    <div class="d-flex flex-column justify-content-center align-items-start my-5 ps-2">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="account-new-create-body">
      <h3>SETUP YOUR ACCOUNT</h3>
      <div class="account-new-create-form">
				<form @submit.prevent>
          <!-- Nickname -->
					<label for="accountNickname" class="input-label">
            Nickname
            <span class="input-label-small">(Required)</span>
          </label>
					<input
            ref="account_username"
						id="accountNickname"
						type="text"
						class="small-input mb-0"
            :class="hasError['account_username'] ? 'has-error' : ''"
						placeholder="Enter A Nickname"
						aria-describedby="nicknameHelp"
						v-model="accountInfo.account_username"
					/>
					<p id="nicknameHelp" class="help-text mb-3">
						The nickname must start with a letter and can only contain letters, numbers, and the underscore character.
					</p>

          <!-- Email -->
					<label for="accountEmail" class="input-label mt-2">
            Email
            <span class="input-label-small">(Required)</span>
          </label>
					<input
            ref="account_email"
						id="accountEmail"
						type="email"
						class="small-input mb-0"
            :class="hasError['account_email'] ? 'has-error' : ''"
						placeholder="Enter Your Email"
						aria-describedby="emailHelp"
						v-model="accountInfo.account_email"
					/>
					<p id="emailHelp" class="help-text mb-3">
            Email is private and it is only visible to your trusted network.
					</p>
          
					<!-- Save Button -->
					<input
						type="submit"
						value="SETUP"
						@click="setupAccount"
					/>

        </form>
      </div>
      <!-- To Do -->
      <p v-if="false" class="main-text-small">
        <i class="fa fa-asterisk pe-1" aria-hidden="true"></i>
        If you already have an account, click
        <span
          role="button"
          @click="$router.push('/account/link')"
          class="front-btn blue-btn fw-bold"
        >
          here
        </span>
        to link to your existing account.
      </p>
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus';
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import venomwallet from "@/wallets/venomwallet";
import { Address } from 'everscale-inpage-provider';

const { AccountsContract } = require('@/contracts');

import metamask from "@/wallets/metamask";



export default {
  name: "AccountNewCreate",
  data() {
    return {
      accountInfo: {
        account_email: '',
        account_username: ''
      },
      wallet: this.defaultchain.wallets[0] == 'venom-connect' ? venomwallet : metamask,
      hasError: {
        account_username: false,
        account_email: false,
      },
      openLoadings: []
    }
  },
  computed: {
    ...mapGetters(['getConnectionStoreByKey']),
    accountAddress() {
      return this.getConnectionStoreByKey('account_address');
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setConnectionStoreByKey', 'setProfileStore']),
    async setupAccount() {
      if(this.checkForm()) {
        let loadingId = await this.showLoading();
        try {
          const accountsContractAddress = AccountsContract.address;
          const accountsContract = await venomwallet.getDeployedContract(AccountsContract, accountsContractAddress);
          const publicKey = await venomwallet.getPublicKey();
          const _accountAddress = new Address(this.accountAddress)
          loadingId = await this.showLoading();
          const { output, transaction } = await accountsContract.methods.setAccount({
            accountAddress: _accountAddress,
            username: this.accountInfo.account_username,
            email: this.accountInfo.account_email,
            answerId: 1
          }).sendExternal({
            publicKey: publicKey,
          });
          this.openLoadings[loadingId].close();

          if(output.done) {
            console.log('transaction:', transaction);

            let apiResponse = await api.post_account_create(this.accountInfo);
            if(apiResponse.data.done) {
              this.setConnectionStoreByKey({
                account_status: 'main',
                main_account_address: this.accountAddress
              });
              this.setProfileStore(apiResponse.data.result[0]);
              this.notif({
                title: "SUCCESS!",
                message: apiResponse.data.message,
                dangerouslyUseHTMLString: true,
                type: apiResponse.data.message_type,
                duration: 3000,
                onClose: () => { this.$router.push("/account/profile") }
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
          } else {
            if(output.err == 102) {
              this.notif({
                title: "OOPS!",
                message: "Nickname already taken, please choose another one.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(output.err == 103) {
              this.notif({
                title: "OOPS!",
                message: "Email already taken, please choose another one.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else {
              this.notif({
                title: "OOPS!",
                message: `Transaction failed by code: ${output.err}`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            }
          }
        } catch(err) {
          this.openLoadings[loadingId].close();
          this.notif({
            title: "OOPS!",
            message: "Something went wrong, please try again later.",
            dangerouslyUseHTMLString: true,
            type: "error",
            duration: 3000,
          })
          console.log(err);
        }
      }
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this.accountInfo[element] == null || this.accountInfo[element].length <= 0) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "Make sure all required fields are filled in correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'account_username' && !(this.accountInfo[element].match(/^(?=.{4,25}$)(?![_])(?!.*[_]{2})[a-z][a-z0-9_]+(?![_])$/i))) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "1. The nickname is between 4 and 25 characters." +
                "<br/>2. It must start with a letter." +
                "<br/>3. It can only contain letters, numbers, and the underscore character.",
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'account_email' && !(this.accountInfo[element].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "The email address is not valid.",
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
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
    },
    async showLoading() {
      const randomId = Date.now();
      this.openLoadings[randomId] = undefined;
      this.openLoadings[randomId] = new ElLoading.service({
        lock: true,
        text: '',
        fullscreen: true,
      });
      return randomId;
    }
  }
}
</script>

<style lang="scss" scoped>
#account-new-create {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
  margin: 20px auto 0;
}
.account-new-create-body {
  text-align: start;
  border: none;
  border-radius: 16px;
  background: var(--ptn-second-bg);
  width: 96%;
  // max-width: 940px;
  // margin: 20px auto 0;
  padding: 50px 30px;
}
.account-new-create-body h3 {
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
  .account-new-create-body {
    padding: 30px 15px;
  }
  .account-new-create-body h3 {
    font-size: 20px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
