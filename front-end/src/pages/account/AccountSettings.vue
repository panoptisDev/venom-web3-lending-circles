<template>
  
  <NavBar />
  
  <div id="account-settings" class="row">
    <div class="col-2 col-md-3">
      <AccountSettingsSidebar
        :activePage = "activePage"
      />
    </div>
    <div class="col-10 col-md-9 mt-4 my-md-5">
      <div v-if="loading" class="page-loading">
        Work In Progress ...
      </div>
      <AccountSettingsProfile v-if="activePage == 'profile'"
        :connectedAccountProps = "connectedAccount"
        :accountProfileProps = "accountProfile"
      />
      <AccountSettingsAccounts v-if="activePage == 'accounts'"
        :connectedAccountProps = "connectedAccount"
        :accountWalletsProps = "accountWallets"
      />
    </div>
  </div>
    
  <FooterBar />

</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import AccountSettingsSidebar from '@/components/AccountPages/AccountSettings/AccountSettingsSidebar.vue'
import AccountSettingsProfile from '@/components/AccountPages/AccountSettings/AccountSettingsProfile.vue'
import AccountSettingsAccounts from '@/components/AccountPages/AccountSettings/AccountSettingsAccounts.vue'
import FooterBar from '@/components/FooterBar/FooterBar.vue'
import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";

export default {
  name: 'AccountSettings',
  components: {
    NavBar,
    AccountSettingsSidebar,
    AccountSettingsProfile,
    AccountSettingsAccounts,
    FooterBar
  },
  data() {
    return {
      accountSettingsPages: ["profile", "accounts"],
      accountWallets: {},
      activePage: "profile",
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore', 'getProfileStore']),
    connectedAccount() {
      return this.getConnectionStore;
    },
    accountProfile() {
      return this.getProfileStore;
    }
  },
  mounted() {
    if('active_page' in this.$route.query) {
      this.setActivePage(this.$route.query.active_page);
    } else {
      this.setActivePage(this.activePage);
    }
  },
  watch: {
    $route(to) {
      if('active_page' in to.query) {
        this.setActivePage(to.query.active_page);
      }
    }
  },
  methods: {
    ...mapActions(['fetchProfile']),
    async setActivePage(active_page) {
      this.activePage = this.accountSettingsPages.includes(active_page) ? active_page : this.accountSettingsPages[0];
      
      // Profile Settings
      if(this.activePage == 'profile') {
        await this.fetchProfile();
      }

      // Accounts Settings
      if(this.activePage == 'accounts') {
        let apiResponse = await api.get_account_wallets();
        if(apiResponse.data.done) {
          this.accountWallets = apiResponse.data.result[0];
        } else {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
          })
          this.activePage = 'profile'
        }
      }

      this.$router.push({path: '/account/settings', query: {active_page: this.activePage}})
      this.loading = false;
    }
  }
}
</script>
