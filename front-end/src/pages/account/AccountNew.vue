<template>
    <NavBar />
    <div id="account-new">
      <div v-if="loading" class="page-loading">
        Work In Progress ...
      </div>
      <AccountNewType v-else-if="activePage == 'new'" />
      <AccountNewCreate v-else-if="activePage == 'create'" />
      <AccountNewLink v-else-if="activePage == 'link'" />
    </div>
    <FooterBar />
</template>

<script>
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar/NavBar.vue';
import AccountNewType from '@/components/AccountPages/AccountNew/AccountNewType.vue';
import AccountNewCreate from '@/components/AccountPages/AccountNew/AccountNewCreate.vue';
import AccountNewLink from '@/components/AccountPages/AccountNew/AccountNewLink.vue';
import FooterBar from '@/components/FooterBar/FooterBar.vue';
import { mapActions } from "vuex";

export default {
  name: 'AccountNew',
  components: {
    NavBar,
    AccountNewType,
    AccountNewCreate,
    AccountNewLink,
    FooterBar
  },
  data() {
    return {
      activePage: 'new',
      loading: true
    }
  },
  mounted() {
    this.setup();
  },
  watch: {
    $route() {
      this.$router.go();
    }
  },
  methods: {
    ...mapActions(["fetchAccount"]),
    async setup() {
      const route = useRoute();
      const account = await this.fetchAccount();
      if(account.account_status == 'main' || account.account_status == 'linked') {
        this.$router.push('/account/profile');
      } else {
        let cid = route ? (route.params.cid || 'new') : 'new';
        if(account.account_status == 'waiting') {
          this.activePage = 'link';
          if(cid != 'link') this.$router.push('/account/link');
        } else this.activePage = cid;
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>
#account-new {
  min-height: calc(100vh - 240px);
}
</style>

