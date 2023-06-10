<template>
  <SwitchTheme class="d-none" />
  <div class="container-fluid m-0 p-0">
    <div id="top-section" class="min-vh-100 p-0">
      <div class="container p-0">
        <div class="row m-0 p-0">
          <div class="col-12 big-text my-auto">
            404
          </div>
          <div class="col-12 my-auto">
            <h3 class="mb-1">OOPS! PAGE NOT FOUND</h3>
            <h6 class="mb-4">ARE YOU SURE THE URL IS CORRECT?</h6>
          </div>
          <div class="col-12 my-auto">
            <button
              type="button"
              class="go-back-btn mt-3 py-2 px-5"
              @click="$router.go(-1)"
            >
              <i class="fa fa-arrow-left me-2" aria-hidden="true"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwitchTheme from "@/components/NavBar/SwitchTheme.vue";

export default {
  name: "NotFound",
  components: {
    SwitchTheme
  },
};
</script>

<style lang="scss" scoped>
.big-text {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 404px;
  font-weight: normal;
  letter-spacing: 7px;
  line-height: 400px;
  text-align: center;
  color: rgba(var(--ptn-third-blue-rgb), 0.6);
  margin: 0;
  padding: 0;
}
.go-back-btn {
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  border: none;
  border-radius: 8px;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .big-text {
    font-size: 300px;
    letter-spacing: 3px;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .big-text {
    font-size: 200px;
  }
}
</style>
