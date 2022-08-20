# Vue3 框架實作

## 框架使用

| Javascripts | CSS |
| :---: | :---: |
| Vue3 | Bootstrap5 | 

## Bootstrap5 調整部分

### variables.scss

調整 BS5 CSS 變數
|||
| --- | --- |
|<code>$enable-rfs: false;</code>|關閉 BS5 的單元大小調整引擎|
|<code>$enable-negative-margins: true;</code>|允許負向 margin|



### utilities.scss

利用通用類別的 API 調整 BS5 部分 class 的應用範圍，並加入自定義的 class。

- 新增響應式的原有 class：

  - <code>.shadow</code>, <code>.position</code>, <code>.top</code>, <code>.bottom</code>, <code>.start</code>, <code>.end</code>, <code>.translate-middle</code>, <code>.fs</code>, <code>.fw</code>, <code>.text</code>

- 新增 value 的原有 class：

  | class | CSS |
  | --- | --- |
  |<code>.text-<strong>prewrap</strong></code>|<code>white-space: pre-wrap;</code>|
  |<code>.bg-white-<strong>80</strong></code>|<code>background-color: rgba($white, .8);</code>|

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