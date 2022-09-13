<template>
  <div
    id="exampleModal"
    ref="modal"
    class="modal fade animate__animated animate__fadeInUp animate__slower"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div
        class="modal-content couponImg bgp-center bgsz-cover"
      >
        <div class="modal-header border-bottom-0">
          <h5
            id="exampleModalLabel"
            class="modal-title text-white"
          >
            {{ coupon.title }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body py-0">
          <div class="position-relative d-flex justify-content-center py-3">
            <span class="fs-2 fw-bold text-white zindex-1">
              {{ coupon.code }}
            </span>
            <div
              class="bg-white bg-opacity-25 position-absolute top-0 bottom-0 start-0 end-0 zindex-0
                rounded-1"
            />
          </div>
        </div>
        <div class="modal-footer border-top-0">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="copyCouponCode"
          >
            複製優惠代碼
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  mixins: [modalMixin],
  props: {
    coupon: {
      type: Object,
      default() {
        return {
          title: '優惠券標題',
          code: 'LF2.NET',
        };
      },
    },
  },
  data() {
    return {
      modal: {},
    };
  },
  methods: {
    copyCouponCode() {
      navigator.clipboard.writeText(this.coupon.code);
    },
  },
};
</script>

<style lang="scss" scoped>
.couponImg {
  background-image: url(@/assets/images/getCouponBg.avif);
}
</style>
