<template>
  <VueLoading :active="isLoading" />
  <div class="container mt-6">
    <div class="text-end">
      <button
        class="btn btn-primary"
        type="button"
        @click="openModal(true)"
      >
        增加一組優惠代碼
      </button>
    </div>
    <div class="table-responsive">
      <table class="table mt-4">
        <thead>
          <tr>
            <th
              width="30"
              class="text-nowrap"
            >
              #
            </th>
            <th
              width=""
              class="text-nowrap"
            >
              名稱
            </th>
            <th
              width=""
              class="text-nowrap"
            >
              優惠代碼
            </th>
            <th
              width=""
              class="text-nowrap"
            >
              折扣
            </th>
            <th
              width=""
              class="text-nowrap"
            >
              到期時間
            </th>
            <th
              width="80"
              class="text-nowrap"
            >
              狀態
            </th>
            <th
              width="120"
              class="text-nowrap"
            >
              編輯
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="coupon in coupons"
            :key="coupon.id"
            class="align-middle"
          >
            <td>{{ coupon.num }}</td>
            <td class="text-nowrap">
              {{ coupon.title }}
            </td>
            <td class="text-nowrap">
              {{ coupon.code }}
            </td>
            <td class="text-right">
              {{ coupon.percent }}%
            </td>
            <td class="text-right text-nowrap">
              <ul class="list-unstyled mb-0">
                <li>{{ $dayjs.unix(coupon.due_date).tz('Asia/Taipei').format('YYYY-MM-DD') }}</li>
                <li>{{ $dayjs.unix(coupon.due_date).tz('Asia/Taipei').format('HH:mm:ss') }}</li>
              </ul>
            </td>
            <td class="text-nowrap">
              <span
                v-if="coupon.is_enabled"
                class="text-success"
              >啟用</span>
              <span
                v-else
                class="text-muted"
              >未啟用</span>
            </td>
            <td class="text-nowrap">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="openModal(false, coupon)"
                >
                  編輯
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelModal(coupon)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <CouponUpdateModal
        ref="couponUpdateModal"
        :coupon="tempCoupon"
        :is-new="isNew"
        @update-coupon="updateCoupon"
      />
      <DelModal
        ref="delModal"
        :item="tempCoupon"
        @del-item="delCoupon"
      />
    </div>
  </div>
  <PaginationComponent
    :pages="pagination"
    @emit-pages="getCoupons"
  />
</template>

<script>
import CouponUpdateModal from '@/components/modals/CouponUpdateModal.vue';
import DelModal from '@/components/modals/DelModal.vue';
import PaginationComponent from '@/components/layouts/PaginationComponent.vue';

export default {
  components: {
    CouponUpdateModal,
    DelModal,
    PaginationComponent,
  },
  inject: ['$emitter', '$dayjs', '$pushMessageState'],
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      isNew: false,
      isLoading: false,
      pageTheme: '優惠券',
    };
  },
  created() {
    this.getCoupons();
  },
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得優惠券列表');
        });
    },
    openModal(isNew, coupon) {
      if (isNew) {
        this.tempCoupon = {};
        this.tempCoupon.is_enabled = 0;
      } else {
        this.tempCoupon = JSON.parse(JSON.stringify(coupon));
      }
      this.isNew = isNew;
      this.$refs.couponUpdateModal.showModal();
    },
    updateCoupon(coupon) {
      this.tempCoupon = coupon;

      // 新增
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempCoupon })
        .then((res) => {
          this.$refs.couponUpdateModal.hideModal();
          this.getCoupons();
          const title = this.isNew ? `${this.pageTheme}新增` : `${this.pageTheme}更新`;
          this.$pushMessageState(res, title);
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '更新單一優惠券');
        });
    },
    openDelModal(coupon) {
      this.tempCoupon = JSON.parse(JSON.stringify(coupon));
      this.$refs.delModal.showModal();
    },
    delCoupon(coupon) {
      this.tempCoupon = coupon;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
      this.$http.delete(api, { data: this.tempCoupon })
        .then((res) => {
          this.$refs.delModal.hideModal();
          this.getCoupons();
          this.$pushMessageState(res, '刪除');
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '刪除單一商品');
        });
    },
  },
};
</script>
