(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{160:function(e,t,n){},161:function(e,t,n){},240:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(25),s=n.n(r),i=(n(160),n(30)),o=n.n(i),j=n(47),l=n(44),b=(n.p,n(161),n(69)),u=n(48),d=n(24),p=n(58),h=n(152),O=n(8),x=function(e){var t=e.component,n=e.isSignedIn,a=Object(h.a)(e,["component","isSignedIn"]);return Object(O.jsx)(d.b,Object(p.a)(Object(p.a)({},a),{},{render:function(e){return n?Object(O.jsx)(t,Object(p.a)({},e)):Object(O.jsx)(d.a,{to:"/signin"})}}))},m=n(242),f=n(243),k=n(33),v=n(247),y=n(245),g=n(246);function I(){return S.apply(this,arguments)}function S(){return(S=Object(j.a)(o.a.mark((function e(){var t,n,a,c,r,s,i,j,l,b,u=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=u.length>0&&void 0!==u[0]?u[0]:"",n=u.length>1&&void 0!==u[1]?u[1]:"GET",a=u.length>2?u[2]:void 0,c=u.length>3?u[3]:void 0,e.prev=4,r="JWT ".concat(c),s="http://localhost:5000".concat(t),(i=new Headers).append("Content-Type","application/json"),"GET"!==n){e.next=23;break}if(!c){e.next=18;break}return(l=new Headers).append("Authorization",r),e.next=15,fetch(s,{headers:l});case 15:j=e.sent,e.next=21;break;case 18:return e.next=20,fetch(s);case 20:j=e.sent;case 21:e.next=41;break;case 23:if("POST"!==n&&"PUT"!==n){e.next=30;break}return c&&i.append("Authorization",r),e.next=27,fetch(s,{method:n,body:JSON.stringify(a),headers:i});case 27:j=e.sent,e.next=41;break;case 30:if("DELETE"!==n){e.next=41;break}if(!c){e.next=38;break}return i.append("Authorization",r),e.next=35,fetch(s,{method:n,headers:i});case 35:j=e.sent,e.next=41;break;case 38:return e.next=40,fetch(s,{method:n});case 40:j=e.sent;case 41:return console.log(j),e.next=44,j.json();case 44:return b=e.sent,e.abrupt("return",b);case 48:return e.prev=48,e.t0=e.catch(4),console.error("error",e.t0),e.abrupt("return",{error:e.t0});case 52:case"end":return e.stop()}}),e,null,[[4,48]])})))).apply(this,arguments)}var w={labelCol:{span:8},wrapperCol:{span:16}},C={wrapperCol:{offset:8,span:16}},T=function(e){var t=e.admin,n=e.setAdmin,c=e.setToken,r=e.token,s=Object(a.useState)(!1),i=Object(l.a)(s,2),b=i[0],u=i[1],d=Object(a.useState)({}),h=Object(l.a)(d,2),x=h[0],S=h[1],T=function(){var e=Object(j.a)(o.a.mark((function e(t){var a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(JSON.stringify(t)),e.prev=1,e.next=4,I("/auth","POST",t,r);case 4:if(a=e.sent,console.log(a),"Invalid credentials"!==a.description){e.next=9;break}return S(t),e.abrupt("return",E());case 9:console.log(a),c(a.access_token),n(t),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),console.error("error",e.t0);case 17:case"end":return e.stop()}}),e,null,[[1,14]])})));return function(t){return e.apply(this,arguments)}}(),E=function(){u(!0)},N=function(){var e=Object(j.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!1),e.next=3,I("/users","POST",x,r);case 3:(t=e.sent)&&!t.error&&n&&(n(t),T(t));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t?Object(O.jsx)(m.a,{className:"mt-4",children:Object(O.jsx)(f.a,{span:12,offset:6,children:Object(O.jsx)(k.a,{type:"primary",htmlType:"submit",onClick:function(){n&&n(void 0)},children:"Cerrar Sesi\xf3n"})})}):Object(O.jsxs)(m.a,{className:"mt-4",children:[Object(O.jsx)(v.a,{title:"Crear Cuenta",visible:b,onOk:N,onCancel:function(){u(!1)},children:Object(O.jsx)("p",{children:"Email No Existe Desea Crear Una Nueva Cuenta"})}),Object(O.jsx)(f.a,{span:12,offset:6,children:Object(O.jsxs)(y.a,Object(p.a)(Object(p.a)({},w),{},{name:"basic",onFinish:T,onFinishFailed:function(e){console.error("Failed:",e)},children:[Object(O.jsx)(y.a.Item,{label:"Usuario",name:"username",rules:[{required:!0,message:"Campo obligatorio!"}],children:Object(O.jsx)(g.a,{})}),Object(O.jsx)(y.a.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Campo obligatorio!"}],children:Object(O.jsx)(g.a.Password,{})}),Object(O.jsx)(y.a.Item,Object(p.a)(Object(p.a)({},C),{},{children:Object(O.jsx)(k.a,{type:"primary",htmlType:"submit",children:"Submit"})}))]}))})]})},E=n(244),N=n(53),F=[{title:"URL",dataIndex:"url",key:"url",render:function(e,t){return Object(O.jsx)(u.b,{to:"/".concat(t.url,"/home"),children:e})}},{title:"Nombre",dataIndex:"name",key:"name"},{title:"Fecha Inicio",dataIndex:"start_date",key:"start_date"},{title:"Pago",dataIndex:"payment",key:"payment"}],A=function(e){e.admin,e.setAdmin;var t=e.token,n=(e.setToken,Object(a.useState)([{url:"shit",name:"hello",start_date:"29-09-1999",payment:5e3}])),r=Object(l.a)(n,2),s=r[0],i=r[1],b=Object(a.useState)(!1),u=Object(l.a)(b,2),d=u[0],p=u[1];return Object(a.useEffect)((function(){function e(){return(e=Object(j.a)(o.a.mark((function e(){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I("/contests","GET",null,t);case 2:n=e.sent,console.log(n);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}try{p(!0),function(){e.apply(this,arguments)}()}catch(n){console.error("error",n)}finally{p(!1)}}),[t,i]),d?Object(O.jsx)(m.a,{className:"mt-4",children:Object(O.jsx)(f.a,{children:Object(O.jsx)(N.a,{style:{fontSize:24},spin:!0})})}):Object(O.jsxs)(c.a.Fragment,{children:[Object(O.jsx)(m.a,{className:"mt-4"}),Object(O.jsx)(m.a,{children:Object(O.jsx)(f.a,{span:24,children:Object(O.jsx)(E.a,{dataSource:s,columns:F})})})]})},P=function(){return Object(O.jsxs)("div",{children:[Object(O.jsx)("p",{children:'Click para redireccionar a "/" que es una ruta conocida:'}),Object(O.jsx)(u.b,{to:"/",children:"Click!!"})]})},z=n(249),_=n(248),G=function(e){e.admin,e.setAdmin;var t=e.token,n=(e.setToken,Object(a.useState)()),r=Object(l.a)(n,2),s=r[0],i=r[1],b=Object(a.useState)(!0),p=Object(l.a)(b,2),h=p[0],x=p[1],k=Object(d.g)().contestId;return Object(a.useEffect)((function(){function e(){return(e=Object(j.a)(o.a.mark((function e(n){var a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,x(!0),e.next=4,I("/contests/".concat(n),"GET",null,t);case 4:a=e.sent,i(a),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.error("error",e.t0);case 11:return e.prev=11,x(!1),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[0,8,11,14]])})))).apply(this,arguments)}!function(t){e.apply(this,arguments)}(k)}),[k,i,t]),h?Object(O.jsx)(m.a,{className:"mt-4",children:Object(O.jsx)(f.a,{children:Object(O.jsx)(N.a,{style:{fontSize:24},spin:!0})})}):s?Object(O.jsx)(c.a.Fragment,{children:Object(O.jsx)(m.a,{className:"mt-4",children:Object(O.jsx)(f.a,{span:24,children:Object(O.jsxs)(z.b,{title:"User Info",bordered:!0,children:[Object(O.jsx)(z.b.Item,{label:"Nombre",children:s.name}),Object(O.jsx)(z.b.Item,{label:"Pago",children:s.payment}),Object(O.jsx)(z.b.Item,{label:"Fecha Inicial",span:6,children:s.start_date}),Object(O.jsx)(z.b.Item,{label:"Fecha Final",span:6,children:s.end_date}),Object(O.jsx)(z.b.Item,{label:"Guion",span:6,children:s.script}),Object(O.jsx)(z.b.Item,{label:"Recomendaciones",span:6,children:s.recommendations}),Object(O.jsx)(z.b.Item,{label:"Estado",span:3,children:Object(O.jsx)(_.a,{status:"processing",text:"Running"})})]})})})}):Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(m.a,{children:Object(O.jsx)(f.a,{children:Object(O.jsx)("h3",{children:"Concurso no encontrado! Click para redireccionar"})})}),Object(O.jsx)(m.a,{children:Object(O.jsx)(f.a,{children:Object(O.jsx)("h3",{children:Object(O.jsx)(u.b,{to:"/",children:"Inicio"})})})})]})};var J=function(){var e=Object(a.useState)(),t=Object(l.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(""),s=Object(l.a)(r,2),i=s[0],p=s[1],h=function(){var e=Object(j.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c(void 0);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(O.jsx)("div",{className:"App",children:Object(O.jsxs)(u.a,{children:[Object(O.jsx)(b.a,{theme:"dark",mode:"horizontal",defaultSelectedKeys:["1"],children:Object(O.jsx)(b.a.Item,{children:i?Object(O.jsx)(u.b,{to:"/",onClick:h,children:"Cerrar Sesion"}):Object(O.jsx)(u.b,{to:"/",children:"Login"})},"1")}),Object(O.jsxs)(d.d,{children:[Object(O.jsx)(d.b,{path:"/",exact:!0,component:function(){return n?Object(O.jsx)(x,{path:"/",exact:!0,isSignedIn:!!n,component:function(){return Object(O.jsx)(A,{admin:n,setAdmin:c,token:i,setToken:p})}}):Object(O.jsx)(T,{token:i,setToken:p,admin:n,setAdmin:c})}}),Object(O.jsx)(x,{path:"/:contestId/home",exact:!0,isSignedIn:!!n,component:function(){return Object(O.jsx)(G,{admin:n,setAdmin:c,token:i,setToken:p})}}),Object(O.jsx)(d.b,{path:"*",component:P})]})]})})};n(238),n(239);s.a.render(Object(O.jsx)(c.a.StrictMode,{children:Object(O.jsx)(J,{})}),document.getElementById("root"))}},[[240,1,2]]]);
//# sourceMappingURL=main.bcafb9d7.chunk.js.map