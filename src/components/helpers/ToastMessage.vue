<template>
  <div
    ref="toast"
    class="toast mb-2"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="toast-header">
      <span
        :class="`bg-${msg.style}`"
        class="p-2 rounded me-2 d-inline-block"
      />
      <strong class="me-auto">{{ msg.title }}</strong>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      />
    </div>
    <div
      v-if="msg.content || msg.status"
      class="toast-body"
    >
      <ul class="mb-0">
        <li v-if="msg.status">
          HTTP 狀態碼：{{ msg.status }}
        </li>
        <template v-if="msg.content">
          <li
            v-for="(item, index) in msgContentArr"
            :key="index"
          >
            {{ item }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import Toast from 'bootstrap/js/dist/toast';

export default {
  props: {
    msg: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    msgContentArr() {
      if (Array.isArray(this.msg.content)) {
        return this.msg.content;
      }
      return [this.msg.content];
    },
  },
  mounted() {
    const toastEl = this.$refs.toast;
    const toast = new Toast(toastEl, {
      delay: 6000,
    });
    toast.show();
  },
};
</script>
