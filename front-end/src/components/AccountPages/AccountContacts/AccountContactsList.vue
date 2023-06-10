<template>
  <div id="account-contacts-contact-list">
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
    <div v-if="accountContactsProps.waiting_friends && accountContactsProps.waiting_friends.length > 0" class="main-section">
      <h3>FRIEND REQUESTS</h3>
      <!-- Waiting Friends Contacts -->
      <div v-for="(accountContact, index) in accountContactsProps.waiting_friends"
        :key="accountContact.contact_id"
        class="d-flex flex-column justify-content-center align-items-startr"
        :class="index > 0 ? 'mt-4' : ''"
      >
        <div class="d-flex flex-row justify-content-start align-items-center">
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <JazzIcon
            v-if="!accountContact.account_image_url"
            :address="accountContact.main_account_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          />
          <p class="top-text-small ms-2">
            <span>
              {{ accountContact.account_fullname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `friend request on ${utils.formatDate(accountContact.created_at, 'DD Month YYYY')}` }}
            </span>
          </p>
        </div>
        <div class="d-flex flex-column flex-sm-row justify-content-start align-items-start mt-2">
          <div class="d-flex flex-row justify-content-start align-items-center">
            <p class="main-text">{{ `Is ${accountContact.account_fullname || accountContact.account_username} your trusted friend?` }}</p>
          </div>
          <div class="d-flex flex-row justify-content-start align-items-center">
            <div
              type="button"
              @click="acceptWaitingContact(accountContact.contact_id)"
              class="front-btn green-btn ms-0 ms-sm-3"
            >
              <span class="m-0 p-0">Yes, sure!</span>
            </div>
            <div
              type="button"
              @click="rejectWaitingContact(accountContact.contact_id)"
              class="front-btn red-btn ms-3"
            >
              <span class="m-0 p-0">Reject</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-section">
      <h3>CONTACT LIST</h3>
      <!-- Connected Contacts -->
      <div v-if="accountContactsProps.connected">
        <div v-for="(accountContact, index) in accountContactsProps.connected"
          :key="accountContact.contact_id"
          class="d-flex flex-row justify-content-start align-items-center"
          :class="index > 0 ? 'mt-2' : ''"
        >
          <p class="account-contacts-contact-list-check me-0">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <p class="account-contacts-contact-list-check">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <JazzIcon
            v-if="!accountContact.account_image_url"
            :address="accountContact.main_account_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          />
          <p class="top-text-small ms-2">
            <span>
              {{ accountContact.account_fullname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `your contact since ${utils.formatDate(accountContact.updated_at, 'Month YYYY')}` }}
            </span>
          </p>
        </div>
      </div>
      <!-- Waiting Contacts -->
      <div v-if="accountContactsProps.waiting">
        <p class="note-text mt-3">
          <i class="fa fa-spinner fa-pulse me-1" aria-hidden="true"></i>
          Waiting for the friends' confirmation
        </p>
        <div v-for="(accountContact) in accountContactsProps.waiting"
          :key="accountContact.contact_id"
          class="d-flex flex-row justify-content-start align-items-center mt-2"
        >
          <p class="account-contacts-contact-list-check me-0">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <p class="account-contacts-contact-list-check gray-btn">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <JazzIcon
            v-if="!accountContact.account_image_url"
            :address="accountContact.main_account_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          />
          <p class="top-text-small ms-2">
            <span>
              {{ accountContact.account_fullname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `waiting from ${utils.formatDate(accountContact.created_at, 'DD Month YYYY')}` }}
            </span>
          </p>
        </div>
      </div>
      <div v-if="!accountContactsProps.connected && !accountContactsProps.waiting">
        <p class="note-text">Your contact list is empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import metamask from "@/wallets/metamask";
import venomwallet from '@/wallets/venomwallet';

export default {
  name: "AccountContactsList",
  props: {
    connectedAccountProps: Object,
    accountContactsProps: Object
  },
  data() {
    return {
      accountIsMain: false,
      shareLink: null,
      showShareLinkModal: false,
      copyLinkTooltip: "Copy Link",
      copyAddressTooltip: "Copy Address",
      networkExplorerUrl: `${this.defaultchain.explorer}accounts`,
      wallet: this.defaultchain.wallets[0] == 'venom-connect' ? venomwallet : metamask,
      hasError: {
        accept_waiting: false
      }
    };
  },
  mounted() {
    // console.log(this.accountContactsProps);
  },
  methods: {
    async acceptWaitingContact(contactId) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_contacts_accept_waiting_contact({contact_id: contactId});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
          })
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
    },
    async rejectWaitingContact(contactId) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_contacts_reject_waiting_contact({contact_id: contactId});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
          })
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
    },
    async personalSign() {
      let personalSignResult = await this.wallet.personalSign(
        "This request requires your signature. It costs you nothing." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccountProps.account_address,
        null
      );
      return personalSignResult;
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
#account-contacts-contact-list {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-contacts-contact-list-check {
  color: var(--ptn-green);
  width: 10px;
  padding-top: 10px;
  margin-right: 15px;
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
}
</style>
