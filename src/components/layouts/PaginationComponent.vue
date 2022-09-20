<template>
  <nav
    aria-label="Page navigation"
    class="mb-4"
  >
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        :class="{ 'disabled': !pages.has_pre }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          :tabindex="pages.has_pre ? 0 : -1"
          @click.prevent="updatePage(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        v-for="page in pages.total_pages"
        :key="page"
        class="page-item"
        :class="{ 'active': page===pages.current_page}"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="updatePage(page)"
        >{{ page }}</a>
      </li>
      <li
        class="page-item"
        :class="{ 'disabled': !pages.has_next }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          :tabindex="pages.has_next ? 0 : -1"
          @click.prevent="updatePage(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pages: {
      type: Object,
      default() {
        return {};
      },
    },
    tabindex: {
      type: Number,
      default: 1,
    },
  },
  emits: ['emit-pages'],
  methods: {
    updatePage(page) {
      this.$emit('emit-pages', page);
    },
  },
};
</script>
