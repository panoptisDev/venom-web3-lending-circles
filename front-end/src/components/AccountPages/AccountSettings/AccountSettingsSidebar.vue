<template>
  <div id="side-bar" class="p-0 mt-4">
    <div class="side-bar-main">
      <h3>
				<i class="fa fa-gear d-none d-lg-inline-block me-2" aria-hidden="true"></i>
				<span class="d-none d-md-inline-block">SETTINGS</span>
			</h3>
      <div class="side-bar-item mt-4">
        <div
					type="button"
					@click="$router.push({path: '/account/settings', query: {active_page: 'profile'}})"
					class="side-bar-btn"
					:class="activePage == 'profile' ? 'active' : ''"
				>
          <i class="fa fa-user-circle d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1" aria-hidden="true"></i>
          <p class="d-none d-md-inline-block m-0 ps-2">Profile</p>
        </div>
      </div>
      <div class="side-bar-item">
        <div
					type="button"
					@click="$router.push({path: '/account/settings', query: {active_page: 'accounts'}})"
					class="side-bar-btn"
					:class="activePage == 'accounts' ? 'active' : ''"
				>
          <i class="fa fa-link d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1" aria-hidden="true"></i>
          <p class="d-none d-md-inline-block m-0 ps-2">Linked Accounts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountSettingsSidebar",
  props: {
    activePage: String,
  }
};
</script>

<style lang="scss" scoped>
.side-bar-main {
  text-align: start;
  border: none;
  width: 96%;
  max-width: 940px;
  margin: 20px auto 0;
  padding: 50px 30px;
}
.side-bar-main h3 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 30px;
  color: var(--ptn-third-gray);
  margin: 0;
  padding: 10px 0 30px;
}
.side-bar-item {
  display: flex;
  flex-direction: row;
  border: none;
  width: 318px;
  height: 50px;
  margin: 10px 0;
  padding: 0;
}
.side-bar-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  border-radius: 8px;
  width: calc(100% - 31px);
  max-width: 230px;
  height: 50px;
  margin: 0;
  padding: 0;
}
.side-bar-btn p {
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
}
.side-bar-btn.active {
  font-size: 21px;
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
}
.side-bar-btn.active p {
  font-size: 21px;
}

@media (max-width: 1199px) {
}

@media (max-width: 991px) {
  .side-bar-main h3 {
    font-size: 30px;
  }
  .side-bar-btn {
    max-width: 150px;
  }
}

@media (max-width: 767px) {
  .side-bar-btn {
    width: 41px;
    height: 41px;
  }
}

@media (max-width: 575px) {
  .side-bar-main {
    padding: 50px 10px;
  }
}
</style>
