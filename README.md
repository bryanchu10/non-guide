# Vue3 框架實作

## 頁面規劃

``` HTML
App
 ┣ home (首頁) 
 ┣ about （關於）
 ┃ ┣ overview (關於-概覽所有特色)
 ┃ ┗ article (關於-單一特色)
 ┣ products (產品)
 ┃ ┣ list (產品-總清單)
 ┃ ┗ product (產品-單一產品)
 ┣ favorite (收藏產品)
 ┣ checkout (結帳)
 ┃ ┣ info (資料填寫)
 ┃ ┗ payment (付款)
 ┣ success (結帳成功)
 ┗ admin (管理員介面)
   ┣ productsManage (產品管理)
   ┣ ordersManage (訂單管理)
   ┣ couponsManage (優惠券管理)
   ┗ articlesManage (文章管理)
```

## 框架使用

| JavaScript | CSS |
| :---: | :---: |
| Vue3 | Bootstrap 5.2.0-beta1 |

## Vue 專案工具使用

- [Vue CLI](https://cli.vuejs.org/)

  整體專案建置、資源載入與打包。

- [Vue Router](https://router.vuejs.org/)

  管理前端路由。

## Vue 程式碼架構

- 使用 Options API。

## 自製元件 ProductRecommend 說明

- 項目輪播元件，與 BS5 格線系統組合，並響應視窗寬度變化。

- 滑鼠指標移入元件範圍時，阻擋滾輪對整個頁面垂直滾動的控制，改為控制元件左右滾動。元件左右滾動至邊界後，回復滑鼠滾輪控制整個頁面垂直滾動的能力。

- 可以按住滑鼠右鍵拖曳元件進行左右滾動。

## Bootstrap5 調整部分

### variables.scss

- 調整 BS5 的 SCSS 變數

| 變數名稱與變數值 | 作用 |
| --- | --- |
|`$enable-rfs: false;`|關閉 BS5 的單元大小調整引擎|
|`$enable-negative-margins: true;`|允許負向 margin|
|`$primary: #027EAC;`|將主色設定為 #027EAC|
|`$theme-colors: ("tertiary": $gray-200,);`|主題顏色增加第三色|
|`$spacers: (6: $spacer * 4.5,);`|增加空間變數 Map 等級|
|`$spacers: (7: $spacer * 6.5,);`|增加空間變數 Map 等級|
|`$spacers: (8: $spacer * 8,);`|增加空間變數 Map 等級|
|`$position-values: (20: 20%,);`|增加定位 Map 等級|
|`$position-values: (90: 90%,);`|增加定位 Map 等級|
|`$font-family-sans-serif: "Noto Serif TC";`|將 Noto Serif TC 字體設為第一優先|
|`$h1-font-size: $font-size-base * 3;`|加大 h1 字型大小|
|`$h7-font-size: $font-size-base * 0.75;`|增加 h7 字體大小變數|
|`$h8-font-size: $font-size-base * 0.5;`|增加 h8 字體大小變數|
|`$font-sizes: (7: $h7-font-size,);`|增加字體大小變數 Map 等級|
|`$font-sizes: (8: $h8-font-size,);`|增加字體大小變數 Map 等級|
|`$card-border-radius: $border-radius-sm;`|設定卡片元件的邊框圓角改為「小」|

### utilities.scss

- 使用通用類別 API 擴展 Class 選擇器組合，讓這些組合具有響應式能力。

  `.shadow`, `.position`, `.top`, `.bottom`, `.start`, `.end`, `.translate-middle`, `.fs`, `.fw`, `.text`, `.color`

- 使用通用類別 API 擴展 Class 選擇器組合，新增組合的值：

  | Class 選擇器 | 屬性與屬性值 |
  | --- | --- |
  |`.shadow-s`|`box-shadow: $box-shadow-sm;`|
  |`.shadow-l`|`box-shadow: $box-shadow-lg;`|
  |`.w-lv*`|`width: 特定數值 px`|
  |`.h-lv*`|`height: 特定數值 px`|
  |`.text-prewrap`|`white-space: pre-wrap;`|
  |`.bg-white-80`|`background-color: rgba($white, .8);`|

- 新增全新的 class：

  |class|property|
  | --- | --- |
  |`.zindex`|z-index|
  |`.bgsz`|background-size|
  |`.bgp`|background-position-x background-position-y|
  |`.bgpx`|background-position-x|
  |`.bgpy`|background-position-y|
  |`.ojf`|object-fit|
  |`.ojp`|object-position|

### type.scss

- 自製 blockquote 樣式。
  
  `.custom-blockquote`

### input.scss

- 去除 number 類型的 input 的預設樣式。

### hover.scss

- 自製 hover 時縮放元素樣式。
  
  `.hover-scale`

### fixedTopAnimate.scss

- 自製隱藏置頂元件的樣式。

  `.fixed-top-animate`

### filter.scss

- 自製替元素加上遮罩的樣式。

  `.filter-brightness-50`

## 其它套件使用

- [Axios](https://axios-http.com/docs/intro)

  遠端資料存取。

- [vue-axios](https://www.npmjs.com/package/vue-axios)

  以類似 Vue 內建方法使用 Axios。

- [vue3-loading-overlay](https://www.npmjs.com/package/vue3-loading-overlay)

  存取遠端資料時，在頁面上呈現載入動畫效果。

- [VeeValidate](https://vee-validate.logaretm.com/v4/)

  驗證各種類型的表單輸入內容。

- [Day.js](https://day.js.org)

  處理時間資料的格式轉換。

- [Masonry](https://masonry.desandro.com/)

  配合 Bootstrap5 格線系統產生動態格線排版。

- [Bootstrap Icons](https://icons.getbootstrap.com)

  配合 Bootstrap 設計風格的圖示。

- [Animate.css](https://animate.style)

  CSS 驅動的動畫樣式。

- [xml2json](https://goessner.net)

  將 xml 資料格式轉換成 json 資料格式。

## API

- 六角學院 Vue3 課程 API

  商品、文章、優惠代碼存取

- 政府資料開放平台
  
  - [代碼服務－縣市清單](https://data.gov.tw/dataset/101905)

  - [代碼服務－鄉鎮市區清單（地政）](https://data.gov.tw/dataset/102013)

  將抓取到的縣市與鄉鎮市區清單作為表單輸入項目的 datalist 選項。
