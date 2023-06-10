<template>
  <el-dialog 
    id="message-modal"
    v-model="showModal"
    :title="title"
    class="message-dialog pt-3"
    :style="customStyle"
  >
    <pre class="pb-3" :style="textStyle">{{ message }}</pre>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="okBtn" type="success" class="ok-btn px-4 m-1" @click="okClicked" :style="okBtnStyle">{{ okBtn }}</el-button>
        <el-button v-if="cancelBtn" type="danger" class="cancel-btn px-4 m-1" @click="cancelClicked" :style="cancelBtnStyle">{{ cancelBtn }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "MessageModal",
  data() {
    return {
      showModal: false,
      title: "",
      message: "",
      okBtn: "",
      cancelBtn: "",
      params: "",
      customStyle: "",
      textStyle: "",
      okBtnStyle: "",
      cancelBtnStyle: ""
    }
  },
  methods: {
    async setMessage(message) {
      this.title = 'title' in message ? message.title : null;
      this.message = 'message' in message ? message.message : '...';
      this.okBtn = 'okBtn' in message ? message.okBtn : 'Ok';
      this.cancelBtn = 'cancelBtn' in message ? message.cancelBtn : 'Cancel';
      this.params = 'params' in message ? message.params : null;
      this.customStyle = 'customStyle' in message ? message.customStyle : '';
      this.textStyle = 'textStyle' in message ? message.textStyle : '';
      this.okBtnStyle = 'okBtnStyle' in message ? message.okBtnStyle : '';
      this.cancelBtnStyle = 'cancelBtnStyle' in message ? message.cancelBtnStyle : '';
      this.showModal = true;
    },
    okClicked() {
      this.showModal = false;
      this.$emit('okClicked', this.params);
    },
    cancelClicked() {
      this.showModal = false;
      this.$emit('cancelClicked', this.params);
    }
  },
};
</script>
    
<style lang="scss" scoped>
#message_modal {
  z-index: 9000;
}
.ok-btn,
.cancel-btn {
  min-width: 96px;
  height: 32px;
}
</style>
