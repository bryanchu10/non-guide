<template>
  <VueLoading :active="isLoading" />
  <nav class="navbar bg-light mt-6">
    <div class="container">
      <ul class="navbar-nav flex-row justify-content-between justify-content-md-start w-100">
        <li
          v-for="(area, index) in areas"
          :key="index"
          class="nav-item me-md-5"
        >
          <a
            href="#"
            class="nav-link"
            :class="[areaSelected === area.name ? 'active fw-bold' : 'link-secondary']"
            @click.prevent="areaSelected = area.name"
          >
            <span class="fs-md-4">
              {{ area.name }}
            </span>
            <small class="fs-8 fs-md-7 align-top ms-1">
              {{ area.amount }}
            </small>
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <section class="container pt-4 pt-md-5 mb-4">
    <div class="row d-md-none gx-3 gx-md-4 align-items-md-start">
      <div
        v-for="product in filterProducts"
        :key="product.id"
        class="col-6"
      >
        <a
          href="#"
          class="d-block text-decoration-none position-relative mb-4 hover-scale"
          @click.prevent="goProduct(product.id)"
        >
          <img
            class="w-100 ojf-cover rounded-1 mb-2"
            :src="product.imageUrl"
            :alt="product.title"
            :style="{height: `${mobileImgHeight}px`}"
          >
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
          <small
            v-if="product.price !== product.origin_price"
            class="text-white fw-bold position-absolute top-0 end-0 py-2 pe-2"
          >
            Sale
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
          class="d-block text-decoration-none position-relative mb-5 hover-filter"
          @click.prevent="goProduct(product.id)"
        >
          <div class="mb-2 position-relative">
            <img
              class="w-100 ojf-cover rounded-1"
              :src="product.imageUrl"
              :alt="product.title"
            >
            <div
              class="d-flex position-absolute top-50 start-50 translate-middle"
            >
              <button
                :ref="setItemRef"
                class="btn btn-outline-light btn--cart-plus rounded-circle border border-2
                  me-2"
                :class="{show: status.loadingItem === product.id}"
                @click.stop.prevent="addOne(product.id, index)"
              >
                <i class="bi bi-cart-plus fs-4" />
              </button>
              <button
                class="btn btn-outline-light btn--heart rounded-circle border border-2"
                @click.stop.prevent="toggleFavorites(product.id)"
              >
                <i
                  class="bi fs-4"
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
          <span
            v-if="product.price !== product.origin_price"
            class="text-white fw-bold position-absolute top-0 end-0 py-3 pe-3"
          >
            On Sale
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import windowResizeMixin from '@/mixins/windowResizeMixin';
import Masonry from 'masonry-layout/masonry';
import ImagesLoaded from 'imagesloaded/imagesloaded';

export default {
  mixins: [windowResizeMixin],
  inject: ['$emitter', '$filters', '$pushMessageState'],
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
      products: [],
      device: '',
      mobileImgHeight: 0,
      areaSelected: '全部',
      areas: [
        { name: '全部', amount: 0 },
        { name: '北部', amount: 0 },
        { name: '中部', amount: 0 },
        { name: '南部', amount: 0 },
        { name: '東部', amount: 0 },
        { name: '離島', amount: 0 },
      ],
      masonry: {},
      imagesLoaded: {},
      browserWidth: 0,
      isLoading: true,
      favorites: [],
      status: {
        loadingItem: '',
      },
      itemRefs: [],
    };
  },
  computed: {
    filterProducts() {
      if (this.areaSelected !== '全部') {
        return this.products.filter((product) => product.category.match(this.areaSelected));
      }
      return this.products;
    },
  },
  watch: {
    browserWidth() {
      if (this.browserWidth < 576) {
        this.device = 'mobile';
        this.mobileImgHeight = (this.browserWidth - 16 - 12 * 2) * 0.5;
      }
      if (this.browserWidth >= 576 && this.browserWidth < 768) {
        this.device = 'mobile';
        this.mobileImgHeight = (532 - 16 * 2) * 0.5;
      }
      if (this.browserWidth >= 768) {
        this.device = 'PC';
      }
    },
    areaSelected(area) {
      this.$emitter.emit('areaFromList', area);
    },
  },
  created() {
    if (!this.$route.params.areaThroughRouter) {
      this.areaSelected = '全部';
    } else {
      this.areaSelected = this.$route.params.areaThroughRouter;
    }
    this.getProducts();
    this.getFavorites();
    this.countAreaAmount();
  },
  mounted() {
    this.$emitter.on('areaFromNavbar', this.areaFromNavbarHandler);
    this.imagesLoaded = new ImagesLoaded(this.$refs.masonryRow, () => {
      this.masonry = new Masonry(this.$refs.masonryRow, {
        percentPosition: true,
      });
      this.isLoading = false;
    });
  },
  beforeUpdate() {
    this.itemRefs = [];
  },
  updated() {
    this.masonry = new Masonry(this.$refs.masonryRow, {
      percentPosition: true,
    });
  },
  beforeUnmount() {
    this.$emitter.off('areaFromNavbar', this.areaFromNavbarHandler);
  },
  methods: {
    getProducts() {
      const productsArr = JSON.parse(JSON.stringify(this.parentProductsData));
      const productsPromote = productsArr
        .filter((item) => item.price !== item.origin_price);
      productsPromote
        .push(...productsArr.filter((item) => item.price === item.origin_price));
      this.products = productsPromote;
    },
    countAreaAmount() {
      this.areas[0].amount = this.products.length;
      this.products.forEach((product) => {
        switch (product.category) {
          case '北部':
            this.areas[1].amount += 1;
            break;
          case '中部':
            this.areas[2].amount += 1;
            break;
          case '南部':
            this.areas[3].amount += 1;
            break;
          case '東部':
            this.areas[4].amount += 1;
            break;
          case '離島':
            this.areas[5].amount += 1;
            break;
          default:
            break;
        }
      });
    },
    goProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    areaFromNavbarHandler(area) {
      this.areaSelected = area;
    },
    getFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    },
    toggleFavorites(id) {
      this.favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
      } else {
        this.favorites = this.favorites.filter((item) => item !== id);
      }
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
    },
    isFavorite(id) {
      if (this.favorites.indexOf(id) !== -1) {
        return true;
      }
      return false;
    },
    addOne(id, index) {
      console.log(id, index, this.itemRefs[index]);
      const productInfo = {
        product_id: id,
        qty: 1,
      };
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = id;
      this.$http.post(api, { data: productInfo })
        .then((res) => {
          if (res.data.success) {
            this.$emitter.emit('addCart');
          } else {
            this.$pushMessageState(res, '加入購物車');
          }
          this.status.loadingItem = '';
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '加入購物車');
        });
      const el = document.createElement('div');
      el.textContent = '+1';
      el.setAttribute('class', 'plus-one animate__animated animate__fadeOutUp');
      this.itemRefs[index].appendChild(el);
      setTimeout(() => {
        this.itemRefs[index].removeChild(el);
      }, 1000);
    },
    setItemRef(el) {
      this.itemRefs.push(el);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn--cart-plus,
.btn--heart {
  display: none;
  width: 54px;
  height: 54px;
}

.hover-filter {
  &:hover {
    .btn--cart-plus,
    .btn--heart {
      display: block;
    }
  }
}

// .btn--cart-plus {
//   position: relative;
//   &::after {
//     opacity: 0;
//     position: absolute;
//     content: '+1';
//     font-size: 1.5rem;
//     font-weight: bold;
//     color: yellow;
//     top: -48px;
//     left: 12px;
//   }
//   &.show{
//     &::after {
//       opacity: 1;
//       top: -96px;
//       transition: top 2s ease;
//     }
//   }
// }

.btn--cart-plus {
  position: relative;
  :deep(.plus-one) {
    opacity: 1;
    position: absolute;
    font-size: 1.5rem;
    font-weight: bold;
    color: yellow;
    top: -48px;
    left: 12px;
  }
}
</style>
