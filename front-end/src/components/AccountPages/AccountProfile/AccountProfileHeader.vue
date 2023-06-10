<template>
  <div id="account-profile-header">
    <div class="d-flex flex-column justify-content-center align-items-center pt-5">
      <img
        v-if="accountProfile?.account_image_url"
        :src="accountProfile?.account_image_url"
        alt=""
        class="account-image"
      />
      <JazzIcon
        v-if="!accountProfile?.account_image_url"
        :address="accountProfile?.account_address"
        :diameter="130"
        :colors=jazzColors
        class="account-image"
      />
      <span class="account-fullname mt-3 ms-2">
        {{ accountProfile?.account_fullname || '' }}
        <el-tooltip
          content="Edit Profile"
          placement="top"
          :hide-after="0"
        >
          <a role="button" @click="$router.push('/account/settings?active_page=profile')">
            <i class="fa fa-pencil account-edit-icon ms-1" aria-hidden="true"></i>
          </a>
        </el-tooltip> 
      </span>
      <span class="account-username mt-2">{{ accountProfile?.account_username ? `@${accountProfile?.account_username}` : '' }}</span>
      <div class="d-flex flex-row justify-content-center align-items-center gap-2">
        <span class="account-address mt-3">Main Account: {{ accountProfile?.account_address ? utils.truncate(accountProfile?.account_address, 12) : '' }}</span>
        <span>
          <el-tooltip
            :content="this.copyAddressTooltip"
            placement="top"
            :hide-after="0"
          >
            <a id="copy-account" role="button" @click="copyAccount('copy-account')">
              <i class="far fa-copy mt-3"></i>
            </a>
          </el-tooltip>
        </span>
      </div>
      
      <!-- account social -->
      <div class="gap-2 mt-3 d-flex flex-row justify-content-center align-items-center">
        <!-- account social twitter -->
        <span v-if="accountProfile?.account_social_twitter">
          <a
            :href="`https://twitter.com/${accountProfile?.account_social_twitter}`"
            target="_blank"
          >
            <i class="fab fa-twitter account-social-icons"></i>
          </a>
        </span>
        <!-- account social facebook -->
        <span v-if="accountProfile?.account_social_facebook">
          <a
            :href="`https://facebook.com/${accountProfile?.account_social_facebook}`"
            target="_blank"
          >
            <i class="fab fa-facebook-f account-social-icons"></i>
          </a>
        </span>
        <!-- account social instagram -->
        <span v-if="accountProfile?.account_social_instagram">
          <a
            :href="`https://instagram.com/${accountProfile?.account_social_instagram}`"
            target="_blank"
          >
            <i class="fab fa-instagram account-social-icons"></i>
          </a>
        </span>
        <!-- account social linkedin -->
        <span v-if="accountProfile?.account_social_linkedin">
          <a
            :href="`https://linkedin.com/${accountProfile?.account_social_linkedin}`"
            target="_blank"
          >
            <i class="fab fa-linkedin account-social-icons"></i>
          </a>
        </span>
        <!-- account social telegram -->
        <span v-if="accountProfile?.account_social_telegram">
          <a
            :href="`https://t.me/${accountProfile?.account_social_telegram}`"
            target="_blank"
          >
            <i class="fab fa-telegram account-social-icons"></i>
          </a>
        </span>
      </div>

      <div class="container-fluid d-flex flex-row p-0 mt-3">
        <!-- profile menu -->
        <!-- To Do -->
        <div v-if="false" class="col-6 d-flex justify-content-start">
          <!-- account circles -->
          <div
            type="button"
            @click="$emit('profileSetActiveTab', 'circles')"
            class="profile-menu d-flex flex-row justify-content-center align-items-center px-3 py-2"
            :class="activeTabProps === 'circles' ? 'active' : ''"
          >
            <i class="fa fa-circle me-1" aria-hidden="true"></i>
            CIRCLES
            <span class="ms-1">
              {{ accountProfile?.account_circles_number }}
            </span>
          </div>
          <!-- account contacts -->
          <div
            type="button"
            @click="$emit('profileSetActiveTab', 'contacts')"
            class="profile-menu last-right d-flex flex-row justify-content-center align-items-center px-3 py-2"
            :class="activeTabProps === 'contacts' ? 'active' : ''"
          >
            <i class="fa fa-user me-1" aria-hidden="true"></i>
            CONTACTS
            <span class="ms-1">
              {{ accountProfile?.account_contacts_number }}
            </span>
          </div>
        </div>
        <div v-if="true" class="col-12 d-flex justify-content-center justify-content-lg-start">
          <!-- account circles -->
          <div
            type="button"
            @click="$router.push('/account/circles')"
            class="profile-link d-flex flex-row justify-content-center align-items-center p-2 mx-2"
          >
            <i class="fa fa-circle me-2" aria-hidden="true"></i>
            Lending Circles
            <!-- To Do -->
            <span v-if="false" class="ms-1">
              {{ accountProfile?.account_circles_number }}
            </span>
          </div>
          <!-- account contacts -->
          <div
            type="button"
            @click="$router.push('/account/contacts')"
            class="profile-link last-right d-flex flex-row justify-content-center align-items-center p-2 mx-2"
          >
            <i class="fa fa-user me-2" aria-hidden="true"></i>
            Contact List
            <!-- To Do -->
            <span v-if="false" class="ms-1">
              {{ accountProfile?.account_contacts_number }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AccountProfileHeader",
  props: {
    activeTabProps: String
  },
  data() {
    return {
      copyAddressTooltip: "Copy Address"
    }
  },
  computed: {
    ...mapGetters(['getConnectionStore', 'getProfileStore']),
    connectedAccount() {
      return this.getConnectionStore;
    },
    accountProfile() {
      return this.getProfileStore;
    }
  },
  methods: {
    async copyAccount(id) {
      navigator.clipboard.writeText(this.accountProfile?.account_address);
      document.getElementById(id).innerHTML = '<i class="fa fa-check mt-3" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy mt-3"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
.account-image {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border: none;
  border-radius: 50%;
}
.account-fullname {
  font-size: 22px;
  line-height: 30px;
  font-weight: bold;
}
.account-username {
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
}
.account-address {
  font-size: 20px;
  line-height: 20px;
  font-weight: normal;
}
.account-edit-icon {
  font-size: 16px;
  font-weight: 400;
  color: var(--ptn-btn-bg);
}
.account-social-icons {
    font-size: 19px;
}
.profile-link {
  background: var(--ptn-bg);
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.profile-link svg {
  color: rgba(var(--ptn-blue-rgb), 0.7);
}
.profile-link span {
  border-radius: 50%;
  background: rgba(var(--ptn-blue-rgb), 0.9);
  color: var(--ptn-color);
  width: 25px;
  height: 25px;
}
.profile-menu {
  background: var(--ptn-bg);
  color: rgba(var(--ptn-color-rgb), 0.5);
  border-top: solid 1px var(--ptn-gray);
  border-left: solid 1px var(--ptn-gray);
  border-bottom: solid 1px var(--ptn-gray);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  margin-bottom: -1px;
  z-index: 1000;
}
.profile-menu svg {
  color: rgba(var(--ptn-blue-rgb), 0.3);
}

.profile-menu.last-right {
  border-right: solid 1px var(--ptn-gray);
}
.profile-menu.active {
  color: rgba(var(--ptn-color-rgb), 0.8);
  border-bottom: solid 1px var(--ptn-bg);
}
.profile-menu.active svg {
  color: var(--ptn-blue);
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
