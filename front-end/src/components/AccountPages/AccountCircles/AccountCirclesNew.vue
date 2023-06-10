<template>
  <div id="account-circles-new">
    <div class="account-circles-new-main row">
      
      <h2>YOU DON'T HAVE ANY LENDING CIRCLES YET.</h2>
      <h3>All your lending circles that you've created, been invited to, and joined will appear here.<br />
        If you'd like, you can create a new one yourself.</h3>
			
      <div class="col-12">
        <!-- New Circle -->
        <div
          type="button"
          class="account-circles-new-card"
          @click="createNewCircleOnTestnet"
        >
          <h2>
            CREATE A NEW <br />
            CIRCLE
          </h2>
          <h3>
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
          </h3>
        </div>
      </div>
    </div>
  </div>

  <MessageModal
    ref="message_modal"
    @ok-clicked="createNewCircle"
  />

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AccountCirclesNew",
  computed: {
    ...mapGetters(['getProfileStore']),
    accountProfile() {
      return this.getProfileStore;
    }
  },
  methods: {
    createNewCircleOnTestnet() {
      if(this.accountProfile.account_contacts_number < 2) {
        this.notif({
          title: "INVITE MORE FRIENDS",
          message: "You need at least two contacts to create your own circle.",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
        })
      } else {
        this.$refs.message_modal.setMessage({
          title: 'Beta Version',
          message: 'This is a test version of lending circles in Piltonet. In future updates, your information may be deleted without notice.',
          okBtn: 'I Like To Test',
          cancelBtn: null,
          customStyle: 'text-align: start !important; padding-left: 1rem !important;'
        });
      }
    },
    createNewCircle() {
      this.$router.push({path: '/account/circles/create', query: {active_page: 'deploy'}});
    }
  }
};
</script>

<style lang="scss" scoped>
#account-circles-new {
  // border-top: solid 1px var(--ptn-gray);
  min-height: 500px;
  padding: 100px 0;
}
.account-circles-new-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.account-circles-new-main h2 {
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
.account-circles-new-main h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
  text-align: center;
  color: var(--ptn-third-gray);
  max-width: 900px;
  margin: 0 0 25px;
  padding: 0 15px;
}
.account-circles-new-card {
  background: var(--ptn-second-bg);
  width: 310px;
  height: 310px;
  border: 1px solid rgba(var(--ptn-third-gray-rgb), 3);
  border-radius: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}
.account-circles-new-card.right {
  margin: 15px 15px 0 auto;
}
.account-circles-new-card.left {
  margin: 15px auto 0 15px;
}

.account-circles-new-card h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  text-align: justify;
  letter-spacing: 0.05em;
  text-transform: capitalize;
  text-align: center;
  padding-bottom: 32px;
  padding-top: 50px;
  margin: 0;
}
.account-circles-new-card h3 {
  font-size: 50px;
  color: var(--ptn-btn-bg);
  padding: 0;
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
  .account-circles-new-card {
    max-width: 90%;
    max-height: 100vw;
  }
  .account-circles-new-card.right,
  .account-circles-new-card.left {
    margin: 15px auto;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
