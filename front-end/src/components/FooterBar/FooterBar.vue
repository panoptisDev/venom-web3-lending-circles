<template>
  <footer id="footer-bar" class="mx-auto">
    <div class="container-fluid row">
      <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-column justify-content-center justify-content-md-start align-items-center align-items-md-start ps-0 ps-md-4">
        <div class="footer-bar-logo d-flex flex-row justify-content-center justify-content-md-start align-items-center">
          <img
            alt="piltonet-logo"
            src="@/assets/images/piltonet-logo.png"
            class="p-1 me-1 mb-1"
            height="37"
            width="37"
          />
          <h2 class="me-2">Piltonet</h2>
        </div>
        <p class="footer-bar-logo-text px-1">
          When we save together.
        </p>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-row justify-content-center align-items-center justify-content-md-end pe-0 pe-md-4 my-3 my-md-0">
        <a href="https://medium.com/piltonet" target="_blank">
          <i class="fab fa-medium footer-bar-social-icon me-2" aria-hidden="true"></i>
        </a>
        <a href="https://github.com/piltonet" target="_blank">
          <i class="fab fa-github footer-bar-social-icon me-2" aria-hidden="true"></i>
        </a>
        <!-- Instagram account is not active. -->
        <a v-if="false" href="https://instagram.com/piltonet" target="_blank">
          <i class="fab fa-instagram footer-bar-social-icon me-2" aria-hidden="true"></i>
        </a>
        <!-- Facebook account is not active. -->
        <a v-if="false" href="https://www.facebook.com/piltonet" target="_blank">
          <i class="fab fa-facebook footer-bar-social-icon me-2" aria-hidden="true"></i>
        </a>
        <a href="https://twitter.com/piltonet" target="_blank">
          <i class="fab fa-twitter footer-bar-social-icon" aria-hidden="true"></i>
        </a>
        <!-- To Do -->
        <div v-if="false">
          <a href="">
            <ul>
              <li>Help</li>
              <li style="list-style: none; display: inline"></li>
              <li>Status</li>
              <li style="list-style: none; display: inline"></li>
              <li>API</li>
              <li style="list-style: none; display: inline"></li>
              <li>Brand</li>
              <li style="list-style: none; display: inline"></li>
              <li>Terms</li>
              <li style="list-style: none; display: inline"></li>
              <li>Privacy</li>
            </ul></a
          >
        </div>
      </div>
      <div>
        <p class="footer-bar-copyright">
          Piltonet &copy;2023 All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterBar",
};
</script>

<style lang="scss" scoped>
#footer-bar {
  width: 96%;
  max-width: 1400px;
  padding: 7rem 0 0.3rem;
}

.footer-bar-bg-image {
  margin-left: 9px;
  position: absolute;
  margin-top: 8px;
}
.footer-bar-logo {
  border-bottom: solid 1px rgba(var(--ptn-second-blue-rgb), 0.7);
  width: 195px;
  margin: 0;
  padding: 0;
}
.footer-bar-logo h2 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 33px;
  letter-spacing: 3px;
  color: rgba(var(--ptn-color-rgb), 0.9);
  margin: 0;
  padding: 0;
}
.footer-bar-logo-text {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 1px;
  text-align: justify;
  color: rgba(var(--ptn-color-rgb), 0.8);
  margin: 0;
  padding: 0;
}
.footer-bar-social-icon {
  font-size: 25px;
  color: rgba(var(--ptn-color-rgb), 0.8);
  margin: 0;
  padding: 0;
}
.footer-bar-copyright {
  font-size: 15px;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .footer-bar-logo h2 {
    font-size: 25px;
    letter-spacing: 1px;
  }
  .footer-bar-logo-text {
    font-size: 16px;
    letter-spacing: 0;
  }
  .footer-bar-copyright {
    font-size: 13px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
