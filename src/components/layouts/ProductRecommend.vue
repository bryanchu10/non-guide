<template>
  <div
    ref="carousel"
    class="bc-carousel"
    :class="{active: isGrabbing}"
    @mousedown="mouseDown($event)"
    @mouseup="mouseUp"
    @mouseleave="mouseLeave"
    @mousemove.prevent="mouseMove($event)"
    @mousewheel="mouseWheel"
  >
    <div
      class="bc-carousel__pad-start"
      :style="{width: `${carouselPadWidth}px`}"
    />

    <div
      v-for="(productList, index) in recommendProducts"
      :key="index"
      class="bc-carousel__container"
    >
      <div class="row gx-3 gx-sm-4">
        <div
          v-for="product in recommendProducts[index]"
          :key="product.id"
          class="col-4"
        >
          <router-link
            :to="`/products/${product.id}`"
            class="d-block bc-carousel__container__card text-decoration-none position-relative
              hover-scale"
          >
            <img
              class="h-lv4 h-sm-lv3 h-lg-lv5 h-xl-lv7 h-xxl-lv9 w-100 ojf-cover rounded-1 mb-2"
              :src="product.imageUrl"
              :alt="product.title"
            >
            <h3 class="fs-5 fs-lg-4 fw-bold text-black">
              {{ product.title }}
            </h3>
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
          </router-link>
        </div>
        <template v-if="index === 2">
          <div class="col-4">
            <router-link
              to="/products/list"
              class="d-block bc-carousel__container__card text-decoration-none position-relative
                hover-scale"
            >
              <img
                class="h-lv4 h-sm-lv3 h-lg-lv5 h-xl-lv7 h-xxl-lv9 w-100 ojf-cover
                  filter-brightness-50 rounded-1"
                src="@/assets/images/more.jpg"
                alt="觀看更多..."
              >
              <i
                class="bi bi-arrow-right-circle fs-1 text-white opacity-75 position-absolute
                  start-50 top-50 translate-middle"
              />
            </router-link>
          </div>
        </template>
      </div>
    </div>

    <div
      class="bc-carousel__pad-end"
      :style="{width: `${carouselPadWidth}px`}"
    />
  </div>
</template>

<script>
export default {
  inject: ['$filters'],
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
      dragSpeed: 3, // 設定滑鼠點擊中拖曳速度
      wheelSpeed: 2, // 設定滑鼠滾輪滾動速度
      browserWidth: 0,
      clientWidth: 0,
      carouselPadWidth: 0,
      isGrabbing: false,
      relativeStartX: 0, // 按下滑鼠時，游標相對於 carousel 元件左側的水平位置
      carouselLeftX: 0,
      scrollLeftStarX: 0, // 按下滑鼠時水平滾動軸的水平位置
      scrollLeftBefore: 0, // 滾輪滾動前水平滾動軸的水平位置
      scrollLeftAfter: 0, // 滾輪滾動後水平滾動軸的水平位置
      toStartEdge: false,
      toEndEdge: false,
    };
  },
  computed: {
    recommendProducts() {
      const productsArr = JSON.parse(JSON.stringify(this.parentProductsData));

      // 將推薦產品的順序隨機排列
      for (let i = 0; i < productsArr.length; i += 1) {
        const rand = Math.floor(Math.random() * (productsArr.length - i)) + i;
        [productsArr[i], productsArr[rand]] = [productsArr[rand], productsArr[i]];
      }

      // 將促銷的產品放在陣列前面
      // 篩選促銷品放進促銷陣列
      const productsPromote = productsArr
        .filter((product) => product.price !== product.origin_price);
      // 非促銷品放進促銷陣列後面
      productsPromote
        .push(...productsArr.filter((product) => product.price === product.origin_price));

      // 已經在特定商品頁面時，將該特定商品從促銷陣列移除
      if (this.$route.path === `/products/${this.$route.params.productId}`) {
        const currentProductIndex = productsPromote
          .findIndex((product) => product.id === this.$route.params.productId);
        productsPromote.splice(currentProductIndex, 1);
      }
      const recommendProducts = [[], [], []];
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          recommendProducts[i][j] = productsPromote[3 * i + j];
        }
      }
      recommendProducts[2].splice(2, 1);
      return recommendProducts;
    },
  },
  watch: {
    browserWidth() {
      if (this.browserWidth < 576) {
        this.carouselPadWidth = 4;
      }
      if (this.browserWidth >= 576 && this.browserWidth < 768) {
        this.carouselPadWidth = (this.clientWidth - 540) * 0.5;
      }
      if (this.browserWidth >= 768 && this.browserWidth < 992) {
        this.carouselPadWidth = (this.clientWidth - 720) * 0.5;
      }
      if (this.browserWidth >= 992 && this.browserWidth < 1200) {
        this.carouselPadWidth = (this.clientWidth - 960) * 0.5;
      }
      if (this.browserWidth >= 1200 && this.browserWidth < 1400) {
        this.carouselPadWidth = (this.clientWidth - 1140) * 0.5;
      }
      if (this.browserWidth >= 1400) {
        this.carouselPadWidth = (this.clientWidth - 1320) * 0.5;
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.getBrowserWidth();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
      this.clientWidth = document.documentElement.clientWidth;
    },
    mouseDown(e) {
      this.isGrabbing = true;
      this.relativeStartX = e.pageX - this.$refs.carousel.offsetLeft;
      this.scrollLeftStartX = this.$refs.carousel.scrollLeft;
    },
    mouseUp() {
      this.isGrabbing = false;
    },
    mouseLeave() {
      this.isGrabbing = false;
    },
    mouseMove(e) {
      if (this.isGrabbing === false) {
        return;
      }
      const moveX = e.pageX - this.$refs.carousel.offsetLeft;
      const scrollMove = (moveX - this.relativeStartX) * this.dragSpeed;
      this.$refs.carousel.scrollLeft = this.scrollLeftStartX - scrollMove;
    },
    mouseWheel(e) {
      const step = e.deltaY * this.wheelSpeed;
      if (step > 0 && this.toEndEdge === false) {
        e.preventDefault();
        this.toStartEdge = false;
        this.scrollLeftBefore = this.$refs.carousel.scrollLeft;
        this.$refs.carousel.scrollLeft += step;
        this.scrollLeftAfter = this.$refs.carousel.scrollLeft;
        if (this.scrollLeftBefore === this.scrollLeftAfter) {
          this.toEndEdge = true;
        }
      }
      if (step < 0 && this.toStartEdge === false) {
        e.preventDefault();
        this.toEndEdge = false;
        this.scrollLeftBefore = this.$refs.carousel.scrollLeft;
        this.$refs.carousel.scrollLeft += step;
        this.scrollLeftAfter = this.$refs.carousel.scrollLeft;
        if (this.scrollLeftBefore === this.scrollLeftAfter) {
          this.toStartEdge = true;
        }
      }
    },
    resizeHandler() {
      this.getBrowserWidth();
    },
  },
};
</script>

<style lang="scss" scoped>
// gutter 和專案使用中的 BS5 設定一致
$carousel-gutter: 1rem;
$carousel-sm-gutter: 1.5rem; // 576px 以上

.bc-carousel {
  display: flex;
  overflow-x: auto;
  cursor: grab;
  scrollbar-width: none; // 隱藏 Firefox 的滾動條
  &.active {
    cursor: grabbing;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  &__container {
    max-width: 768px;
    padding-right: $carousel-gutter * 0.5;
    padding-left: $carousel-gutter * 0.5;
    @media (min-width: 576px) {
      max-width: 768px;
      padding-right: $carousel-sm-gutter * 0.5;
      padding-left: $carousel-sm-gutter * 0.5;
    }
    @media (min-width: 768px) {
      max-width: 720px;
      padding-right: $carousel-sm-gutter * 0.5;
      padding-left: $carousel-sm-gutter * 0.5;
    }
    @media (min-width: 992px) {
      max-width: 960px;
      padding-right: $carousel-sm-gutter * 0.5;
      padding-left: $carousel-sm-gutter * 0.5;
    }
    @media (min-width: 1200px) {
      max-width: 1140px;
      padding-right: $carousel-sm-gutter * 0.5;
      padding-left: $carousel-sm-gutter * 0.5;
    }
    @media (min-width: 1400px) {
      max-width: 1320px;
      padding-right: $carousel-sm-gutter * 0.5;
      padding-left: $carousel-sm-gutter * 0.5;
    }
    flex: 0 0 auto;
  }
  &__pad-start, &__pad-end {
    flex: 0 0 auto;
  }
}
</style>
