<template>
  <VueLoading :active="isLoading"/>
  <div class="container mt-6">
    <div class="text-end">
      <button class="btn btn-primary" type="button"
              @click="openModal(true)">增加一篇文章</button>
    </div>
    <div class="table-responsive-lg">
      <table class="table mt-4" style="table-layout: fixed;">
        <thead>
          <tr>
            <th width="30" class="text-nowrap">#</th>
            <th width="180" class="text-nowrap">名稱</th>
            <th width="120" class="text-nowrap">作者</th>
            <th width="120" class="text-nowrap">時間</th>
            <th width="300" class="text-nowrap">概述</th>
            <th width="80" class="text-nowrap">狀態</th>
            <th width="120" class="text-nowrap">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id"
              class="align-middle">
            <td>{{ article.num }}</td>
            <td class="text-nowrap">{{ article.title }}</td>
            <td class="text-nowrap">{{ article.author }}</td>
            <td class="text-nowrap">
              {{ $dayjs.unix(article.create_at).tz('Asia/Taipei').format('YYYY-MM-DD') }}
            </td>
            <td class="text-truncate">{{ article.description }}</td>
            <td class="text-nowrap">
              <span class="text-success" v-if="article.isPublic">公開</span>
              <span class="text-muted" v-else>未公開</span>
            </td>
            <td class="text-nowrap">
              <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm"
                        @click="openModal(false, article)">編輯</button>
                <button class="btn btn-outline-danger btn-sm"
                        @click="openDelModal(article)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <PaginationComponent :pages="pagination" @emit-pages="getArticles"/>
  <ArticleUpdateModal ref="articleUpdateModal" :article="tempArticle" :isNew="isNew"
                      @update-article="updateArticle"/>
  <DelModal ref="delModal" :item="tempArticle" @del-item="delArticle"/>
</template>

<script>
import ArticleUpdateModal from '@/components/ArticleUpdateModal.vue';
import DelModal from '@/components/DelModal.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
  data() {
    return {
      articles: [],
      pagination: {},
      tempArticle: {},
      isNew: false,
      isLoading: false,
    };
  },
  inject: ['$emitter', '$filters', '$dayjs', 'pushMessageState'],
  components: {
    ArticleUpdateModal,
    DelModal,
    PaginationComponent,
  },
  computed: {

  },
  methods: {
    getArticles(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles?page=${page}`;
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.articles = JSON.parse(JSON.stringify(res.data.articles));
            this.pagination = { ...res.data.pagination };
          }
        });
    },
    openModal(isNew, article) {
      if (isNew) {
        this.tempArticle = {};
        this.tempArticle.create_at = Math.floor(new Date().getTime() / 1000);
        this.tempArticle.isPublic = false;
        this.$refs.articleUpdateModal.showModal();
      } else {
        const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${article.id}`;
        this.isLoading = true;
        this.$http.get(api)
          .then((res) => {
            this.isLoading = false;
            this.tempArticle = JSON.parse(JSON.stringify(article));
            this.tempArticle.content = res.data.article.content;
            this.$refs.articleUpdateModal.showModal();
          });
      }
      this.isNew = isNew;
    },
    updateArticle(article) {
      this.tempArticle = article;

      // 新增
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`;
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${article.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempArticle })
        .then((res) => {
          this.$refs.articleUpdateModal.hideModal();
          this.getArticles();
          this.pushMessageState(res, '更新');
        });
    },
    openDelModal(article) {
      this.tempArticle = JSON.parse(JSON.stringify(article));
      this.$refs.delModal.showModal();
    },
    delArticle(article) {
      this.tempArticle = article;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${article.id}`;
      this.$http.delete(api, { data: this.tempArticle })
        .then((res) => {
          this.$refs.delModal.hideModal();
          this.getArticles();
          this.pushMessageState(res, '刪除');
        });
    },
  },
  created() {
    this.getArticles();
  },
};
</script>
