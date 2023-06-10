<template>
  <div class="container-fluid m-0 p-0">
    <VenomHackathonModal/>
    <NavBar ref="nav_bar" />
    <JumboTron @connect-wallet="onConnectButtonClick" />
    <PiltonetSteps />
    <HowWorks />
    <WaitingList />
    <FooterBar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import JumboTron from '@/components/HomePage/JumboTron.vue'
import HowWorks from '@/components/HomePage/HowWorks.vue'
import PiltonetSteps from '@/components/HomePage/PiltonetSteps.vue'
import WaitingList from '@/components/HomePage/WaitingList.vue'
import FooterBar from '@/components/FooterBar/FooterBar.vue'
import VenomHackathonModal from "@/components/CustomModals/VenomHackathonModal.vue";

export default {
  name: 'HomePage',
  components: {
    NavBar,
    JumboTron,
    HowWorks,
    PiltonetSteps,
    WaitingList,
    FooterBar,
    VenomHackathonModal
  },
  methods: {
    async onConnectButtonClick() {
      await this.$refs.nav_bar.onConnectButtonClick();
    }
  }
}
</script>

<style scoped>
</style>

