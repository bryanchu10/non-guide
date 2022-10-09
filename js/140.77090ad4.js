"use strict";(self["webpackChunknon_guide"]=self["webpackChunknon_guide"]||[]).push([[140],{233:function(e,t,i){i.d(t,{Z:function(){return D}});var r=i(3396),s=i(7139),a=i(9242);const n={class:"container mt-6 mb-4 mb-md-6"},o={class:"d-none d-md-block col-md-7 offset-md-1"},c=["src","alt"],l={class:"col-md-5 position-absolute top-90 top-md-20 end-md-0"},d={ref:"infoCard",class:"p-3 py-md-4 ps-md-4 pe-md-0 bg-white rounded-1"},u={class:"row"},h={class:"col-xl-10"},p={"aria-label":"breadcrumb"},m={class:"breadcrumb mb-0"},b={class:"breadcrumb-item"},f=(0,r.Uk)(" 首頁 "),g={class:"breadcrumb-item"},w={class:"breadcrumb-item","aria-current":"page"},v={class:"text-secondary"},A={class:"fs-3 fs-md-4 fs-lg-2 fw-bold lh-base mb-4"},_={class:"text-secondary text-prewrap mb-0"},$={class:"row justify-content-center"},k={class:"col-md-8 zindex-1"},x={class:"text-prewrap bg-white-80 p-4 mb-0 shadow-none shadow-md rounded-1"};function y(e,t,i,y,I,C){const W=(0,r.up)("VueLoading"),D=(0,r.up)("router-link");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r.Wm)(W,{active:I.isLoading},null,8,["active"]),(0,r._)("section",n,[(0,r._)("div",{class:"row position-relative mb-md-n6",style:(0,s.j5)({"margin-bottom":I.infoCardHeight-48+"px"})},[(0,r._)("div",{class:"col d-md-none h-lv8 bgsz-cover bgp-center",style:(0,s.j5)({"background-image":`url(${I.mainArticle.image?I.mainArticle.image:""})`})},null,4),(0,r._)("div",o,[(0,r._)("img",{class:"h-lv10 w-100 ojf-cover rounded-1",src:I.mainArticle.image,alt:I.mainArticle.title},null,8,c)]),(0,r._)("div",l,[(0,r._)("div",d,[(0,r._)("div",u,[(0,r._)("div",h,[(0,r._)("nav",p,[(0,r._)("ol",m,[(0,r._)("li",b,[(0,r.Wm)(D,{to:"/",class:"text-decoration-none link-secondary"},{default:(0,r.w5)((()=>[f])),_:1})]),(0,r._)("li",g,[(0,r._)("a",{href:"#",class:"text-decoration-none link-secondary",onClick:t[0]||(t[0]=(0,a.iM)((t=>e.$router.push("/about/overview")),["prevent"]))}," 關於 ")]),(0,r._)("li",w,[(0,r._)("span",v,(0,s.zw)(I.mainArticle.title),1)])])]),(0,r._)("h2",A,(0,s.zw)(I.mainArticle.title),1),(0,r._)("p",_,(0,s.zw)(I.mainArticle.description),1)])])],512)])],4),(0,r._)("div",$,[(0,r._)("div",k,[(0,r._)("p",x,(0,s.zw)(I.mainArticle.content),1)])])])],64)}var I={inject:["$pushMessageState"],props:{parentArticlesData:{type:Array,default(){return[]}}},data(){return{mainArticle:{},browserWidth:0,infoCardHeight:0,isLoading:!0}},watch:{browserWidth(){this.browserWidth<768&&(this.infoCardHeight=this.$refs.infoCard.offsetHeight)}},created(){this.getMainArticle()},mounted(){window.onresize=()=>{this.getBrowserWidth()},this.getBrowserWidth()},updated(){this.infoCardHeight=this.$refs.infoCard.offsetHeight},unmounted(){window.onresize=null},methods:{getMainArticle(){let{articleId:e}=this.$route.params;"overview"===this.$route.name&&(e=this.parentArticlesData[0].id);const t=`https://vue3-course-api.hexschool.io/api/vue3-final/article/${e}`;this.$http.get(t).then((e=>{e.data.success?(this.mainArticle=e.data.article,this.isLoading=!1):this.$pushMessageState(e,"取得單一文章")})).catch((e=>{this.$pushMessageState(e.response,"取得單一文章")}))},getBrowserWidth(){this.browserWidth=window.innerWidth},goArticle(e){this.$router.push(`/about/${e}`)}}},C=i(89);const W=(0,C.Z)(I,[["render",y]]);var D=W},1140:function(e,t,i){i.r(t),i.d(t,{default:function(){return g}});var r=i(3396),s=i(9242);const a={class:"container mb-4 mb-md-6"},n={class:"row justify-content-center"},o={class:"col-10 col-md-8 d-flex"},c=(0,r._)("i",{class:"bi bi-arrow-left-circle-fill fs-2 opacity-75"},null,-1),l=[c],d=(0,r._)("i",{class:"bi bi-arrow-right-circle-fill fs-2 opacity-75"},null,-1),u=[d];function h(e,t,i,c,d,h){const p=(0,r.up)("ArticleSection");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r.Wm)(p,{"parent-articles-data":i.parentArticlesData},null,8,["parent-articles-data"]),(0,r._)("div",a,[(0,r._)("div",n,[(0,r._)("div",o,[d.previousArticleId?((0,r.wg)(),(0,r.iD)("a",{key:0,href:"#","aria-label":"previous",onClick:t[0]||(t[0]=(0,s.iM)((t=>e.$router.push(`/about/${d.previousArticleId}`)),["prevent"]))},l)):(0,r.kq)("",!0),d.nextArticleId?((0,r.wg)(),(0,r.iD)("a",{key:1,href:"#","aria-label":"next",class:"ms-auto",onClick:t[1]||(t[1]=(0,s.iM)((t=>e.$router.push(`/about/${d.nextArticleId}`)),["prevent"]))},u)):(0,r.kq)("",!0)])])])],64)}var p=i(233),m={components:{ArticleSection:p.Z},props:{parentArticlesData:{type:Array,default(){return[]}}},data(){return{previousArticleId:"",nextArticleId:""}},created(){this.getNeighborArticleId()},methods:{getNeighborArticleId(){const e=[...this.parentArticlesData],t=[];e.forEach((e=>{t.push(e.id)}));const i=t.findIndex((e=>e===this.$route.params.articleId));this.previousArticleId=t[i-1],this.nextArticleId=t[i+1]}}},b=i(89);const f=(0,b.Z)(m,[["render",h]]);var g=f}}]);
//# sourceMappingURL=140.77090ad4.js.map