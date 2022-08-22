<template>
  <VueLoading :active="isLoading"/>
  <div class="container mt-6">
    <div class="text-end">
      <button class="btn btn-primary" type="button"
              @click="openModal(true)">增加一個品項</button>
    </div>
    <div class="table-responsive">
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="30" class="text-nowrap">#</th>
            <th width="60" class="text-nowrap">分類</th>
            <th widht="" class="text-nowrap">名稱</th>
            <th width="120" class="text-nowrap">售價</th>
            <th width="120" class="text-nowrap">原價</th>
            <th width="80" class="text-nowrap">狀態</th>
            <th width="120" class="text-nowrap">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id"
              class="align-middle">
            <td>{{ product.num }}</td>
            <td>{{ product.category }}</td>
            <td class="text-nowrap">{{ product.title }}</td>
            <td class="text-right">
              NT${{ $filters.currency(product.price) }}
            </td>
            <td class="text-right">
              NT${{ $filters.currency(product.origin_price) }}
            </td>
            <td>
              <span class="text-success" v-if="product.is_enabled">啟用</span>
              <span class="text-muted" v-else>未啟用</span>
            </td>
            <td class="text-nowrap">
              <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm"
                        @click="openModal(false, product)">編輯</button>
                <button class="btn btn-outline-danger btn-sm"
                        @click="openDelModal(product)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <ProductUpdateModal ref="productUpdateModal" :product="tempProduct" :isNew="isNew"
                      @update-product="updateProduct"/>
      <DelModal ref="delModal" :item="tempProduct" @del-item="delProduct"/>
    </div>
  </div>
  <PaginationComponent :pages="pagination" @emit-pages="getProducts"/>
</template>

<script>
import ProductUpdateModal from '@/components/modals/ProductUpdateModal.vue';
import DelModal from '@/components/modals/DelModal.vue';
import PaginationComponent from '@/components/layouts/PaginationComponent.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
    };
  },
  inject: ['$emitter', '$filters', 'pushMessageState'],
  components: {
    ProductUpdateModal,
    DelModal,
    PaginationComponent,
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.products = JSON.parse(JSON.stringify(res.data.products));
            this.pagination = { ...res.data.pagination };
          }
        });
    },
    openModal(isNew, product) {
      if (isNew) {
        this.tempProduct = {};
      } else {
        this.tempProduct = JSON.parse(JSON.stringify(product));
      }
      this.isNew = isNew;
      this.$refs.productUpdateModal.showModal();
    },
    updateProduct(product) {
      this.tempProduct = product;

      // 新增
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${product.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          this.$refs.productUpdateModal.hideModal();
          this.getProducts();
          this.pushMessageState(res, '更新');
        });
    },
    openDelModal(product) {
      this.tempProduct = JSON.parse(JSON.stringify(product));
      this.$refs.delModal.showModal();
    },
    delProduct(product) {
      this.tempProduct = product;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${product.id}`;
      this.$http.delete(api, { data: this.tempProduct })
        .then((res) => {
          this.$refs.delModal.hideModal();
          this.getProducts();
          this.pushMessageState(res, '刪除');
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
