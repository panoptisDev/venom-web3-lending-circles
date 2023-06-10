<template>
  <div id="how-works" class="mx-auto my-5">
    <p class="how-works-title my-3">LET'S TAKE A SIMPLE EXAMPLE</p>
    <p class="how-works-subtitle pb-4">
      The idea behind lending circle is simple. A group of people agree to contribute regularly to a pool of funds and give it all to one group member until everyone in the group gets their chance.
    </p>
    <div class="d-flex flex-row row">
      <div class="col-12 col-md-6">
        <img
          alt="lending circle"
          class="how-works-img"
          src="@/assets/images/lending-circle.png"
        />
      </div>
      <div class="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center how-works-step">
        <p>
          For instance, a group of 7 friends could decide to put in $200 each every month, and one member gets the full $1,400 each time.<br/><br/>
          The winner of each month may be chosen randomly, predetermined or at the request of one of the friends and the consent of others.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HowWorks",
};
</script>

<style lang="scss" scoped>
#how-works {
  width: 100%;
  max-width: 1100px;
  padding: 4rem 2rem 0;
}
.how-works-title {
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
.how-works-subtitle {
  font-size: 26px;
  font-weight: normal;
  letter-spacing: 0;
  line-height: 35px;
  text-align: center;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.how-works-img {
  width: 100%;
  max-width: 340px;
}
.how-works-step {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0;
  text-align: start;
  color: rgba(var(--ptn-color-rgb), 0.7);
  width: 96%;
  max-width: 350px;
  margin: 0;
  padding: 0;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
  .how-works-title {
    font-size: 45px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .how-works-subtitle {
    font-size: 24px;
    line-height: 30px;
  }
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
  .how-works-title {
    font-size: 35px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .how-works-subtitle {
    font-size: 22px;
    line-height: 25px;
  }
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .how-works-title {
    font-size: 39px;
    letter-spacing: 3px;
    line-height: 52px;
  }
  .how-works-subtitle {
    font-size: 21px;
    line-height: 30px;
    text-align: center;
  }
  .how-works-step {
    font-size: 16px;
    text-align: center;
    margin: 20px auto 0;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .how-works-title {
    font-size: 26px;
    letter-spacing: 3px;
    line-height: 39px;
  }
  .how-works-subtitle {
    font-size: 20px;
    line-height: 25px;
  }
}
</style>
