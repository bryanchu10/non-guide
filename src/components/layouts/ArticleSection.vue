<template>
  <section class="container mt-6 mb-4 mb-md-6">
    <div
      class="row position-relative mb-md-n6 "
      :style="{ 'margin-bottom': `${infoCardHeight - 48}px` }"
    >
      <div
        class="col d-md-none h-lv8 bgsz-cover bgp-center"
        :style="{ 'background-image':
          `url(${mainArticle.image ? mainArticle.image : ''})` }"
      />
      <div class="d-none d-md-block col-md-7 offset-md-1">
        <img
          class="h-lv10 w-100 ojf-cover rounded-1"
          :src="mainArticle.image"
          :alt="mainArticle.title"
        >
      </div>
      <div class="col-md-5 position-absolute top-90 top-md-20 end-md-0">
        <div
          ref="infoCard"
          class="p-3 py-md-4 ps-md-4 pe-md-0 bg-white rounded-1"
        >
          <div class="row">
            <div class="col-xl-10">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <router-link
                      to="/"
                      class="text-decoration-none link-secondary"
                    >
                      首頁
                    </router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <a
                      href="#"
                      class="text-decoration-none link-secondary"
                      @click.prevent="$router.push('/about/overview')"
                    >
                      關於
                    </a>
                  </li>
                  <li
                    class="breadcrumb-item"
                    aria-current="page"
                  >
                    <span class="text-secondary">
                      {{ mainArticle.title }}
                    </span>
                  </li>
                </ol>
              </nav>
              <h2 class="fs-2 fs-md-1 fw-bold lh-base mb-4">
                {{ mainArticle.title }}
              </h2>
              <p class="text-secondary text-prewrap mb-0">
                {{ mainArticle.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8 zindex-1">
        <p class="text-prewrap bg-white-80 p-4 mb-0 shadow-none shadow-md rounded-1">
          {{ mainArticle.content }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  inject: ['$pushMessageState'],
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
      mainArticle: {},
      browserWidth: 0,
      infoCardHeight: 0,
    };
  },
  watch: {
    browserWidth() {
      if (this.browserWidth < 768) {
        this.infoCardHeight = this.$refs.infoCard.offsetHeight;
      }
    },
  },
  created() {
    this.getMainArticle();
  },
  mounted() {
    window.onresize = () => {
      this.getBrowserWidth();
    };
    this.getBrowserWidth();
  },
  updated() {
    this.infoCardHeight = this.$refs.infoCard.offsetHeight;
  },
  unmounted() {
    window.onresize = null;
  },
  methods: {
    getMainArticle() {
      let { articleId } = this.$route.params;
      if (this.$route.name === 'overview') {
        articleId = this.parentArticlesData[0].id;
      }
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/article/${articleId}`;
      this.$http.get(api)
        .then((res) => {
          if (res.data.success) {
            this.mainArticle = res.data.article;
          } else {
            this.$pushMessageState(res, '取得單一文章');
          }
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '取得單一文章');
        });
    },
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
    },
    goArticle(id) {
      this.$router.push(`/about/${id}`);
    },
  },
};
</script>
