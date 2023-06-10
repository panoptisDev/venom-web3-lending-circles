<template>
  <div id="account-circles-members">
    <div class="main-section">
      <h3>JOINED MEMBERS</h3>
      <!-- Circle Members -->
      <div v-if="circleInfoProps.circle_total_members > 0">
        <div v-for="(member, index) in circleInfoProps.circle_members"
          :key="index"
          :class="'member_id' in member ? 'align-items-center row my-2 ms-2 ms-md-4' : 'd-none'"
        >
          <img
            v-if="member.account_image_url"
            :src="member.account_image_url"
            alt=""
            class="account-image-small"
          />
          <JazzIcon
            v-if="!member.account_image_url"
            :address="member.main_account_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          />
          <p class="top-text-small">
            <span>
              {{ member.main_account_address == mainAccountAddress ? (isCircleCreator ? 'You (creator)' : (isCircleModerator ? 'You (moderator)' : 'You'))
                : member.main_account_address == circleInfoProps.circle_creator_main ? `${member.account_fullname} (creator)`
                : member.member_is_moderator ? `${member.account_fullname} (moderator)` : member.account_fullname }}
            </span>
            <span class="note-text">
              {{ `joined on ${utils.formatDate(member.created_at, 'DD Month YYYY', 'HH:MM')}` }}
            </span>
          </p>
        </div>
      </div>
      <div v-else>
        <span class="note-text">The member list is empty.</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'AccountCirclesMembers',
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      isCircleCreator: false,
      isCircleModerator: false
    }
  },
  computed: {
    ...mapGetters(['getConnectionStoreByKey']),
    mainAccountAddress() {
      return this.getConnectionStoreByKey('main_account_address');
    }
  },
  mounted() {
    this.setup();
    // console.log(this.circleInfoProps);
  },
  watch: {
    circleIdProps: function () {
      this.setup();
    }
  },
  methods: {
    setup() {
      if(this.circleInfoProps.circle_creator_main == this.mainAccountAddress) {
        this.isCircleCreator = true;
        this.isCircleModerator = true;
      } else {
        this.isCircleCreator = false;
        this.isCircleModerator = false;
        this.circleInfoProps.circle_members.forEach(member => {
          if('main_account_address' in member && member.main_account_address == this.mainAccountAddress && member.member_is_moderator) {
            this.isCircleModerator = true;
          }
        });
      }

    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-members {
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
