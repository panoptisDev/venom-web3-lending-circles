<template>
  <div v-if="circleInfo" id="account-circles-setup" class="row">
    <div class="d-flex flex-column justify-content-center align-items-start mx-auto py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/circles')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="main-section">
      <h3>CIRCLE DETAILS</h3>
      <div class="account-circles-setup-form">
        <form @submit.prevent>
          
          <!-- Circle Name -->
          <label for="circleName" class="input-label">
            Circle Name
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            ref="circle_name"
            id="circleName"
            type="text"
            class="small-input mb-0"
            :class="hasError['circle_name'] ? 'has-error' : ''"
            placeholder="e.g. Work Friends"
            aria-describedby="circleNameHelp"
            v-model="circleInfo.circle_name"
          />
          <p id="circleNameHelp" class="help-text mb-3">
            Name the circle whatever you want.
          </p>

          <!-- Fixed Pay -->
          <label v-if="circleInfo.circle_payment_type == 'fixed_pay'" for="circleFixedAmount" class="input-label mt-2">
            Monthly Payments
            <span class="input-label-small">(Required)</span>
          </label>
          <label v-if="circleInfo.circle_payment_type == 'fixed_loan'" for="circleFixedAmount" class="input-label mt-2">
            Loan Amount
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            :disabled="circleInfo.circle_joined_members"
            ref="circle_fixed_amount"
            id="circleFixedAmount"
            type="number"
            :placeholder="`e.g. ${minFixedAmount}`"
            class="small-input mb-0"
            :class="hasError['circle_fixed_amount'] ? 'has-error' : ''"
            aria-describedby="circleFixedAmountHelp"
            v-model="circleInfo.circle_fixed_amount"
          />
          <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleFixedAmountHelp" class="help-text mb-3">
            {{ `Participants contribute the same monthly payment, ${minFixedAmount} to ${maxFixedAmount} ${this.defaultchain.nativeToken.symbol}.` }}
          </p>
          <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleFixedAmountHelp" class="help-text mb-3">
            {{ `The fixed amount of loan that the winner receives, ${minFixedAmount} to ${maxFixedAmount}  ${this.defaultchain.nativeToken.symbol}.` }}
          </p>

          <!-- Min Members -->
          <label for="circleMinMembers" class="input-label mt-2">
            Min. Members
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            :disabled="circleInfo.circle_joined_members"
            ref="circle_min_members"
            id="circleMinMembers"
            type="number"
            placeholder="e.g. 5"
            class="small-input mb-0"
            :class="hasError['circle_min_members'] ? 'has-error' : ''"
            aria-describedby="circleMinMembersHelp"
            v-model="circleInfo.circle_min_members"
          />
          <p id="circleMinMembersHelp" class="help-text mb-3">
            {{ `The minimum number of participants in the circle, ${minMembers} to ${maxMembers} people.` }}
          </p>
          
          <!-- Max Members -->
          <label for="circleMaxMembers" class="input-label mt-2">
            Max. Members
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            :disabled="circleInfo.circle_joined_members"
            ref="circle_max_members"
            id="circleMaxMembers"
            type="number"
            placeholder="e.g. 5"
            class="small-input mb-0"
            :class="hasError['circle_max_members'] ? 'has-error' : ''"
            aria-describedby="circleMaxMembersHelp"
            v-model="circleInfo.circle_max_members"
          />
          <p id="circleMaxMembersHelp" class="help-text mb-3">
            {{ `The maximum number of participants in the circle, ${Math.max(minMembers, circleInfo.circle_min_members)} to ${maxMembers} people.` }}
          </p>
          
          <!-- Order Of Winners -->
          <label for="circleWinnersOrder" class="input-label mt-2">Order Of Winners</label>
          <button
            :disabled="circleInfo.circle_joined_members"
            class="choosing-winners-button"
            :class="circleInfo.circle_winners_order == 'random' ? 'selected' : ''"
            @click="circleInfo.circle_winners_order = 'random'"
          >
          <p class="pt-2">
              <i class="fa fa-dice fa-xl" aria-hidden="true"></i>
              Random
            </p>
            <p class="help-text pt-1 px-1">Winner(s) is/are chosen randomly each month.</p>
          </button>
          <button
            :disabled="circleInfo.circle_joined_members"
            class="choosing-winners-button mb-3"
            :class="circleInfo.circle_winners_order == 'fixed' ? 'selected' : ''"
            @click="circleInfo.circle_winners_order = 'fixed'"
          >
            <p class="ps-2 pt-2">
              <i class="fa fa-calendar-check fa-xl" aria-hidden="true"></i>
              Fixed
            </p>
            <p class="help-text pt-1 px-1">Members can specify their position among the vacant months.</p>
          </button>
          
          <!-- Number Of Winners -->
          <label for="circleWinnersNumber" class="input-label mt-2">
            Number Of Winners
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            :disabled="circleInfo.circle_joined_members"
            ref="circle_winners_number"
            id="circleWinnersNumber"
            type="number"
            placeholder="e.g. 1"
            min="1"
            :max="Math.max(parseInt(circleInfo.circle_max_members /  3), 1)"
            step="1"
            class="small-input mb-0"
            :class="hasError['circle_winners_number'] ? 'has-error' : ''"
            aria-describedby="circleWinnersNumberHelp"
            v-model="circleInfo.circle_winners_number"
          />
          <p id="circleWinnersNumberHelp" class="help-text mb-3">
            The number of winners are chosen per month, default 1 person.
          </p>
          
          <!-- Benefit Of Patience -->
          <label for="circlePatienceBenefit" class="input-label mt-2">
            Patience Benefit
            <span class="input-label-small">(Required)</span>
          </label>
          <input
            :disabled="circleInfo.circle_joined_members"
            ref="circle_patience_benefit"
            id="circlePatienceBenefit"
            type="number"
            step="0.01"
            placeholder="e.g. 10"
            class="small-input mb-0"
            :class="hasError['circle_patience_benefit'] ? 'has-error' : ''"
            aria-describedby="circlePatienceBenefitHelp"
            v-model="circleInfo.circle_patience_benefit"
          />
          <p id="circlePatienceBenefitHelp" class="help-text mb-3">
            Benefit percentage for members who win in the last months, default 0%.
          </p>
          
          <!-- Save Button -->
          <input
            v-if="circleInfo.circle_status == 'deployed'"
            type="submit"
            value="SETUP"
            @click="setupCircle"
          />
          <input
            v-else-if="circleInfo.circle_status == 'setuped'"
            type="submit"
            value="UPDATE"
            @click="setupCircle"
          />

        </form>
      </div>
      <form action=""></form>
    </div>

  </div>

  <NotFound v-else />

</template>

<script>
import { ElLoading } from 'element-plus';
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
// import abi from "@/services/abi";
import venomwallet from "@/wallets/venomwallet";
import NotFound from '@/pages/NotFound.vue';
// import { Address } from 'everscale-inpage-provider';

const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateSetup",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      circleInfo: this.circleInfoProps,
      minFixedAmount: parseInt(process.env.VUE_APP_CIRCLES_MIN_MONTHLY_PAYMENT_IN_VENOM),
      maxFixedAmount: parseInt(process.env.VUE_APP_CIRCLES_MAX_MONTHLY_PAYMENT_IN_VENOM),
      minMembers: parseInt(process.env.VUE_APP_CIRCLES_MIN_MEMBERS),
      maxMembers: parseInt(process.env.VUE_APP_CIRCLES_MAX_MEMBERS),
      hasError: {
        circle_name: false,
        circle_fixed_amount: false,
        circle_min_members: false,
        circle_max_members: false,
        circle_winners_number: false,
        circle_patience_benefit: false,
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
  mounted() {
    this.setup();
  },
  watch: {
    circleInfoProps: function () {
      // if(this.circleInfo.circle_id != this.circleInfoProps.circle_id) this.setup();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    setup() {
      this.circleInfo = this.circleInfoProps;
      if(this.circleInfo) {
        if(this.circleInfo.circle_payment_type == 'fixed_loan') {
          this.minFixedAmount = this.minFixedAmount * this.minMembers;
          this.maxFixedAmount = this.maxFixedAmount * this.maxMembers;
        }
        if(this.circleInfo.circle_status == 'deployed') {
          this.circleInfo['circle_name'] = '';
          this.circleInfo['circle_fixed_amount'] = '';
          this.circleInfo['circle_min_members'] = '';
          this.circleInfo['circle_max_members'] = '';
          this.circleInfo['circle_winners_order'] = 'random';
          this.circleInfo['circle_winners_number'] =1;
          this.circleInfo['circle_patience_benefit'] = 0;
          this.circleInfo['circle_start_date'] = '';
        }
        this.circleInfo.circle_patience_benefit = this.circleInfo.circle_patience_benefit * 100;
      }
    },
    async setupCircle() {
      if(this.checkForm()) {
        let loadingId = await this.showLoading();
        try {
          const circleContractAddress = this.circleInfo.circle_id;
          const circleContract = await venomwallet.getDeployedContract(LendingCircleContract, circleContractAddress);
          const publicKey = await venomwallet.getPublicKey();

          loadingId = await this.showLoading();
          
          const { transaction } = await circleContract.methods.setCircle({
            circleName: this.circleInfo.circle_name,
            fixedAmount: this.circleInfo.circle_fixed_amount * 1e+9,
            minMembers: this.circleInfo.circle_min_members,
            maxMembers: this.circleInfo.circle_max_members,
            winnersOrder: this.circleInfo.circle_winners_order == 'random' ? 0 : 1,
            winnersNumber: this.circleInfo.circle_winners_number,
            patienceBenefit_x10000: this.circleInfo.circle_patience_benefit * 100,
          }).sendExternal({
            publicKey: publicKey
          });
          
          this.openLoadings[loadingId].close();

          if(!transaction.aborted) {
            let apiResponse = await api.post_account_circles_creator_update(this.circleInfo);
            if(apiResponse.data.done) {
              this.notif({
                title: "SUCCESS!",
                message: apiResponse.data.message,
                dangerouslyUseHTMLString: true,
                type: apiResponse.data.message_type,
                duration: 3000,
                onClose: () => {
                  this.circleInfo.circle_status == 'deployed' ?
                  this.$router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: this.circleInfo.circle_id}}) :
                  window.scrollTo(0,0);
                }
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
            if(transaction.exitCode == 102) {
              this.notif({
                title: "OOPS!",
                message: "The value is less than required.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(transaction.exitCode == 103) {
              this.notif({
                title: "OOPS!",
                message: "The circle is already launched.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(transaction.exitCode == 104) {
              this.notif({
                title: "OOPS!",
                message: "The pay amount is out of range.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(transaction.exitCode == 105) {
              this.notif({
                title: "OOPS!",
                message: "The number of members is out of range.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(transaction.exitCode == 106) {
              this.notif({
                title: "OOPS!",
                message: "The number of winners is invalid.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else if(transaction.exitCode == 107) {
              this.notif({
                title: "OOPS!",
                message: "The patience benefit is out of range.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
              })
            } else {
              this.notif({
                title: "OOPS!",
                message: `Transaction failed by code: ${transaction.exitCode}`,
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
          if(this.circleInfo[element] == null || this.circleInfo[element].length <= 0) {
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
          if(element == 'circle_fixed_amount' && (parseInt(this.circleInfo[element]) < this.minFixedAmount || parseInt(this.circleInfo[element]) > this.maxFixedAmount)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The ${this.circleInfo.circle_payment_type == 'fixed_pay' ? 'monthly payments' : 'loan amount'} must be between ${this.minFixedAmount} and ${this.maxFixedAmount}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_min_members' && (parseInt(this.circleInfo[element]) < this.minMembers || parseInt(this.circleInfo[element]) > this.maxMembers)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The minimum number of members must be between ${this.minMembers} and ${this.maxMembers}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_max_members' && (parseInt(this.circleInfo[element]) < parseInt(this.circleInfo['circle_min_members']) || parseInt(this.circleInfo[element]) > this.maxMembers)) {
            console.log(parseInt(this.circleInfo[element]));
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The maximum number of members must be between ${this.circleInfo['circle_min_members']} and ${this.maxMembers}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_winners_number' && (parseInt(this.circleInfo['circle_min_members'] / this.circleInfo[element]) < this.minMembers)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: 'The number of monthly winners is high compared to the minimum number of participants.',
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_patience_benefit' && (this.circleInfo[element] < 0 || this.circleInfo[element] > 100)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "The benefit of patience must be between 0% and 100%.",
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
#account-circles-setup {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.choosing-winners-button,
.account-circles-setup-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: rgba(var(--ptn-blue-rgb), 0.3);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 200px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.choosing-winners-button {
  width: 250px;
  height: 70px;
}
.account-circles-setup-button.selected {
  color: var(--ptn-second-blue);
  cursor: default;
}
.account-circles-setup-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.choosing-winners-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.choosing-winners-button p {
  color: var(--ptn-third-gray);
}
.choosing-winners-button.selected p {
  color: var(--ptn-second-blue);
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
