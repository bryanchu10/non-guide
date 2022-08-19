<template>
  <nav class="navbar py-3">
    <div class="container">
      <router-link class="navbar-brand py-0" to="/">
        <h1 class="fs-4 fw-bold mb-0">烏有指南</h1>
      </router-link>
    </div>
  </nav>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-4 order-lg-3 mb-4">
        <OrderSummary :parent-order-summary-data="orderSummaryData"
                      :parent-order-summary-total="orderSummaryTotal"/>
      </div>
      <nav class="col-lg-12 order-lg-1 mb-4"
            style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item text-primary">
            購物車
          </li>
          <li class="breadcrumb-item"
              :class="[this.$route.name === 'info' ? 'fw-bold text-dark' : 'text-secondary']">
            建立訂單
          </li>
          <li class="breadcrumb-item text-secondary"
              :class="[this.$route.name === 'payment' ? 'fw-bold text-dark' : 'text-secondary']">
            付款
          </li>
        </ol>
      </nav>
      <div class="col-lg-6 order-lg-2">
        <router-view v-if="this.$route.name === 'payment'"
                      :parent-receiver-info="receiverInfo"
                      :parent-receiver-message="receiverMessage"/>
        <router-view v-else/>
      </div>
    </div>
  </div>
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
import OrderSummary from '@/components/OrderSummary.vue';
import HintModal from '@/components/HintModal.vue';

export default {
  inject: ['$emitter'],
  data() {
    return {
      orderSummaryData: [],
      orderSummaryTotal: 0,
      orderId: '',
      receiverInfo: {},
      receiverMessage: '',
    };
  },
  components: {
    OrderSummary,
    HintModal,
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
        });
    },
    updateCartHandler() {
      this.getCart();
    },
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
};
</script>
