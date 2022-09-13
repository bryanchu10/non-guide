<template>
  <section
    ref="section"
    class="subscribe subscribeImg bgpx-center bgsz-cover bgpy-75"
  >
    <div class="container py-md-2">
      <div class="row justify-content-between position-relative py-4 py-md-6">
        <div class="col-md-8 col-lg-6 col-xl-5 py-md-1 zindex-1">
          <p class="text-white fs-2 fs-md-1 fw-bold mb-4 mb-md-5">
            訂閱獲得最新情報<br>及特別折扣！
          </p>
          <VeeForm
            ref="form"
            v-slot="{errors}"
            @submit="subscribe"
          >
            <div class="input-group input-group-lg mb-2">
              <VeeField
                v-model="userMail"
                type="text"
                class="form-control bg-transparent text-light"
                :class="{'is-invalid': errors['電子郵箱位置']}"
                name="電子郵箱位置"
                rules="email|required"
                placeholder="請輸入電子郵箱位置"
                aria-label="請輸入電子郵箱位置"
                aria-describedby="輸入電子郵箱位置的欄位"
              />
              <button
                id="button-addon2"
                class="btn btn-primary btn-lg px-4 px-md-6"
                type="submit"
              >
                訂閱
              </button>
            </div>
            <VeeErrorMessage
              class="position-absolute d-block mt-0 ps-2 invalid-feedback"
              name="電子郵箱位置"
            />
          </VeeForm>
        </div>
        <div
          class="d-md-none bg-black bg-opacity-25 position-absolute top-0 bottom-0 start-0 end-0
            zindex-0"
        />
      </div>
    </div>
  </section>
  <CouponCodeModal
    ref="couponCodeModal"
    :coupon="coupon"
  />
</template>
<script>
import CouponCodeModal from '@/components/modals/CouponCodeModal.vue';
import windowResizeMixin from '@/mixins/windowResizeMixin';

export default {
  components: {
    CouponCodeModal,
  },
  mixins: [windowResizeMixin],
  data() {
    return {
      coupon: {
        title: '優惠券標題',
        code: 'LF2.NET',
      },
      userMail: '',
      sectionHeight: 0,
      browserWidth: 0,
    };
  },
  watch: {
    browserWidth() {
      this.sectionHeight = this.$refs.section.offsetHeight;
    },
  },
  methods: {
    subscribe(values, { resetForm }) {
      // 這邊假裝 API 有這個功能
      // 傳送用戶填寫的電子郵箱地址到後端
      // 後端傳送管理員設定的獎勵折扣碼
      this.coupon = { title: '拜託了幫我折 10 %', code: 'C8763' };
      this.$refs.couponCodeModal.showModal();
      resetForm();
    },
  },
};
</script>

<style lang="scss" scoped>
.subscribeImg {
  background-image: url(@/assets/images/subscribeBg.avif);
}
</style>
