<template>
  <UserNavbar @show-offcanvas="showCartCanvas" />

  <section
    class="container mt-6 mb-4 position-relative"
    :class="[isLoading ? 'py-7' : 'pt-4']"
    :style="{minHeight: `${sectionHeight}px`}"
  >
    <VueLoading
      :active="isLoading"
      :is-full-page="false"
    />
    <div
      v-if="!filterProducts.length"
      class="alert alert-warning"
      role="alert"
    >
      目前您還沒有收藏任何出版品。您可以在個別出版品的資訊卡上點選 <i class="bi bi-heart" /> 符號，將該出版品加入收藏清單。
    </div>
    <div class="row d-md-none gx-3 gx-md-4 align-items-md-start">
      <div
        v-for="(product, index) in filterProducts"
        :key="product.id"
        class="col-6"
      >
        <a
          href="#"
          class="d-block text-decoration-none position-relative mb-4 hover-scale"
          @click.prevent="goProduct(product.id)"
        >
          <div class="mb-2 position-relative">
            <img
              class="w-100 ojf-cover rounded-1 mb-2"
              :src="product.imageUrl"
              :alt="product.title"
              :style="{height: `${mobileImgHeight}px`}"
            >
            <small
              v-if="product.price !== product.origin_price"
              class="text-white fw-bold position-absolute top-0 end-0 py-2 pe-2"
            >
              Sale
            </small>
            <div
              class="btn-block-filter d-flex position-absolute bottom-0 start-0 end-0 py-2 ps-3
                rounded-1"
            >
              <button
                :ref="setItemRef"
                class="btn btn-outline-light btn--cart-plus rounded-circle border border-2
                  me-2"
                @click.stop.prevent="addOne(product.id, index)"
              >
                <i class="bi bi-cart-plus fs-5" />
              </button>
              <button
                class="btn btn-outline-light btn--heart rounded-circle border border-2 pb-1"
                @click.stop.prevent="toggleFavorites(product.id)"
              >
                <i
                  class="bi fs-5"
                  :class="[isFavorite(product.id) ? 'bi-heart-fill' : 'bi-heart']"
                />
              </button>
            </div>
          </div>
          <h3 class="fs-6 fs-sm-5 fw-bold text-black text-truncate">{{ product.title }}</h3>
          <small class="fw-bold text-bold text-black me-2">
            $NT{{ $filters.currency(product.price) }}
          </small>
          <small
            v-if="product.price !== product.origin_price"
            class="fw-bold text-bold text-secondary text-decoration-line-through"
          >
            $NT{{ $filters.currency(product.origin_price) }}
          </small>
        </a>
      </div>
    </div>
    <div
      ref="masonryRow"
      class="row d-none d-md-flex"
    >
      <div
        v-for="(product, index) in filterProducts"
        :key="product.id"
        class="col-4 col-xl-3"
      >
        <a
          href="#"
          class="d-block text-decoration-none mb-5 hover-scale"
          @click.prevent="goProduct(product.id)"
        >
          <div class="mb-2 position-relative">
            <img
              class="w-100 rounded-1"
              :src="product.imageUrl"
              :alt="product.title"
            >
            <span
              v-if="product.price !== product.origin_price"
              class="text-block-filter text-white fw-bold text-end position-absolute top-0 start-0
                end-0 py-2 pe-3"
            >
              On Sale
            </span>
            <div
              class="btn-block-filter d-flex position-absolute bottom-0 start-0 end-0 py-2 ps-3
                rounded-1"
            >
              <button
                :ref="setMasonryItemRef"
                class="btn btn-outline-light btn--cart-plus rounded-circle border border-2
                  me-2"
                @click.stop.prevent="addOne(product.id, index)"
              >
                <i class="bi bi-cart-plus fs-5" />
              </button>
              <button
                class="btn btn-outline-light btn--heart rounded-circle border border-2 pb-1"
                @click.stop.prevent="toggleFavorites(product.id)"
              >
                <i
                  class="bi fs-5"
                  :class="[isFavorite(product.id) ? 'bi-heart-fill' : 'bi-heart']"
                />
              </button>
            </div>
          </div>
          <h3 class="fs-5 fs-lg-4 fw-bold text-black">{{ product.title }}</h3>
          <span class="fw-bold text-bold text-black me-2">
            $NT{{ $filters.currency(product.price) }}
          </span>
          <span
            v-if="product.price !== product.origin_price"
            class="fw-bold text-bold text-secondary text-decoration-line-through"
          >
            $NT{{ $filters.currency(product.origin_price) }}
          </span>
        </a>
      </div>
    </div>
  </section>

  <SubscribeMe ref="subscribeSection" />

  <UserFooter
    ref="footerSection"
    @show-login-modal="showLoginModal"
  />

  <CartOffcanvas ref="cartOffcanvas" />
  <LoginModal ref="loginModal" />
</template>

<script>
import windowResizeMixin from '@/mixins/windowResizeMixin';
import Masonry from 'masonry-layout/masonry';
import ImagesLoaded from 'imagesloaded/imagesloaded';

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
  mixins: [windowResizeMixin],
  inject: ['$emitter', '$filters', '$pushMessageState'],
  data() {
    return {
      productsData: [],
      isLoading: true,
      favorites: [],
      filterProducts: [],
      browserWidth: 0,
      mobileImgHeight: 0,
      masonry: {},
      imagesLoaded: {},
      itemRefs: [],
      itemMasonryRefs: [],
      browserHeight: 0,
      sectionHeight: 0,
    };
  },
  watch: {
    browserWidth() {
      if (this.browserWidth < 576) {
        this.mobileImgHeight = (this.browserWidth - 16 - 12 * 2) * 0.5;
      }
      if (this.browserWidth >= 576 && this.browserWidth < 768) {
        this.mobileImgHeight = (532 - 16 * 2) * 0.5;
      }
      const subscribeHeight = this.$refs.subscribeSection.sectionHeight;
      const footerHeight = this.$refs.footerSection.sectionHeight;
      this.sectionHeight = this.browserHeight - subscribeHeight - footerHeight - 96;
      // 96 是 PC 版的 section margin
    },
  },
  created() {
    this.getProducts();
  },
  mounted() {
    this.imagesLoaded = new ImagesLoaded(this.$refs.masonryRow, () => {
      this.masonry = new Masonry(this.$refs.masonryRow, {
        percentPosition: true,
      });
    });
  },
  beforeUpdate() {
    this.itemRefs = [];
    this.itemMasonryRefs = [];
  },
  updated() {
    this.imagesLoaded = new ImagesLoaded(this.$refs.masonryRow, () => {
      this.masonry = new Masonry(this.$refs.masonryRow, {
        percentPosition: true,
      });
      this.isLoading = false;
    });
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      this.$http.get(api)
        .then((res) => {
          this.productsData = res.data.products;
          this.getFavorites();
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得商品列表');
        });
    },
    getFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      this.filterProducts = [];
      this.favorites.forEach((id) => {
        this.filterProducts.push(this.productsData.find((product) => product.id === id));
      });
    },
    toggleFavorites(id) {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
      } else {
        this.favorites = this.favorites.filter((item) => item !== id);
      }
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
      this.getFavorites();
    },
    goProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    isFavorite(id) {
      if (this.favorites.indexOf(id) !== -1) {
        return true;
      }
      return false;
    },
    addOne(id, index) {
      const productInfo = {
        product_id: id,
        qty: 1,
      };
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      this.$http.post(api, { data: productInfo })
        .then((res) => {
          if (res.data.success) {
            this.$emitter.emit('addCart');
          } else {
            this.$pushMessageState(res, '加入購物車');
          }
        })
        .catch((err) => {
          console.log(err);
          this.$pushMessageState(err.response, '加入購物車');
        });
      const el = document.createElement('div');
      el.textContent = '+1';
      el.setAttribute('class', 'plus-one animate__animated animate__fadeOutUp');
      if (this.browserWidth < 768) {
        this.itemRefs[index].appendChild(el);
        setTimeout(() => {
          this.itemRefs[index].removeChild(el);
        }, 1000);
      } else {
        this.itemMasonryRefs[index].appendChild(el);
        setTimeout(() => {
          this.itemMasonryRefs[index].removeChild(el);
        }, 1000);
      }
    },
    setItemRef(el) {
      this.itemRefs.push(el);
    },
    setMasonryItemRef(el) {
      this.itemMasonryRefs.push(el);
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
.btn--cart-plus,
.btn--heart {
  display: block;
  width: 48px;
  height: 48px;
}

.btn--cart-plus {
  position: relative;
  :deep(.plus-one) {
    position: absolute;
    font-size: 1.5rem;
    font-weight: bold;
    color: yellow;
    top: -42px;
    left: 8px;
  }
}

.btn-block-filter {
  background: linear-gradient(rgba(#000000, 0), rgba(#000000, 1) 70%)
}
</style>
