(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{Kdrr:function(e,t,a){e.exports={next_btn:"next_btn___2HuSX",content:"content___3ClNS"}},endv:function(e,t,a){"use strict";a.r(t);a("+L6B");var n=a("2/Rp"),r=(a("miYZ"),a("tsqr")),c=(a("T2oS"),a("W9HT")),i=a("qIgq"),s=a.n(i),u=(a("Znn+"),a("ZTPi")),o=a("q1tI"),l=a.n(o),d=a("hQyA"),p=a("4/LA"),m=a("DPwR"),b=a("MrYu"),v=a("Kdrr"),f=a.n(v),_=a("/MKj"),h=a("p0pE"),g=a.n(h),x=(a("/xke"),a("TeRw")),w=a("d6i3"),y=a.n(w),k=a("1l/V"),j=a.n(k),E=a("pGep"),O=a("7Qib"),S=a("V2Ys"),P=a("3a4m"),C=a.n(P),I=a("DNZy"),z=a.n(I),N=l.a.memo(e=>{var t=e.setLoading,a=e.adaccount_id,c=e.campaignState,i=e.adsCreativeState,s=e.adsetState,u=e.images,p=e.video_ids,v=e.setVideoIds,f=e.clearStateCache;function _(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i;return c.objective===d["a"]?h(s.promoted_object.object_store_url,e):h(e.link,e)}function h(e,t){return w.apply(this,arguments)}function w(){return w=j()(y.a.mark(function e(t,n){var r,c;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=s.is_dynamic_creative,e.next=3,E["createAdCreative"](a,r?Object(b["a"])(t,n,u):Object(m["b"])(t,n));case 3:if(c=e.sent,c.error){e.next=8;break}return e.abrupt("return",c.id);case 8:x["a"].error({message:"\u521b\u5efa\u5e7f\u544a\u521b\u610f\u5931\u8d25",description:"".concat(c.error.error_user_msg),duration:null});case 9:case"end":return e.stop()}},e)})),w.apply(this,arguments)}function k(e){return P.apply(this,arguments)}function P(){return P=j()(y.a.mark(function e(t){var n;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(c.name){e.next=2;break}return e.abrupt("return",r["a"].warning("\u8bf7\u8f93\u5165\u5e7f\u544a\u7cfb\u5217\u540d\u79f0 !"));case 2:return e.next=4,E["createCampaign"](a,g()({},Object(O["c"])(void 0!==t?g()({},c,{name:c.name+"_".concat(t)}):c)));case 4:if(n=e.sent,!n.id){e.next=7;break}return e.abrupt("return",n.id);case 7:case"end":return e.stop()}},e)})),P.apply(this,arguments)}function I(e,t){return N.apply(this,arguments)}function N(){return N=j()(y.a.mark(function e(t,n){var c,i,u;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(s.name){e.next=2;break}return e.abrupt("return",r["a"].warning("\u8bf7\u8f93\u5165\u5e7f\u544a\u7ec4\u540d\u79f0 !"));case 2:return c=Object(O["c"])(void 0!==n?g()({},s,{name:s.name+"_".concat(n)}):s),c.start_time&&(c.start_time=parseInt(c.start_time/1e3)),c.end_time&&(c.end_time=parseInt(c.end_time/1e3)),e.next=7,E["createAdset"](a,g()({campaign_id:t},c));case 7:return i=e.sent,u=i.id,e.abrupt("return",u);case 10:case"end":return e.stop()}},e)})),N.apply(this,arguments)}function R(e,t,a){return T.apply(this,arguments)}function T(){return T=j()(y.a.mark(function e(t,n,r){var c,s;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E["createAds"](a,{adset_id:t,name:r||i.ads_name,creative:{creative_id:n},status:i.status});case 2:return c=e.sent,s=c.id,e.abrupt("return",s);case 5:case"end":return e.stop()}},e)})),T.apply(this,arguments)}function A(e,t,a,n){for(var r=n.slice(),c=[],i=0;i<e;i++){for(var s={adset:[]},u=0;u<t;u++){var o={},l=r.shift();o.ads=l,s.adset.push(o)}c.push(s)}return c}function V(){return q.apply(this,arguments)}function q(){return q=j()(y.a.mark(function e(){var a,n,u,o;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=i.campaign_num,n=i.adset_num,u=i.ads_num,o=A(a,n,u,z.a.chunk(p,u)),e.prev=2,e.next=5,Promise.all(o.map(function(){var e=j()(y.a.mark(function e(t,a){var n,u;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.adset,!c.id){e.next=5;break}e.t0=c.id,e.next=8;break;case 5:return e.next=7,k(a);case 7:e.t0=e.sent;case 8:return u=e.t0,e.next=11,Promise.all(n.map(function(){var e=j()(y.a.mark(function e(t,a){var n,c;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.ads,!s.id){e.next=5;break}e.t0=s.id,e.next=8;break;case 5:return e.next=7,I(u,a);case 7:e.t0=e.sent;case 8:return c=e.t0,e.next=11,Promise.all(n.map(function(){var e=j()(y.a.mark(function e(t){var a,n,s,u,o;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.video_id,n=t.image_url,s=t.name,e.next=3,_(g()({},i,{video_id:a,image_url:n}));case 3:return u=e.sent,e.next=6,R(c,u,s);case 6:o=e.sent,o&&r["a"].success("\u521b\u5efa\u5e7f\u544a\u6210\u529f");case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 11:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}()));case 11:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}()));case 5:t(!1),r["a"].success("\u521b\u5efa\u5e7f\u544a\u5b8c\u6210"),f(),C.a.push("/campaign"),e.next=15;break;case 11:e.prev=11,e.t0=e["catch"](2),r["a"].warning(e.t0),t(!1);case 15:case"end":return e.stop()}},e,null,[[2,11]])})),q.apply(this,arguments)}function K(){return L.apply(this,arguments)}function L(){return L=j()(y.a.mark(function e(){var a,n,o,l;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=i.campaign_num,n=i.adset_num,o=i.ads_num,l=A(a,n,o,z.a.chunk(u,o)),e.prev=2,e.next=5,Promise.all(l.map(function(){var e=j()(y.a.mark(function e(t,a){var n,u;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.adset,!c.id){e.next=5;break}e.t0=c.id,e.next=8;break;case 5:return e.next=7,k(a);case 7:e.t0=e.sent;case 8:return u=e.t0,e.next=11,Promise.all(n.map(function(){var e=j()(y.a.mark(function e(t,a){var n,c;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.ads,!s.id){e.next=5;break}e.t0=s.id,e.next=8;break;case 5:return e.next=7,I(u,a);case 7:e.t0=e.sent;case 8:return c=e.t0,e.next=11,Promise.all(n.map(function(){var e=j()(y.a.mark(function e(t){var a,n,s,u;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.hash,n=t.name,e.next=3,_(g()({},i,{format:"photo_data",image_hash:a}));case 3:return s=e.sent,e.next=6,R(c,s,n);case 6:u=e.sent,u&&r["a"].success("\u521b\u5efa\u5e7f\u544a\u6210\u529f");case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 11:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}()));case 11:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}()));case 5:t(!1),r["a"].success("\u521b\u5efa\u5e7f\u544a\u5b8c\u6210"),f(),C.a.push("/campaign"),e.next=15;break;case 11:e.prev=11,e.t0=e["catch"](2),r["a"].warning(e.t0),t(!1);case 15:case"end":return e.stop()}},e,null,[[2,11]])})),L.apply(this,arguments)}function Y(){return console.log(i),i.page_id?!(!i.call_to_action&&!s.is_dynamic_creative)||(r["a"].warning("\u8bf7\u9009\u62e9\u884c\u52a8\u53f7\u53ec"),!1):(r["a"].warning("\u8bf7\u9009\u62e9\u4e3b\u9875"),!1)}function Z(){return D.apply(this,arguments)}function D(){return D=j()(y.a.mark(function e(){var a,n,o,l,d;return y.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!Y()){e.next=35;break}if(t(!0),a=i.format,!a||-1===a.indexOf("batch_video_data")){e.next=7;break}if(p.length){e.next=6;break}return e.abrupt("return",r["a"].warning("\u8bf7\u5148\u4e0a\u4f20\u89c6\u9891"));case 6:return e.abrupt("return",V());case 7:if(!a||-1===a.indexOf("batch_image_data")){e.next=11;break}if(u.length){e.next=10;break}return e.abrupt("return",r["a"].warning("\u8bf7\u5148\u9009\u62e9\u56fe\u7247"));case 10:return e.abrupt("return",K());case 11:if(setTimeout(()=>{t(!1),C.a.replace("/campaign")},1e3),!c.id){e.next=16;break}e.t0=c.id,e.next=19;break;case 16:return e.next=18,k();case 18:e.t0=e.sent;case 19:if(n=e.t0,!s.id){e.next=24;break}e.t1=s.id,e.next=27;break;case 24:return e.next=26,I(n);case 26:e.t1=e.sent;case 27:return o=e.t1,e.next=30,_();case 30:return l=e.sent,e.next=33,R(o,l);case 33:d=e.sent,d&&(r["a"].success("\u521b\u5efa\u5e7f\u544a\u6210\u529f"),f());case 35:case"end":return e.stop()}},e)})),D.apply(this,arguments)}return Object(o["useEffect"])(()=>{var e=JSON.parse(localStorage.getItem("video_ids"));function t(){return a.apply(this,arguments)}function a(){return a=j()(y.a.mark(function t(){return y.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.t0=v,t.next=3,Object(S["resetVideoInfo"])(e);case 3:t.t1=t.sent,(0,t.t0)(t.t1);case 5:case"end":return t.stop()}},t)})),a.apply(this,arguments)}return(null===e||void 0===e?void 0:e.length)&&!p.length&&t(),()=>{}},[v,p]),l.a.createElement(n["a"],{type:"primary",onClick:Z},"\u786e\u8ba4")}),R=e=>{var t=e.global;return{images:t.images,video_ids:t.video_ids}},T=e=>{return{setVideoIds:t=>e({type:"global/set_video_ids",payload:t}),clearStateCache:()=>{e({type:"global/set_c_adset",payload:null}),e({type:"global/set_c_campaign",payload:null})}}},A=Object(_["c"])(R,T)(N),V=Object(o["lazy"])(()=>Promise.all([a.e(0),a.e(8)]).then(a.bind(null,"OIcR"))),q=Object(o["lazy"])(()=>Promise.all([a.e(0),a.e(9)]).then(a.bind(null,"4AHE"))),K=Object(o["lazy"])(()=>Promise.all([a.e(0),a.e(7)]).then(a.bind(null,"lYTh"))),L=u["a"].TabPane,Y=e=>{var t=e.adaccount_id,a=e.dispatch,i=e.c_campaign,v=e.c_adset,_=Object(o["useState"])(!1),h=s()(_,2),g=h[0],x=h[1],w=Object(o["useState"])("campaign"),y=s()(w,2),k=y[0],j=y[1],E=Object(o["useReducer"])(d["d"],i||d["b"]),O=s()(E,2),S=O[0],P=O[1],C=Object(o["useReducer"])(p["c"],v||p["b"][S.objective]),I=s()(C,2),z=I[0],N=I[1],R=Object(o["useReducer"])(m["d"],m["c"]),T=s()(R,2),Y=T[0],Z=T[1],D=Object(o["useReducer"])(b["c"],b["b"]),H=s()(D,2),J=H[0],M=H[1];function Q(){console.log(S),a({type:"global/set_c_campaign",payload:S})}function B(){console.log(z),a({type:"global/set_c_adset",payload:z})}return Object(o["useEffect"])(()=>{return document.onkeydown&&(document.onkeydown=null),()=>{document.onkeydown=null}},[]),Object(o["useEffect"])(()=>{return N({type:"reset",payload:v||p["b"][S.objective]}),()=>{}},[S.objective,v,Z]),l.a.createElement(c["a"],{tip:"\u52aa\u529b\u521b\u5efa\u4e2d...",spinning:g,size:"large",delay:500},l.a.createElement(u["a"],{className:f.a.content,tabPosition:"left",activeKey:k,onTabClick:e=>{j(e)}},l.a.createElement(L,{className:f.a.campaign,tab:"\u5e7f\u544a\u7cfb\u5217",key:"campaign"},l.a.createElement(o["Suspense"],{fallback:l.a.createElement(c["a"],{size:"small"})},l.a.createElement(q,{adaccount_id:t,state:S,campaignDispatch:P,initailState:d["b"],setStep:j}),l.a.createElement("div",{className:f.a.next_btn},l.a.createElement(n["a"],{type:"primary",onClick:()=>{S.name?(j("adset"),Q()):r["a"].warning("\u8bf7\u8f93\u5165\u5e7f\u544a\u7cfb\u5217\u540d\u79f0")}},"\u7ee7\u7eed")))),l.a.createElement(L,{tab:"\u5e7f\u544a\u7ec4",key:"adset"},l.a.createElement(o["Suspense"],{fallback:l.a.createElement(c["a"],{size:"small"})},l.a.createElement(V,{campaign_id:S.id,bid_strategy:S.bid_strategy,daily_budget:S.daily_budget||S.lifetime_budget,state:z,dispatch:N,initailState:p["b"][S.objective],objective:S.objective}),l.a.createElement("div",{className:f.a.next_btn},l.a.createElement(n["a"],{type:"primary",onClick:()=>{var e,t,a,n;return(null===z||void 0===z?void 0:null===(e=z.targeting)||void 0===e?void 0:null===(t=e.geo_locations)||void 0===t?void 0:t.countries.length)||(null===z||void 0===z?void 0:null===(a=z.targeting)||void 0===a?void 0:null===(n=a.geo_locations)||void 0===n?void 0:n.country_groups.length)?z.optimization_goal?void(z.name?(j("ads"),B()):r["a"].warning("\u8bf7\u8f93\u5165\u5e7f\u544a\u7ec4\u540d\u79f0")):r["a"].warning("\u8bf7\u9009\u62e9\u5e7f\u544a\u6295\u653e\u4f18\u5316\u76ee\u6807"):r["a"].warning("\u8bf7\u9009\u62e9\u56fd\u5bb6/\u533a\u57df")}},"\u7ee7\u7eed")))),l.a.createElement(L,{tab:"\u5e7f\u544a",key:"ads"},l.a.createElement(o["Suspense"],{fallback:l.a.createElement(c["a"],{size:"small"})},l.a.createElement(K,{state:z.is_dynamic_creative?J:Y,dispatch:z.is_dynamic_creative?M:Z,objective:S.objective,is_dynamic_creative:z.is_dynamic_creative}),l.a.createElement("div",{className:f.a.next_btn},l.a.createElement(A,{setLoading:x,adaccount_id:t,campaignState:S,adsetState:z,adsCreativeState:z.is_dynamic_creative?J:Y}))))))},Z=e=>{return{adaccount_id:e.global.adaccount_id,c_campaign:e.global.c_campaign,c_adset:e.global.c_adset}};t["default"]=Object(_["c"])(Z)(Y)}}]);