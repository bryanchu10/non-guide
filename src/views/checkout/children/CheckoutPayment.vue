<template>
  <VueLoading
    :active="isLoading"
    :is-full-page="false"
  />
  <h3 class="fs-5">
    資訊
  </h3>
  <div
    id="accordionAddress"
    class="accordion mb-4"
  >
    <div class="accordion-item">
      <h4
        id="headingContact"
        class="accordion-header"
      >
        <button
          class="accordion-button text-dark bg-transparent collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseContact"
          aria-expanded="true"
          aria-controls="collapseContact"
        >
          <span class="text-nowrap">聯絡</span>
          <span class="d-flex overflow-hidden mx-4">
            <span class="text-truncate order-1 order-lg-3">
              {{ parentReceiverInfo.email }}
            </span>
            <span class="d-none d-lg-inline order-2 mx-1">/</span>
            <span class="d-none d-lg-inline info__contact__name text-nowrap order-3 order-lg-1">
              {{ parentReceiverInfo.name }}
            </span>
            <span class="d-none d-lg-inline order-4 mx-1">/</span>
            <span class="d-none d-lg-inline info__contact__tel order-5">
              {{ parentReceiverInfo.tel }}
            </span>
          </span>
        </button>
      </h4>
      <div
        id="collapseContact"
        class="accordion-collapse collapse"
        aria-labelledby="headingContact"
      >
        <div class="accordion-body text-secondary">
          <p class="mb-0">
            {{ parentReceiverInfo.name }}
          </p>
          <p class="mb-0">
            {{ parentReceiverInfo.email }}
          </p>
          <p class="mb-0">
            {{ parentReceiverInfo.tel }}
          </p>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h4
        id="headingSend"
        class="accordion-header"
      >
        <button
          class="accordion-button text-dark bg-transparent collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseSend"
          aria-expanded="false"
          aria-controls="collapseSend"
        >
          <span class="text-nowrap">寄送</span>
          <span class="text-truncate mx-4">
            {{ parentReceiverInfo.address }}
          </span>
        </button>
      </h4>
      <div
        id="collapseSend"
        class="accordion-collapse collapse"
        aria-labelledby="headingSend"
      >
        <div class="accordion-body">
          <p class="mb-0">
            {{ separateAddress.county }}
          </p>
          <p class="mb-0">
            {{ separateAddress.countyElse }}
          </p>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h4
        id="headingNote"
        class="accordion-header"
      >
        <button
          class="accordion-button text-dark bg-transparent collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseNote"
          aria-expanded="false"
          aria-controls="collapseNote"
        >
          <span class="text-nowrap">備註</span>
          <span class="text-truncate mx-4">
            {{ parentReceiverMessage }}
          </span>
        </button>
      </h4>
      <div
        id="collapseNote"
        class="accordion-collapse collapse"
        aria-labelledby="headingNote"
      >
        <div class="accordion-body">
          {{ parentReceiverMessage }}
        </div>
      </div>
    </div>
  </div>
  <div class="row gx-2 mb-4">
    <div class="ms-md-auto col-md-6">
      <button
        type="button"
        class="btn btn-primary btn-lg w-100"
        @click="payOrder"
      >
        付款
      </button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$pushMessageState'],
  props: {
    parentReceiverInfo: {
      type: Object,
      default() {
        return {
          address: '',
        };
      },
    },
    parentReceiverMessage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      separateAddress: {
        county: '',
        countyElse: '',
      },
      isLoading: false,
    };
  },
  watch: {
    parentReceiverInfo() {
      this.divideAddress();
    },
  },
  methods: {
    divideAddress() {
      this.separateAddress.county = this.parentReceiverInfo.address.slice(0, 3);
      this.separateAddress.countyElse = this.parentReceiverInfo.address.slice(3);
    },
    payOrder() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/pay/${this.$route.params.orderId}`;
      this.$http.post(api)
        .then(() => {
          this.$router.push(`/success/${this.$route.params.orderId}`);
        })
        .catch((err) => {
          this.$pushMessageState(err.response, '結帳');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion-button {
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
</style>
