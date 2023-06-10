<template>
  
  <div v-if="loading" class="page-loading">
    Work In Progress ...
  </div>

  <div v-else-if="circleInfo" id="account-circles-invited">
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

    <AccountCirclesDetails
      :circleInfoProps="circleInfo"
    />
    
    <AccountCirclesMembers
      :circleInfoProps="circleInfo"
    />
    
    <AccountCirclesRotations
      :circleInfoProps="circleInfo"
      :circleMembersProps="circleInfo.circle_members"
      :selectedRoundProps="selectVacantRound"
      @change-member-round="changeMemberRound"
    />
    
    <div class="main-section">
      <h3>JOIN THE CIRCLE</h3>
      <div class="d-flex flex-column justify-content-center align-items-start">
        <p class="top-text">
          Before joining the circle, pay attention to the following points:
        </p>
      </div>
      <div class="d-flex flex-column justify-content-center align-items-start">
        <p class="main-text-small mt-3">
          <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
            The minimum number of members to start the circle is
            <span class="top-text-small">{{ `${circleInfo.circle_min_members} people` }}</span>.
            If not reached by the start date, the circle will be automatically removed and all payments will be refunded.
        </p>
        <p v-if="parseInt(circleInfo.circle_min_members) < parseInt(circleInfo.circle_max_members)" class="main-text-small mt-3">
          <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
            If the number of joined accounts does not reach the maximum number of circle members
            (<span class="top-text-small">{{ `${circleInfo.circle_max_members} people` }}</span>)
            by the start date, the vacant rounds will be removed but the order of the winners will be preserved.
        </p>
      </div>

      <div class="d-flex flex-column flex-sm-row justify-content-start align-items-start mt-4">
        <div class="d-flex flex-row justify-content-start align-items-center">
          <p class="main-text">Would you like to join this circle?</p>
        </div>
        <div class="d-flex flex-row justify-content-start align-items-center">
          <div
            type="button"
            @click="acceptCircleInvite"
            class="front-btn green-btn ms-0 ms-sm-3"
          >
            <span class="m-0 p-0">Yes, of course.</span>
          </div>
          <div
            type="button"
            @click="rejectCircleInvite"
            class="front-btn red-btn ms-3"
          >
          <span class="m-0 p-0">No, thanks.</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <NotFound/>
  </div> 

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import AccountCirclesDetails from "@/components/AccountPages/AccountCircles/AccountCirclesDetails.vue";
import AccountCirclesMembers from "@/components/AccountPages/AccountCircles/AccountCirclesMembers.vue";
import AccountCirclesRotations from "@/components/AccountPages/AccountCircles/AccountCirclesRotations.vue";
import NotFound from '@/pages/NotFound.vue';
import metamask from "@/wallets/metamask";
import venomwallet from '@/wallets/venomwallet';

export default {
  name: 'AccountCirclesInvited',
  components: {
    AccountCirclesDetails,
    AccountCirclesMembers,
    AccountCirclesRotations,
    NotFound
  },
  props: {
    circleIdProps: String
  },
  data() {
    return {
      circleInfo: null,
      selectVacantRound: -1,
      wallet: this.defaultchain.wallets[0] == 'venom-connect' ? venomwallet : metamask,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getConnectionStoreByKey']),
    accountAddress() {
      return this.getConnectionStoreByKey('account_address');
    }
  },
  async mounted() {
    if(this.circleIdProps && this.circleIdProps.length >= 42) {
      this.setup()
    }
  },
  watch: {
    circleIdProps: function () {
      if(this.circleIdProps && this.circleIdProps.length >= 42) {
        this.setup()
      } else {
        this.circleInfo = null;
      }
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      this.loading = true;
      let apiResponse = await api.get_account_circles_invited(`circle_id=${this.circleIdProps}`);
      this.loading = false;
      if(apiResponse && apiResponse.data.done) {  
        this.circleInfo = apiResponse.data.result[0];
      } else {
        this.circleInfo = null;
      }
    },
    async changeMemberRound(newRound) {
      this.selectVacantRound = newRound;
    },
    async acceptCircleInvite() {
      if(this.circleInfo.circle_winners_order == 'fixed' && this.selectVacantRound < 0) {
        this.scrollToElement('account-circles-rotations')
        return this.notif({
          message: "Choose your loan date from among the vacant months.",
          type: "error",
          duration: 3000
        })
      }
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_circles_invited_accept({
          circle_id: this.circleInfo.circle_id,
          member_selected_round: this.circleInfo.circle_winners_order == 'fixed' ? this.selectVacantRound : 0
        });
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go(-1) }
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
              onClose: () => { this.$router.go() }
            })
          }
        }
      }
    },
    async rejectCircleInvite() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_circles_invited_reject({
          circle_id: this.circleInfo.circle_id
        });
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.push("/account/circles") }
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
        this.accountAddress,
        null
      );
      return personalSignResult;
    },
    async scrollToElement(element) {
      if(document.getElementById(element)) {
        document.getElementById(element).scrollIntoView();
      } else {
        this.scrollToLaunchpad();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-invited {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
  margin: auto;
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
