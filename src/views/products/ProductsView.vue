<template>
  <UserNavbar @show-offcanvas="this.$refs.cartOffcanvas.showOffcanvas()"/>
  <div class="position-relative"
            :class="{ 'py-7': !productsDataGotten}">
    <VueLoading :active="!productsDataGotten" :is-full-page="false"/>
    <router-view v-if="productsDataGotten"
                  :parent-products-data="productsData"
                  :key="pageKey"/>
  </div>
  <SubscribeMe/>
  <UserFooter @show-login-modal="this.$refs.loginModal.showModal()"/>
  <CartOffcanvas ref="cartOffcanvas"/>
  <LoginModal ref="loginModal"/>
</template>

<script>
import UserNavbar from '@/components//layouts/UserNavbar.vue';
import SubscribeMe from '@/components/layouts/SubscribeMe.vue';
import UserFooter from '@/components/layouts/UserFooter.vue';
import CartOffcanvas from '@/components/layouts/CartOffcanvas.vue';
import LoginModal from '@/components/modals/LoginModal.vue';

export default {
  name: 'ProductsView',
  components: {
    UserNavbar,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
  },
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
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.productsData = JSON.parse(JSON.stringify(res.data.products));
            this.productsDataGotten = true;
          }
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
