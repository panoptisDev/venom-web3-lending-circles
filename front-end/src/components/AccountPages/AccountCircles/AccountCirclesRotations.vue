<template>
  <div id="account-circles-rotations">
    <div class="main-section">
      <h3>WINNERS ROTATION</h3>
      <!-- Circle Members -->
      <div v-if="circleMembers">
        
        <!-- Titles in Header -->
        <div class="row mb-3">
          <div class="col-2 col-md-1 col-lg-1 col-xl-1 text-center"><span class="main-text-small">Round</span></div>
          <div class="col-4 col-md-4 col-lg-4 col-xl-3 ps-2 ps-md-3 ps-lg-4 ps-xl-5"><span class="main-text-small">Winner</span></div>
          <div class="col-md-3 col-lg-2 col-xl-2 d-none d-md-block text-center"><span class="main-text-small">Due Date</span></div>
          <div class="col-3 col-md-2 col-lg-2 col-xl-2 text-center"><span class="main-text-small">Loan Amount</span></div>
          <div class="col-3 col-md-2 col-lg-3 col-xl-2 text-center"><span class="main-text-small">Total Payments</span></div>
        </div>

        <div v-for="(member, index) in circleMembers"
          :key="member.member_account_address"
          class="align-items-center row py-2"
          :class="index % 2 == 0 ? 'bg-blue' : ''"
        >
          <!-- Round -->
          <div class="col-2 col-md-1 col-lg-1 col-xl-1 fw-bold text-center align-items-center">
            <p v-if="member.main_account_address == mainAccountAddress" class="account-circles-rotations-you">
                {{ selectedRound = roundNumber(index) }}
              </p>
              <p v-else class="main-text-tiny">
                {{ roundNumber(index) }}
              </p>
          </div>
          
          <!-- Winner -->
          <div v-if="circleInfo.circle_winners_order == 'fixed'" class="col-4 col-md-4 col-lg-4 col-xl-3 ps-1 ps-md-2 ps-lg-3 ps-xl-4 row">
            <!-- Occupied -->
            <div v-if="'member_id' in member" class="row align-items-center">
              <img
                v-if="member.account_image_url"
                :src="member.account_image_url"
                alt=""
                class="account-image-small d-none d-md-inline-block"
              />
              <JazzIcon
                v-if="!member.account_image_url"
                :address="member.main_account_address"
                :diameter="40"
                :colors=jazzColors
                class="account-image-small d-none d-md-inline-block"
              />
              <p v-if="member.main_account_address == mainAccountAddress" class="account-circles-rotations-you ms-2">
                You
              </p>
              <p v-else class="main-text-tiny ms-2">
                {{ member.account_fullname }}
              </p>
            </div>
            <!-- Vacant -->
            <div v-else
              role="button"
              class="row align-items-center"
              @click="selectVacantRound(index)"
            >
              <div
                class="account-image-small vacant d-none d-md-inline-block"
                :class="selectedRound == index ? 'selected' : ''"
              >
              </div>
              <p v-if="selectedRound == index" class="main-text-tiny selected ms-2">
                selected
              </p>
              <p v-else class="main-text-tiny ms-2">
                vacant
              </p>
            </div>
          </div>
          
          <div v-else class="col-4 col-md-4 col-lg-4 col-xl-3 ps-1 ps-md-2 ps-lg-3 ps-xl-4 ps-lg-3 align-items-start">
            <p class="main-text-tiny py-2">
              <i class="fa fa-dice fa-xl third-gray-btn me-2" aria-hidden="true"></i>
              Random
            </p>
          </div>
          
          <!-- Due Date -->
          <div class="col-md-3 col-lg-2 col-xl-2 d-none d-md-block d-flex flex-row text-center align-items-center">
            <p class="main-text-tiny">
              {{ circleInfo.circle_start_date ? utils.formatDate(utils.nextMonth(circleInfo.circle_start_date, roundNumber(index) - 1), 'DD Month YYYY') : 'Open' }}
            </p>
          </div>

          <!-- Loan Amount -->
          <div class="col-3 col-md-2 col-lg-2 col-xl-2 d-flex flex-row justify-content-center align-items-center">
            <span class="main-text-tiny">
              {{ parseFloat(loanAmount(index)).toFixed(2) }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfo.circle_chain_id"
              :paymentToken="circleInfo.circle_payment_token"
              :height="14" customClass="ms-1"
            />
          </div>

          <!-- Total Payments -->
          <div class="col-3 col-md-2 col-lg-3 col-xl-2 d-flex flex-row justify-content-center align-items-center">
            <span class="main-text-tiny">
              {{ parseFloat(totalPayments()).toFixed(2) }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfo.circle_chain_id"
              :paymentToken="circleInfo.circle_payment_token"
              :height="14" customClass="ms-1"
            />
          </div>
          
        </div>
        <p v-if="circleInfo.circle_winners_order == 'fixed'" class="help-text mt-4">
          You can choose your desired round from among the vacant ones.
        </p>
      </div>
    
      <div v-if="!circleMembers">
        <p class="note-text">The member list is empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'AccountCirclesRotations',
  props: {
    circleInfoProps: Object,
    circleMembersProps: Object,
    selectedRoundProps: Number
  },
  emits: ['changeMemberRound'],
  data() {
    return {
      circleInfo: this.circleInfoProps,
      circleMembers: this.circleMembersProps,
      circleFee: process.env.VUE_APP_CIRCLES_SERVICE_CHARGE_X10000 / 10000,
      selectedRound: this.selectedRoundProps
    }
  },
  computed: {
    ...mapGetters(['getConnectionStoreByKey']),
    mainAccountAddress() {
      return this.getConnectionStoreByKey('main_account_address');
    }
  },
  async mounted() {
  },
  watch: {
    circleInfoProps: function () {
      this.circleInfo = this.circleInfoProps;
    },
    circleMembersProps: function () {
      this.circleMembers = this.circleMembersProps;
    },
    selectedRoundProps: function () {
      this.selectedRound = this.selectedRoundProps;
    }
  },
  methods: {
    roundNumber(index) {
      return parseInt((index + parseInt(this.circleInfo.circle_winners_number)) / parseInt(this.circleInfo.circle_winners_number));
    },
    totalPayments() {
      if(this.circleInfo.circle_payment_type == 'fixed_pay') {
        return (this.circleInfo.circle_max_members * this.circleInfo.circle_fixed_amount);
      }
      if(this.circleInfo.circle_payment_type == 'fixed_loan') {
        return (this.circleInfo.circle_fixed_amount / this.circleInfo.circle_winners_number);
      }
    },
    loanAmount(index) {
      const memberMonth = parseInt((index + parseInt(this.circleInfo.circle_winners_number)) / parseInt(this.circleInfo.circle_winners_number));
      const totalMonths = parseInt(this.circleInfo.circle_max_members) / parseInt(this.circleInfo.circle_winners_number);
      const memberBenefit = ((memberMonth - ((totalMonths + 1) / 2)) * (this.circleInfo.circle_patience_benefit / 12)) * this.totalPayments();
      return (this.totalPayments() + memberBenefit) * (1 - this.circleFee);
    },
    selectVacantRound(index) {
      this.selectedRound = this.selectedRound != index ? index : -1;
      this.$emit('changeMemberRound', this.selectedRound);
    }
  }
}
</script>

<style lang="scss" scoped>
.account-circles-rotations-you {
  font-size: 17px;
  font-weight: bold;
  line-height: 45px;
  overflow-wrap: break-word;
  color: rgba(var(--ptn-second-blue-rgb), 0.9);
  width: auto;
  margin: 0;
  padding: 0;
}
.account-image-small.vacant {
  background: var(--ptn-second-gray);
}
.account-image-small.selected {
  // background: var(--ptn-second-blue);
  border: solid 2px var(--ptn-second-blue);
}
.main-text-tiny.selected {
  font-weight: bold;
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
