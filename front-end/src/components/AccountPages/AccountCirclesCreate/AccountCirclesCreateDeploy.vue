<template>
  <div v-if="circleInfo" id="account-circles-deploy" class="row">
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
      <h3 v-if="circleInfo.circle_id">CIRCLE CONTRACT</h3>
      <h3 v-else>CREATE & DEPLOY</h3>
      <div class="account-circles-deploy-form">
        <form @submit.prevent>
          
          <!-- Circle Contract Chain -->
          <label for="circleContractChain" class="input-label">Blockchain</label>
          <button class="account-circles-deploy-button selected locked">
            <p>{{ defaultchain.chainName }}</p>
            <i class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <p id="circleContractChainHelp" class="help-text mb-3">
            All transactions will be done on this chain.
          </p>

          <!-- Circle Payment Token -->
          <label for="circlePaymentToken" class="input-label mt-2">
            Payment Token
          </label>
          <button
            class="account-circles-deploy-button selected locked"
            :class="circleInfo.circle_payment_token == this.defaultchain.nativeToken.address ? 'selected' : ''"
            @click="circleInfo.circle_payment_token = this.defaultchain.nativeToken.address"
          >
            <SvgPaymentToken
              :chainId="circleInfo.circle_chain_id"
              :paymentToken="circleInfo.circle_payment_token"
              :tooltip="false"
              customClass="mb-1 me-2"
            />
            <p>{{ defaultchain.nativeToken.symbol }}</p>
            <i class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <p id="circlePaymentTokenHelp" class="help-text mb-3">
            This token is used to pay contributions and receive loans.
          </p>

          <!-- Circle Round Days -->
          <label for="circleRoundDays" class="input-label mt-2">
            Round Period
          </label>
          <button
            class="account-circles-deploy-button selected locked"
          >
            <p>Monthly (30 days)</p>
            <i class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <p id="circleRoundDaysHelp" class="help-text mb-3">
            Duration of each round in days.
          </p>

          <!-- Payment Type -->
          <label for="circlePaymentType" class="input-label mt-2">Payment Type</label>
          <button
            class="account-circles-deploy-button"
            :class="circleInfo.circle_payment_type == 'fixed_pay' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
            @click="circleInfo.circle_payment_type = 'fixed_pay'"
          >
            <p>Fixed Payment</p>
            <i v-if="circleInfo.circle_payment_type == 'fixed_pay' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <button
            class="account-circles-deploy-button mt-2"
            :class="circleInfo.circle_payment_type == 'fixed_loan' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
            @click="circleInfo.circle_payment_type = 'fixed_loan'"
          >
            <p>Fixed Loan</p>
            <i v-if="circleInfo.circle_payment_type == 'fixed_loan' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleRoundDaysHelp" class="help-text mb-3">
            In the fixed payment type, the loan amount will be based on the number of members and other rules.
          </p>
          <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleRoundDaysHelp" class="help-text mb-3">
            In the fixed loan type, the contribution amount will be based on the number of members and other rules.
          </p>

          <!-- Circle Service Charge -->
          <label for="circleServiceCharge" class="input-label mt-2">
            Service Charge
            <span class="input-label-small">(Fixed Rate)</span>
          </label>
          <button
            class="account-circles-deploy-button selected locked"
          >
            <p>{{ `${circleInfo.circle_service_charge} (${circleInfo.circle_service_charge * 100}%)` }}</p>
            <i class="fa fa-lock ps-2" aria-hidden="true"></i>
          </button>
          <p id="circleServiceChargeHelp" class="help-text mb-3">
            Piltonet service charge rate that is deducted from the loan amount.
          </p>
          
          <!-- Circle Creator Earnings -->
          <!-- To Do -->
          <div v-if="false">
            <label for="circleCreatorEarnings" class="input-label mt-2">
              Creator Earnings
              <span class="input-label-small">(Percent)</span>
            </label>
            <input
              ref="circle_creator_earnings"
              id="circleCreatorEarnings"
              type="number"
              placeholder="e.g. 0.5"
              min=0.00
              :max="maxCreatorEarnings"
              step="0.01"
              class="small-input mb-0"
              :class="hasError['circle_creator_earnings'] ? 'has-error' : ''"
              aria-describedby="circleCreatorEarningsHelp"
              v-model="circleInfo.circle_creator_earnings"
            />
            <p id="circleCreatorEarningsHelp" class="help-text mb-3">
              {{ `Earnings of the circle creator, up to ${maxCreatorEarnings}%.` }}
            </p>
          </div>
          
          <!-- Create & Deploy Button -->
          <div v-if="circleInfo.circle_id">
            <!-- Contract Address -->
            <label for="contractAddress" class="input-label mt-2">Contract Address</label>
            <div class="row">
              <button
                class="account-circles-deploy-button selected locked"
              >
                <p>{{ utils.truncate(circleInfo.circle_id, 17) }}</p>
              </button>
              <div class="col-12 col-sm-3">
                <div class="d-flex flex-row justify-content-start align-items-center h-100 third-gray-btn ps-1">
                  <!-- Copy Icon -->
                  <el-tooltip
                    :content="this.copyAddressTooltip"
                    placement="top"
                    :hide-after="0"
                  >
                    <a
                      id="copy-contract-address"
                      role="button"
                      @click="copyAddress('copy-contract-address', circleInfo.circle_id)"
                      class="ms-2"
                    >
                      <i class="far fa-copy" aria-hidden="true"></i>
                    </a>
                  </el-tooltip>
                  <!-- Explore Icon -->
                  <el-tooltip
                    content="View in Explorer"
                    placement="top"
                    :hide-after="0"
                  >
                    <a
                      v-if="explorerLink"
                      :href="explorerLink"
                      target="_blank"
                      class="ms-2"
                    >
                      <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <input
              type="submit"
              value="DEPLOY"
              @click="deployCircle"
            />
          </div>

        </form>
      </div>
      <form action=""></form>
    </div>
  </div>

  <NotFound v-else />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
// import deploy from "@/services/deploy";
import NotFound from '@/pages/NotFound.vue';
import venomwallet from "@/wallets/venomwallet";
import { Address } from 'everscale-inpage-provider';

const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateDeploy",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  emits: ["setActivePage"],
  data() {
    return {
      circleInfo: this.circleInfoProps,
      maxCreatorEarnings: process.env.VUE_APP_CIRCLES_MAX_CREATOR_EARNINGS / 100,
      hasError: {
        circle_creator_earnings: false
      },
      copyAddressTooltip: "Copy Address",
      explorerLink: null
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
      this.setup();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      if(this.circleInfoProps) {
        this.circleInfo = this.circleInfoProps;
        this.explorerLink = `${this.defaultchain.explorer}accounts/${this.circleInfo.circle_id}`;
      } else {
        // New Circle
        this.circleInfo = {
          circle_id: null,
          circle_contract: process.env.VUE_APP_CIRCLE_CONTRACT,
          circle_chain_id: this.defaultchain.chainId,
          circle_payment_token: this.defaultchain.nativeToken.address,
          circle_round_days: 30,
          circle_payment_type: 'fixed_pay',
          circle_service_charge: process.env.VUE_APP_CIRCLES_SERVICE_CHARGE_X10000 / 10000,
          circle_creator_earnings: 0
        }
      }
    },
    async deployCircle() {
      if(this.checkForm()) {
        const circleOwner =  new Address(this.accountAddress);
        const initParams = {
          version: "A01",
          circleOwner: circleOwner,
          serviceAddress: process.env.VUE_APP_VENOM_SERVICE_ADMIN_ADDRESS,
          nonce: (Math.random() * 64000).toFixed()
        }
        const constructorParams = {
          paymentToken: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"),
          roundDays: this.circleInfo.circle_round_days,
          paymentType: this.circleInfo.circle_payment_type == 'fixed_pay' ? 0 : 1,
          creatorEarnings_x10000: this.circleInfo.circle_creator_earnings * 100
        }
        const circleContract = await venomwallet.deployContract(
          LendingCircleContract,
          initParams,
          constructorParams,
          "5000000000" // 5 venom
        );
        if(circleContract) {
          this.circleInfo.circle_id = circleContract.address.toString();
          let apiResponse = await api.post_account_circles_creator_create(this.circleInfo);
          if(apiResponse.data.done) {
            this.circleInfo = apiResponse.data.result[0];
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$emit('setActivePage', 'setup', this.circleInfo.circle_id, true) }
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
          this.notif({
            title: "OOPS!",
            message: "Something Went Wrong, Please Try Again.",
            type: "error",
            duration: 3000,
          })
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
          if(element == 'circle_creator_earnings') {
            this.circleInfo[element] = this.circleInfo[element] < 0 ? 0 : parseInt(this.circleInfo[element] * 100) / 100;
            if(parseInt(this.circleInfo[element] * 100) > this.maxCreatorEarnings * 100) {
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The creator earnings should not be more than ${this.maxCreatorEarnings}%.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
        });
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy" aria-hidden="true"></i>';
        }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-deploy {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.account-circles-deploy-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: rgba(var(--ptn-color-rgb), 0.3);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 200px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.account-circles-deploy-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.account-circles-deploy-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
  border: 1px solid rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.date-button {
  color: var(--ptn-second-blue);
  width: 95%;
  max-width: 150px;
}
.front-icon {
  height: 40px;
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
