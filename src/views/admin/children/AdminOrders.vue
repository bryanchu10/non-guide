<template>
  <VueLoading :active="isLoading" />
  <div class="container mt-6">
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
              width="100"
              class="text-nowrap"
            >
              收件人
            </th>
            <th
              width="240"
              class="text-nowrap"
            >
              訂單編號
            </th>
            <th
              width=""
              class="text-nowrap"
            >
              內容
            </th>
            <th
              width="120"
              class="text-nowrap"
            >
              總金額
            </th>
            <th
              width="120"
              class="text-nowrap"
            >
              成立時間
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
            v-for="order in orders"
            :key="order.id"
          >
            <td>{{ order.num }}</td>
            <td class="text-nowrap">
              {{ order.user.name }}
            </td>
            <td class="text-nowrap">
              {{ order.id }}
            </td>
            <td class="text-nowrap">
              <ul
                v-for="(product, key) in order.products"
                :key="key"
                class="list-unstyled mb-0"
              >
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
            <td class="text-nowrap">
              <span
                v-if="order.is_paid"
                class="text-success"
              >已付款</span>
              <span
                v-else
                class="text-danger"
              >未付款</span>
            </td>
            <td class="text-nowrap">
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="openModal(order)"
                >
                  編輯
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelModal(order)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <OrderUpdateModal
        ref="orderUpdateModal"
        :order="tempOrder"
        @update-order="updateOrder"
      />
      <DelModal
        ref="delModal"
        :item="tempOrder"
        @del-item="delOrder"
      />
    </div>
  </div>
  <PaginationComponent
    :pages="pagination"
    @emit-pages="getOrders"
  />
</template>

<script>
import OrderUpdateModal from '@/components/modals/OrderUpdateModal.vue';
import DelModal from '@/components/modals/DelModal.vue';
import PaginationComponent from '@/components/layouts/PaginationComponent.vue';

export default {
  components: {
    OrderUpdateModal,
    DelModal,
    PaginationComponent,
  },
  inject: ['$emitter', '$filters', '$pushMessageState', '$dayjs'],
  data() {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      isLoading: false,
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得訂單列表');
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
          this.pushMessageState(res, '訂單更新');
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '更新單一訂單');
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
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '刪除單一訂單');
        });
    },
  },
};
</script>
