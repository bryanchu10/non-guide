<template>
  <UserNavbar @show-offcanvas="this.$refs.cartOffcanvas.showOffcanvas()"/>
  <router-view :parent-articles-data="articlesData"
                v-if="articlesDataGotten"
                :key="pageKey"/>
  <SubscribeMe/>
  <UserFooter @show-login-modal="this.$refs.loginModal.showModal()"/>
  <CartOffcanvas ref="cartOffcanvas"/>
  <LoginModal ref="loginModal"/>
</template>

<script>
import UserNavbar from '@/components/layouts/UserNavbar.vue';
import SubscribeMe from '@/components/layouts/SubscribeMe.vue';
import UserFooter from '@/components/layouts/UserFooter.vue';
import CartOffcanvas from '@/components/layouts/CartOffcanvas.vue';
import LoginModal from '@/components/modals/LoginModal.vue';

export default {
  name: 'AboutView',
  components: {
    UserNavbar,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
  },
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
  methods: {
    getRecentArticles(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/articles?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.articlesData = [...res.data.articles];
            this.articlesDataGotten = true;
          }
        });
    },
  },
  created() {
    this.getRecentArticles();
  },
};
</script>
