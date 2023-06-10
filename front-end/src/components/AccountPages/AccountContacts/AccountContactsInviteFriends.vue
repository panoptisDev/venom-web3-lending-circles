<template>
  <div id="account-contacts-invite-fiends">
    <div class="d-flex flex-column justify-content-center align-items-start ms-3 ms-xl-5 py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/profile')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="main-section">
      <h3>INVITE YOUR FRIENDS</h3>
      <div v-if="inviteCode" class="text-center mt-4">
        <div v-if="new Date(inviteCodeED) > new Date()">
          <p>
            <span class="account-contacts-invite-fiends-code">
              {{ inviteCode }}
            </span>
            <el-tooltip
              :content="this.copyInviteCodeTooltip"
              placement="top"
              :hide-after="0"
            >
              <a id="copy-invite-code" role="button" @click="copyInviteCode('copy-invite-code', inviteCode)">
                <i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>
              </a>
            </el-tooltip>
          </p>
          <p>
            <span class="account-contacts-invite-fiends-ed">
              {{ `Exp. ${utils.formatDate(inviteCodeED, 'DD Month YYYY', 'HH:MM:SS')}` }}
            </span>
          </p>
          <!-- Invite Message -->
          <div class="row my-5">
            <label for="inviteMessage" class="account-contacts-invite-fiends-message-label mb-2">
              Send the code to your friends or just share the message below with them.
              <el-tooltip
                :content="this.copyInviteMessageTooltip"
                placement="top"
                :hide-after="0"
              >
                <a id="copy-invite-message" role="button" @click="copyInviteMessage('copy-invite-message', inviteMessage)">
                  <i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>
                </a>
              </el-tooltip>
              <el-tooltip
                content="Share via WhatsApp"
                placement="top"
                :hide-after="0"
              >
                <s-whats-app
                  :window-features="{}"
                  :share-options="{text: inviteMessage}"
                >
                  <i class="fab fa-whatsapp ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>
                </s-whats-app>
              </el-tooltip>
              <el-tooltip
                content="Share via Telegram"
                placement="top"
                :hide-after="0"
              >
                <s-telegram
                  :window-features="{
                    // left: 100,
                    // top: 100,
                    // width: 450,
                    // height: 320
                  }"
                  :share-options="{
                    url: ' ',
                    text: inviteMessage
                  }"
                >
                  <i class="fab fa-telegram ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>
                </s-telegram>
              </el-tooltip>
            </label>
            <textarea
              id="inviteMessage"
              type="textbox"
              rows="3"
              class="account-contacts-invite-fiends-message"
              v-model="inviteMessage"
            ></textarea>
          </div>
          <div
            type="button"
            @click="$refs.message_modal.setMessage({
              message: 'If you create a new invitation code, the current code becomes invalid.',
              okBtn: 'Continue'
            })"
            class="account-contacts-invite-fiends-create-code"
          >
            <span class="m-0 p-0">CREATE NEW CODE</span>
          </div>
        </div>
        <div v-else>
          <p>
            <span class="account-contacts-invite-fiends-code expired">
              {{ inviteCode }}
            </span>
          </p>
          <p>
            <span class="account-contacts-invite-fiends-ed expired">
              (The invite code has expired)
            </span>
          </p>
          <div
            type="button"
            @click="createInviteCode"
            class="account-contacts-invite-fiends-create-code"
          >
            <span class="m-0 p-0">CREATE NEW CODE</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="note-text">It is very easy to invite friends in Piltonet.<br>
          For this you need to create an invitation code that you can share with your trusted friends.<br>
          The invitation code is valid for only one day.
        </p>
        <div
					type="button"
					@click="createInviteCode"
					class="account-contacts-invite-fiends-create-code"
				>
          <span class="m-0 p-0">CREATE INVITE CODE</span>
        </div>
      </div>
    </div>
  </div>
  
  <MessageModal
    ref="message_modal"
    @ok-clicked="createInviteCode"
  />

</template>

<script>
import { mapMutations } from "vuex";
import api from "@/services/api";
import { SWhatsApp, STelegram } from 'vue-socials'

export default {
  name: "AccountContactsInviteFriends",
  components: {
    SWhatsApp,
    STelegram
  },
  props: {
    connectedAccountProps: Object,
    accountProfileProps: Object
  },
  data() {
    return {
      inviteCode: null,
      inviteCodeED:null,
      inviteMessage: null,
      copyInviteCodeTooltip: "Copy Code",
      copyInviteMessageTooltip: "Copy Message",
      hasError: {
      }
    };
  },
  mounted() {
    this.setup();
    // console.log(this.accountProfileProps);
  },
  watch: {
    accountProfileProps: function () {
      this.setup();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore', 'setProfileStoreByKey']),
    setup() {
      this.inviteCode = this.accountProfileProps?.account_invite_code || null;
      this.inviteCodeED = this.accountProfileProps?.account_invite_code_ed || null;

      // To Do
      this.inviteMessage =`Hi 👋
Do you know Piltonet? It is a Web3 platform for lending circles between family and friends.
If you'd like to join us, here are the details you need:
1. Go to ${process.env.VUE_APP_URL}
2. Connect your MetaMask wallet (If you are new to MetaMask, please check out metamask.io)
3. Click on “I Have An Invite Code” and enter "${this.inviteCode}" (valid until ${this.utils.formatDate(this.inviteCodeED, 'DD Month', 'HH:MM')})`;

      this.inviteMessage = `Hi 👋
My invitation code on https://piltonet.com is "${this.inviteCode}"
(valid until ${this.utils.formatDate(this.inviteCodeED, 'DD Month', 'HH:MM')})`;

    },
    async createInviteCode() {
      let apiResponse = await api.post_account_contacts_create_invite_code();
      if(apiResponse.data.done) {
        this.notif({
          title: "SUCCESS!",
          message: apiResponse.data.message,
          dangerouslyUseHTMLString: true,
          type: apiResponse.data.message_type,
          duration: 3000,
        })
        this.setProfileStoreByKey({ 
          account_invite_code: apiResponse.data.result[0]?.account_invite_code,
          account_invite_code_ed: apiResponse.data.result[0]?.account_invite_code_ed
        });
        this.setup();
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
    },
    async copyInviteCode(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyInviteCodeTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyInviteCodeTooltip = "Copy Code";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>';
        }, 2000);
    },
    async copyInviteMessage(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyInviteMessageTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyInviteMessageTooltip = "Copy Message";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
#account-contacts-invite-fiends {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-contacts-invite-fiends-code {
  font-size: 35px;
  font-weight: Bold;
  letter-spacing: 5px;
  line-height: 35px;
  color: rgba(var(--ptn-second-blue-rgb), 0.9) !important;
}
.account-contacts-invite-fiends-code.expired {
  text-decoration: line-through;
}
.account-contacts-invite-fiends-ed {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  overflow-wrap: break-word;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 5px 30px 0;
}
.account-contacts-invite-fiends-ed.expired {
  color: var(--ptn-red) !important;
}
.account-contacts-invite-fiends-message-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  overflow-wrap: break-word;
  text-align: start;
  border: none;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.account-contacts-invite-fiends-message {
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
  overflow-wrap: break-word;
  text-align: start;
  border: solid 1px rgba(var(--ptn-third-gray-rgb), 0.3);
  border-radius: 8px;
  background: var(--ptn-second-bg);
  color: rgba(var(--ptn-second-blue-rgb), 0.7);
  margin: 0;
  padding: 10px;
}
.account-contacts-invite-fiends-create-code {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 16px;
  line-height: 45px;
  text-align: center;
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 200px;
  // height: 45px;
  margin: 25px 0 15px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .account-contacts-invite-fiends-message-label {
    font-size: 12px;
    line-height: 16px;
  }
  .account-contacts-invite-fiends-message {
    font-size: 13px;
    line-height: 20px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
