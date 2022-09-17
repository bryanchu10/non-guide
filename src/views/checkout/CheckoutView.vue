<template>
  <nav
    ref="nav"
    class="navbar py-3"
  >
    <div class="container">
      <router-link
        class="navbar-brand d-flex align-items-center pe-2 py-0"
        to="/"
      >
        <img
          class="me-2"
          src="@/assets/images/logo.svg"
          alt="logo"
          width="24"
          height="24"
        >
        <h1 class="fs-4 fw-bold lh-base mb-0">
          烏有指南
        </h1>
      </router-link>
    </div>
  </nav>
  <div
    class="container"
    :style="{minHeight: `${sectionHeight}px`}"
  >
    <div class="row justify-content-center">
      <div class="col-lg-4 order-lg-3 mb-4">
        <OrderSummary
          :parent-order-summary-data="orderSummaryData"
          :parent-order-summary-total="orderSummaryTotal"
        />
      </div>
      <nav
        class="col-lg-12 order-lg-1 mb-4"
        style="--bs-breadcrumb-divider: '>';"
        aria-label="breadcrumb"
      >
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item text-primary">
            購物車
          </li>
          <li
            class="breadcrumb-item"
            :class="[$route.name === 'info' ? 'fw-bold text-dark' : 'text-secondary']"
          >
            建立訂單
          </li>
          <li
            class="breadcrumb-item text-secondary"
            :class="[$route.name === 'payment' ? 'fw-bold text-dark' : 'text-secondary']"
          >
            付款
          </li>
        </ol>
      </nav>
      <div class="col-lg-6 order-lg-2">
        <router-view
          v-if="$route.name === 'payment'"
          :parent-receiver-info="receiverInfo"
          :parent-receiver-message="receiverMessage"
        />
        <router-view v-else />
      </div>
    </div>
  </div>

  <UserFooter
    ref="footerSection"
    @show-login-modal="showLoginModal"
  />

  <LoginModal ref="loginModal" />

  <HintModal ref="hintModal">
    <template #title>
      目前購物車是空的
    </template>
    <template #body>
      關閉此彈出視窗後，將自動跳轉到出版品頁面。
    </template>
  </HintModal>
</template>

<script>
import windowResizeMixin from '@/mixins/windowResizeMixin';

import OrderSummary from '@/components/layouts/OrderSummary.vue';
import HintModal from '@/components/modals/HintModal.vue';
import UserFooter from '@/components/layouts/UserFooter.vue';
import LoginModal from '@/components/modals/LoginModal.vue';

export default {
  components: {
    OrderSummary,
    HintModal,
    UserFooter,
    LoginModal,
  },
  mixins: [windowResizeMixin],
  inject: ['$emitter', '$pushMessageState'],
  data() {
    return {
      orderSummaryData: [],
      orderSummaryTotal: 0,
      orderId: '',
      receiverInfo: {},
      receiverMessage: '',
      browserWidth: 0,
      browserHeight: 0,
      sectionHeight: 0,
    };
  },
  watch: {
    $route() {
      if (this.$route.name === 'info') {
        this.getCart();
      }
      if (this.$route.name === 'payment') {
        this.orderId = this.$route.params.orderId;
        this.getOrder();
      }
    },
    browserWidth() {
      const navHeight = this.$refs.nav.offsetHeight;
      const footerHeight = this.$refs.footerSection.sectionHeight;
      this.sectionHeight = this.browserHeight - navHeight - footerHeight;
    },
  },
  created() {
    if (this.$route.name === 'info') {
      this.getCart();
    }
    if (this.$route.name === 'payment') {
      this.orderId = this.$route.params.orderId;
      this.getOrder();
    }
  },
  mounted() {
    this.$emitter.on('updateCart', this.updateCartHandler);
  },
  beforeUnmount() {
    this.$emitter.off('updateCart', this.updateCartHandler);
  },
  methods: {
    getCart() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            if (!res.data.data.carts.length) {
              this.$refs.hintModal.showModal();
            }
            this.orderSummaryData = JSON.parse(JSON.stringify(res.data.data.carts));
            this.orderSummaryTotal = res.data.data.final_total;
          }
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得購物車');
        });
    },
    getOrder() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order/${this.orderId}`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.orderSummaryData = Object.values(res.data.order.products);
            this.orderSummaryTotal = res.data.order.total;
            this.receiverInfo = { ...res.data.order.user };
            if (res.data.order.message) {
              this.receiverMessage = res.data.order.message;
            }
          }
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得訂單');
        });
    },
    updateCartHandler() {
      this.getCart();
    },
    showLoginModal() {
      this.$refs.loginModal.showModal();
    },
  },
};
</script>
