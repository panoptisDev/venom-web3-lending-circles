<template>
  <div id="account-profile-new">
    <div class="account-profile-new-main row">
				
      <h2>WELCOME TO PILTONET</h2>
      <h3>If you don't have a Piltonet account, create one. Otherwise, you can link to your existing account.</h3>

      <!-- New Main Account -->
      <div class="col-12 col-md-6">
        <div
          type="button"
          class="account-profile-new-card right"
          @click="creatNewAccount"
        >
          <h2>
            CREATE A NEW<br />
            ACCOUNT
          </h2>
          <h3>
            <i class="far fa-user-circle" aria-hidden="true"></i>
          </h3>
        </div>
      </div>

      <!-- To Do -->
      <!-- Exist Main Account -->
      <div class="col-12 col-md-6">
        <div
          type="button"
          class="account-profile-new-card left disabled"
          @click="comingSoonMsg"
        >
          <h2 class="disabled">
            LINK TO EXISTING<br />
            ACCOUNT
          </h2>
          <h3 class="disabled">
            <i class="fa fa-link" aria-hidden="true"></i>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus';
import { mapGetters } from "vuex";
import venomwallet from "@/wallets/venomwallet";
import { Address } from 'everscale-inpage-provider';

const { AccountsContract } = require('@/contracts');

export default {
  name: "AccountNewType",
  data() {
    return {
      openLoadings: []
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
    }
  },
  methods: {
    async creatNewAccount() {
      let loadingId = await this.showLoading();
      try {
        const accountsContractAddress = AccountsContract.address;
        const accountsContract = await venomwallet.getDeployedContract(AccountsContract, accountsContractAddress);
        const publicKey = await venomwallet.getPublicKey();
        const accountAddress = new Address(this.connectedAccount.account_address)
        loadingId = await this.showLoading();
        const transaction = await accountsContract.methods.createAccount({publicKey: `0x${publicKey}`}).send({
          from: accountAddress,
          amount: '1000000000' // 1 venom
        });
        this.openLoadings[loadingId].close();
        this.notif({
          title: "SUCCESS!",
          message: "Your account successfully created.",
          dangerouslyUseHTMLString: true,
          type: "success",
          duration: 3000,
          onClose: () => { this.$router.push('/account/create') }
        })

        console.log('connect transaction:', transaction);
      } catch (err) {
        this.openLoadings[loadingId].close();
        this.notif({
          title: "OOPS!",
          message: "Something went wrong, please try again later.",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
        })
        console.log(err);
      }
    },
    async showLoading() {
      const randomId = Date.now();
      this.openLoadings[randomId] = undefined;
      this.openLoadings[randomId] = new ElLoading.service({
        lock: true,
        text: '',
        fullscreen: true,
      });
      return randomId;
    },
    async comingSoonMsg() {
      this.notif({
        title: "COMING SOON",
        message: "This feature is not yet released. We are working hard to add exciting new features to Pilotnet.",
        dangerouslyUseHTMLString: true,
        type: "success",
        duration: 3000,
      })
    }
  }
};
</script>

<style lang="scss" scoped>
#account-profile-new {
  min-height: 500px;
  padding: 100px 0;
}
.account-profile-new-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.account-profile-new-main h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 32px;
  text-align: center;
  color: var(--ptn-color);
  max-width: 900px;
  margin: 0 0 15px;
  padding: 0 15px;
}
.account-profile-new-main h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
  text-align: center;
  color: var(--ptn-third-gray);
  max-width: 900px;
  margin: 0 0 25px;
  padding: 0 15px;
}
.account-profile-new-card {
  background: var(--ptn-second-bg);
  width: 310px;
  height: 310px;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}
.account-profile-new-card.right {
  margin: 15px 15px 0 auto;
}
.account-profile-new-card.left {
  margin: 15px auto 0 15px;
}
.account-profile-new-card.disabled {
  cursor: default;
}
.account-profile-new-card h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  text-align: justify;
  letter-spacing: 0.05em;
  text-transform: capitalize;
  text-align: center;
  padding-bottom: 32px;
  padding-top: 50px;
  margin: 0;
}
.account-profile-new-card h2.disabled {
  color: rgba(var(--ptn-color-rgb), 0.2);
}
.account-profile-new-card h3 {
  font-size: 50px;
  color: var(--ptn-btn-bg);
  padding: 0;
  margin: 0;
}
.account-profile-new-card h3.disabled {
  color: rgba(var(--ptn-btn-bg-rgb), 0.2);
}

@media (max-width: 768px) {
  .account-profile-new-card {
    max-width: 90%;
    max-height: 100vw;
  }
  .account-profile-new-card.right,
  .account-profile-new-card.left {
    margin: 15px auto;
  }
}
</style>
