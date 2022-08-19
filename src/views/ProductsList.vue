<template>
  <nav class="navbar bg-light mt-6">
    <div class="container">
      <ul class="navbar-nav flex-row justify-content-between justify-content-md-start w-100">
        <li class="nav-item me-md-5" v-for="(area, index) in areas" :key="index">
          <a class="nav-link"
              :class="[areaSelected === area.name ? 'active fw-bold': 'link-secondary']"
              href="#" @click.prevent="areaSelected = area.name">
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
    <div class="row gx-3 gx-md-4 align-items-md-start">
      <template v-if="device === 'mobile'">
        <div v-for="product in this.filterProducts" :key="product.id"
              class="col-6">
          <a href="#" class="d-block text-decoration-none position-relative mb-4"
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
      </template>
        <div v-for="(col, index) in dynaCol" :key="index" :ref="setColRef"
              class="col-3">
      <template v-if="device === 'PC'">
          <a href="#" v-for="product in dynaCol[index]" :key="product.id"
              class="d-block text-decoration-none position-relative mb-5"
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
      </template>
        </div>
    </div>
  </section>
</template>
<script>
export default {
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
      products: [],
      dynaCol: [[], [], [], []],
      colRefs: [],
      browserWidth: 0,
      device: '',
      mobileImgHeight: 0,
      areaSelected: '全部',
      areas: [
        {
          name: '全部',
          amount: 0,
        },
        {
          name: '北部',
          amount: 0,
        },
        {
          name: '中部',
          amount: 0,
        },
        {
          name: '南部',
          amount: 0,
        },
        {
          name: '東部',
          amount: 0,
        },
        {
          name: '離島',
          amount: 0,
        },
      ],
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
  methods: {
    getProducts() {
    //   // const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
    //   // this.$http.get(api)
    //   //   .then((res) => {
    //   //     if (res.data.success) {
      const productsArr = JSON.parse(JSON.stringify(this.parentProductsData));
      const productsPromote = productsArr
        .filter((item) => item.price !== item.origin_price);
      productsPromote
        .push(...productsArr.filter((item) => item.price === item.origin_price));
      this.products = productsPromote;
    //   //     }
    //   //   });
    },
    pushProducts(arg) {
      if (this.device === 'PC') {
        const index = arg || 0;
        const putIndex = this.selectCol();
        if (this.filterProducts.length > index) {
          this.dynaCol[putIndex].push(this.filterProducts[index]);
          this.$nextTick(() => {
            this.pushProducts(index + 1);
          });
        }
      }
    },
    selectCol() {
      const height0 = this.colRefs[0].offsetHeight;
      const height1 = this.colRefs[1].offsetHeight;
      const height2 = this.colRefs[2].offsetHeight;
      const height3 = this.colRefs[3].offsetHeight;
      switch (Math.min(height0, height1, height2, height3)) {
        case height0:
          return 0;
        case height1:
          return 1;
        case height2:
          return 2;
        case height3:
          return 3;
        default:
          return -1;
      }
    },
    setColRef(el) {
      if (el) {
        this.colRefs.push(el);
      }
    },
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
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
        }
      });
    },
    goProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    areaFromNavbarHandler(area) {
      this.areaSelected = area;
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
    device() {
      if (this.device === 'mobile') {
        this.dynaCol = [[], [], [], []];
        this.pushProducts();
      }
      if (this.device === 'PC') {
        this.dynaCol = [[], [], [], []];
        this.pushProducts();
      }
    },
    areaSelected(area) {
      this.dynaCol = [[], [], [], []];
      this.pushProducts();
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
    this.countAreaAmount();
  },
  mounted() {
    window.onresize = () => {
      this.getBrowserWidth();
    };
    this.getBrowserWidth();
    this.$emitter.on('areaFromNavbar', this.areaFromNavbarHandler);
  },
  beforeUpdate() {
    this.colRefs = [];
  },
  beforeUnmount() {
    this.$emitter.off('areaFromNavbar', this.areaFromNavbarHandler);
  },
  unmounted() {
    window.onresize = null;
  },
};
</script>
<style lang="scss" scoped>
.row {
  a {
    transition: transform 0.5s;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
