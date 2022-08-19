<template>
  <UserNavbar @show-offcanvas="this.$refs.cartOffcanvas.showOffcanvas()"/>
  <!-- banner -->
  <section class="banner container-fluid vh-100 position-relative mb-5 mb-lg-6">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-lg-6 d-flex flex-column align-items-sm-center align-items-lg-start
                    justify-content-between justify-content-lg-center py-4">
          <div class="d-lg-none py-4"></div>
          <div class="mb-5 align-self-center align-self-lg-start">
            <h2 class="text-md-start text-white text-lg-black fw-bold fs-1 mb-4">
              世界的每個角落<br>
              ——— 都是一本<br class="d- d-xl-none">博物誌。
            </h2>
            <p class="text-light text-lg-secondary fw-lg-bold fs-lg-4
                      text-center text-lg-start mb-0">
              最獨特的旅行指南，帶你認識街上<br>
              一道牆、一棵樹的故事。
            </p>
          </div>
          <div class="col-12 col-sm-8 col-md-6">
            <button class="btn btn-primary btn-lg w-100" type="button"
                    @click.prevent="this.$router.push('/products/list')">
              開啟旅程
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-lg-6 position-absolute top-0 bottom-0 bgp-center bgsz-cover zindex-n1"
            style="background-image: url(https://images.unsplash.com/photo-1589823032775-1affcb1d5bef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1372&q=80);">
      </div>
      <div class="d-lg-none bg-black bg-opacity-25
                  position-absolute top-0 bottom-0 zindex-n1"></div>
    </div>
  </section>
  <!-- about -->
  <section class="about container mb-4 mb-md-6">
    <template  v-for="(article, index) in recentArticles" :key="article.id">
      <div class="row mb-2" :class="[index === (recentArticlesNum - 1) ? '' : 'mb-md-4']">
        <div class="col-md-6" :class="[index%2 === 0 ? '' : 'order-md-1 offset-md-1']">
          <img class="w-100 ojf-cover rounded-1" :src="article.image" :alt="article.title">
        </div>
        <div class="col-md-4 offset-md-1 d-flex flex-column justify-content-center py-3">
          <h3 class="fs-4 fw-bold mb-3">{{ article.title }}</h3>
          <p class="text-secondary mb-3">{{ article.description }}</p>
          <a class="link-primary fw-bold text-decoration-none align-self-start
                    py-2" href="#"
              @click.prevent="this.$router.push(`/about/${article.id}`)">
            了解更多
          </a>
        </div>
      </div>
    </template>
  </section>
  <!-- quotation -->
  <section class="quotation bgpx-center bgpy-75 bgsz-cover" style="background-image: url(https://images.unsplash.com/photo-1498760232600-92f65c153b44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80);">
    <div class="container">
      <div class="row justify-content-between py-4 py-md-8 align">
        <div class="col-md-4">
          <blockquote class="custom-blockquote text-white fs-2 fw-bold mb-md-0 mb-7">
            看似微不足道的小資訊，卻使我們看待事物的眼光有所不同。
          </blockquote>
        </div>
        <div class="col-md-3 d-flex flex-column">
          <span class="text-secondary fw-bold mb-1">總編輯</span>
          <MeltTransText :wordChanged="wordChanged">
            <template #init>諾．薩奇．皮森</template>
            <template #final>No such person</template>
          </MeltTransText>
          <Transition name="custom-classes"
            enter-active-class="animate__animated animate__fadeOut">
            <button v-if="!wordChanged"
                    type="button"
                    class="link-primary align-self-start
                            bg-transparent border-0 p-0
                            fw-bold"
                    @click="changeWords">
                    Github
            </button>
          </Transition>
          <Transition name="custom-classes"
            enter-active-class="animate__animated animate__fadeIn animate__delay-2s">
            <a v-if="wordChanged"
                class="link-primary align-self-start
                      bg-transparent border-0 p-0
                      fw-bold text-decoration-none"
                href="https://github.com/bryanchu10">
              改去 Bryan Chu 的 Github 吧！
            </a>
          </Transition>
        </div>
      </div>
    </div>
  </section>
  <ProductRecommend class="py-5 py-md-6"
                    :parent-products-data="productsData"
                    v-if="productsDataGotten"/>
  <SubscribeMe/>
  <UserFooter @show-modal="this.$refs.loginModal.showModal()"/>
  <CartOffcanvas ref="cartOffcanvas"/>
  <LoginModal ref="loginModal"/>
</template>

<script>
import UserNavbar from '@/components/UserNavbar.vue';
import MeltTransText from '@/components/MeltTransText.vue';
import ProductRecommend from '@/components/ProductRecommend.vue';
import SubscribeMe from '@/components/SubscribeMe.vue';
import UserFooter from '@/components/UserFooter.vue';
import CartOffcanvas from '@/components/CartOffcanvas.vue';
import LoginModal from '@/components/LoginModal.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      articlesData: [],
      recentArticlesNum: 3, // 調整首頁顯示的近期文章數量
      recentArticles: [],
      wordChanged: false,
      productsData: [],
      productsDataGotten: false,
    };
  },
  components: {
    UserNavbar,
    MeltTransText,
    ProductRecommend,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
  },
  methods: {
    getRecentArticles(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/articles?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.articlesData = [...res.data.articles];
            this.recentArticles = this.articlesData.slice(0, this.recentArticlesNum);
          }
        });
    },
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
    changeWords() {
      this.wordChanged = true;
    },
  },
  created() {
    this.getRecentArticles();
    this.getProducts();
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: absolute;
  :deep(.navbar-brand) {
    color: #ffffff;
    @media (min-width: 992px) {
      color: #000000;
    }
  }
  :deep(.nav-link) {
    @media (min-width: 992px) {
      color: #ffffff;
      &:hover {
        color: rgba(#ffffff, .75);
      }
    }
  }
  :deep(.cart) {
    color: #ffffff;
    &:hover {
      color: rgba(#ffffff, .75);
    }
  }
  :deep(.navbar-toggler) {
    color: #ffffff;
    &:hover {
      color: rgba(#ffffff, .75);
    }
  }
}

.about {
  img {
    height: 244px;
    @media (min-width: 992px) {
      height: 400px;
    }
  }
}
</style>
