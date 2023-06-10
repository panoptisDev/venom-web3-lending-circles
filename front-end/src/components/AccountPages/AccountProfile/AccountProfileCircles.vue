<template>
  <div id="account-profile-circles">
    <div v-if="loading" class="page-loading">
        Work In Progress ...
    </div>

    <div v-else-if="!accountCircles">
      <div class="account-profile-circles-main row mt-5">
        <h2>YOU HAVE NO ACTIVE CIRCLES.</h2>
        <h3>Lending Circles you've been invited to or joined will appear here.</h3>
        <div class="col-12">
          <!-- New Circle -->
          <div
            type="button"
            class="account-profile-circles-card"
            @click="$router.push('/account/circles')"
          >
            <h3>
              <i class="fa fa-gavel" aria-hidden="true"></i>
            </h3>
            <h2>
              MY CIRCLES
            </h2>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <!-- Whitelisted -->
      <div class="my-4 row">
        <div
          v-for="circle in accountCircles.whitelisted || []"
          :key="circle.circle_id"
          class="col-12 col-md-6 col-lg-4 col-xl-3"
        >
          <AccountCirclesCard
            :accountCircleProps="circle"
            accountRoleProps="whitelisted"
          />
        </div>
      </div>
      <!-- Joined -->
      <div class="my-4 row">
        <div
          v-for="circle in accountCircles.joined || []"
          :key="circle.circle_id"
          class="col-12 col-md-6 col-lg-4 col-xl-3"
        >
          <AccountCirclesCard
            :accountCircleProps="circle"
            accountRoleProps="joined"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import api from "@/services/api";
import AccountCirclesCard from "@/components/AccountPages/AccountCircles/AccountCirclesCard.vue";

export default {
  name: "AccountProfileCircles",
  components: {
    AccountCirclesCard,
  },
  data () {
      return {
        accountCircles: null,
        loading: true
      }
  },
  mounted() {
    this.setup();
  },
  computed: {
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      api.get_account_circles().then((apiResponse) => {
        if(apiResponse && apiResponse.data.done) {
          let circles = apiResponse.data.result[0];
          this.accountCircles = circles && (circles.whitelisted || circles.joined) ? apiResponse.data.result[0] : null;
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
        this.loading = false;
      })
      .catch((err) => { 
        console.log(err);
      })
    }
  }
};
</script>

<style scoped>
#account-profile-circles {
  min-height: 500px;
}
.account-profile-circles-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.account-profile-circles-main h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 32px;
  text-align: center;
  color: var(--ptn-color);
  max-width: 900px;
  margin: 0 0 15px;
  padding: 0 15px;
}
.account-profile-circles-main h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
  text-align: center;
  color: var(--ptn-third-gray);
  max-width: 900px;
  margin: 0 0 25px;
  padding: 0 15px;
}
.account-profile-circles-card {
  background: var(--ptn-second-bg);
  width: 310px;
  height: 270px;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}
.account-profile-circles-card.right {
  margin: 15px 15px 0 auto;
}
.account-profile-circles-card.left {
  margin: 15px auto 0 15px;
}

.account-profile-circles-card h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  text-align: justify;
  letter-spacing: 0.05em;
  text-transform: capitalize;
  text-align: center;
  padding-bottom: 50px;
  margin: 0;
}
.account-profile-circles-card h3 {
  font-size: 50px;
  color: var(--ptn-btn-bg);
  padding: 70px 0 30px;
  margin: 0;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .account-profile-circles-card {
    max-width: 90%;
    max-height: 100vw;
  }
  .account-profile-circles-card.right,
  .account-profile-circles-card.left {
    margin: 15px auto;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
