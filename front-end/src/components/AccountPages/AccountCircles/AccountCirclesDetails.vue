<template>
  <div v-if="circleInfoProps" id="account-circles-details" class="row">
    <div class="main-section row">
      <h3>CIRCLE DETAILS</h3>
      <!-- Circle Name -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="top-text">
          {{ circleInfoProps.circle_name }}
        </span>
      </div>
      <div class="d-flex flex-row justify-content-start align-items-center m-0 mt-md-1">
        <img
          v-if="circleInfoProps.circle_creator.account_image_url"
          :src="circleInfoProps.circle_creator.account_image_url"
          alt=""
          class="account-image-small mb-1"
        />
        <JazzIcon
          v-if="!circleInfoProps.circle_creator.account_image_url"
          :address="circleInfoProps.circle_creator.main_account_address"
          :diameter="40"
          :colors=jazzColors
          class="account-image-small"
        />
        <span class="top-text-small ms-2">
          {{ circleInfoProps.circle_creator.account_fullname }}
        </span>
        <span class="main-text-small ps-2">(creator)</span>
      </div>

      <div class="col-12 col-lg-6">
        <!-- Round Period -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">
            Round Period:
          </span>
          <span class="top-text-small ps-2">Monthly</span>
          <span class="main-text-small ps-2">(30 days)</span>
        </div>
        <!-- Payment Type -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Payment Type:</span>
          <div v-if="circleInfoProps.circle_payment_type == 'fixed_pay'">
            <span class="top-text-small ps-2">
              Fixed Payments
            </span>
            <el-tooltip
              content="In this circle, the amount paid by each participant in each round is fixed. The loan amount is calculated based on the number of joined members and the patience benefit."
              placement="top"
              :hide-after="0"
            >
              <span class="info-text ms-1">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </el-tooltip>
          </div>
          <div v-if="circleInfoProps.circle_payment_type == 'fixed_loan'">
            <span class="top-text-small ps-2">
              Fixed Loan
            </span>
            <el-tooltip
              content="In the fixed loan type, the contribution amount will be based on the number of members and other rules."
              placement="top"
              :hide-after="0"
            >
              <span class="info-text ms-1">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </el-tooltip>
          </div>
        </div>
        <!-- Number Of Members -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members">
            <span class="note-text">Number Of Members</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_max_members }}
            </span>
            <span class="main-text-small ps-2">people</span>
          </div>
          <div v-else>
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
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
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
          <div v-if="circleInfoProps.circle_winners_order == 'random'">
            <span class="top-text-small ps-2">
              Random
            </span>
            <el-tooltip
              content="The order of the winners in this circle is random. It means at the beginning of each round, the winner is determined randomly by the smart contract."
              placement="top"
              :hide-after="0"
            >
              <span class="info-text ms-1">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </el-tooltip>
          </div>
          <div v-if="circleInfoProps.circle_winners_order == 'fixed'">
            <span class="top-text-small ps-2">
              Fixed
            </span>
            <el-tooltip
              content="The order of winners in this circle is fixed. It means the members choose their desired round among the vacant rounds at the time of joining."
              placement="top"
              :hide-after="0"
            >
              <span class="info-text ms-1">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </span>
            </el-tooltip>
          </div>
        </div>
        <!-- Number Of Winners -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Number Of Winners:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_winners_number }}
          </span>
          <span class="main-text-small ps-2">people / round</span>
        </div>
        <!-- Patience Benefit -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Patience Benefit:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_patience_benefit * 100 }}
          </span>
          <span class="main-text-small ps-1">%</span>
          <el-tooltip
            content="Patience Benefit is calculated same as Annual Percentage Yield (APY). This rate affects the amount of loan received by the winners. The later loan date, the higher loan amount."
            placement="top"
            :hide-after="0"
          >
            <span class="info-text ms-1">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </span>
          </el-tooltip>
        </div>
        <!-- Service Charge -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Service Charge:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_service_charge * 100 }}
          </span>
          <span class="main-text-small ps-1">%</span>
          <el-tooltip
            content="The service charge is a very small percentage of the loan amount charged by the platform to the winners."
            placement="top"
            :hide-after="0"
          >
            <span class="info-text ms-1">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </span>
          </el-tooltip>
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
  </div>

  <NotFound v-else />

  <MessageModal
    ref="message_modal"
    @ok-clicked="launchCircle"
  />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import abi from "@/services/abi";
import NotFound from '@/pages/NotFound.vue';

export default {
  name: "AccountCirclesDetails",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      startDate: null,
      minStartDate: '',
      copyAddressTooltip: "Copy Address",
      explorerLink: null
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
      const contractAbi = abi.setAbi(
        this.circleInfoProps.circle_id,
        this.circleInfoProps.circle_contract,
        this.provider
      );
      let abiResponse = await contractAbi.interaction('launchCircle', [parseInt(this.startDate.getTime() / 1000)]);

      if(!abiResponse.done) {
        this.notif({
          title: "OOPS!",
          message: abiResponse.message,
          dangerouslyUseHTMLString: true,
          type: abiResponse.message_type,
          duration: 3000,
        });
      } else {
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
