<template>
  <MetamaskModal v-if="defaultchain.wallets[0] == 'metamask'"
    ref="connect_modal"
  />
  <VenomConnectModal v-if="defaultchain.wallets[0] == 'venom-connect'"
    ref="connect_modal"
  />
  <MessageModal
    ref="message_modal"
    @ok-clicked="onDisconnectButtonClick"
  />
  <AcceptCookiesModal/>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <nav v-if="connectedAccount.is_connected" id="top-navbar" class="top-navbar navbar navbar-expand">
      <div class="div-navbar-logo">
        <img
          class="navbar-logo-img"
          alt="piltonet-logo"
          role="button"
          @click="$router.push('/')"
        />
      </div>
      <input id="menu-toggle" type="checkbox" />
      <label class="menu-button-container" for="menu-toggle">
        <div class="menu-button"></div>
      </label>
  
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="menu navbar-nav ms-auto">
          
          <!-- To Do -->
          <!-- <AccountMessages class="me-1" /> -->
          
          <li
            v-if="accountProfile"
            type="button"
            class="link-connect"
            @click="$router.push('/account/profile')"
          >
            {{ accountProfile.account_username }}
            <span class="d-none d-md-inline-block">
              {{ `(${utils.truncate(connectedAccount.account_address, 12)})` }}
            </span>
          </li>
          <li
            v-else
            type="button"
            class="link-connect"
            @click="$router.push('/account')"
          >
            {{ utils.truncate(connectedAccount.account_address, 12) }}
          </li>
  
          <!-- <ProfileImage /> -->
          <li class="nav-item dropdown">
            <a
              id="accountDropdown"
              class="nav-link"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              <img
                v-if="accountProfile && accountProfile.account_image_url"
                :src="accountProfile.account_image_url"
                class="navbar-profile-image rounded-circle"
              />
              <JazzIcon
                v-else-if="connectedAccount.account_address"
                :address="connectedAccount.account_address"
                :diameter="40"
                :colors=jazzColors
                class="rounded-circle"
              />
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end mt-0"
              aria-labelledby="accountDropdown"
            >
              <li v-if="connectedAccount.account_status != 'fresh' && connectedAccount.account_status != 'waiting'">
                <a
                  class="dropdown-item"
                  role="button"
                  @click="$router.push('/account/profile')"
                >
                  <i class="fa fa-user pe-3"></i>
                  Profile
                </a>
              </li>
              <li v-if="connectedAccount.account_status != 'fresh' && connectedAccount.account_status != 'waiting'">
                <a
                  class="dropdown-item"
                  role="button"
                  @click="$router.push('/account/circles')"
                >
                  <i class="fa fa-circle pe-3" aria-hidden="true"></i>
                  Lending Circles
                </a>
              </li>
              <li v-if="connectedAccount.account_status != 'fresh' && connectedAccount.account_status != 'waiting'">
                <a
                  class="dropdown-item"
                  role="button"
                  @click="$router.push('/account/contacts')"
                >
                  <i class="fa fa-address-card pe-3"></i>
                  Contact List
                </a>
              </li>
              <li v-if="connectedAccount.account_status != 'fresh' && connectedAccount.account_status != 'waiting'">
                <a
                  class="dropdown-item"
                  role="button"
                  @click="$router.push('/account/settings')"
                >
                  <i class="fa fa-gear pe-3"></i>
                  Settings
                </a>
              </li>
              <li v-if="connectedAccount.account_status != 'fresh' && connectedAccount.account_status != 'waiting'">
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a
                  class="dropdown-item"
                  role="button"
                  @click="onConnectButtonClick"
                >
                  <i class="fa fa-wallet pe-3"></i>
                  Wallet
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  role="button"
                  @click="$refs.message_modal.setMessage({
                    message: 'Are you sure you want to logout?',
                    okBtn: 'Yes',
                    cancelBtn: 'No',
                    customStyle: 'width: 330px;'
                  })"
                >
                  <i class="fa fa-sign-out pe-3"></i>
                  Logout
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <SwitchTheme class="px-3" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  
    <nav v-else id="top-navbar" class="top-navbar navbar navbar-expand">
      <div class="div-navbar-logo">
        <img
          class="navbar-logo-img"
          alt="piltonet-logo"
          role="button"
          @click="$router.push('/')"
        />
      </div>
      <SwitchTheme class="d-none" />
      <ul class="menu navbar-nav ms-auto">
        <li type="button" class="btn-connect" @click="onConnectButtonClick">
          Connect Wallet
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import SwitchTheme from "@/components/NavBar/SwitchTheme.vue";
import MetamaskModal from "@/components/CustomModals/MetamaskModal.vue";
import AcceptCookiesModal from "@/components/CustomModals/AcceptCookiesModal.vue";
import { mapGetters } from "vuex";

export default {
  name: "NavBar",
  components: {
    SwitchTheme,
    MetamaskModal,
    AcceptCookiesModal
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(["getConnectionStore", "getProfileStore"]),
    connectedAccount() {
      return this.getConnectionStore || {is_connected: false};
    },
    accountProfile() {
      return this.getProfileStore;
    }
  },
  methods: {
    async onConnectButtonClick() {
      await this.$refs.connect_modal?.onConnectButtonClick();
    },
    async onDisconnectButtonClick() {
      await this.$refs.connect_modal?.onDisconnectButtonClick();
    }
  }
}
</script>

<style lang="scss" scoped>
.top-navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
  max-width: 1400px;
  margin: 0;
  padding: 2rem 2rem 0;
}
.menu {
  display: flex;
  flex-direction: row;
  list-style-type: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.menu > li {
  font-size: 17px;
  margin: 0 0 0 1rem;
}
.navbar-logo-img {
  content: url("@/assets/images/piltonet-logo.png");
  height: 40px;
}
.navbar-profile-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.dropdown-menu-end {
  right: 10px;
  background: var(--ptn-second-bg);
  color: var(--ptn-color);
}

.dropdown-item:hover, .dropdown-item:focus,
.dropdown-item.active, .dropdown-item:active {
  background: rgba(var(--ptn-second-gray-rgb), 0.2);
}
.dropdown-divider {
  border-top-color: rgba(var(--ptn-second-gray-rgb), 0.2);
}

.menu-button-container {
  display: none;
  height: 100%;
  width: 30px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#menu-toggle {
  display: none;
}

.menu-button,
.menu-button::before,
.menu-button::after {
  display: block;
  background: var(--ptn-btn-bg);
  position: absolute;
  height: 4px;
  width: 30px;
  transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 2px;
}

.menu-button::before {
  content: "";
  margin-top: -8px;
}

.menu-button::after {
  content: "";
  margin-top: 8px;
}

#menu-toggle:checked + .menu-button-container .menu-button::before {
  margin-top: 0px;
  transform: rotate(405deg);
}

#menu-toggle:checked + .menu-button-container .menu-button {
  background: var(--ptn-bg);
}

#menu-toggle:checked + .menu-button-container .menu-button::after {
  margin-top: 0px;
  transform: rotate(-405deg);
}
.div-navbar-logo {
  display: flex;
  flex-direction: row;
  width: 30%;
  text-align: center;
  align-items: center;
}
.btn-connect {
  line-height: 44px;
  letter-spacing: 0.7px;
  border: none;
  border-radius: 8px;
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  height: auto;
  width: 170px;
}

.link-connect {
  border-bottom: solid 2px rgba(var(--ptn-blue-rgb), 0.5);
  padding-bottom: 3px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .top-navbar {
    padding: 5rem 3rem 3rem;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .top-navbar {
    padding: 3.3rem 1rem;
  }
  .btn-connect {
    line-height: 40px;
    letter-spacing: 0.5px;
    border-radius: 3px;
    width: 150px;
  }
}
</style>
