<template>
  <div class="modal fade" id="exampleModal"
        tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5 class="modal-title" id="exampleModalLabel">
            <span class="fw-bold">{{ isNew ? '新增' : '編輯'}}出版品</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-4 position-relative">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" id="image"
                        placeholder="請輸入圖片連結" v-model.lazy="tempProduct.imageUrl"/>
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                </label>
                <input type="file" id="customFile"
                        class="form-control" ref="fileInput"
                        @change="uploadFile"/>
              </div>
              <img v-if="tempProduct.imageUrl" class="w-100 h-lv6 ojf-cover"
                    :src="tempProduct.imageUrl" :alt="tempProduct.title">
              <VueLoading :active="isLoading" :is-full-page="false"/>
            </div>
            <div class="col-lg-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempProduct.title"/>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input type="text" class="form-control" id="category"
                          placeholder="請輸入分類" v-model="tempProduct.category"/>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input type="text" class="form-control" id="unit"
                          placeholder="請輸入單位" v-model="tempProduct.unit"/>
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input type="number" class="form-control" id="origin_price"
                          placeholder="請輸入原價" v-model="tempProduct.origin_price"/>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input type="number" class="form-control" id="price"
                          placeholder="請輸入售價" v-model="tempProduct.price"/>
                </div>
              </div>
              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description"
                          placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content"
                          placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                          :true-value="1"
                          :false-value="0"
                          id="is_enabled"
                          v-model="tempProduct.is_enabled"/>
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary"
                  data-bs-dismiss="modal">取消
          </button>
          <button type="button" class="btn btn-primary"
                  @click="$emit('update-product', tempProduct)">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
    isNew: {
      type: Boolean,
      defautl: false,
    },
  },
  watch: {
    product() {
      this.tempProduct = JSON.parse(JSON.stringify(this.product));
    },
  },
  data() {
    return {
      tempProduct: {},
      isLoading: false,
    };
  },
  methods: {
    uploadFile() {
      this.isLoading = true;
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload`;
      this.$http.post(url, formData)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.tempProduct.imageUrl = res.data.imageUrl;
          }
        });
    },
  },
  mixins: [modalMixin],
};
</script>