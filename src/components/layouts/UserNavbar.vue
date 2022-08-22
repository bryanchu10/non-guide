<template>
  <nav class="navbar navbar-expand-lg bg-white w-100 py-3"
        :class="[$route.name === 'home'
                  ? 'bg-transparent position-absolute zindex-1'
                  : 'fixed-top']">
    <div class="container align-items-center">
      <button class="navbar-toggler fs-3 border-0 ps-0 ms-1"
              :class="{'link-light': $route.name === 'home'}"
              type="button"
              data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar">
        <i class="bi bi-list"></i>
      </button>
      <router-link class="navbar-brand d-flex align-items-center pe-3 py-0" to="/"
                    :class="{'text-light text-lg-dark': $route.name === 'home'}">
        <img class="me-2" src="@/assets/logo.svg" alt="logo" width="24" height="24">
        <h1 class="fs-4 fw-bold lh-base mb-0">烏有指南</h1>
      </router-link>
      <div class="offcanvas offcanvas-start" tabindex="-1" ref="menuOffcanvas"
            id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header py-3">
          <a class="link-dark fs-4" data-bs-dismiss="offcanvas"
              aria-label="Close">
            <i class="bi bi-arrow-left-short"></i>
          </a>
          <a class="link-dark fs-4" href="#" aria-label="cart"
              @click.prevent="$emit('show-offcanvas')">
            <i class="bi bi-cart-fill"></i>
          </a>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1">
            <li class="nav-item dropdown d-lg-none">
              <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item border-bottom">
                  <h2 class="accordion-header" id="flush-headingOne">
                    <button class="accordion-button collapsed px-0 bg-transparent" type="button"
                            data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"
                            aria-expanded="false" aria-controls="flush-collapseOne">
                      出版品
                    </button>
                  </h2>
                  <div id="flush-collapseOne" class="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body px-0 py-2">
                      <div class="list-group list-group-flush">
                        <button v-for="(area, index) in areas" :key="index"
                                type="button"
                                class="list-group-item
                                        border-bottom-0 text-start"
                                :class="{active: areaSelected === area}"
                                @click="goProductsPage(area)"
                                data-bs-dismiss="offcanvas">{{ area }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item d-none d-lg-flex px-3">
              <!-- 因為單一出版品、單一關於文章的路徑和出版品總覽、關於文章總覽的路徑不同，
                    並且因為設計的原因，單一頁面並不是總覽的子路由，
                    但要讓使用者以為單一頁面是在總覽頁面下層，
                    所以在 Vue Router 提供的 linkActiveClass 功能之外，
                    再額外寫上需要呈現 active 樣式的情況。-->
              <router-link class="nav-link" to="/products/list"
                          :class="{'active fw-bold': $route.name === 'product',
                                    'text-light': $route.name === 'home'}">
                出版品
              </router-link>
            </li>
            <li class="nav-item px-lg-3">
              <router-link class="nav-link" to="/about/overview"
                          :class="{'active fw-bold': $route.name === 'article',
                                    'text-lg-light': $route.name === 'home'}">
                關於
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <a href="#" aria-label="cart"
          class="cart nav-link fs-4 ms-lg-4 me-1 position-relative"
          :class="{'link-light': $route.name === 'home'}"
          @click.prevent="$emit('show-offcanvas')">
        <i class="bi bi-cart-fill"></i>
        <span v-if="cartFilled"
              class="position-absolute top-20 start-100 translate-middle p-2
                      bg-danger rounded-circle">
          <span class="visually-hidden">New alerts</span>
        </span>
      </a>
    </div>
  </nav>
</template>

<script>
import Offcanvas from 'bootstrap/js/dist/offcanvas';

export default {
  inject: ['$emitter'],
  data() {
    return {
      areaSelected: '',
      areas: ['全部', '北部', '中部', '南部', '東部', '離島'],
      onSingleProduct: false,
      onSingleArticle: false,
      cartFilled: false,
      offcanvas: {},
    };
  },
  methods: {
    goProductsPage(area) {
      this.$router.push({
        name: 'list',
        params: { areaThroughRouter: area },
      });
      this.$emitter.emit('areaFromNavbar', area);
    },
    areaFromListHandler(area) {
      this.areaSelected = area;
    },
    cartFilledHandler(itemAmount) {
      if (itemAmount === 0) {
        this.cartFilled = false;
      } else {
        this.cartFilled = true;
      }
    },
  },
  created() {
    if (this.$route.name === 'list') {
      if (!this.$route.params.areaThroughRouter) {
        this.areaSelected = '全部';
      } else {
        this.areaSelected = this.$route.params.areaThroughRouter;
      }
    }
  },
  mounted() {
    this.offcanvas = new Offcanvas(this.$refs.menuOffcanvas);
    this.$emitter.on('areaFromList', this.areaFromListHandler);
    this.$emitter.on('cartFilled', this.cartFilledHandler);
  },
  beforeUnmount() {
    this.offcanvas.hide();
    this.$emitter.off('areaFromList', this.areaFromListHandler);
    this.$emitter.off('cartFilled', this.cartFilledHandler);
  },
};
</script>
