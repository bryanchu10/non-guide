<template>
  <ArticleSection :parent-articles-data="parentArticlesData" />
  <div class="container mb-4 mb-md-6">
    <div class="row justify-content-center">
      <div class="col-10 col-md-8 d-flex">
        <a
          v-if="previousArticleId"
          href="#"
          aria-label="previous"
          @click.prevent="$router.push(`/about/${previousArticleId}`)"
        >
          <i class="bi bi-arrow-left-circle-fill fs-2 opacity-75" />
        </a>
        <a
          v-if="nextArticleId"
          href="#"
          aria-label="next"
          class="ms-auto"
          @click.prevent="$router.push(`/about/${nextArticleId}`)"
        >
          <i class="bi bi-arrow-right-circle-fill fs-2 opacity-75" />
        </a>
      </div>
    </div>
  </div>
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
      previousArticleId: '',
      nextArticleId: '',
    };
  },
  created() {
    this.getNeighborArticleId();
  },
  methods: {
    getNeighborArticleId() {
      const articlesArr = [...this.parentArticlesData];
      const articleIdsArr = [];
      articlesArr.forEach((article) => {
        articleIdsArr.push(article.id);
      });
      const currIndex = articleIdsArr.findIndex((id) => id === this.$route.params.articleId);
      this.previousArticleId = articleIdsArr[currIndex - 1];
      this.nextArticleId = articleIdsArr[currIndex + 1];
    },
  },
};
</script>
