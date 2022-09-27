<template>
  <!-- mobile -->
  <div
    id="accordionExample"
    class="accordion d-lg-none"
  >
    <div class="accordion-item bg-tertiary border-0">
      <h2
        id="headingOne"
        class="accordion-header"
      >
        <button
          class="accordion-button bg-transparent px-3 collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="false"
          aria-controls="collapseOne"
        >
          <span class="fw-bold text-dark">訂單摘要</span>
          <span class="fw-bold ms-auto">
            NT${{ $filters.currency(parentOrderSummaryTotal) }}
          </span>
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <table class="table mb-0">
            <tbody
              v-for="(item, index) in parentOrderSummaryData"
              :key="item.id"
            >
              <tr>
                <td
                  class="pt-0 px-0 border-bottom-0"
                  :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
                >
                  <img
                    :src="item.product.imageUrl"
                    :alt="item.product.title"
                    class="w-100 ojf-cover"
                  >
                </td>
                <td
                  class="fw-bold align-middle border-bottom-0
                            pt-0 ps-3"
                  :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
                >
                  {{ item.product.title }} x{{ item.qty }}
                </td>
                <td
                  class="fw-bold text-end align-middle border-bottom-0
                            pt-0 pe-0"
                  :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
                >
                  NT${{ $filters.currency(item.final_total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  class="fs-4 fw-bold pt-3 pb-0 px-0 border-top border-secondary border-bottom-0"
                >
                  總計
                </td>
                <td
                  colspan="2"
                  class="fs-4 fw-bold pt-3 pb-0 px-0 text-end border-top border-secondary
                    border-bottom-0"
                >
                  NT${{ $filters.currency(parentOrderSummaryTotal) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- PC -->
  <div class="d-none d-lg-block bg-tertiary py-4 px-3">
    <table class="table my-2">
      <tbody
        v-for="(item, index) in parentOrderSummaryData"
        :key="item.id"
      >
        <tr>
          <td
            class="pt-0 px-0 border-bottom-0"
            :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
          >
            <img
              :src="item.product.imageUrl"
              :alt="item.product.title"
              class="w-100 ojf-cover"
            >
          </td>
          <td
            class="fw-bold align-middle border-bottom-0 pt-0 ps-3"
            :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
          >
            {{ item.product.title }} x{{ item.qty }}
          </td>
          <td
            class="fw-bold text-end align-middle border-bottom-0 pt-0 pe-0"
            :class="[index === parentOrderSummaryData.length - 1 ? 'pb-3' : 'pb-2']"
          >
            NT${{ $filters.currency(item.final_total) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td
            class="fs-4 fw-bold pt-3 pb-0 px-0 border-top border-secondary border-bottom-0"
          >
            總計
          </td>
          <td
            colspan="2"
            class="fs-4 fw-bold pt-3 pb-0 px-0 text-end border-top border-secondary border-bottom-0"
          >
            NT${{ $filters.currency(parentOrderSummaryTotal) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  inject: ['$filters'],
  props: {
    parentOrderSummaryData: {
      type: Array,
      default() {
        return [];
      },
    },
    parentOrderSummaryTotal: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion-button {
  &::after {
    margin-left: 1rem;
  }
  span {
    &:last-child {
      visibility: hidden;
    }
  }
  &.collapsed {
    span {
      &:last-child {
        visibility: visible;
      }
    }
  }
}
.table {
  tbody {
    td {
      &:first-child {
        width: 3rem;
      }
    }
  }
  img {
    height: 3rem;
  }
}
</style>
