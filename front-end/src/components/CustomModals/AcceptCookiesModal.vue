<template>
  <div v-if="!cookiesAccepted && showModal" id="accept-cookies" class="accept-cookies-alert fixed-bottom animated" :class="fadeModal">
    <div class="w-100 mw-100" role="alert" data-autohide="false">
      <div class="accept-cookies-body p-2">
        <p class="m-0 px-3">
          We use cookies to ensure you get the best possible experience. By browsing the site you consent to the use of cookies.
          <button
            type="button"
            class="accept-cookies-btn ms-1 px-4"
            @click="acceptCookies"
          >
            Ok
          </button>
        </p>
        <button
          type="button" 
          class="btn position-absolute top-0 end-0 p-0 pe-2 m-0"
          @click="closeModal"
        >
          <i class="fa fa-close text-muted" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "AcceptCookiesModal",
  data() {
    return {
      showModal: true,
      fadeModal: 'fadeInUp'
    };
  },
  computed: {
    ...mapGetters(["getAcceptCookiesStore"]),

    cookiesAccepted() {
      // return this.getAcceptCookiesStore;
      return true;
    },
  },
  methods: {
    ...mapMutations(['setAcceptCookiesStore']),

    acceptCookies() {
      this.fadeModal = 'fadeInDown';
      setTimeout(() => {
        this.setAcceptCookiesStore();
      }, "2000");
    },
    closeModal() {
      this.fadeModal = 'fadeInDown';
      setTimeout(() => {
        // this.showModal = false;
        this.setAcceptCookiesStore();
      }, "2000");
    }
  },
};
</script>
    
<style lang="scss" scoped>
.animated {
    animation-duration: 2s;
    animation-fill-mode: both;
    -webkit-animation-duration: 2s;
    -webkit-animation-fill-mode: both
}
.fadeInUp {
    opacity: 0;
    animation-name: fadeInUp;
    -webkit-animation-name: fadeInUp;
}
@keyframes fadeInUp {
    from {
        transform: translate3d(0, 100px, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
        opacity: 0.9;
    }
}
@-webkit-keyframes fadeInUp {
    from {
        transform: translate3d(0, 100px, 0)
    }
    to {
        transform: translate3d(0, 0, 0);
        opacity: 0.9
    }
}
.fadeInDown {
    opacity: 0.9;
    animation-name: fadeInDown;
    -webkit-animation-name: fadeInDown;
}
@keyframes fadeInDown {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 100px, 0);
      opacity: 0;
    }
}
@-webkit-keyframes fadeInDown {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 100px, 0);
      opacity: 0;
    }
}

.accept-cookies-body {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1px;
  text-align: center;
  background: var(--ptn-color);
  color: var(--ptn-bg);
  opacity: 0.9;
}
.accept-cookies-btn {
  display: inline-block;
  vertical-align: middle;
  font-size: 13px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  border: none;
  border-radius: 0.25rem;
  background: rgba(var(--ptn-third-gray-rgb), 0.9);
  color: var(--ptn-color);
  padding: 3px 13px;
}
</style>
