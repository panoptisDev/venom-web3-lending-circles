<template>
  
  <div v-if="loading" class="page-loading">
    Work In Progress ...
  </div>

  <div v-else-if="circleInfo" id="account-circles-invited">
    <div class="d-flex flex-column justify-content-center align-items-start account-circles-back-btn">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.go(-1)"
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
      :circleMembersProps="circleInfo.circle_members"
    />
    
    <AccountCirclesRotations
      :circleInfoProps="circleInfo"
      :circleMembersProps="circleInfo.circle_members"
      :selectedRoundProps="selectVacantRound"
      @change-member-round="changeMemberRound"
    />

    <div class="main-section">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <div
          type="button"
          @click="leaveCircle"
          class="front-btn red-btn red-border px-3 py-2 mb-1"
        >
          <span class="m-0 p-0">Leave The Circle</span>
        </div>
        <p class="note-text">(only possible before the circle start)</p>
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
import AccountCirclesRotations from "@/components/AccountPages/AccountCircles/AccountCirclesRotations.vue";
import AccountCirclesMembers from "@/components/AccountPages/AccountCircles/AccountCirclesMembers.vue";
import NotFound from '@/pages/NotFound.vue';
import metamask from "@/wallets/metamask";
import venomwallet from '@/wallets/venomwallet';

export default {
  name: 'AccountCirclesInvited',
  components: {
    AccountCirclesDetails,
    AccountCirclesRotations,
    AccountCirclesMembers,
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
  mounted() {
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
      let apiResponse = await api.get_account_circles_joined(`circle_id=${this.circleIdProps}`);
      this.loading = false;
      if(apiResponse && apiResponse.data.done) {  
        this.circleInfo = apiResponse.data.result[0];
      } else {
        this.circleInfo = null;
      }
    },
    async changeMemberRound(newRound) {
      this.selectVacantRound = newRound;
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_circles_change_round({
          circle_id: this.circleInfo.circle_id,
          member_selected_round: newRound
        });
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
              onClose: () => { this.$router.go() }
            })
          }
        }
      } else {
        this.selectVacantRound = -1;
      }
    },
    async leaveCircle() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_circles_leave({
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
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-invited {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-circles-back-btn {
  width: 96%;
  max-width: 940px;
  margin: 3rem auto;
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
