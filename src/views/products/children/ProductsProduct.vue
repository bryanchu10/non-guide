<template>
  <section class="container mt-6 mb-5 mb-md-6">
    <div
      class="row position-relative mb-md-5"
      :style="{ 'margin-bottom': `${infoCardHeight-12}px` }"
    >
      <div
        class="col d-md-none h-lv8 bgsz-cover bgp-center position-relative"
        :style="{ 'background-image': `url(${product.imageUrl ? product.imageUrl : ''})` }"
      >
        <span
          v-if="product.price !== product.origin_price"
          class="position-absolute end-0 text-white fw-bold p-3"
        >
          On Sale
        </span>
      </div>
      <div class="d-none d-md-block col-md-8">
        <div class="position-relative">
          <img
            class="h-lv10 w-100 ojf-cover rounded-1"
            :src="product.imageUrl"
            :alt="product.title"
          >
          <span
            v-if="product.price !== product.origin_price"
            class="position-absolute start-0 text-white fw-bold p-4"
          >
            On Sale
          </span>
        </div>
      </div>
      <div
        class="col-md-5 position-absolute top-90 top-md-50 end-md-0
                  translate-middle-md-y"
      >
        <div
          ref="infoCard"
          class="p-3 py-md-4 ps-md-4 pe-md-0 bg-white rounded-1"
        >
          <nav
            aria-label="breadcrumb"
            class="d-flex"
          >
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link
                  to="/"
                  class="text-decoration-none link-secondary"
                >
                  首頁
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link
                  to="/products/list"
                  class="text-decoration-none link-secondary"
                >
                  出版品
                </router-link>
              </li>
              <li
                class="breadcrumb-item"
                aria-current="page"
              >
                <a
                  href="#"
                  class="text-decoration-none link-secondary"
                  @click.prevent="goProductsPage(product.category)"
                >
                  {{ product.category }}
                </a>
              </li>
            </ol>
            <a
              href="#"
              class="link-secondary ms-auto"
              aria-label="加入最愛"
              @click.prevent="toggleFavorites"
            >
              <i
                v-if="isFavorite"
                class="bi bi-heart-fill text-primary"
              />
              <i
                v-else
                class="bi bi-heart"
              />
            </a>
          </nav>
          <h2 class="fs-2 fs-md-1 fw-bold lh-base mb-4">
            {{ product.title }}
          </h2>
          <div class="row">
            <div class="col-7 col-lg-6 col-xl-5 order-xl-2">
              <div class="input-group input-group-lg mb-3 mb-lg-0">
                <button
                  id="button-addon1"
                  class="btn btn-tertiary"
                  type="button"
                  :disabled="status.loadingItem === product.id"
                  @click="changeProductAmount(-1)"
                >
                  <i class="bi bi-dash-lg" />
                </button>
                <input
                  v-model="productAmount"
                  type="number"
                  class="form-control text-center bg-tertiary border-0
                                input-browser-style-none"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  :disabled="status.loadingItem === product.id"
                  @change="productAmountChanged(productAmount)"
                >
                <button
                  id="button-addon2"
                  class="btn btn-tertiary"
                  type="button"
                  :disabled="status.loadingItem === product.id"
                  @click="changeProductAmount(1)"
                >
                  <i class="bi bi-plus-lg" />
                </button>
              </div>
            </div>
            <div class="col-5 col-lg-6 col-xl-12 order-xl-1">
              <div class="d-flex flex-column">
                <span
                  v-if="product.origin_price !== product.price"
                  class="text-secondary text-decoration-line-through text-end"
                >
                  NT${{ $filters.currency(product.origin_price) }}
                </span>
                <span
                  class="fs-4 fw-bold text-end mb-3 mb-xl-4"
                  :class="{'mt-4': product.origin_price === product.price}"
                >
                  NT${{ $filters.currency(product.price) }}
                </span>
              </div>
            </div>
            <div class="col-xl-7 order-xl-3">
              <button
                id="button-addon3"
                class="btn btn-lg btn-primary w-100"
                type="button"
                :disabled="status.loadingItem === product.id || !productAmount"
                @click.prevent="addCart(product.id)"
              >
                <span
                  v-if="status.loadingItem === product.id"
                  class="spinner-grow spinner-grow-sm align-baseline me-2"
                  role="status"
                  aria-hidden="true"
                />
                <span v-if="status.loadingItem === product.id">加入中…</span>
                <span v-else>加入購物車</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 mb-4 mb-md-0">
        <p class="fs-md-5 mb-0 text-prewrap">
          {{ product.content }}
        </p>
      </div>
      <div class="col-md-3">
        <p class="fs-md-5 mb-0 text-secondary text-prewrap">
          {{ product.description }}
        </p>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <h3 class="fs-2 fw-bold mb-0">
        您可能也會喜歡……
      </h3>
    </div>
    <ProductRecommend
      v-if="productsDataGotten"
      class="pt-3 pb-5 pt-md-4 pb-md-6"
      :parent-products-data="productsData"
    />
  </section>
</template>

<script>
import ProductRecommend from '@/components/layouts/ProductRecommend.vue';
import windowResizeMixin from '@/mixins/windowResizeMixin';

export default {
  components: {
    ProductRecommend,
  },
  mixins: [windowResizeMixin],
  inject: ['$emitter', '$filters'],
  props: {
    parentProductsData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      productId: '',
      product: {},
      productAmount: 1,
      infoCardHeight: 0,
      productsData: [],
      productsDataGotten: false,
      status: {
        loadingItem: '',
      },
      browserWidth: 0,
      isFavorite: false,
      favorites: [],
    };
  },
  watch: {
    browserWidth() {
      if (this.browserWidth < 768) {
        this.infoCardHeight = this.$refs.infoCard.offsetHeight;
      }
    },
  },
  created() {
    this.productId = this.$route.params.productId;
    this.getFavorites();
    this.getProduct();
    this.getProducts();
  },
  updated() {
    this.infoCardHeight = this.$refs.infoCard.offsetHeight;
  },
  methods: {
    getProduct() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${this.productId}`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.product = JSON.parse(JSON.stringify(res.data.product));
          }
        });
    },
    getProducts() {
      this.productsData = JSON.parse(JSON.stringify(this.parentProductsData));
      this.productsDataGotten = true;
    },
    goProductsPage(area) {
      this.$router.push({
        name: 'list',
        params: { areaThroughRouter: area },
      });
      this.$emitter.emit('areaFromNavbar', area);
    },
    getFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      if (this.favorites.indexOf(this.productId) !== -1) {
        this.isFavorite = true;
      }
    },
    addCart(id) {
      const productInfo = {
        product_id: id,
        qty: this.productAmount,
      };
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = id;
      this.$http.post(api, { data: productInfo })
        .then((res) => {
          if (res.data.success) {
            this.status.loadingItem = '';
            this.$emitter.emit('addCart');
          }
        });
    },
    changeProductAmount(changeAmount) {
      this.productAmount += changeAmount;
      this.productAmountChanged(this.productAmount);
    },
    productAmountChanged(amount) {
      this.productAmount = Math.floor(amount);
      if (amount < 0) {
        this.productAmount = 0;
      }
      if (amount > 99) {
        this.productAmount = 99;
      }
    },
    toggleFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      if (this.isFavorite === false) {
        this.favorites.push(this.productId);
      } else {
        this.favorites = this.favorites.filter((item) => item !== this.productId);
      }
      this.isFavorite = !this.isFavorite;
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
    },
  },
};
</script>
