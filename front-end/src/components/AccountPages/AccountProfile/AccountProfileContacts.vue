<template>
  <div id="account-profile-contacts">
    <div class="account-profile-contacts-main row">
      
      <h2>YOUR CONTACT LIST IS EMPTY.</h2>
      <h3>Lending Circles are formed based on relationship and trust. Invite your friends to join you.</h3>
			
      <div class="col-12 col-md-6">
        <!-- New Circle -->
        <div
          type="button"
          class="account-profile-contacts-card right"
          @click="$router.push({path: '/account/contacts', query: {active_page: 'inviteCode'}})"
        >
          <h2>
            I HAVE AN <br />
            INVITE CODE
          </h2>
          <h3>
            <i class="far fa-hand-peace" aria-hidden="true"></i>
          </h3>
        </div>
      </div>	
      <div class="col-12 col-md-6">
        <!-- New Circle -->
        <div
          type="button"
          class="account-profile-contacts-card left"
          @click="$router.push({path: '/account/contacts', query: {active_page: 'inviteFriends'}})"
        >
          <h2>
            INVITE YOUR <br />
            FRIENDS
          </h2>
          <h3>
            <i class="fa fa-user-plus" aria-hidden="true"></i>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountProfileContacts",
  props: {
    connectedAccount: Object,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#account-profile-contacts {
  min-height: 500px;
  padding: 100px 0;
}
.account-profile-contacts-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.account-profile-contacts-main h2 {
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
.account-profile-contacts-main h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
  text-align: center;
  color: #888888;
  max-width: 900px;
  margin: 0 0 25px;
  padding: 0 15px;
}
.account-profile-contacts-card {
  background: var(--ptn-second-bg);
  width: 310px;
  height: 310px;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}
.account-profile-contacts-card.right {
  margin: 15px 15px 0 auto;
}
.account-profile-contacts-card.left {
  margin: 15px auto 0 15px;
}

.account-profile-contacts-card h2 {
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
.account-profile-contacts-card h3 {
  font-size: 50px;
  color: var(--ptn-btn-bg);
  padding: 0;
  margin: 0;
}

@media (max-width: 768px) {
  .account-profile-contacts-card {
    max-width: 90%;
    max-height: 100vw;
  }
  .account-profile-contacts-card.right,
  .account-profile-contacts-card.left {
    margin: 15px auto;
  }
}
</style>
