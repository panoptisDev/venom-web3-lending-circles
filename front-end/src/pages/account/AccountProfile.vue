<template>
  <NavBar />
  <div id="account-profile">
    <div v-if="loading" class="page-loading">
      Work In Progress ...
    </div>
    <div v-else>
      <AccountProfileHeader
        :activeTabProps="activeTab"
        @profile-set-active-tab="setActiveTab"
      />
      <AccountProfileContacts v-if="activeTab == 'contacts'"
        @profile-set-active-tab="setActiveTab"
      />
      <AccountProfileCircles v-if="activeTab == 'circles'" />
    </div>
  </div>
  <FooterBar />
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue';
import AccountProfileHeader from '@/components/AccountPages/AccountProfile/AccountProfileHeader.vue';
import AccountProfileContacts from '@/components/AccountPages/AccountProfile/AccountProfileContacts.vue';
import AccountProfileCircles from '@/components/AccountPages/AccountProfile/AccountProfileCircles.vue';
import FooterBar from '@/components/FooterBar/FooterBar.vue';
import { mapActions } from "vuex";

export default {
  name: 'AccountProfile',
  components: {
    NavBar,
    AccountProfileHeader,
    AccountProfileContacts,
    AccountProfileCircles,
    FooterBar
  },
  data() {
    return {
      activeTab: 'circles',
      loading: true
    }
  },
  mounted() {
    this.setup();
  },
  methods: {
    ...mapActions(["fetchProfile"]),
    async setup() {
      const accountProfile = await this.fetchProfile();
      this.loading = false;
      if(accountProfile.account_circles_number == 0 && accountProfile.account_contacts_number == 0) {
        this.activeTab = 'contacts';
      }
    },
    async setActiveTab(activeTab) {
      this.activeTab = activeTab;
    }
  }
}
</script>

<style scoped>
#account-profile {
  width: 96%;
  max-width: 1300px;
  min-height: calc(100vh - 240px);
  margin: 30px auto;
}
</style>

