<template>
  <ArticleSection :parent-articles-data="parentArticlesData" />
  <section class="container mb-5 mb-md-6">
    <h3 class="fs-2 fw-bold mb-4">
      接著閱讀……
    </h3>
    <a
      v-for="article in otherArticles"
      :key="article.id"
      href="#"
      class="card mb-3 mb-md-4 border-0 shadow-s text-decoration-none hover-scale"
      @click.prevent="goArticle(article.id)"
    >
      <div class="row g-0">
        <div class="col-md-6">
          <img
            :src="article.image"
            class="rounded-start w-100 ojf-cover h-lv4"
            alt="article.title"
          >
        </div>
        <div class="col-md-6">
          <div class="row justify-content-center align-items-center h-100">
            <div class="col-md-8">
              <div class="p-3 p-md-0">
                <h5 class="card-title link-dark fw-bold mb-3">{{ article.title }}</h5>
                <p class="card-text link-secondary text-prewrap">{{ article.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  </section>
</template>

<script>
import ArticleSection from '@/components/layouts/ArticleSection.vue';

export default {
  components: {
    ArticleSection,
  },
  props: {
    parentArticlesData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      otherArticlesNum: 2, // 調整其它文章的顯示數量
      otherArticles: [],
    };
  },
  created() {
    this.getOtherArticles();
  },
  methods: {
    getOtherArticles() {
      this.otherArticles = this.parentArticlesData.slice(1, 1 + this.otherArticlesNum);
    },
    goArticle(id) {
      this.$router.push(`/about/${id}`);
    },
  },
};
</script>
