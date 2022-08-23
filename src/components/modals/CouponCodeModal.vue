<template>
  <div class="modal fade animate__animated animate__fadeInUp animate__slower"
        id="exampleModal" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content bgp-center bgsz-cover" style="background-image: url(https://images.unsplash.com/photo-1573131153082-dcd70e318e0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1635&q=80);">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title text-white"
              id="exampleModalLabel">{{ coupon.title }}</h5>
          <button type="button" class="btn-close btn-close-white"
                  data-bs-dismiss="modal" aria-label="Close">
          </button>
        </div>
        <div class="modal-body py-0">
          <div class="position-relative d-flex justify-content-center py-3">
            <span class="fs-2 fw-bold text-white zindex-1">
              {{ coupon.code }}
            </span>
            <div class="bg-white bg-opacity-25
                        position-absolute top-0 bottom-0 start-0 end-0 zindex-0
                        rounded-1">
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" @click="copyCouponCode">複製優惠代碼</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin';

export default {
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
  mixins: [modalMixin],
};
</script>

<style lang="scss" scoped>

</style>
