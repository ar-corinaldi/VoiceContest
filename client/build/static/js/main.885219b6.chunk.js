(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{173:function(e,t,n){},174:function(e,t,n){},255:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(29),s=n.n(r),o=(n(173),n(21)),i=n.n(o),l=n(30),j=n(26),u=(n(174),n(73)),b=n(48),d=n(28),p=n(34),O=n(165),h=n(6),x=function(e){var t=e.component,n=e.isSignedIn,a=Object(O.a)(e,["component","isSignedIn"]);return Object(h.jsx)(d.b,Object(p.a)(Object(p.a)({},a),{},{render:function(e){return n?Object(h.jsx)(t,Object(p.a)({},e)):Object(h.jsx)(d.a,{to:"/"})}}))},m=n(257),f=n(263),v=n(258),g=n(261),y=n(262),k=n(36);function C(){return w.apply(this,arguments)}function w(){return(w=Object(l.a)(i.a.mark((function e(){var t,n,a,c,r,s,o,l,j,u,b,d=arguments;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=d.length>0&&void 0!==d[0]?d[0]:"/",n=d.length>1&&void 0!==d[1]?d[1]:"GET",a=d.length>2?d[2]:void 0,c=d.length>3?d[3]:void 0,r="".concat("http://104.154.109.18").concat(t),console.log("production"),r="".concat("http://104.154.109.18").concat(t),console.log("URL FINAL: ",r),e.prev=8,s="JWT ".concat(c),o=r,(l=new Headers).append("Content-Type","application/json"),"GET"!==n){e.next=27;break}if(!c){e.next=22;break}return(u=new Headers).append("Authorization",s),e.next=19,fetch(o,{headers:u});case 19:j=e.sent,e.next=25;break;case 22:return e.next=24,fetch(o);case 24:j=e.sent;case 25:e.next=45;break;case 27:if("POST"!==n&&"PUT"!==n){e.next=34;break}return c&&l.append("Authorization",s),e.next=31,fetch(o,{method:n,body:JSON.stringify(a),headers:l});case 31:j=e.sent,e.next=45;break;case 34:if("DELETE"!==n){e.next=45;break}if(!c){e.next=42;break}return l.append("Authorization",s),e.next=39,fetch(o,{method:n,headers:l});case 39:j=e.sent,e.next=45;break;case 42:return e.next=44,fetch(o,{method:n});case 44:j=e.sent;case 45:if(j.ok){e.next=51;break}return e.t0=Error,e.next=49,j.json().error;case 49:throw e.t1=e.sent,new e.t0(e.t1);case 51:return e.next=53,j.json();case 53:return b=e.sent,e.abrupt("return",b);case 57:return e.prev=57,e.t2=e.catch(8),console.error("error",e.t2),e.abrupt("return",{error:e.t2});case 61:case"end":return e.stop()}}),e,null,[[8,57]])})))).apply(this,arguments)}var I={labelCol:{span:8},wrapperCol:{span:16}},T={wrapperCol:{offset:8,span:16}},S=function(){var e=Object(a.useState)(!1),t=Object(j.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)({}),s=Object(j.a)(r,2),o=s[0],u=s[1],b=Object(a.useContext)(B),d=(b.admin,b.setAdmin),O=b.setToken,x=b.token,w=function(){var e=Object(l.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C("/auth","POST",t);case 3:if("Invalid credentials"!==(n=e.sent).description&&!n.error){e.next=7;break}return u(t),e.abrupt("return",S());case 7:if(!n.access_token){e.next=11;break}return O(n.access_token),d(t),e.abrupt("return");case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(0),console.error("error",e.t0);case 16:case"end":return e.stop()}}),e,null,[[0,13]])})));return function(t){return e.apply(this,arguments)}}(),S=function(){c(!0)},E=function(){var e=Object(l.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c(!1),e.next=3,C("/users","POST",o,x);case 3:(t=e.sent)&&!t.error&&w(o);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(h.jsxs)(m.a,{className:"mt-4",children:[Object(h.jsx)(f.a,{title:"Crear Cuenta",visible:n,onOk:E,onCancel:function(){c(!1)},children:Object(h.jsx)("p",{children:"Email No Existe Desea Crear Una Nueva Cuenta"})}),Object(h.jsx)(v.a,{span:12,offset:6,children:Object(h.jsxs)(g.a,Object(p.a)(Object(p.a)({},I),{},{name:"basic",onFinish:w,onFinishFailed:function(e){console.error("Failed:",e)},children:[Object(h.jsx)(g.a.Item,{label:"Usuario",name:"username",rules:[{required:!0,message:"Campo obligatorio!"}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Campo obligatorio!"}],children:Object(h.jsx)(y.a.Password,{})}),Object(h.jsx)(g.a.Item,Object(p.a)(Object(p.a)({},T),{},{children:Object(h.jsx)(k.a,{type:"primary",htmlType:"submit",children:"Submit"})}))]}))})]})},E=n(259),N=n(58),U=n(117),_=n(260),F=n(153),P=_.a.RangePicker,q={labelCol:{span:8},wrapperCol:{span:16}},D={required:"${label} is required!",types:{email:"${label} is not a valid email!",number:"${label} is not a valid number!"},number:{range:"${label} must be between ${min} and ${max}"}},A=function(e){var t=e.setContests,n=Object(a.useContext)(B).token,c=function(){var e=Object(l.a)(i.a.mark((function e(a){var c,r,s,o,l,j,u,b,d,p,O;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=a.startEndDate[0]._d,r=a.startEndDate[1]._d,s="".concat(c.getUTCDate()<=9?"0".concat(c.getUTCDate()):c.getUTCDate(),"-").concat(c.getUTCMonth()+1<=9?"0".concat(c.getUTCMonth()+1):"".concat(c.getUTCMonth()+1),"-").concat(c.getUTCFullYear()),o="".concat(r.getUTCDate()<=9?"0".concat(r.getUTCDate()):r.getUTCDate(),"-").concat(r.getUTCMonth()+1<=9?"0".concat(c.getUTCMonth()+1):"".concat(c.getUTCMonth()+1),"-").concat(r.getUTCFullYear()),l=a.name,j=a.script,u=a.bannerPath,b=a.recommendations,d=a.payment,p={name:l,script:j,banner_path:u,start_date:s,finish_date:o,recommendations:b,payment:d,url:Object(F.v4)()},e.next=8,C("/contests","POST",p,n);case 8:O=e.sent,t((function(e){return[O].concat(Object(U.a)(e))}));case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(h.jsxs)(g.a,Object(p.a)(Object(p.a)({},q),{},{name:"nest-messages",onFinish:function(e){return c(e)},validateMessages:D,children:[Object(h.jsx)(g.a.Item,{name:"name",label:"Nombre",rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"bannerPath",label:"Banner",rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"payment",label:"Pago",rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"startEndDate",label:"Fecha",rules:[{required:!0}],children:Object(h.jsx)(P,{})}),Object(h.jsx)(g.a.Item,{name:"script",label:"Gui\xf3n",rules:[{required:!0}],children:Object(h.jsx)(y.a.TextArea,{})}),Object(h.jsx)(g.a.Item,{name:"recommendations",label:"Recomendaciones",rules:[{required:!0}],children:Object(h.jsx)(y.a.TextArea,{})}),Object(h.jsx)(g.a.Item,{wrapperCol:Object(p.a)(Object(p.a)({},q.wrapperCol),{},{offset:8}),children:Object(h.jsx)(k.a,{type:"primary",htmlType:"submit",children:"Submit"})})]}))},$=[{title:"URL",dataIndex:"url",key:"url",render:function(e,t){return Object(h.jsx)(b.b,{to:"/".concat(t.url,"/home"),children:e})}},{title:"Nombre",dataIndex:"name",key:"name"},{title:"Fecha Inicio",dataIndex:"start_date",key:"start_date"},{title:"Pago",dataIndex:"payment",key:"payment"}],M=function(){var e=Object(a.useState)([]),t=Object(j.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(!1),s=Object(j.a)(r,2),o=s[0],u=s[1],b=Object(a.useContext)(B).token;return Object(a.useEffect)((function(){function e(){return(e=Object(l.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C("/contests","GET",null,b);case 2:(t=e.sent).error||c(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}try{u(!0),function(){e.apply(this,arguments)}()}catch(t){console.error("error",t)}finally{u(!1)}}),[b,c]),o?Object(h.jsx)(m.a,{className:"mt-4",children:Object(h.jsx)(v.a,{children:Object(h.jsx)(N.a,{style:{fontSize:24},spin:!0})})}):Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(m.a,{className:"mt-4",children:Object(h.jsx)(v.a,{children:Object(h.jsx)(A,{setContests:c})})}),Object(h.jsx)(m.a,{children:Object(h.jsx)(v.a,{span:24,children:Object(h.jsx)(E.a,{dataSource:n,columns:$})})})]})},z=function(){return Object(h.jsxs)("div",{children:[Object(h.jsx)("p",{children:'Click para redireccionar a "/" que es una ruta conocida:'}),Object(h.jsx)(b.b,{to:"/",children:"Click!!"})]})},G=n(264),L=n(157);var V=function(e){var t=e.voice,n=e.page,c=e.idx,r=e.contest,s=e.setVoices,o=Object(a.useState)(!1),u=Object(j.a)(o,2),b=u[0],d=u[1],p=Object(a.useContext)(B).token,O=Object(a.useState)(""),x=Object(j.a)(O,2),m=x[0],f=x[1];Object(a.useEffect)((function(){d(!0);try{f("".concat("http://104.154.109.18","/").concat(r.id,"/").concat(t.id)),console.log(m)}finally{d(!1)}}),[f,r.id,t.id]);var g=function(){var e=Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C("/contests/".concat(r.id,"/voices/").concat(t.id),"DELETE",void 0,p);case 3:e.sent.error||s((function(e){return e.filter((function(e){return e.id!==t.id}))})),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("error",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}(),y=function(){var e=Object(l.a)(i.a.mark((function e(){var t,n,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(m),e.next=3,fetch(m);case 3:return t=e.sent,console.log(t),e.next=7,t.blob();case 7:n=e.sent,console.log(n),(a=document.createElement("a")).href="".concat(m,"/downloadVoiceConverted"),a.target="_blank",a.click();case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(h.jsx)(v.a,{className:"m-3",children:Object(h.jsxs)("div",{className:"card",children:[Object(h.jsxs)("h5",{className:"card-header",children:["Audio # ",c+20*(n-1)+1]}),Object(h.jsxs)("div",{className:"card-body",children:[Object(h.jsx)("h5",{className:"card-title",children:t.name+" "+t.last_name}),Object(h.jsx)("p",{className:"card-text",children:t.email}),Object(h.jsxs)("div",{className:"d-flex justify-center",children:[Object(h.jsx)(k.a,{onClick:Object(l.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(t=document.createElement("a")).href="".concat(m,"/downloadVoiceOriginal"),t.target="_blank",t.click();case 4:case"end":return e.stop()}}),e)}))),className:"btn btn-primary",children:"Descargar Original"}),Object(h.jsx)(k.a,{onClick:y,className:"btn btn-secondary",children:"Descargar Convertida"})]}),b&&!m(Object(h.jsx)("div",{class:"spinner-border",role:"status",children:Object(h.jsx)("span",{class:"sr-only",children:"Loading..."})})),!b&&m&&Object(h.jsx)("audio",{controls:!0,children:Object(h.jsx)("source",{id:"original",src:"".concat(m,"/downloadVoiceConverted"),type:"audio/mp3"})})]}),!!p&&Object(h.jsx)(k.a,{type:"primary",onClick:g,danger:!0,children:"Eliminar"})]})},t.id)},R={labelCol:{span:8},wrapperCol:{span:16}},H={required:"${label} is required!",types:{email:"${label} is not a valid email!",number:"${label} is not a valid number!"},number:{range:"${label} must be between ${min} and ${max}"}},J=function(){var e=Object(a.useState)(""),t=Object(j.a)(e,2),n=t[0],r=t[1],s=Object(a.useState)(""),o=Object(j.a)(s,2),u=o[0],O=o[1],x=Object(a.useState)(""),f=Object(j.a)(x,2),w=f[0],I=f[1],T=Object(a.useState)(),S=Object(j.a)(T,2),E=S[0],_=S[1],F=Object(a.useState)(""),P=Object(j.a)(F,2),q=P[0],D=P[1],A=Object(a.useState)(),$=Object(j.a)(A,2),M=$[0],z=$[1],J=Object(a.useState)([]),Y=Object(j.a)(J,2),K=Y[0],W=Y[1],Q=Object(a.useState)(!0),X=Object(j.a)(Q,2),Z=X[0],ee=X[1],te=Object(a.useState)(1),ne=Object(j.a)(te,2),ae=ne[0],ce=ne[1],re=Object(a.useState)(0),se=Object(j.a)(re,2),oe=se[0],ie=se[1],le=Object(a.useState)(!1),je=Object(j.a)(le,2),ue=je[0],be=je[1],de=Object(d.h)().contestUrl,pe=Object(a.useContext)(B).token,Oe=Object(d.g)();Object(a.useEffect)((function(){function e(){return(e=Object(l.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,ee(!0),e.next=4,C("/contests/".concat(t),"GET",null,pe);case 4:(n=e.sent).error||(z(n),console.log(n)),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.error("error",e.t0);case 11:return e.prev=11,ee(!1),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[0,8,11,14]])})))).apply(this,arguments)}!function(t){e.apply(this,arguments)}(de)}),[de,z,pe]),Object(a.useEffect)((function(){function e(){return(e=Object(l.a)(i.a.mark((function e(t){var n,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,ee(!0),e.next=4,C("/contests/".concat(t,"/voices/").concat(ae),"GET",null,null);case 4:return n=e.sent,e.next=7,C("/".concat(t,"/getLenVoices"),"GET");case 7:a=e.sent,console.log(a),console.log("newVoices",n),n.error||W(n),a.error||(console.log(a.totalVoices),ie(a.totalVoices)),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(0),console.error("error",e.t0);case 17:return e.prev=17,ee(!1),e.finish(17);case 20:case"end":return e.stop()}}),e,null,[[0,14,17,20]])})))).apply(this,arguments)}M&&M.id&&function(t){e.apply(this,arguments)}(M.id)}),[M,ee,W,ae]);var he=function(){var e=Object(l.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C("/contests/".concat(de),"PUT",t,pe);case 3:(n=e.sent).error||z(n),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("paila",e.t0);case 10:return e.prev=10,be(!1),e.finish(10);case 13:case"end":return e.stop()}}),e,null,[[0,7,10,13]])})));return function(t){return e.apply(this,arguments)}}(),xe=function(){var e=Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C("/contests/".concat(de),"DELETE",void 0,pe);case 3:e.sent.error||Oe.push("/"),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("error",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}();function me(){return(me=Object(l.a)(i.a.mark((function e(){var t,a,c,r,s,o;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={name:n,last_name:u,email:w,observation_message:q},e.next=4,C("/contests/".concat(M.id,"/voices/").concat(ae),"POST",t,pe);case 4:if(a=e.sent,console.log(a),a.error){e.next=20;break}return(c=new FormData).append("audio_file",E),r="".concat("http://104.154.109.18","/contests/").concat(M.id,"/voices/").concat(a.id),console.log("ENDPOINT FETCH PUT:",r),console.log(E,c),e.next=14,fetch(r,{method:"PUT",body:c});case 14:return s=e.sent,console.log("RESPONSE FETCH PUT:",s),e.next=18,s.json();case 18:o=e.sent,W((function(e){return[].concat(Object(U.a)(e),[o])}));case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(0),console.error("error subiendo voz",e.t0);case 25:return e.prev=25,e.finish(25);case 27:case"end":return e.stop()}}),e,null,[[0,22,25,27]])})))).apply(this,arguments)}return Z?Object(h.jsx)(m.a,{className:"mt-4",children:Object(h.jsx)(v.a,{children:Object(h.jsx)(N.a,{style:{fontSize:24},spin:!0})})}):M?Object(h.jsxs)(c.a.Fragment,{children:[Object(h.jsx)(m.a,{className:"mt-4",children:Object(h.jsxs)(v.a,{span:24,children:[pe&&Object(h.jsx)(b.b,{to:"/",children:"Ir a Concursos"}),!ue&&Object(h.jsxs)(G.b,{title:"Informaci\xf3n del Concurso",bordered:!0,children:[Object(h.jsx)(G.b.Item,{label:"Nombre",children:M.name}),Object(h.jsx)(G.b.Item,{label:"Pago",children:M.payment}),Object(h.jsx)(G.b.Item,{label:"Fecha Inicial",span:6,children:M.start_date}),Object(h.jsx)(G.b.Item,{label:"Fecha Final",span:6,children:M.finish_date}),Object(h.jsx)(G.b.Item,{label:"Gui\xf3n",span:6,children:M.script}),Object(h.jsx)(G.b.Item,{label:"Recomendaciones",span:6,children:M.recommendations})]}),ue&&Object(h.jsxs)(g.a,Object(p.a)(Object(p.a)({},R),{},{validateMessages:!0,onFinish:he,children:[Object(h.jsx)(g.a.Item,{name:"name",label:"Nombre",children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"payment",label:"Pago",children:Object(h.jsx)(y.a,{type:"number"})}),Object(h.jsx)(g.a.Item,{name:"start_date",label:"Fecha Inicial",children:Object(h.jsx)(y.a,{type:"datetime-local"})}),Object(h.jsx)(g.a.Item,{name:"finish_date",label:"Fecha Final",children:Object(h.jsx)(y.a,{type:"datetime-local"})}),Object(h.jsx)(g.a.Item,{name:"banner_path",label:"Banner",children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"script",label:"Gui\xf3n",children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"recommendations",label:"Recomendaciones",children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{wrapperCol:{offset:8},children:Object(h.jsx)(k.a,{type:"primary",htmlType:"submit",children:"Submit"})})]}))]})}),Object(h.jsxs)(m.a,{justify:"center",hidden:!pe,children:[Object(h.jsx)(v.a,{className:"p-3",children:Object(h.jsx)(k.a,{type:"primary",onClick:function(){return be(!ue)},children:ue?"Dejar de editar":"Editar"})}),Object(h.jsx)(v.a,{className:"p-3",children:Object(h.jsx)(k.a,{type:"primary",onClick:xe,danger:!0,children:"Eliminar"})})]}),Object(h.jsxs)(m.a,{justify:"space-around",children:[Object(h.jsx)(v.a,{children:Object(h.jsxs)(g.a,{name:"nest-messages",validateMessages:H,encType:"multipart/form-data",children:[Object(h.jsx)(g.a.Item,{name:"name",label:"Nombre",onChange:function(e){return r(e.target.value)},rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"last_name",label:"Apellido",onChange:function(e){return O(e.target.value)},rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"email",label:"Correo electr\xf3nico",onChange:function(e){return I(e.target.value)},rules:[{required:!0}],children:Object(h.jsx)(y.a,{})}),Object(h.jsx)(g.a.Item,{name:"original_voice_file_path",label:"Archivo de voz",onChange:function(e){return _(e.target.files[0])},rules:[{required:!0}],children:Object(h.jsx)(y.a,{type:"file"})}),Object(h.jsx)(g.a.Item,{name:"observation_message",label:"Observaciones",onChange:function(e){return D(e.target.value)},rules:[{required:!0}],children:Object(h.jsx)(y.a.TextArea,{})}),Object(h.jsx)(g.a.Item,{wrapperCol:{offset:8},children:Object(h.jsx)(k.a,{type:"primary",htmlType:"submit",onClick:function(){return function(){return me.apply(this,arguments)}()},children:"Submit"})})]})}),Object(h.jsxs)(v.a,{children:[Object(h.jsxs)(m.a,{justify:"center",children:[K&&0===K.length&&Object(h.jsx)("div",{children:"No hay voces!"}),K&&K.map((function(e,t){return Object(h.jsx)(V,{voice:e,idx:t,contest:M,page:ae,setVoices:W},e.id)}))]}),Object(h.jsx)(m.a,{justify:"center",children:Object(h.jsx)(v.a,{children:Object(h.jsx)(L.a,{defaultCurrent:ae,pageSize:40,total:oe,onChange:function(e){return ce(e)}})})})]})]})]}):Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(m.a,{children:Object(h.jsx)(v.a,{children:Object(h.jsx)("h3",{children:"Concurso no encontrado! Click para redireccionar"})})}),Object(h.jsx)(m.a,{children:Object(h.jsx)(v.a,{children:Object(h.jsx)("h3",{children:Object(h.jsx)(b.b,{to:"/",children:"Inicio"})})})})]})},B=Object(a.createContext)();var Y=function(){var e=Object(a.useState)(),t=Object(j.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(""),s=Object(j.a)(r,2),o=s[0],p=s[1],O=Object(a.useMemo)((function(){return{admin:n,setAdmin:c,token:o,setToken:p}}),[c,n,o,p]),m=function(){var e=Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c(void 0),p(void 0);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(h.jsx)("div",{className:"App",children:Object(h.jsx)(b.a,{children:Object(h.jsxs)(B.Provider,{value:O,children:[Object(h.jsx)(u.a,{theme:"dark",mode:"horizontal",defaultSelectedKeys:["1"],children:Object(h.jsx)(u.a.Item,{children:o?Object(h.jsx)(b.b,{to:"/",onClick:m,children:"Cerrar Sesion"}):Object(h.jsx)(b.b,{to:"/",children:"Login"})},"1")}),Object(h.jsxs)(d.d,{children:[Object(h.jsx)(d.b,{path:"/",exact:!0,component:function(){return n?Object(h.jsx)(x,{path:"/",exact:!0,isSignedIn:!!n,component:function(){return Object(h.jsx)(M,{})}}):Object(h.jsx)(S,{})}}),Object(h.jsx)(d.b,{path:"/:contestUrl/home",exact:!0,component:function(){return Object(h.jsx)(J,{})}}),Object(h.jsx)(d.b,{path:"*",component:z})]})]})})})};n(253),n(254);s.a.render(Object(h.jsx)(c.a.StrictMode,{children:Object(h.jsx)(Y,{})}),document.getElementById("root"))}},[[255,1,2]]]);
//# sourceMappingURL=main.885219b6.chunk.js.map