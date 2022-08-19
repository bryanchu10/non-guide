<template>
  <VueLoading :active="isLoading"/>
  <div class="container mt-6">
    <div class="table-responsive">
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="30" class="text-nowrap">#</th>
            <th widht="100" class="text-nowrap">收件人</th>
            <th width="240" class="text-nowrap">訂單編號</th>
            <th width="" class="text-nowrap">內容</th>
            <th width="120" class="text-nowrap">總金額</th>
            <th width="120" class="text-nowrap">成立時間</th>
            <th width="80" class="text-nowrap">狀態</th>
            <th width="120" class="text-nowrap">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id"
              class="">
            <td>{{ order.num }}</td>
            <td class="text-nowrap">{{ order.user.name }}</td>
            <td class="text-nowrap">{{ order.id }}</td>
            <td class="text-nowrap">
              <ul class="list-unstyled mb-0"
                  v-for="(product, key) in order.products"
                  :key="key">
                <li>
                  {{ product.product.title }} x{{ product.qty }}
                </li>
              </ul>
            </td>
            <td class="text-right">
              NT${{ $filters.currency(order.total) }}
            </td>
            <td class="text-right text-nowrap">
              <ul class="list-unstyled mb-0">
                <li>{{ $dayjs.unix(order.create_at).tz('Asia/Taipei').format('YYYY-MM-DD') }}</li>
                <li>{{ $dayjs.unix(order.create_at).tz('Asia/Taipei').format('HH:mm:ss') }}</li>
              </ul>
            </td>
            <td>
              <span class="text-success" v-if="order.is_paid">已付款</span>
              <span class="text-danger" v-else>未付款</span>
            </td>
            <td class="text-nowrap">
              <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm"
                        @click="openModal(order)">編輯</button>
                <button class="btn btn-outline-danger btn-sm"
                        @click="openDelModal(order)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <OrderUpdateModal ref="orderUpdateModal" :order="tempOrder"
                      @update-order="updateOrder"/>
      <DelModal ref="delModal" :item="tempOrder" @del-item="delOrder"/>
    </div>
  </div>
  <PaginationComponent :pages="pagination" @emit-pages="getOrders"/>
</template>

<script>
import OrderUpdateModal from '@/components/OrderUpdateModal.vue';
import DelModal from '@/components/DelModal.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
  data() {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      isLoading: false,
    };
  },
  inject: ['$emitter', '$filters', 'pushMessageState', '$dayjs'],
  components: {
    OrderUpdateModal,
    DelModal,
    PaginationComponent,
  },
  // computed: {
  //   orderProducts(products) {
  //     return Object.values(products);
  //   },
  // },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.orders = JSON.parse(JSON.stringify(res.data.orders));
            this.pagination = { ...res.data.pagination };
          }
        });
    },
    openModal(order) {
      this.tempOrder = JSON.parse(JSON.stringify(order));
      this.$refs.orderUpdateModal.showModal();
    },
    updateOrder(order) {
      this.tempOrder = JSON.parse(JSON.stringify(order));
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${order.id}`;
      this.$http.put(api, { data: this.tempOrder })
        .then((res) => {
          this.$refs.orderUpdateModal.hideModal();
          this.getOrders();
          this.pushMessageState(res, '更新');
        });
    },
    openDelModal(order) {
      this.tempOrder = JSON.parse(JSON.stringify(order));
      this.$refs.delModal.showModal();
    },
    delOrder(order) {
      this.tempOrder = JSON.parse(JSON.stringify(order));
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${order.id}`;
      this.$http.delete(api, { data: this.tempOrder })
        .then((res) => {
          this.$refs.delModal.hideModal();
          this.getOrders();
          this.pushMessageState(res, '刪除');
        });
    },
  },
  created() {
    this.getOrders();
    // 測試開始
    // // 後端時間格式（秒）
    // const UnixTimestamp = Math.floor(new Date().getTime() / 1000);
    // console.log('後端時間格式', UnixTimestamp);
    // // iso 未轉換格式
    // console.log('iso 未轉換格式', this.$dayjs.unix(UnixTimestamp).format());
    // // iso 日期
    // const isoDate = this.$dayjs.unix(UnixTimestamp).tz('Asia/Taipei').format('YYYY-MM-DD');
    // console.log('iso 日期', isoDate);
    // // iso 時間
    // const isoTime = this.$dayjs.unix(UnixTimestamp).tz('Asia/Taipei').format('HH:mm:ss');
    // console.log('iso 時間', isoTime);
    // // 重組回+8時區標iso時間
    // const combineIsoTime = `${isoDate}T${isoTime}+08:00`;
    // console.log('重組時間', combineIsoTime);
    // // 轉回後端 Unix 格式（秒）
    // const backUnixTimestamp = this.$dayjs(combineIsoTime).unix();
    // console.log('轉回後端 Unix 格式（秒）', backUnixTimestamp);
    // 測試結束
  },
};
</script>

<style lang="scss" scoped>
img {
  height: 200px;
}
</style>
