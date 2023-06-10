<template>
  <NavBar />

  <div v-if="loading" class="page-loading min-vh-100 d-inline-block">
    Work In Progress ...
  </div>
  
  <div v-else id="account-circles" class="row">
    <AccountCirclesNew v-if="activePage == 'list' && !accountCircles" />
    <AccountCirclesList v-else-if="activePage == 'list' && accountCircles"
      :accountCirclesProps="accountCircles"
    />
    <AccountCirclesInvited v-else-if="activePage == 'invited'"
      :circleIdProps="circleId"
    />
    <AccountCirclesJoined v-else-if="activePage == 'joined'"
      :circleIdProps="circleId"
    />
    <NotFound v-else />
  </div>

  <FooterBar />
</template>

<script>
import { useRoute } from 'vue-router';
import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";
import NavBar from '@/components/NavBar/NavBar.vue';
import AccountCirclesNew from "@/components/AccountPages/AccountCircles/AccountCirclesNew.vue";
import AccountCirclesList from "@/components/AccountPages/AccountCircles/AccountCirclesList.vue";
import AccountCirclesInvited from '@/components/AccountPages/AccountCircles/AccountCirclesInvited.vue';
import AccountCirclesJoined from '@/components/AccountPages/AccountCircles/AccountCirclesJoined.vue';
import FooterBar from '@/components/FooterBar/FooterBar.vue';
import NotFound from '@/pages/NotFound.vue';

export default {
  name: 'AccountCircles',
  components: {
    NavBar,
    AccountCirclesNew,
    AccountCirclesList,
    AccountCirclesInvited,
    AccountCirclesJoined,
    FooterBar,
    NotFound
  },
  data() {
    return {
      activePage: 'list',
      accountCircles: null,
      circleId: null,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
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
    ...mapActions(['fetchProfile']),
    async setup() {
      const route = useRoute();
      this.activePage = route ? (route.params.cid || 'list') : 'list';
      if(this.activePage != 'list') {
        if('circle_id' in route.query) {
          this.circleId = route.query.circle_id;
        }
        if(!this.circleId && this.activePage != 'deploy') {
          return this.$router.push('/account/circles');
        }
      }
      if(this.activePage == 'list') {
        await this.fetchProfile();
        let apiResponse = await api.get_account_circles();
        if(apiResponse && apiResponse.data.done) {
          let circles = apiResponse.data.result[0];
          this.accountCircles = circles && (circles.whitelisted || circles.joined || circles.creating) ? apiResponse.data.result[0] : null;
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
      this.loading = false;
    }
  }
}
</script>

<style scoped>
#account-circles {
  min-height: calc(100vh - 240px);
}
</style>

