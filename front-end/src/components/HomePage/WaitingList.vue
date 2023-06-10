<template>
  <div id="waiting-list">
    <div class="d-flex flex-row justify-content-center mx-0 my-5">
      <div v-if="!email_joined">
        <h2 class="waiting-list-title">STAY IN THE CIRCLE!</h2>
        <form @submit.prevent="addWaitingList(email)">
          <div class="form-group m-0">
            <label for="waiting-list-email" class="px-4 my-3">
              Join our mailing list to stay informed about our upcoming events and news.
            </label>
            <!-- <p id="emailHelp" class="form-text text-white">We'll never share your email address</p> -->
            <input
              v-model="email"
              type="email"
              id="waiting-list-email"
              placeholder="Enter Email"
              class="waiting-list-input mx-auto"
            />
            <div class="mt-1">
              <p class="m-0 text-warning">{{ message }}</p>
            </div>
            <button type="submit" class="waiting-list-btn mt-3 py-2 px-5">
              Join
            </button>
          </div>
        </form>
      </div>
      <div v-else>
        <div class="form-group">
          <h4 class="text-lowercase text-decoration-underline">{{ email }}</h4>
          <h5 class="my-3 text-warning">
            <i class="fa fa-quote-left fa-xl" aria-hidden="true"></i>
            <i class="mx-2"> Thanks for Joining Our Community </i>
            <i class="fa fa-quote-right fa-xl" aria-hidden="true"></i>
          </h5>
          <h6>
            You’r subscribed to Piltonet mailing list.<br />
            You’ll now be among the first to hear about the latest product updates and services.
          </h6>
        </div>
      </div> 
    </div>
  </div>
</template>
  
  <script>
import api from "@/services/api";

export default {
  name: "WaitingList",
  data() {
    return {
      email: "",
      message: "",
      email_joined: false,
      formBE: {
        email: "",
      },
    };
  },
  methods: {
    async addWaitingList(email) {
      try {
        var hasError = false;
        var noticeMessage;
        if(email.length == 0) {
          hasError = true;
          noticeMessage = "Please enter a valid email address.";
        } else if(!this.validEmail(email)) {
          hasError = true;
          noticeMessage = "The email address is badly formatted.";
        } else {
          this.formBE.email = email;
          const Response = await api.post_waiting_list(this.formBE);
          if(!Response.data.done) {
            hasError = true;
            noticeMessage = Response.data.message;
          } else {
            noticeMessage = "";
          }
          // await Auth.createUserWithEmailAndPassword(email, this.randomPassword(20)).catch(function(error) {
          //     hasError = true
          //     if(error.code == 'auth/email-already-in-use') {
          //         noticeMessage = 'This email address has already been added.'
          //     } else {
          //         noticeMessage = error.message
          //     }
          // });
        }
        this.message = noticeMessage;
        if(hasError) {
          setTimeout(() => (this.message = ""), 5000);
        } else {
          // this.email = ''
          this.email_joined = true;
        }
      } catch (err) {
        console.log(err);
        this.message = "Something went wrong. Try reloading the page.";
        this.email = "";
      }
    },
    randomPassword(length) {
      var chars =
        "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
      var password = "";
      for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        password += chars.charAt(i);
      }
      return password;
    },
    validEmail(email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },
};
</script>
  
<style lang="scss" scoped>
#waiting-list {
  padding: 4rem 0.5rem;
}
.waiting-list-title {
  font-family: "RobotoB2", arial, sans-serif;
  color: rgba(var(--ptn-third-blue-rgb), 0.9);
}
.waiting-list-input {
  background-color: transparent;
  color: var(--ptn-color) !important;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  height: 45px;
  width: 90%;
  max-width: 450px;
  padding: 0 10px;
}
.waiting-list-btn {
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  border: none;
  border-radius: 8px;
}
</style>