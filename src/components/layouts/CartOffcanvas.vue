<template>
  <div class="offcanvas offcanvas-end w-lv11" tabindex="-1"
        id="offcanvasExample" aria-labelledby="offcanvasExampleLabel"
        ref="offcanvas">
    <VueLoading :active="isLoading" :is-full-page="false"/>
    <div class="offcanvas-header pt-3 pt-md-5 px-3 px-md-5 pb-0 mb-4">
      <h2 class="offcanvas-title fw-bold" id="offcanvasExampleLabel">
        購物車
        <small v-if="cartsData.length" class="fs-7 fs-md-6 align-top text-primary">
          {{ cartsData.length }}
        </small>
      </h2>
      <button type="button" class="btn-close"
              data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body pt-0 pb-3 pb-md-5 px-md-5">
      <div class="mb-4">
        <div v-for="(item, index) in cartsData" :key="item.id"
              class="card mb-2 border-0">
          <div class="row g-0">
            <div class="col-3">
              <img :src="item.product.imageUrl"
                    :alt="item.product.title"
                    class="h-lv1 h-md-lv2 rounded-start w-100 ojf-cover">
            </div>
            <div class="col-9">
              <div class="card-body p-2 p-md-3 bg-tertiary h-100
                          d-flex flex-column">
                <div class="d-flex justify-content-between">
                  <h3 class="card-title fs-6 fw-bold">{{ item.product.title }}</h3>
                  <button type="button" class="btn-close" aria-label="Close"
                          @click="deleteItem(item.id)"
                          :disabled="status.loadingItem === item.id">
                  </button>
                </div>
                <div class="price mb-auto">
                  <span v-if="item.coupon" class="text-primary me-2">
                    NT${{ $filters.currency(item.product.price * item.coupon.percent * .01) }}
                  </span>
                  <span class="me-2" :class="{'text-decoration-line-through': item.coupon}">
                    NT${{ $filters.currency(item.product.price) }}
                  </span>
                  <span v-if="item.product.origin_price !== item.product.price"
                        class="text-secondary text-decoration-line-through">
                    NT${{ $filters.currency(item.product.origin_price) }}
                  </span>
                </div>
                <div class="d-flex"
                    :class="[status.loadingItem !== item.id ?
                      'justify-content-between': 'justify-content-center']">
                  <div v-if="status.loadingItem !== item.id" class="input-group w-lv1">
                    <button class="btn btn-tertiary py-0 px-1" type="button" id="button-addon1"
                            @click="changeItemAmount(index, -1, item.id, item.product_id)">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="number"
                            class="form-control text-center bg-tertiary border-0 py-0
                                    input-browser-style-none"
                            aria-label="Example text with button addon"
                            aria-describedby="button-addon1"
                            v-model.number="item.qty"
                            @change="itemAmountChanged(item.id, item.product_id, item.qty)">
                    <button class="btn btn-tertiary py-0 px-1" type="button" id="button-addon2"
                            @click="changeItemAmount(index, 1, item.id, item.product_id)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <span v-if="status.loadingItem !== item.id" class="fw-bold"
                        :class="{'text-primary': item.coupon}">
                    NT${{ $filters.currency(item.final_total) }}
                  </span>
                  <div v-else class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 justify-content-end">
        <div class="col-md-9">
          <div class="input-group input-group-lg mb-4">
            <input type="text" class="form-control"
                    placeholder="我有優惠代碼"
                    aria-label="我有優惠代碼"
                    aria-describedby="basic-addon2"
                    v-model="couponCode"
                    :disabled="status.loadingItem === 'addingCoupon' || !cartsData.length">
            <button class="btn btn-outline-secondary fw-bold"
                    type="button" id="button-addon2"
                    @click="addCoupon"
                    :disabled="status.loadingItem === 'addingCoupon' || !cartsData.length">
              <span v-if="status.loadingItem !== 'addingCoupon'">套用優惠</span>
              <div v-else class="spinner-border spinner-border-sm
                          text-secondary align-baseline" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
          <span v-if="couponMessage"
                class="d-block mt-n3 mb-3 ps-2 text-danger">
            <i class="bi bi-exclamation-circle me-1"></i>
            {{ couponMessage }}
          </span>
          <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold fs-4">總計</span>
            <span class="fw-bold fs-4">NT${{ $filters.currency(cartsTotal) }}</span>
          </div>
          <div v-if="cartsTotal !== cartsFinalTotal"
                class="d-flex justify-content-between text-primary mb-4">
            <span class="fw-bold fs-4">折扣價</span>
            <span class="fw-bold fs-4">NT${{ $filters.currency(cartsFinalTotal) }}</span>
          </div>
          <button type="button" class="btn btn-primary btn-lg w-100"
                  :disabled="!cartsData.length"
                  @click="checkout">
            結帳
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Offcanvas from 'bootstrap/js/dist/offcanvas';

export default {
  inject: ['$emitter', '$filters'],
  data() {
    return {
      offcanvas: {},
      cartsData: [],
      cartsTotal: 0,
      cartsFinalTotal: 0,
      status: {
        loadingItem: '',
      },
      couponCode: '',
      couponMessage: '',
      isLoading: false,
    };
  },
  watch: {
    cartsData() {
      this.$emitter.emit('cartFilled', this.cartsData.length);
    },
    $route() {
      this.getCart();
    },
  },
  methods: {
    showOffcanvas() {
      this.offcanvas.show();
    },
    hideOffcanvas() {
      this.offcanvas.hide();
    },
    getCart() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.cartsData = JSON.parse(JSON.stringify(res.data.data.carts));
            this.cartsTotal = res.data.data.total;
            this.cartsFinalTotal = res.data.data.final_total;
            this.status.loadingItem = '';
            this.isLoading = false;
          }
        });
    },
    changeItemAmount(index, changeAmount, itemId, productId) {
      this.cartsData[index].qty += changeAmount;
      this.itemAmountChanged(itemId, productId, this.cartsData[index].qty);
    },
    itemAmountChanged(itemId, productId, productQty) {
      const changeInfo = {
        product_id: productId,
        qty: productQty,
      };
      changeInfo.qty = Math.floor(changeInfo.qty);
      if (changeInfo.qty < 0) {
        this.deleteItem(itemId);
        return;
      }
      if (changeInfo.qty > 99) {
        changeInfo.qty = 99;
      }
      this.status.loadingItem = itemId;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${itemId}`;
      this.$http.put(api, { data: changeInfo })
        .then((res) => {
          if (res.data.success) {
            this.getCart();
          }
        });
    },
    deleteItem(itemId) {
      this.isLoading = true;
      this.status.loadingItem = 'itemId';
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${itemId}`;
      this.$http.delete(api)
        .then((res) => {
          this.status.loadingItem = '';
          if (res.data.success) {
            this.getCart();
          }
        });
    },
    addCoupon() {
      // console.log('addCoupon');
      this.status.loadingItem = 'addingCoupon';
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/coupon`;
      const couponCode = {
        code: this.couponCode,
      };
      this.$http.post(api, { data: couponCode })
        .then((res) => {
          this.status.loadingItem = '';
          if (res.data.success) {
            this.couponMessage = '';
            this.getCart();
            return;
          }
          if (res.data.message === '找不到優惠券!') {
            this.couponMessage = '找不到優惠券';
          } else {
            this.couponMessage = res.data.message;
          }
        });
    },
    checkout() {
      this.hideOffcanvas();
      this.$router.push('/checkout/info');
    },
    hideOffcanvasHandler() {
      this.$emitter.emit('updateCart');
    },
    addCartHandler() {
      this.getCart();
    },
  },
  created() {
    this.getCart();
  },
  mounted() {
    this.offcanvas = new Offcanvas(this.$refs.offcanvas);
    this.$emitter.on('addCart', this.addCartHandler);
    this.$refs.offcanvas.addEventListener('hide.bs.offcanvas', this.hideOffcanvasHandler);
  },
  beforeUnmount() {
    this.hideOffcanvas();
    this.$emitter.off('addCart', this.addCartHandler);
    this.$refs.offcanvas.removeEventListener('hide.bs.offcanvas', this.hideOffcanvasHandler);
  },
};
</script>
