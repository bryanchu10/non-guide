<template>
  <div
    id="cartOffcanvas"
    ref="offcanvas"
    class="offcanvas offcanvas-end w-lv11"
    tabindex="-1"
    aria-labelledby="cartOffcanvasLabel"
  >
    <VueLoading
      :active="isLoading"
      :is-full-page="false"
    />
    <div class="offcanvas-header pt-3 pt-md-5 px-3 px-md-5 pb-0 mb-4">
      <h2
        id="cartOffcanvasLabel"
        class="offcanvas-title fw-bold"
      >
        購物車
        <small
          v-if="cartsData.length"
          class="fs-7 fs-md-6 align-top text-primary"
        >
          {{ cartsData.length }}
        </small>
      </h2>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div class="offcanvas-body pt-0 pb-3 pb-md-5 px-md-5">
      <div
        v-if="!cartsTotal"
        class="alert alert-warning"
        role="alert"
      >
        購物車目前沒有商品，前往
        <router-link
          href="#"
          class="alert-link"
          to="/products/list"
        >
          出版品
        </router-link>
        頁面吧！
      </div>
      <div class="mb-4">
        <div
          v-for="(item, index) in cartsData"
          :key="item.id"
          class="card mb-2 border-0"
        >
          <div class="row g-0">
            <div class="col-3">
              <img
                :src="item.product.imageUrl"
                :alt="item.product.title"
                class="h-lv1 h-md-lv2 rounded-start w-100 ojf-cover"
              >
            </div>
            <div class="col-9">
              <div
                class="card-body d-flex flex-column bg-tertiary h-100 p-2 p-md-3"
              >
                <div class="d-flex justify-content-between">
                  <h3 class="card-title fs-6 fw-bold">
                    {{ item.product.title }}
                  </h3>
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    :disabled="status.loadingItem === item.id"
                    @click="deleteItem(item.id)"
                  />
                </div>
                <div class="price mb-auto">
                  <span
                    v-if="item.coupon"
                    class="text-primary me-2"
                  >
                    NT${{ $filters.currency(item.product.price * item.coupon.percent * .01) }}
                  </span>
                  <span
                    class="me-2"
                    :class="{'text-decoration-line-through': item.coupon}"
                  >
                    NT${{ $filters.currency(item.product.price) }}
                  </span>
                  <span
                    v-if="item.product.origin_price !== item.product.price"
                    class="text-secondary text-decoration-line-through"
                  >
                    NT${{ $filters.currency(item.product.origin_price) }}
                  </span>
                </div>
                <div
                  class="d-flex"
                  :class="[status.loadingItem !== item.id ?
                    'justify-content-between': 'justify-content-center']"
                >
                  <div
                    v-if="status.loadingItem !== item.id"
                    class="input-group w-lv1"
                  >
                    <button
                      class="btn btn-tertiary py-0 px-1"
                      type="button"
                      @click="changeItemAmount(index, -1, item.id, item.product_id)"
                    >
                      <i class="bi bi-dash" />
                    </button>
                    <input
                      v-model.number="item.qty"
                      type="number"
                      class="form-control input-browser-style-none bg-tertiary text-center border-0
                        py-0"
                      aria-label="商品數量"
                      aria-describedby="輸入商品數量"
                      @change="itemAmountChanged(item.id, item.product_id, item.qty)"
                    >
                    <button
                      class="btn btn-tertiary py-0 px-1"
                      type="button"
                      @click="changeItemAmount(index, 1, item.id, item.product_id)"
                    >
                      <i class="bi bi-plus" />
                    </button>
                  </div>
                  <span
                    v-if="status.loadingItem !== item.id"
                    class="fw-bold"
                    :class="{'text-primary': item.coupon}"
                  >
                    NT${{ $filters.currency(item.final_total) }}
                  </span>
                  <div
                    v-else
                    class="spinner-border text-secondary"
                    role="status"
                  >
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
            <input
              v-model="couponCode"
              type="text"
              class="form-control"
              placeholder="我有優惠代碼"
              aria-label="我有優惠代碼"
              aria-describedby="basic-addon2"
              :disabled="status.loadingItem === 'addingCoupon' || !cartsData.length"
            >
            <button
              id="button-addon2"
              class="btn btn-outline-secondary fw-bold"
              type="button"
              :disabled="status.loadingItem === 'addingCoupon' || !cartsData.length"
              @click="addCoupon"
            >
              <span v-if="status.loadingItem !== 'addingCoupon'">套用優惠</span>
              <div
                v-else
                class="spinner-border spinner-border-sm text-secondary align-baseline"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
          <span
            v-if="couponMessage"
            class="d-block mt-n3 mb-3 ps-2 text-danger"
          >
            <i class="bi bi-exclamation-circle me-1" />
            {{ couponMessage }}
          </span>
          <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold fs-4">總計</span>
            <span class="fw-bold fs-4">NT${{ $filters.currency(cartsTotal) }}</span>
          </div>
          <div
            v-if="cartsTotal !== cartsFinalTotal"
            class="d-flex justify-content-between text-primary mb-4"
          >
            <span class="fw-bold fs-4">折扣價</span>
            <span class="fw-bold fs-4">NT${{ $filters.currency(cartsFinalTotal) }}</span>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-lg w-100"
            :disabled="!cartsData.length"
            @click="checkout"
          >
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
  inject: ['$emitter', '$filters', '$pushMessageState'],
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
          this.cartsData = res.data.data.carts;
          this.cartsTotal = res.data.data.total;
          this.cartsFinalTotal = res.data.data.final_total;
          this.status.loadingItem = '';
          this.isLoading = false;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得購物車資料');
          this.status.loadingItem = '';
          this.isLoading = false;
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
      if (changeInfo.qty < 1) {
        this.deleteItem(itemId);
        return;
      }
      if (changeInfo.qty > 99) {
        changeInfo.qty = 99;
      }
      this.status.loadingItem = itemId;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${itemId}`;
      this.$http.put(api, { data: changeInfo })
        .then(() => {
          this.getCart();
        })
        .catch((err) => {
          this.getCart();
          this.$pushMessageState(err.response, '更新購物車商品數量');
        });
    },
    deleteItem(itemId) {
      this.isLoading = true;
      this.status.loadingItem = 'itemId';
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${itemId}`;
      this.$http.delete(api)
        .then(() => {
          this.getCart();
        })
        .catch((err) => {
          this.getCart();
          this.$pushMessageState(err.response, '刪除購物車商品數量');
        });
    },
    addCoupon() {
      this.status.loadingItem = 'addingCoupon';
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/coupon`;
      const couponCode = {
        code: this.couponCode,
      };
      this.$http.post(api, { data: couponCode })
        .then((res) => {
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
          this.status.loadingItem = '';
        })
        .catch((err) => {
          this.couponMessage = '';
          this.getCart();
          this.$pushMessageState(err.response, '使用優惠券');
          this.status.loadingItem = '';
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
};
</script>
