<template>
  <div id="jumbo-tron">
    <div class="d-flex flex-column justify-content-center align-items-center">
      
      <div class="main-top row">
        <!-- Left Blank -->
        <div class="d-none d-xl-block col-xl-1"></div>
        <!-- Left Texts -->
        <div class="col-12 col-md-6 col-xl-5">
          <p class="main-text-title-small">0% INTEREST</p>
          <p class="main-text-title">
            WHEN
            <br/>
            WE SAVE
            <br/>
            TOGETHER
          </p>
        </div>
        <!-- Right Image -->
        <div class="col-12 col-md-6 col-xl-5 mt-4 mt-md-0">
          <img
            alt="When We Save Together"
            class="right-img"
            src="@/assets/images/save-together.png"
          />
        </div>
      </div>

      <div class="main-middle">
        <h1 class="main-text-subtitle my-3">
          WEB3 LENDING CIRCLE
        </h1>
        <h3 class="main-text-desc pb-4">
          Lending Circles provide an interest-free social loan, where friends and family come together to lend each other money. There is a strong social incentive to pay back the loan successfully because lending circles often consist of people who know and trust each other.
        </h3>
        <h2 class="main-text-goal pt-4">
          Piltonet makes it easier to set up and manage a lending circle in the Web3 age. Piltonet goal is to help people around the world to Lend and Borrow with a trusted network of Friends, Family, and Verified Accounts when bank loans are not an option.
        </h2>
      </div>

      <div class="d-flex flex-row justify-content-center align-items-center text-center main-bottom row">
        <div class="col-12 col-sm-6 text-center text-sm-end mt-4 mb-2 px-2">
          <button v-if="isConnected" class="left-button" @click="$router.push('/account/profile')">
            MY PROFILE
          </button>
          <button v-else class="venom-button" @click="goToVenomHackathon">
            VENOM HACKATHON
          </button>
          <!-- To Do -->
          <button v-if="false" class="right-button" @click="showConnectModal">
            OK, GOT IT!
          </button>
        </div>
        <div class="col-12 col-sm-6 text-center text-sm-start mt-4 mb-2 px-2">
          <button class="right-button" @click="scrollToElement('how-works')">
            TELL ME MORE
          </button>
        </div>
        <div class="d-none d-lg-block col-lg-4 col-xl-6"></div>
      </div>

    </div>
  </div>
  
  <MessageModal
    ref="message_modal"
    @ok-clicked="goToVenomHackathon"
    @cancel-clicked="sendBestWishes"
  />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "JumboTron",
  computed: {
    ...mapGetters(['getConnectionStoreByKey', 'getVisitVenomHackStore']),
    isConnected() {
      return this.getConnectionStoreByKey('is_connected') || false;
    },
    visitVenomHack() {
      return this.getVisitVenomHackStore;
    }
  },
  mounted() {
    if(!this.visitVenomHack) {
      this.$refs.message_modal.setMessage({
        message: "“Hey there! we're participating in Venom Hackathon, and we would greatly appreciate your support. Your encouragement and well wishes can make a difference in our motivation and success. Your support means a lot to us!”",
        okBtn: 'Oh Great! Tell Me More',
        cancelBtn: 'Best Wishes 🤞',
        customStyle: 'width: 100%; max-width: 530px; margin: max(2rem, 50vh - 213px) auto 0 !important;',
        textStyle: 'font-size: 23px; letter-spacing: 1px; padding-bottom: 0 !important;',
        okBtnStyle: 'font-size: 16px; background-color: #094030; border-color: #094030; width: 180px; height: 40px;',
        cancelBtnStyle: 'font-size: 16px; background-color: transparent; border-color: var(--ptn-second-blue); width: 180px; height: 40px; color: var(--ptn-second-blue);',
      })
    }
  },
  methods: {
    ...mapMutations(['setVisitVenomHackStore']),
    async showConnectModal() {
      if(this.isConnected) {
        this.$router.push("/account/profile");
      } else {
        this.$emit('connectWallet');
      }
    },
    goToVenomHackathon() {
      this.setVisitVenomHackStore();
      window.open("https://venom.piltonet.com", "_self");
    },
    sendBestWishes() {
      this.setVisitVenomHackStore();
      this.notif({
          // title: '❤️',
          message: `Thank you for your support and wishes ❤️<br/>You can visit the hackathon page from "venom.piltonet.com".`,
          dangerouslyUseHTMLString: true,
          type: "success",
          duration: 5000,
        })
    },
    async scrollToElement(element) {
      if(document.getElementById(element)) {
        document.getElementById(element).scrollIntoView();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-top {
  align-items: center;
  width: 100%;
  max-width: 1400px;
  padding: 5rem 0 0;
}
.main-middle {
  align-items: center;
  width: 100%;
  max-width: 1100px;
  padding: 7rem 2rem 0;
}
.main-bottom {
  align-items: center;
  width: 100%;
  max-width: 1100px;
  padding: 3rem 0 5rem;
}
.main-text-title {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 104px;
  font-weight: normal;
  letter-spacing: 7px;
  line-height: 123px;
  text-align: start;
  color: var(--ptn-third-blue);
  margin: 0;
  padding: 0;
}
.main-text-title-small {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 66px;
  font-weight: normal;
  letter-spacing: 7px;
  line-height: 104px;
  text-align: start;
  color: rgba(var(--ptn-third-blue-rgb), 0.7);
  margin: 0;
  padding: 0 0 0.1rem;
}
.main-text-subtitle {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 52px;
  font-weight: normal;
  letter-spacing: 3px;
  line-height: 70px;
  text-align: center;
  color: rgba(var(--ptn-third-blue-rgb), 0.9);
  margin: 0;
  padding: 0;
}
.main-text-desc {
  font-size: 26px;
  font-weight: normal;
  letter-spacing: 0;
  line-height: 35px;
  text-align: center;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.main-text-goal {
  font-family: "RobotoB", arial,sans-serif;
  font-size: 36px;
  font-weight: normal;
  letter-spacing: 1px;
  line-height: 47px;
  text-align: center;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.main-text-goal::before {
  content: '\201C';
  color: rgba(var(--ptn-third-blue-rgb), 0.9);
}
.main-text-goal::after {
  content: '\201D';
  color: rgba(var(--ptn-third-blue-rgb), 0.9);
}
.right-img {
  width: 96%;
  object-fit: contain;
  border-radius: 32px;
}
.left-button {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--ptn-blue);
  color: var(--ptn-gray);
  border: 5px solid var(--ptn-blue);
  border-radius: 16px;
  width: 260px;
  height: 55px;
}
.right-button {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(var(--ptn-bg), var(--ptn-bg)) padding-box, linear-gradient(45deg, var(--ptn-blue), rgba(var(--ptn-blue-rgb), 0.3)) border-box;
  color: var(--ptn-blue);
  border: 5px solid transparent;
  border-radius: 16px;
  width: 260px;
  height: 55px;
}
.venom-button {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: linear-gradient(90.61deg,#094030,#11a97d,#11a97d,#094030);
  color: #ffffff;
  // border: 5px solid transparent;
  border: none;
  border-radius: 16px;
  width: 260px;
  height: 55px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
  .main-top {
    padding: 5rem 2rem 0;
  }
  .main-text-title {
    font-size: 92px;
    letter-spacing: 11px;
    line-height: 104px;
  }
  .main-text-title-small {
    font-size: 63px;
    letter-spacing: 7px;
    line-height: 92px;
  }
  .main-text-subtitle {
    font-size: 45px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .main-text-desc {
    font-size: 24px;
    line-height: 30px;
  }
  .main-text-goal {
    font-size: 30px;
    line-height: 40px;
  }
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
  .main-text-title {
    font-size: 79px;
    letter-spacing: 7px;
    line-height: 91px;
  }
  .main-text-title-small {
    font-size: 52px;
    letter-spacing: 5px;
    line-height: 65px;
  }
  .main-text-subtitle {
    font-size: 35px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .main-text-desc {
    font-size: 22px;
    line-height: 25px;
  }
  .main-text-goal {
    font-size: 27px;
    line-height: 35px;
  }
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .main-top {
    padding: 5rem 3rem 3rem;
  }
  .main-middle {
    padding: 3rem 1rem 2rem;
  }
  .main-bottom {
    padding: 0 0 4rem;
  }
  .main-text-title {
    font-size: 92px;
    letter-spacing: 11px;
    line-height: 104px;
  }
  .main-text-title-small {
    font-size: 63px;
    letter-spacing: 7px;
    line-height: 92px;
  }
  .main-text-subtitle {
    font-size: 39px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .main-text-desc {
    font-size: 21px;
    line-height: 30px;
    text-align: center;
  }
  .main-text-goal {
    font-size: 25px;
    letter-spacing: 0;
    line-height: 40px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .main-top {
    padding: 3rem 1rem;
  }
  .main-text-title {
    font-size: 72px;
    letter-spacing: 5px;
    line-height: 78px;
  }
  .main-text-title-small {
    font-size: 39px;
    letter-spacing: 5px;
    line-height: 50px;
  }
  .main-text-subtitle {
    font-size: 26px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .main-text-desc {
    font-size: 20px;
    line-height: 25px;
  }
  .main-text-goal {
    font-size: 23px;
    line-height: 35px;
  }
}
</style>
