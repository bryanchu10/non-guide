<template>
  <section class="subscribe bgpx-center bgpy-75 bgsz-cover" style="background-image: url(https://images.unsplash.com/photo-1592114958604-7e1998d8bd8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80);">
    <div class="container py-md-2">
      <div class="row justify-content-between align position-relative py-4 py-md-6">
        <div class="col-md-8 col-lg-6 col-xl-5 py-md-1 zindex-1">
          <p class="text-white fs-2 fs-md-1 fw-bold mb-4 mb-md-5">
            訂閱獲得最新出刊情報及特別折扣！
          </p>
          <VeeForm v-slot="{errors}" @submit="subscribe">
            <div class="input-group input-group-lg mb-2">
              <VeeField type="text"
                        class="form-control bg-transparent text-light"
                        :class="{'is-invalid': errors['電子郵箱位置']}"
                        name="電子郵箱位置"
                        rules="email|required"
                        placeholder="請輸入電子郵箱位置"
                        aria-label="請輸入電子郵箱位置" aria-describedby="輸入電子郵箱位置的欄位"
                        v-model="userMail"/>
              <button class="btn btn-primary btn-lg px-4 px-md-6" type="submit"
                      id="button-addon2">
                      訂閱
              </button>
            </div>
            <VeeErrorMessage class="position-absolute d-block mt-0 ps-2
                                      invalid-feedback"
                                name="電子郵箱位置"/>
          </VeeForm>
        </div>
        <div class="d-md-none bg-black bg-opacity-25
              position-absolute top-0 bottom-0 start-0 end-0 zindex-0"></div>
      </div>
    </div>
  </section>
  <CouponCodeModal ref="couponCodeModal" :coupon="coupon"/>
</template>
<script>
import CouponCodeModal from '@/components/modals/CouponCodeModal.vue';

export default {
  data() {
    return {
      coupon: {
        title: '優惠券標題',
        code: 'LF2.NET',
      },
      userMail: '',
    };
  },
  components: {
    CouponCodeModal,
  },
  methods: {
    subscribe({ resetForm }) {
      // 這邊假裝 API 有這個功能
      // 傳送用戶填寫的電子郵箱地址到後端
      // 後端傳送管理員設定的獎勵折扣碼
      this.coupon = { title: '拜託了幫我折 10 %', code: 'C8763' };
      this.$refs.couponCodeModal.showModal();
      resetForm();
    },
  },
  mounted() {
  },
};
</script>
