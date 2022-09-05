<template>
  <UserNavbar @show-offcanvas="this.$refs.cartOffcanvas.showOffcanvas()"/>

  <section class="container mt-6 mb-4 position-relative"
            :class="[productsDataGotten ? 'pt-4' : 'py-7']"
            :style="{minHeight: `${sectionHeight}px`}">
    <VueLoading :active="!productsDataGotten" :is-full-page="false"/>
    <div v-if="!filterProducts.length" class="alert alert-warning" role="alert">
      目前您還沒有收藏任何出版品。您可以在個別出版品頁面的資訊卡，點選右上 <i class="bi bi-heart"></i> 符號，將該出版品加入收藏清單。
    </div>
    <div class="row d-md-none gx-3 gx-md-4 align-items-md-start">
      <div v-for="product in filterProducts" :key="product.id"
            class="col-6">
        <a href="#"
            class="d-block text-decoration-none position-relative mb-4 hover-scale"
            @click.prevent="goProduct(product.id)">
          <img class="w-100 ojf-cover rounded-1 mb-2"
                :src="product.imageUrl" :alt="product.title"
                :style="{ height: mobileImgHeight + 'px' }">
          <h3 class="fs-5 fw-bold text-black">{{ product.title }}</h3>
          <small class="fw-bold text-bold text-black me-2">
            $NT{{ $filters.currency(product.price) }}
          </small>
          <small v-if="product.price !== product.origin_price"
                class="fw-bold text-bold text-secondary text-decoration-line-through">
            $NT{{ $filters.currency(product.origin_price) }}
          </small>
          <small v-if="product.price !== product.origin_price"
                class="text-white fw-bold position-absolute top-0 end-0 py-2 pe-2">
                Sale
          </small>
        </a>
      </div>
    </div>

    <div class="row d-none d-md-flex" data-masonry='{"percentPosition": true}' ref="masonryRow">
      <div class="col-3" v-for="product in filterProducts" :key="product.id">
        <a href="#"
            class="d-block text-decoration-none position-relative mb-5 hover-scale"
            @click.prevent="goProduct(product.id)">
          <img class="w-100 ojf-cover rounded-1 mb-2"
                :src="product.imageUrl" :alt="product.title">
          <h3 class="fs-4 fw-bold text-black">{{ product.title }}</h3>
          <span class="fw-bold text-bold text-black me-2">
            $NT{{ $filters.currency(product.price) }}
          </span>
          <span v-if="product.price !== product.origin_price"
                class="fw-bold text-bold text-secondary text-decoration-line-through">
            $NT{{ $filters.currency(product.origin_price) }}
          </span>
          <span v-if="product.price !== product.origin_price"
                class="text-white fw-bold position-absolute top-0 end-0 py-3 pe-3">
                On Sale
          </span>
        </a>
      </div>
    </div>

  </section>

  <SubscribeMe ref="subscribeSection"/>

  <UserFooter @show-login-modal="this.$refs.loginModal.showModal()" ref="footerSection"/>

  <CartOffcanvas ref="cartOffcanvas"/>
  <LoginModal ref="loginModal"/>
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
  inject: ['$filters'],
  data() {
    return {
      productsData: [],
      productsDataGotten: false,
      isLoading: false,
      favorities: [],
      filterProducts: [],
      browserWidth: 0,
      mobileImgHeight: 0,
      browserHeight: 0,
      sectionHeight: 0,
    };
  },
  components: {
    UserNavbar,
    SubscribeMe,
    UserFooter,
    CartOffcanvas,
    LoginModal,
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.productsData = JSON.parse(JSON.stringify(res.data.products));
            this.productsDataGotten = true;
            this.getFavorites();
          }
        });
    },
    getFavorites() {
      this.favorities = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      this.favorities.forEach((id) => {
        this.filterProducts.push(this.productsData.find((product) => product.id === id));
      });
    },
    goProduct(id) {
      this.$router.push(`/products/${id}`);
    },
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
  updated() {
    this.masonry = new Masonry(this.$refs.masonryRow, {
      percentPosition: true,
    });
  },
  mixins: [windowResizeMixin],
};
</script>
