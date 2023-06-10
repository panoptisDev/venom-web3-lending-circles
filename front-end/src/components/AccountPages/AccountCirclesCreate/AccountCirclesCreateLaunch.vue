<template>
  <div v-if="circleInfoProps" id="account-circles-whitelist" class="row">
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
    <div class="main-section row">
      <h3>CIRCLE REVIEW</h3>
      <!-- Circle Name -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="top-text">
          {{ circleInfoProps.circle_name }}
        </span>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Round Period -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">
            Round Period:
          </span>
          <span class="top-text-small ps-2">
            Monthly<span class="main-text-small ps-2">(30 days)</span>
          </span>
        </div>
        <!-- Payment Type -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Payment Type:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
              circleInfoProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
            }}
          </span>
        </div>
        <!-- Number Of Members -->
        <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
          class="d-flex flex-row justify-content-start align-items-center mt-4"
        >
          <span class="note-text">Number Of Members</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_max_members }}
          </span>
          <span class="main-text-small ps-2">people</span>
        </div>
        <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Number Of Members</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_min_members }}
          </span>
          <span class="main-text-small ps-2">to</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_max_members }}
          </span>
          <span class="main-text-small ps-2">people</span>
        </div>
        <!-- Monthly Payments & Loan Amount - fixed_pay -->
        <div v-if="circleInfoProps.circle_payment_type == 'fixed_pay'">
          <div class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Monthly Payments:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">(fixed)</span>
          </div>
          <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center mt-4"
          >
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_min_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">to</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
        </div>
        <!-- Monthly Payments & Loan Amount - fixed_loan -->
        <div v-if="circleInfoProps.circle_payment_type == 'fixed_loan'">
          <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center mt-4"
          >
            <span class="note-text">Monthly Payments:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount / circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Monthly Payments:</span>
            <span class="top-text-small ps-2">
              {{ Math.round(((circleInfoProps.circle_fixed_amount / circleInfoProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">to</span>
            <span class="top-text-small ps-2">
              {{ Math.round(((circleInfoProps.circle_fixed_amount / circleInfoProps.circle_min_members) + Number.EPSILON) * 100) / 100 }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
  
          <div class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">(fixed)</span>
          </div>
  
        </div>
        <!-- Start Date -->
        <div v-if="circleInfoProps.circle_start_date"
          class="d-flex flex-row justify-content-start align-items-center mt-4"
        >
          <span class="note-text">Start Date:</span>
          <span class="top-text-small ps-2">
            {{ utils.formatDate(circleInfoProps.circle_start_date, 'DD Month YYYY') }}
          </span>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Order Of Winners -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Order Of Winners:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_winners_order == 'random' ? 'Random' : 
              circleInfoProps.circle_winners_order == 'fixed' ? 'Fixed' : ''
            }}
          </span>
        </div>
        <!-- Number Of Winners -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Number Of Winners:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_winners_number }}
          </span>
          <span class="main-text-small ps-2">people / 30 days</span>
        </div>
        <!-- Patience Benefit -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Patience Benefit:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_patience_benefit * 100 }}
          </span>
          <span class="main-text-small ps-1">%</span>
        </div>
        <!-- Service Charge -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Service Charge:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_service_charge * 100 }}
          </span>
          <span class="main-text-small ps-1">%</span>
        </div>
        <!-- Contract Address -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Contract Address:</span>
          <span class="top-text-small ps-2">
            {{ utils.truncate(circleInfoProps.circle_id, 17) }}
          </span>
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
                @click="copyAddress('copy-contract-address', circleInfoProps.circle_id)"
                class="ms-2"
              >
                <i class="far fa-copy main-text-small" aria-hidden="true"></i>
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
                <i class="fa fa-external-link main-text-small" aria-hidden="true"></i>
              </a>
            </el-tooltip>
          </div>
        </div>
      </div>

    </div>

    <!-- LAUNCH CIRCLE -->
    <div v-if="circleInfoProps.circle_status == 'setuped'" class="main-section">
      <h3>LAUNCH CIRCLE</h3>
      <!-- Circle Start Date -->
      <div>
        <label for="circleStartDate" class="input-label">Start Date</label>
        <button class="account-circles-setup-button date-button" @click="showCalendarModal = true">
          <p>{{ utils.formatDate(startDate, 'DD Month YYYY') || 'Not Set' }}</p>
        </button>
        <p id="circleStartDateHelp" class="help-text">
          The start date must be after today and at least 12 hours away from now.
        </p>
      </div>

      <!-- Circle Launch Button -->
      <div
        type="button"
        @click="confirmLaunch"
        class="launch-button mt-5"
      >
        <span class="m-0 p-0">LAUNCH</span>
      </div>
    </div>

    <!-- LAUNCHED CIRCLE -->
    <div v-else-if="circleInfoProps.circle_status == 'launched'" class="main-section">
      <h3>LAUNCH CIRCLE</h3>
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="note-text">
          Launched At:
        </span>
        <span class="top-text-small ps-2">
          {{ utils.formatDate(circleInfoProps.circle_launched_at, 'DD Month YYYY', 'HH:MM') }}
        </span>
      </div>
    </div>

    <!-- Calendar Modal -->
    <div v-if="showCalendarModal" class="col-12">
      <el-dialog title="" v-model="showCalendarModal" class="modal-body calendar-modal text-center">
        <v-date-picker v-model="startDate" :min-date='minStartDate' />
        <template #footer>
          <span class="dialog-footer">
            <el-button
              @click="showCalendarModal = false"
              class="calendar-button mt-4 px-5"
            >
              Ok
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

  </div>

  <NotFound v-else />

  <MessageModal
    ref="message_modal"
    @ok-clicked="launchCircle"
  />

</template>

<script>
import { ElLoading } from 'element-plus';
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
// import abi from "@/services/abi";
import venomwallet from "@/wallets/venomwallet";
import NotFound from '@/pages/NotFound.vue';

const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateLaunch",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      showCalendarModal: false,
      startDate: null,
      minStartDate: '',
      copyAddressTooltip: "Copy Address",
      explorerLink: null,
      openLoadings: []
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
    }
  },
  mounted() {
    this.setup();
    // console.log(this.circleInfoProps);
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      this.startDate = this.circleInfoProps.circle_start_date;
      const now = new Date();
      this.minStartDate = now;
      this.minStartDate.setDate(now.getDate() + (now.getHours() < 12 ? 1 : 2 ))
      if(this.circleInfoProps) {
        this.explorerLink = `${this.defaultchain.explorer}accounts/${this.circleInfoProps.circle_id}`;
      }
    },
    async confirmLaunch() {
      if(this.startDate) {
        this.$refs.message_modal.setMessage({
          message: 'Please verify that the information on your circle is correct.',
          okBtn: 'Verify Information',
          cancelBtn: "Let's Check Again!",
          customStyle: 'width: 430px;'
        })
      } else {
        this.notif({
          message: "The start date has not been specified.",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
        })
      }
    },

    async launchCircle() {
      let loadingId = await this.showLoading();
      try {
        const circleContractAddress = this.circleInfoProps.circle_id;
        const circleContract = await venomwallet.getDeployedContract(LendingCircleContract, circleContractAddress);
        // const circleOwner = new Address(this.connectedAccount.main_account_address);
        const publicKey = await venomwallet.getPublicKey();

        loadingId = await this.showLoading();
        
        const { transaction } = await circleContract.methods.launchCircle({
          startDate: this.startDate.getTime() / 1000
        }).sendExternal({
          publicKey: publicKey
        });

        this.openLoadings[loadingId].close();

        console.log('transaction:', transaction);

        if(!transaction.aborted) {
          let apiResponse = await api.post_account_circles_creator_launch(
            {
              circle_id: this.circleInfoProps.circle_id,
              start_date: this.startDate
            }
          );
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
        } else {
          this.notif({
            title: "OOPS!",
            message: `Transaction failed by code: ${transaction.exitCode}`,
            dangerouslyUseHTMLString: true,
            type: "error",
            duration: 3000,
          })
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
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy main-text-small" aria-hidden="true"></i>';
        }, 2000);
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
#account-circles-whitelist {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.date-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: var(--ptn-second-blue);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 95%;
  max-width: 150px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.launch-button {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 16px;
  line-height: 45px;
  text-align: center;
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 200px;
  // height: 45px;
  margin: 25px 0 15px;
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
