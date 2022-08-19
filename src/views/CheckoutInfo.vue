<template>
  <VeeForm v-slot="{errors}" @submit="submitOrder">
    <div class="row gx-2">
      <h3 class="fs-5">聯絡資訊</h3>
      <div class="col-12 mb-4">
        <div class="form-floating">
          <VeeField type="email"
                    id="checkoutInputMail"
                    class="form-control"
                    :class="{'is-invalid': errors['電子郵箱位址']}"
                    name="電子郵箱位址"
                    rules="email|required"
                    placeholder="name@example.com"
                    v-model="form.user.email"/>
          <VeeErrorMessage name="電子郵箱位址" class="invalid-feedback"/>
          <label for="checkoutInputMail" aria-label="電子郵箱位置">電子郵箱位置</label>
        </div>
      </div>
      <h3 class="fs-5">寄件地址</h3>
      <div class="col-md-6 mb-2">
        <div class="form-floating">
          <VeeField type="text"
                  id="checkoutInputName"
                  class="form-control"
                  :class="{'is-invalid': errors['收件人姓名']}"
                  name="收件人姓名"
                  rules="required"
                  placeholder="姓名"
                  v-model="form.user.name"/>
          <VeeErrorMessage name="收件人姓名" class="invalid-feedback"/>
          <label for="checkoutInputName" aria-label="收件人姓名">收件人姓名</label>
        </div>
      </div>
      <div class="col-md-6 mb-2">
        <div class="form-floating">
          <VeeField type="tel"
                    id="checkoutInputMobile"
                    class="form-control"
                    :class="{'is-invalid': errors['收件人行動電話']}"
                    name="收件人行動電話"
                    :rules='isMobile'
                    placeholder="0912345678"
                    v-model="form.user.tel"/>
          <VeeErrorMessage name="收件人行動電話" class="invalid-feedback"/>
          <label for="checkoutInputMobile" aria-label="收件人行動電話">收件人行動電話</label>
        </div>
      </div>
      <div class="col-md-6 mb-2">
        <div class="form-floating">
          <VeeField id="checkoutInputCounty"
                    class="form-control"
                    :class="{'is-invalid': errors['縣市']}"
                    name="縣市"
                    rules="required"
                    placeholder="XX市"
                    list="counties"
                    v-model="county"
                    @change="getTown"/>
          <datalist id="counties">
            <option v-for="county in countyDataArr" :key="county.countycode"
                    :value="county.countyname">
              {{ county.countyname }}
            </option>
          </datalist>
          <VeeErrorMessage name="縣市" class="invalid-feedback"/>
          <label for="checkoutInputCounty" aria-label="縣市">縣市</label>
        </div>
      </div>
      <div class="col-md-6 mb-2">
        <div class="form-floating">
          <VeeField id="checkoutInputTown"
                    class="form-control"
                    :class="{'is-invalid': errors['鄉鎮市區']}"
                    name="鄉鎮市區"
                    rules="required"
                    placeholder="XX市"
                    list="towns"
                    v-model="town"/>
          <datalist id="towns">
            <option v-for="town in townDataArr" :key="town.towncode"
                    :value="town.townname">
              {{ town.townname }}
            </option>
          </datalist>
          <label for="checkoutInputTown" aria-label="鄉鎮市區">鄉鎮市區</label>
        </div>
      </div>
      <div class="col-12 mb-4">
        <div class="form-floating">
          <VeeField type="text"
                    id="checkoutInputAddress"
                    class="form-control"
                    :class="{'is-invalid': errors['街道（巷弄）門牌號（樓層）']}"
                    name="街道（巷弄）門牌號（樓層）"
                    rules="required"
                    placeholder="星光大道"
                    v-model="rawAddress"
                    @change="combineAddress"/>
          <VeeErrorMessage name="街道（巷弄）門牌號（樓層）" class="invalid-feedback"/>
          <label for="checkoutInputAddress" aria-label="街道（巷弄）門牌號（樓層）">街道（巷弄）門牌號（樓層）</label>
        </div>
      </div>
      <h3 class="fs-5 d-none d-md-block">備註</h3>
      <div class="col-12 mb-4 d-none d-md-block">
        <div class="form-floating">
          <VeeField as="textarea"
                    id="checkoutInputNote"
                    class="form-control"
                    name="備註"
                    placeholder="Leave a comment here"
                    v-model="form.message"/>
          <label for="checkoutInputNote">（選填）</label>
        </div>
      </div>
      <div class="col-md-6 mb-4 order-md-2">
        <button type="submit" class="btn btn-primary btn-lg w-100">繼續結帳</button>
      </div>
      <div class="col-md-6 d-flex justify-content-center justify-content-md-start
                  align-items-center mb-4 order-md-1">
        <a href="#" class="text-decoration-none"
            @click.prevent="this.$refs.cartOffcanvas.showOffcanvas()">
          <i class="bi bi-chevron-left me-1"></i>打開購物車
        </a>
      </div>
    </div>
  </VeeForm>
  <CartOffcanvas ref="cartOffcanvas"/>
</template>

<script>
import CartOffcanvas from '@/components/CartOffcanvas.vue';
import { parseXml, xml2json } from '@/methods/xml2json';

export default {
  inject: ['$emitter'],
  data() {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      county: '',
      town: '',
      rawAddress: '',
      countyDataArr: [],
      townDataArr: [],
    };
  },
  components: {
    CartOffcanvas,
  },
  computed: {
    // addressCombined() {
    //   return this.county + this.town + this.rawAddress;
    // },
  },
  methods: {
    isMobile(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '請輸入以「09」開頭的行動電話號碼';
    },
    getCounty() {
      const api = 'https://api.nlsc.gov.tw/other/ListCounty';
      this.$http.get(api)
        .then((res) => {
          if (res.status === 200) {
            const countyData = JSON.parse(xml2json(parseXml(res.data), ''));
            this.countyDataArr = countyData.countyItems.countyItem;
          }
        });
    },
    getTown() {
      const countyIndex = this.countyDataArr.findIndex((el) => el.countyname === this.county);
      if (countyIndex >= 0) {
        const countyCode = this.countyDataArr[countyIndex].countycode;
        const api = `https://api.nlsc.gov.tw/other/ListTown/${countyCode}`;
        this.$http.get(api)
          .then((res) => {
            if (res.status === 200) {
              const townData = JSON.parse(xml2json(parseXml(res.data), ''));
              this.townDataArr = townData.townItems.townItem;
            }
          });
      }
    },
    combineAddress() {
      this.form.user.address = this.county + this.town + this.rawAddress;
    },
    submitOrder() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`;
      const form = JSON.parse(JSON.stringify(this.form));
      this.$http.post(api, { data: form })
        .then((res) => {
          if (res.data.success) {
            this.$router.push(`/checkout/${res.data.orderId}`);
            // this.getCart();
          }
        });
    },
  },
  created() {
    this.getCounty();
  },
};
</script>
