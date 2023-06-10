<template>
  <el-dialog id="cropper-modal" v-model="showModal" class="cropper-dialog">
    <cropper
      ref="cropper"
      :class="cropperClass"
      :src="imageURL"
      :stencil-props="cropperStencilProps"
      :canvas="cropperCanvasMaxArea"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" class="px-4 me-2" @click="cropImage">Ok</el-button>
        <el-button type="danger" class="px-2" @click="showModal = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "CropperModal",
  components: {
    Cropper,
  },
  props: {},
  data() {
    return {
      showModal: false,
      imageURL: null,
      cropperClass: null,
      cropperEvent: null,
      cropperStencilProps: null,
      cropperCanvasMaxArea: null,
    };
  },
  methods: {
    async setCropper(imageKind, imageURL) {
      this.showModal = true;
      if(imageKind == "account-profile-image") {
        this.cropperClass = "account-profile-image-class";
        this.cropperEvent = "account-profile-image-changed";
        this.cropperStencilProps = {aspectRatio: 1/1};
        this.cropperCanvasMaxArea = {maxArea: 512 * 512};
      } else if(imageKind == "account-cover-image") {
        this.cropperClass = "account-cover-image-class";
        this.cropperEvent = "account-cover-image-changed";
        this.cropperStencilProps = {};
        this.cropperCanvasMaxArea = {maxArea: 1400 * 250};
      }
      this.imageURL = imageURL;
    },
    cropImage() {
      this.showModal = false;
      const result = this.$refs.cropper.getResult();
      window.dispatchEvent(
        new CustomEvent(this.cropperEvent, {
          detail: {
            imageURL: result.canvas.toDataURL("image/png")
          },
        })
      );
    }
  },
};
</script>
    
<style lang="scss" scoped>

.account-cover-image-class,
.account-profile-image-class {
  width: 450px;
  height: 450px;
}

</style>
