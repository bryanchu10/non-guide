<template>
  <div class="modal fade" id="exampleModal"
        tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white fw-bold">
          <h5 class="modal-title" id="exampleModalLabel">
            <span class="fw-bold">{{ isNew ? '新增' : '編輯'}}文章</span>
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
                        placeholder="請輸入圖片連結" v-model.lazy="tempArticle.image"/>
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                </label>
                <input type="file" id="customFile"
                        class="form-control" ref="fileInput"
                        @change="uploadFile"/>
              </div>
              <img v-if="tempArticle.image" class="w-100 h-lv6 ojf-cover"
                    :src="tempArticle.image" :alt="tempArticle.title">
              <VueLoading :active="isLoading" :is-full-page="false"/>
            </div>
            <div class="col-lg-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempArticle.title"/>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="author" class="form-label">作者</label>
                  <input type="text" class="form-control" id="author"
                          placeholder="請輸入分類" v-model="tempArticle.author"/>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="create_at" class="form-label">日期</label>
                  <input type="date" class="form-control" id="create_at"
                          placeholder="" v-model="isoCreate_at"/>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">概述</label>
                <textarea type="text" class="form-control" id="description"
                          placeholder="請輸入概述" v-model="tempArticle.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">內容</label>
                <textarea type="text" class="form-control" id="content"
                          placeholder="請輸入內容" v-model="tempArticle.content"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                          id="isPublic"
                          :true-value="true"
                          :false-value="false"
                          v-model="tempArticle.isPublic"/>
                  <label class="form-check-label" for="isPublic">
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
                  @click="$emit('update-article', tempArticle)">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  inject: ['$dayjs'],
  props: {
    article: {
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
  data() {
    return {
      tempArticle: {},
      isLoading: false,
      isoCreate_at: '',
    };
  },
  watch: {
    article() {
      this.tempArticle = JSON.parse(JSON.stringify(this.article));
      this.isoCreate_at = this.$dayjs.unix(this.tempArticle.create_at).tz('Asia/Taipei').format('YYYY-MM-DD');
    },
    isoCreate_at() {
      this.tempArticle.create_at = this.$dayjs(this.isoCreate_at).tz('Asia/Taipei').unix();
    },
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
            this.tempArticle.image = res.data.imageUrl;
          }
        });
    },
  },
  mixins: [modalMixin],
};
</script>
