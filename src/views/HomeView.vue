<template>
  <UserNavbar @show-offcanvas="showCartCanvas" />

  <section class="banner container-fluid vh-100 mb-5 mb-lg-6 position-relative">
    <div class="container h-100">
      <div class="row h-100">
        <div
          class="col-lg-6 d-flex flex-column align-items-sm-center align-items-lg-start
            justify-content-between justify-content-lg-center py-4"
        >
          <div class="d-lg-none py-4" />
          <div class="align-self-center align-self-lg-start mb-5">
            <h2 class="fs-2 fs-sm-1 fw-bold text-white text-lg-black text-md-start mb-4">
              世界的每個角落<br>
              ———都是一本<br class="d-xl-none">博物誌。
            </h2>
            <p
              class="fs-lg-4 fw-lg-bold text-light text-lg-secondary text-center text-lg-start mb-0"
            >
              最獨特的旅行指南，帶你認識街上<br>
              一道牆、一棵樹的故事。
            </p>
          </div>
          <div class="col-12 col-sm-8 col-md-6">
            <button
              class="btn btn-lg btn-primary w-100"
              type="button"
              @click="$router.push('/products/list')"
            >
              開啟旅程
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-end">
      <div
        class="col-lg-6 bannerImg bgp-center bgsz-cover top-0 bottom-0 zindex-n1 position-absolute"
      />
      <div
        class="d-lg-none bg-black bg-opacity-25 top-0 bottom-0 zindex-n1 position-absolute"
      />
    </div>
  </section>

  <section
    class="about container mb-4 mb-md-6 position-relative"
    :class="{'py-7': !articlesReady}"
  >
    <VueLoading
      :active="!articlesReady"
      :is-full-page="false"
    />
    <template
      v-for="(article, index) in recentArticles"
      :key="article.id"
    >
      <div
        class="row mb-2"
        :class="[index === (recentArticlesNum - 1) ? '' : 'mb-md-4']"
      >
        <div
          class="col-md-6"
          :class="[index%2 === 0 ? '' : 'order-md-1 offset-md-1']"
        >
          <img
            class="h-lv4 h-md-lv8 w-100 ojf-cover rounded-1"
            :src="article.image"
            :alt="article.title"
          >
        </div>
        <div class="col-md-4 offset-md-1 d-flex flex-column justify-content-center py-3">
          <h3 class="fs-4 fw-bold mb-3">
            {{ article.title }}
          </h3>
          <p class="text-secondary text-prewrap mb-3">
            {{ article.description }}
          </p>
          <a
            href="#"
            class="link-primary fw-bold text-decoration-none align-self-start py-2"
            @click.prevent="$router.push(`/about/${article.id}`)"
          >
            了解更多
          </a>
        </div>
      </div>
    </template>
  </section>

  <section class="quotation quotationImg bgsz-cover bgpx-center bgpy-75">
    <div class="container">
      <div class="row justify-content-between py-4 py-md-6 py-lg-8">
        <div class="col-lg-4">
          <blockquote class="custom-blockquote fs-2 fw-bold text-white mb-7 mb-lg-0">
            看似微不足道的小資訊，卻使我們看待事物的眼光有所不同。
          </blockquote>
        </div>
        <div class="col-lg-3 d-flex flex-column">
          <span class="text-secondary fw-bold mb-1">總編輯</span>
          <MeltTransText :word-changed="wordChanged">
            <template #init>
              諾．薩奇．皮森
            </template>
            <template #final>
              No such person
            </template>
          </MeltTransText>
          <Transition
            name="custom-classes"
            enter-active-class="animate__animated animate__fadeOut"
          >
            <button
              v-if="!wordChanged"
              type="button"
              class="link-primary fw-bold bg-transparent border-0 align-self-start p-0"
              @click="changeWords"
            >
              Github
            </button>
          </Transition>
          <Transition
            name="custom-classes"
            enter-active-class="animate__animated animate__fadeIn animate__delay-2s"
          >
            <a
              v-if="wordChanged"
              class="link-primary fw-bold text-decoration-none bg-transparent border-0
                align-self-start p-0"
              href="https://github.com/bryanchu10"
            >
              改去 Bryan Chu 的 Github 吧！
            </a>
          </Transition>
        </div>
      </div>
    </div>
  </section>

  <section
    class="recommend position-relative"
    :class="{'py-7': !productsReady}"
  >
    <VueLoading
      :active="!productsReady"
      :is-full-page="false"
    />
    <ProductRecommend
      v-if="productsReady"
      class="py-5 py-md-6"
      :parent-products-data="productsData"
    />
  </section>

  <SubscribeMe />

  <UserFooter @show-login-modal="showLoginModal" />

  <CartOffcanvas ref="cartOffcanvas" />
  <LoginModal ref="loginModal" />
  <ToastList />
</template>

<script>
import UserNavbar from '@/components/layouts/UserNavbar.vue';
import MeltTransText from '@/components/helpers/MeltTransText.vue';
import ProductRecommend from '@/components/layouts/ProductRecommend.vue';
import SubscribeMe from '@/components/layouts/SubscribeMe.vue';
import UserFooter from '@/components/layouts/UserFooter.vue';
import CartOffcanvas from '@/components/layouts/CartOffcanvas.vue';
import LoginModal from '@/components/modals/LoginModal.vue';
import ToastList from '@/components/helpers/ToastList.vue';

export default {
  components: {
    UserNavbar,
    MeltTransText,
    ProductRecommend,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
    ToastList,
  },
  inject: ['$pushMessageState'],
  data() {
    return {
      recentArticlesNum: 3, // 調整首頁顯示的近期文章數量

      articlesData: [],
      recentArticles: [],
      articlesReady: false,

      productsData: [],
      wordChanged: false,
      productsReady: false,
    };
  },
  created() {
    this.getRecentArticles();
    this.getProducts();
  },
  methods: {
    getRecentArticles(page = 1) {
      this.articlesReady = false;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/articles?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.articlesData = res.data.articles;
          this.recentArticles = this.articlesData.slice(0, this.recentArticlesNum);
          this.articlesReady = true;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得近期文章');
        });
    },
    getProducts() {
      this.productsReady = false;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      this.$http.get(api)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsReady = true;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得商品列表');
        });
    },
    changeWords() {
      this.wordChanged = true;
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

<style lang="scss" scoped>
.bannerImg {
  background-image: url(@/assets/images/banner.jpg);
}
.quotationImg {
  background-image: url(@/assets/images/quotationBg.jpg);
}
</style>
