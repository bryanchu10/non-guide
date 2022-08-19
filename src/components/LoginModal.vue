<template>
  <VueLoading :active="isLoading" class="zindex-popover"/>
  <div class="modal fade" id="staticBackdrop"
        data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true"
        ref="modal">
    <div class="modal-dialog">
        <div class="modal-content">
          <VeeForm v-slot="{errors}" @submit="logIn">
            <div class="modal-header bg-primary">
              <h5 class="modal-title text-light fw-bold" id="staticBackdropLabel">管理員後台登入</h5>
              <button type="button" class="btn-close btn-close-white"
                      data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pb-0">
              <div class="form-floating mb-2">
                <VeeField
                  type="email"
                  id="inputEmail"
                  class="form-control"
                  :class="{'is-invalid': errors['帳號']}"
                  name="帳號"
                  placeholder="OOO@OOO.OOO"
                  rules="required"
                  v-model="user.username"
                />
                <VeeErrorMessage name="帳號" class="invalid-feedback"/>
                <label for="inputEmail">帳號</label>
              </div>
              <div class="form-floating">
                <VeeField
                  type="password"
                  id="inputPassword"
                  class="form-control form-control-lg"
                  :class="{'is-invalid': errors['密碼']}"
                  name="密碼"
                  placeholder="Password"
                  rules="required"
                  v-model="user.password"
                />
                <VeeErrorMessage name="密碼" class="invalid-feedback"/>
                <label for="inputPassword">密碼</label>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-lg btn-secondary"
                      data-bs-dismiss="modal">關閉</button>
              <button type="submit" class="btn btn-lg btn-primary">登入</button>
            </div>
          </VeeForm>
        </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      modal: {},
      isLoading: false,
    };
  },
  methods: {
    logIn() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}/admin/signin`;
      this.$http.post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            this.isLoading = false;
            const { token, expired } = res.data;
            document.cookie = `hexVue3CourseApiToken=${token}; expires=${new Date(expired)}`;
            this.hideModal();
            this.$router.push('/admin/products');
          } else {
            this.isLoading = false;
          }
        });
    },
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    hideModalHandler() {
      this.$router.push('/products/list');
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
  beforeUnmount() {
  },
};
</script>
