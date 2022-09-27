<template>
  <VueLoading
    :active="!articlesDataGotten"
  />
  <UserNavbar @show-offcanvas="showCartCanvas" />
  <RouterView
    v-if="articlesDataGotten"
    :key="pageKey"
    :parent-articles-data="articlesData"
  />
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
      articlesData: [],
      articlesDataGotten: false,
    };
  },
  computed: {
    pageKey() {
      // 綁定隨機鍵值，讓切換頁面的時候重新選染元件，避免資料狀態沒有更新。
      return this.$route.path + Math.random();
    },
  },
  created() {
    this.getRecentArticles();
  },
  methods: {
    getRecentArticles(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/articles?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.articlesData = res.data.articles;
          this.articlesDataGotten = true;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得文章列表');
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
