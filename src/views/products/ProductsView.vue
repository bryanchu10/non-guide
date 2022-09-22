<template>
  <UserNavbar @show-offcanvas="showCartCanvas" />
  <div
    class="position-relative"
    :class="{ 'py-7': !productsDataGotten}"
  >
    <VueLoading
      :active="!productsDataGotten"
      :is-full-page="false"
    />
    <RouterView
      v-if="productsDataGotten"
      :key="pageKey"
      :parent-products-data="productsData"
    />
  </div>
  <SubscribeMe />
  <UserFooter @show-login-modal="showLoginModal" />
  <CartOffcanvas ref="cartOffcanvas" />
  <LoginModal ref="loginModal" />
</template>

<script>
import UserNavbar from '@/components/layouts/UserNavbar.vue';
import SubscribeMe from '@/components/layouts/SubscribeMe.vue';
import UserFooter from '@/components/layouts/UserFooter.vue';
import CartOffcanvas from '@/components/layouts/CartOffcanvas.vue';
import LoginModal from '@/components/modals/LoginModal.vue';

export default {
  components: {
    UserNavbar,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
  },
  inject: ['$pushMessageState'],
  data() {
    return {
      productsData: [],
      productsDataGotten: false,
    };
  },
  computed: {
    pageKey() {
      // 綁定隨機鍵值，讓切換頁面的時候重新渲染元件，避免資料狀態沒有更新。
      return this.$route.path + Math.random();
    },
  },
  created() {
    this.getProducts();
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      this.$http.get(api)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsDataGotten = true;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得商品列表');
        });
    },
    showCartCanvas() {
      this.$refs.cartOffcanvas.showOffcanvas();
    },
    showLoginModal() {
      this.$refs.loginModal.showModal();
    },
  },
};
</script>
