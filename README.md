# Vue3 框架實作

撰寫中...

## 框架使用

| Javascripts | CSS |
| :---: | :---: |
| Vue3 | Bootstrap5 | 

## Vue3 框架功能使用

- 使用內建物件 <code>\<Transition></code> ，在切換元素狀態時，套用 Animate.css 以及自定義的動畫效果。

## Bootstrap5 調整部分

### variables.scss

調整 BS5 SCSS 變數

| 變數名稱: 值 | 作用 |
| --- | --- |
|<code>$enable-rfs: false;</code>|關閉 BS5 的單元大小調整引擎|
|<code>$enable-negative-margins: true;</code>|允許負向 margin|

### utilities.scss

利用通用類別的 API 調整 BS5 部分 class 的應用範圍，並加入自定義的 class。

- 新增響應式的原有 class：

  - <code>.shadow</code>, <code>.position</code>, <code>.top</code>, <code>.bottom</code>, <code>.start</code>, <code>.end</code>, <code>.translate-middle</code>, <code>.fs</code>, <code>.fw</code>, <code>.text</code>, <code>.h</code>

- 新增 value 的原有 class：

  | class | CSS |
  | --- | --- |
  |<code>.text-<strong>prewrap</strong></code>|<code>white-space: pre-wrap;</code>|
  |<code>.bg-white-<strong>80</strong></code>|<code>background-color: rgba($white, .8);</code>|
  |<code>.h-lv*</code>|<code>height: 特定數值 px</code>|

- 新增全新的 class：

  |class|property|
  | --- | --- |
  |<code>.zindex</code>|z-index|
  |<code>.bgsz</code>|background-size|
  |<code>.bgp</code>|background-position-x background-position-y|
  |<code>.bgpx</code>|background-position-x|
  |<code>.bgpy</code>|background-position-y|
  |<code>.ojf</code>|object-fit|
  |<code>.ojp</code>|object-position|

### type.scss

- 自製 blockquote 樣式 <code>.custom-blockquote</code>

## 其它套件使用
