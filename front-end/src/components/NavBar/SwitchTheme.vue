<template>
  <a
    v-if="darkMode"
    id="switch-theme"
    role="button"
    class="dropdown-item"
    @click="toggleTheme"
  >
    <i class="far fa-sun pe-3" aria-hidden="true"></i>
    Light Mode
  </a>
  <a
    v-else
    id="switch-theme"
    role="button"
    class="dropdown-item"
    @click="toggleTheme"
  >
    <i class="far fa-moon pe-3" aria-hidden="true"></i>
    Dark Mode
  </a>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "SwitchTheme",
  data() {
    return {
      htmlElement: document.documentElement,
    };
  },
  mounted() {
    if(this.darkMode) {
      this.htmlElement.setAttribute("theme", "dark");
    } else {
      this.htmlElement.setAttribute("theme", "light");
    }
  },
  computed: {
    ...mapGetters(["getDarkModeStore"]),
    darkMode() {
      return this.getDarkModeStore;
    }
  },
  methods: {
    ...mapMutations(["setDarkModeStore"]),
    toggleTheme() {
      this.setDarkModeStore();
      if(this.darkMode) {
        this.htmlElement.setAttribute("theme", "dark");
      } else {
        this.htmlElement.setAttribute("theme", "light");
      }
    },
  },
};
</script>

<style scoped>
</style>
