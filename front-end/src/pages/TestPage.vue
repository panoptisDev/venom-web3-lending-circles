<template>
  <NavBar />
  <div class="mt-3 mb-5">
    <div v-if="account" class="d-flex flex-column text-center justify-content-center align-items-center">
      
      <div class="d-flex flex-column text-end w-100 pe-5 mb-5">
        <span role="button" @click="copyPassword"><i class="fa fa-copy"></i></span>
      </div>
      <p>{{ accountsContractAccount?.username }}</p>
      <p>{{ accountsContractAccount?.email }}</p>
      <p>
        Address:
        <span class="front-btn blue-btn ms-2">
          <a :href="`https://devnet.venomscan.com/accounts/${account.account_address}`" target="_blank">
            {{ account.account_address }}
          </a>
        </span>
      </p>
      <!-- <p>{{ `PublicKey: ${publicKey}` }}</p> -->
      <p v-if="account?.account_balance">
        {{ utils.fixedNumber(account.account_balance / 10 ** defaultchain.nativeToken.decimals, 5, 2) }}
      </p>
      <p v-else>
        <i class="fa fa-sync fa-spin"></i>
      </p>

      <div v-if="!accountsContractConnected" class="d-flex flex-column text-center justify-content-center align-items-center w-100">
        <!-- <p>Contract Address</p> -->
        <input
          ref="contract_address"
          type="text"
          class="big-input text-center mt-5 mb-0"
          v-model="accountsContractAddress"
        />
        <button class="submit-btn" @click="onConnectContractClick">
          Connect Accounts
        </button>
      </div>

      <div v-else class="d-flex flex-column text-center justify-content-center align-items-center w-100">
        <p>
          Accounts Contract:
          <span class="front-btn blue-btn ms-2">
            <a :href="`https://devnet.venomscan.com/accounts/${accountsContractAddress}`" target="_blank">
              {{ accountsContractAddress }}
            </a>
          </span>
        </p>
        <p v-if="accountsContractBalance">
          {{ utils.fixedNumber(accountsContractBalance / 10 ** defaultchain.nativeToken.decimals, 5, 2) }}
        </p>

        <button v-if="!this.accountsContractAccount?.created" class="submit-btn" @click="onConnectClick">
          Connect
        </button>
        
        <p v-if="accountProfileContractAddress">
          AccountPofile Contract:
          <span class="front-btn blue-btn ms-2">
            <a :href="`https://devnet.venomscan.com/accounts/${accountProfileContractAddress}`" target="_blank">
              {{ accountProfileContractAddress }}
            </a>
          </span>
        </p>
        <p v-if="accountProfileContractBalance">
          {{ utils.fixedNumber(accountProfileContractBalance / 10 ** defaultchain.nativeToken.decimals, 5, 2) }}
        </p>
        
        <button v-if="accountProfileContractAddress" class="submit-btn" @click="getAccountProfileContract">
          Connect Profile Contract
        </button>
        
        <button v-if="this.accountsContractAccount?.created" class="submit-btn" @click="onGetAccount()">
          Get Account
        </button>
        
        <button v-if="this.accountsContractAccount?.created" class="submit-btn" @click="onSetAccount('farox', 'info@piltonet.com')">
          Set Account
        </button>
        
        <button v-if="this.accountsContractAccount?.created" class="submit-btn" @click="onGetPastEvents('AccountCreated')">
          Events > AccountCreated
        </button>
        <button v-if="this.accountsContractAccount?.created" class="submit-btn" @click="onGetPastEvents('AccountConnected')">
          Events > AccountConnected
        </button>
        <button v-if="this.accountsContractAccount?.created" class="submit-btn" @click="onGetPastEvents('AccountProfileCreated')">
          Events > AccountProfileCreated
        </button>
        
        <button v-if="this.accountsContractAccount?.created" class="front-btn red-btn red-border mt-4 px-5 py-3" @click="onWithdrawClick">
          Withdraw
        </button>
        
      </div>
    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus';
import { Address, TvmException } from "everscale-inpage-provider";
import venomwallet from "@/wallets/venomwallet";
import NavBar from '@/components/NavBar/NavBar.vue';
import { mapGetters } from "vuex";
// import deploy from "@/services/deploy";
const { AccountsContract, AccounProfileContract } = require('@/contracts');

export default {
  name: "TestPage",
  components: {
    NavBar
  },
  data() {
    return {
      account: undefined,
      accountAddress: undefined,
      provider: undefined,
      publicKey: undefined,
      accountsContractAddress: AccountsContract.address || undefined,
      accountsContract: undefined,
      accountsContractConnected: false,
      accountsContractBalance: undefined,
      accountProfileContractAddress: undefined,
      accountProfileContractBalance: undefined,
      accountsContractAccount: undefined,
      openLoadings: []
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
    }
  },
  watch: {
    connectedAccount: async function () {
      await this.setup();
    }
  },
  async mounted() {
    this.accountsContractAddress = this.accountsContractAddress || venomwallet.getContractAddress();
  },
  methods: {
    async setup() {
      if(this.connectedAccount?.is_connected) {
        this.account = this.connectedAccount;
        this.accountAddress = new Address(this.account.account_address);
        this.provider = this.account && this.account.is_connected ? venomwallet.getProvider() : undefined;
        this.publicKey = await venomwallet.getPublicKey();
        if(this.accountsContractAddress) this.accountsContractBalance = await this.provider.getBalance(this.accountsContractAddress);
        if(this.accountsContract) this.accountsContractAccount = await this.getAccount();
        if(this.accountProfileContractAddress) this.accountProfileContractBalance = await this.provider.getBalance(this.accountProfileContractAddress);
      } else {
        this.account = undefined;
        this.provider = undefined;
        this.publicKey = undefined;
        this.accountsContractAddress = AccountsContract.address || undefined,
        this.accountsContract = undefined;
        this.accountsContractConnected = false;
        this.accountsContractBalance = undefined;
        this.accountProfileContractAddress = undefined;
        this.accountProfileContractBalance = undefined;
        this.accountsContractAccount = undefined;
      }
    },
    
    async onConnectContractClick() {
      if(this.accountsContractAddress) {
        this.accountsContract = await venomwallet.getDeployedContract(AccountsContract, this.accountsContractAddress);
        this.accountsContractConnected = true;
        await this.getAccountProfileContract();
      } else {
        this.$refs.contract_address.focus();
      }
    },

    async onGetVotes() {
      const results = await this.accountsContract.methods.getDetails({}).call();
      // const results = 'End';
      console.log('results', results);
    },


    async onConnectClick() {
      if(this.accountsContractAddress) {
        let loadingId = await this.showLoading();
        try {
          
          // const payload = {
          //   abi: JSON.stringify(AccountsContract.abi),
          //   method: 'connect',
          //   params: {
          //     accountAddress: accountAddress,
          //     answerId: 1
          //   }
          // };
          // const { transaction } = await this.provider.sendMessage({
          //   sender: accountAddress,
          //   recipient: this.accountsContractAddress,
          //   amount: '1000000000', // 1 venom
          //   bounce: true,
          //   payload: payload,
          //   responsible: true
          // });

          // const { transaction } = await this.accountsContract.methods.createAccount({
          //   accountAddress: accountAddress,
          //   answerId: 5
          // }).sendExternal({
          //   publicKey: this.publicKey,
          //   responsible: true
          // });
          
          const transaction = await this.accountsContract.methods.createAccount({publicKey: `0x${this.publicKey}`}).send({
            from: this.accountAddress,
            amount: '300000000' // 0.3 venom
          });

          console.log('connect transaction:', transaction);
        } catch (err) {
          this.openLoadings[loadingId].close();
          if(err instanceof TvmException) {
            console.log(`TVM Exception: ${err.code}`);
          } else {
            // Re-throw it othersise
            throw err;
          }
        }
        
        
        await this.getAccountProfileContract();
        // const initParams = {
        //   _accountsContract: this.accountsContractAddress,
        //   _accountAccount: this.accountAddress
        // }
        // this.accountProfileContractAddress = (await venomwallet.getExpectedAddress(AccounProfileContract, initParams))?.toString() || undefined;
        // console.log('ProfileContract Address:', this.accountProfileContractAddress);
        
        
        this.openLoadings[loadingId].close();
        
        // const profileContract = await venomwallet.getDeployedContract(AccounProfileContract, this.accountProfileContractAddress);
        // console.log('ballotContract  >>>>>>>  ', profileContract);
        
        // const messageParams = {
        //   fullname: 'FAROKH M',
        //   username: 'farokh',
        //   signUpAt: new Date().getTime()
        // }
        // await venomwallet.sendExternallMessage(AccountsContract, this.accountsContractAddress, 'connect', messageParams);
      } else {
        this.$refs.contract_address.focus();
      }
    },

    async onGetAccount() {
      console.log(await this.getAccount());
    },

    async getAccountProfileContract() {
      const initParams = {
        accountsContractAddress: this.accountsContractAddress,
        accountAddress: this.accountAddress
      }
      const expectedAddress = (await venomwallet.getExpectedAddress(AccounProfileContract, initParams))?.toString() || undefined;
      if(await this.provider.getBalance(expectedAddress) > 0) {
        this.accountProfileContractAddress = expectedAddress;
      } else {
        this.accountProfileContractAddress = undefined;
      }
      
      // const profileContract = await venomwallet.getDeployedContract(AccounProfileContract, this.accountProfileContractAddress);
      // console.log('ballotContract  >>>>>>>  ', profileContract);
    },

    async onSignUpExternalClick() {
      if(this.accountsContractAddress) {
        try {
          // const tx = await this.accountsContract.methods.signUpExternal({
          //   // userAddress: this.accountAddress,
          //   fullname: 'MNBVC',
          //   username: 'XXXX',
          //   // signUpAt: (new Date().getTime())
          // }).send({
          //   from: this.accountAddress,
          //   amount: '50000000', // 0.15 venom
          // });
          
          const tx = await this.accountsContract.methods.signUpExternal({
            userAddress: this.accountAddress,
            fullname: 'fdfdfd uyiuyi',
            username: 'erwtre',
            // signUpAt: (new Date().getTime())
          }).sendExternal({
            publicKey: this.publicKey,
          });

          console.log('connect tx:', tx);
        } catch (err) {
          if(err instanceof TvmException) {
            console.log(`TVM Exception: ${err.code}`);
          } else {
            // Re-throw it othersise
            throw err;
          }
        }
      } else {
        this.$refs.contract_address.focus();
      }
    },
    
    async onWithdrawClick() {
      if(this.accountsContractAddress) {
        const tx = await this.accountsContract.methods.withdraw({answerId: 3}).sendExternal({
          publicKey: this.publicKey,
        });
        console.log('withdraw tx:', tx);
      } else {
        this.$refs.contract_address.focus();
      }
    },
    
    async onDoDeployedClick() {
      if(this.accountsContractAddress) {
        await venomwallet.doDeployedContract(this.accountsContractAddress);
      } else {
        this.$refs.contract_address.focus();
      }
    },
    
    async onSetAccount(username, email) {
      if(this.accountsContract) {
        let loadingId = await this.showLoading();
        try {
          const { output, transaction } = await this.accountsContract.methods.setAccount({
            accountAddress: this.accountAddress,
            username: username,
            email: email,
            answerId: 1
          }).sendExternal({
            publicKey: this.publicKey,
          });

          if(output.done) {
            console.log('setAccount transaction:', transaction);
          } else {
            console.log('setAccount transaction failed by code:', output.err);
          }
        } catch(err) {
          console.log(err);
        }
        this.openLoadings[loadingId].close();
      }
    },
    
    async onSetAccount_old(username, email) {
      if(this.accountsContract) {
        let loadingId = await this.showLoading();
        try {
          if(await this.isUsernameAvailable(username)) {
            const { output, transaction } = await this.accountsContract.methods.setAccount({
              accountAddress: this.accountAddress,
              username: username,
              email: email,
              answerId: 1
            }).sendExternal({
              publicKey: this.publicKey,
            });

            // const payload = {
            //   abi: JSON.stringify(AccountsContract.abi),
            //   method: 'setAccount',
            //   params: {
            //     accountAddress: this.accountAddress,
            //     username: username,
            //     email: email,
            //     answerId: 1
            //   }
            // };
            // const { transaction } = await this.provider.sendMessage({
            //   sender: this.accountAddress,
            //   recipient: this.accountsContractAddress,
            //   amount: '100000000', // 0.1 venom
            //   bounce: true,
            //   payload: payload,
            //   responsible: true
            // });

            // const transaction = await this.accountsContract.methods.setAccount({
            //   accountAddress: this.accountAddress,
            //   username: username,
            //   email: email,
            //   answerId: 1
            // }).send({
            //   from: this.accountAddress,
            //   amount: '100000000', // 0.1 venom
            //   responsible: true
            // });


            if(output.done) {
              console.log('setAccount transaction:', transaction);
            } else {
              console.log('setAccount transaction failed by code:', output.err);
            }

            
          } else {
            if((await this.getAccount()).username == username) {
              console.log('same username!');
            } else {
              console.log('username is taken!');
            }
          }
        } catch(err) {
          console.log(err);
        }
        this.openLoadings[loadingId].close();
      }
    },
    
    async getAccount() {
      if(this.accountsContract) {
        try {
          const { account } = await this.accountsContract.methods.getAccount({
            accountAddress: this.accountAddress
          }).call();
          return account;
        } catch(err) {
          console.log(err);
          return undefined;
        }
      } else return undefined;
    },
    
    async isUsernameAvailable(username) {
      if(this.accountsContract) {
        try {
          const { available } = await this.accountsContract.methods.isUsenameAvailable({
            username: username,
          }).call();
          return available;
        } catch(err) {
          console.log(err);
          return undefined;
        }
      } else return undefined;
    },

    async onGetPastEvents(event) {
      let loadingId = await this.showLoading();
      const pastEvents = await venomwallet.getPastEvents(this.accountsContract, event);
      // let _events = [];
      pastEvents.events.reverse().forEach(_event => {
        console.log(_event.data);
        // _events.push(_event.data.account.toString());
        // console.log(_event.data);
        // // let d = (_event.data.at / 1e+6) + 1684856424;
        // let d = (_event.data.at / 1e+6) * 1628.3450851911734;
        // let n = new Date().getTime();
        // let _d = new Date(d * 1000);
        // console.log('date:', _d);
        // console.log(n / (_event.data.at / 1e+3));
      });
      // console.log(_events);
      this.openLoadings[loadingId].close();
    },

    async onDisconnectButtonClick() {
      this.account = undefined;
      this.$refs.venom_connect?.onDisconnectButtonClick();
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

    async copyPassword() {
      navigator.clipboard.writeText("Arnic@2504");
    }
  }
};
</script>