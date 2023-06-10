<template>
  <div
    v-if="showModal"
    id="venom-hack"
    class="position-relative animated w-100"
    :class="growthModal"
  >
    <div
      class="w-100 mw-100 animated"
      role="alert"
      data-autohide="false"
      :class="fadeModal"
    >
      <div class="venom-hack-body px-1 px-md-2 px-lg-5 py-2">
        <p class="venom-hack-text m-0 px-1 py-1">
          Please note, it is now working on the 
          <a href="https://devnet.venomscan.com/" target="_blank">
            <span  class="text-decoration-underline blue-btn">venom-devnet</span>
          </a>
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
export default {
  name: "VenomHackathonModal",
  data() {
    return {
      showModal: true,
      fadeModal: "fadeInDown",
      growthModal: "growthUp",
    };
  },
  methods: {
    goToVenomHackathon() {
      window.open("https://venom.piltonet.com", "_self");
    },
    closeModal() {
      this.fadeModal = "fadeInUp";
      this.growthModal = "growthDown";
      setTimeout(() => {}, "2000");
    },
  },
};
</script>
    
<style lang="scss" scoped>
#venom-hack {
  z-index: 1000;
}
.animated {
  animation-duration: 2s;
  animation-fill-mode: both;
  -webkit-animation-duration: 2s;
  -webkit-animation-fill-mode: both;
}
.fadeInUp {
  opacity: 0.9;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
}
@keyframes fadeInUp {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -44px, 0);
    opacity: 0;
  }
}
@-webkit-keyframes fadeInUp {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -44px, 0);
    opacity: 0;
  }
}
.fadeInDown {
  opacity: 0;
  animation-name: fadeInDown;
  -webkit-animation-name: fadeInDown;
}
@keyframes fadeInDown {
  from {
    transform: translate3d(0, -44px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 0.9;
  }
}
@-webkit-keyframes fadeInDown {
  from {
    transform: translate3d(0, -44px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 0.9;
  }
}
.growthUp {
  animation-name: growthUp;
  -webkit-animation-name: growthUp;
}
@keyframes growthUp {
  from {
    height: 0;
  }
  to {
    height: 44px;
  }
}
@-webkit-keyframes growthUp {
  from {
    height: 0;
  }
  to {
    height: 44px;
  }
}
.growthDown {
  animation-name: growthDown;
  -webkit-animation-name: growthDown;
}
@keyframes growthDown {
  from {
    height: 44px;
  }
  to {
    height: 0;
  }
}
@-webkit-keyframes growthUp {
  from {
    height: 44px;
  }
  to {
    height: 0;
  }
}

.venom-hack-body {
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1px;
  text-align: center;
  background: var(--ptn-color);
  color: var(--ptn-bg);
  opacity: 0.9;
}
.venom-hack-btn {
  font-family: "RobotoB2", arial, sans-serif;
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
  padding: 5px 13px;
}
.venom-hack-text {
  font-size: 15px;
  line-height: 20px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .venom-hack-text {
    font-size: 13px;
    line-height: 17px;
  }
}
</style>
