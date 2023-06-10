<template>
  
  <NavBar />
  
  <div id="account-contacts" class="row">
    <div class="col-2 col-md-3">
      <AccountContactsSidebar
        :activePage = "activePage"
      />
    </div>
    
    <div class="col-10 col-md-9 my-4 my-md-5">
      <div v-if="loading" class="page-loading">
        Work In Progress ...
      </div>
      <AccountContactsList v-else-if="activePage == 'contactList'"
        :connectedAccountProps = "connectedAccount"
        :accountContactsProps = "accountContacts"
      />
      <AccountContactsInviteFriends v-else-if="activePage == 'inviteFriends'"
        :connectedAccountProps = "connectedAccount"
        :accountProfileProps = "accountProfile"
      />
      <AccountContactsInviteCode v-else-if="activePage == 'inviteCode'"
        :connectedAccountProps = "connectedAccount"
        :accountProfileProps = "accountProfile"
      />
    </div>
  </div>
    
  <FooterBar />

</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import AccountContactsSidebar from '@/components/AccountPages/AccountContacts/AccountContactsSidebar.vue'
import AccountContactsInviteFriends from '@/components/AccountPages/AccountContacts/AccountContactsInviteFriends.vue'
import AccountContactsInviteCode from '@/components/AccountPages/AccountContacts/AccountContactsInviteCode.vue'
import AccountContactsList from '@/components/AccountPages/AccountContacts/AccountContactsList.vue'
import FooterBar from '@/components/FooterBar/FooterBar.vue'
import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";

export default {
  name: 'AccountContacts',
  components: {
    NavBar,
    AccountContactsSidebar,
    AccountContactsInviteFriends,
    AccountContactsInviteCode,
    AccountContactsList,
    FooterBar
  },
  data() {
    return {
      accountContactsPages: ["contactList", "inviteFriends", "inviteCode"],
      accountContacts: {},
      activePage: "contactList",
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
			this.activePage = this.accountContactsPages.includes(active_page) ? active_page : this.accountContactsPages[0];

      // Contacts List
      if(this.activePage == 'contactList') {
        let apiResponse = await api.get_account_contacts();
        if(apiResponse.data.done) {
          this.accountContacts = apiResponse.data.result[0];
        } else {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
          })
          this.activePage = 'inviteFriends'
        }
      }
      
      // Invite Your Friends
      if(this.activePage == 'inviteFriends') {
        await this.fetchProfile();
      }
      
      // Enter Invite Code
      if(this.activePage == 'inviteCode') {
        await this.fetchProfile();
      }

      this.$router.push({path: '/account/contacts', query: {active_page: this.activePage}})
      this.loading = false;
    }
  }
}
</script>

<style scoped>
#account-contacts {
  min-height: calc(100vh - 240px);
}
</style>

