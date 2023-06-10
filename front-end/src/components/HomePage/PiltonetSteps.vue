<template>
  <div id="piltonet-steps" class="mx-auto my-5">
    <p class="piltonet-steps-title my-3">HOW PILTONET WORKS</p>
    <p class="piltonet-steps-subtitle pb-4">
      Step By Step
    </p>
    <div class="d-flex flex-row d-flex flex-row justify-content-center align-items-center row">
      <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="piltonet-steps-step">
          <div class="p-4">
            <img
              alt="piltonet step-1"
              src="@/assets/images/piltonet-step-1.png"
              class="piltonet-steps-img"
            />
          </div>
          <p class="piltonet-steps-step-title">
            1. CONNECT A WALLET
          </p>
          <p class="piltonet-steps-step-desc">
            Click on "Connect Wallet" from the right side of the top menu and connect your Venom Wallet.<br />
            <a href="https://docs.venom.foundation/general/wallet/create-a-new-wallet-account/" target="_blank">
              <img
                src="@/assets/icons/venom-logo.svg"
                height="27"
                class="m-0 pb-1"
              />
              Read more about Venom Wallet
            </a>
          </p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="piltonet-steps-step">
          <div class="p-4">
            <img
              alt="piltonet step-2"
              src="@/assets/images/piltonet-step-2.png"
              class="piltonet-steps-img"
            />
          </div>
          <p class="piltonet-steps-step-title">
            2. CREATE YOUR ACCOUNT
          </p>
          <p class="piltonet-steps-step-desc">
            After connecting the wallet, you'll be redirect to "Create Account" page. Enter the requested information and create your account.
          </p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="piltonet-steps-step">
          <div class="p-4">
            <img
              alt="piltonet step-3"
              src="@/assets/images/piltonet-step-3.png"
              class="piltonet-steps-img"
            />
          </div>
          <p class="piltonet-steps-step-title">
            3. CONNECT WITH FRIENDS
          </p>
          <p class="piltonet-steps-step-desc">
            Lending circles are formed based on the group of trusted people. Go to "Contact List" page, join your friends or simply invite them to join you.
          </p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="piltonet-steps-step">
          <div class="p-4">
            <img
              alt="piltonet step-4"
              src="@/assets/images/piltonet-step-4.png"
              class="piltonet-steps-img"
            />
          </div>
          <p class="piltonet-steps-step-title">
            4. JOIN/CREATE A CIRCLE
          </p>
          <p class="piltonet-steps-step-desc">
            Join circles that your friends have created and invited you, or create your own and invite your contacts to attend that lending circle.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PiltonetSteps",
};
</script>

<style lang="scss" scoped>
#piltonet-steps {
  width: 100%;
  max-width: 1300px;
  padding: 0 2rem;
}
.piltonet-steps-title {
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
.piltonet-steps-subtitle {
  font-size: 26px;
  font-weight: normal;
  letter-spacing: 0;
  line-height: 35px;
  text-align: center;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.piltonet-steps-step {
  border: none;
  border-radius: 16px;
  background: var(--ptn-second-bg);
  color: rgba(var(--ptn-color-rgb), 0.7);
  width: 100%;
  max-width: 350px;
  height: 480px;
  margin: 0 auto;
  padding: 1.5rem;
}
.piltonet-steps-step-title {
  font-family: "RobotoB", arial, sans-serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
  margin: 0 0 1rem;
  padding: 0;
}
.piltonet-steps-step-desc {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.7;
  text-align: center;
  margin: 0;
  padding: 0;
}
.piltonet-steps-step-desc a {
  font-size: 15px;
  // text-decoration: underline !important;
  color: var(--ptn-venom-grean) !important;
}

.piltonet-steps-img {
  background: rgba(var(--ptn-third-gray-rgb), 0.2);
  border: none;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  margin: 0;
  padding: 1.5rem;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
  .piltonet-steps-title {
    font-size: 45px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .piltonet-steps-subtitle {
    font-size: 24px;
    line-height: 30px;
  }
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
  .piltonet-steps-title {
    font-size: 35px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .piltonet-steps-subtitle {
    font-size: 22px;
    line-height: 25px;
  }
  .piltonet-steps-step {
    height: 510px;
    margin: 0 auto 20px;
  }
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .piltonet-steps-title {
    font-size: 39px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .piltonet-steps-subtitle {
    font-size: 21px;
    line-height: 30px;
    text-align: center;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .piltonet-steps-title {
    font-size: 26px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .piltonet-steps-subtitle {
    font-size: 20px;
    line-height: 25px;
  }
  .piltonet-steps-step {
    height: 490px;
    padding: 1rem;
  }
}
</style>
