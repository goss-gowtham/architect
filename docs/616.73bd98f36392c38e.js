"use strict";(self.webpackChunkarchitect=self.webpackChunkarchitect||[]).push([[616],{4181:(R,x,l)=>{l.d(x,{Y:()=>f});var f=function(t){return t.master="master",t.admin="admin",t.user="user",t}(f||{})},7772:(R,x,l)=>{l.d(x,{a:()=>g});var f=l(5891),t=l(9853),y=l(6648),M=l(4438),D=l(6139);let g=(()=>{class C{firebaseService;database;storage;constructor(u){this.firebaseService=u,this.database=this.firebaseService.getDatabase(),this.storage=this.firebaseService.getStorage()}getData(u){const _=(0,f.KR)(this.database,u);return(0,y.H)((0,f.Jt)(_).then(h=>h.exists()?h.val():(console.log("No data available"),null)).catch(h=>{throw console.error("Error getting data:",h),h}))}getClients(){return this.getData("clients")}addClient(u,_){const h=(0,f.KR)(this.database,"clients/"+u);return(0,y.H)((0,f.hZ)(h,{name:u,logo:_}).catch(c=>{throw console.error("Error adding client:",c),c}))}uploadFile(u,_){const h=(0,t.KR)(this.storage,_);return(0,y.H)((0,t.D)(h,u).then(()=>(0,t.qk)(h)).catch(c=>{throw console.error("Error uploading file:",c),c}))}getClientLogo(u){const _=(0,f.KR)(this.database,"clients/"+u+"/logo");return(0,y.H)((0,f.Jt)(_).then(h=>h.exists()?h.val():(console.log("No logo available"),"")).catch(h=>{throw console.error("Error getting client logo:",h),h}))}static \u0275fac=function(_){return new(_||C)(M.KVO(D.f))};static \u0275prov=M.jDH({token:C,factory:C.\u0275fac,providedIn:"root"})}return C})()},1279:(R,x,l)=>{l.d(x,{T:()=>g});var f=l(5891),t=l(9853),y=l(6648),M=l(4438),D=l(6139);let g=(()=>{class C{firebaseService;database;storage;constructor(u){this.firebaseService=u,this.database=this.firebaseService.getDatabase(),this.storage=this.firebaseService.getStorage()}addProjectToUser(u,_){const h=(0,f.KR)(this.database,`users/${u}/projects`);return(0,y.H)((0,f.Jt)(h).then(c=>{const p=c.exists()?c.val():[];return p.push({..._,projectId:_.projectId,paid:_.paid||!1}),(0,f.yo)((0,f.KR)(this.database,`users/${u}`),{projects:p})}).catch(c=>{throw console.error("Error adding project to user:",c),c}))}deleteProject(u,_){if(!u)throw new Error("User ID cannot be null");const h=(0,f.KR)(this.database,`users/${u}/projects`);return(0,y.H)((0,f.Jt)(h).then(c=>{if(c.exists()){const p=c.val(),T=p.find(N=>N.projectId===_);if(T){const N=(0,t.KR)(this.storage,T.file);return(0,t.XR)(N).then(()=>{const E=p.filter(O=>O.projectId!==_);return(0,f.yo)((0,f.KR)(this.database,`users/${u}`),{projects:E})})}throw new Error("Project not found")}throw new Error("No projects found for the user")}).then(()=>{console.log("Project and associated file deleted successfully")}).catch(c=>{throw console.error("Error deleting project:",c),c}))}updateProjectPaymentStatus(u,_,h){if(!u)throw new Error("User ID cannot be null");const c=(0,f.KR)(this.database,`users/${u}/projects`);return(0,y.H)((0,f.Jt)(c).then(p=>{if(p.exists()){const N=p.val().map(E=>E.projectId===_?{...E,paid:h}:E);return(0,f.yo)((0,f.KR)(this.database,`users/${u}`),{projects:N})}throw new Error("No projects found for the user")}).catch(p=>{throw console.error("Error updating project payment status:",p),p}))}static \u0275fac=function(_){return new(_||C)(M.KVO(D.f))};static \u0275prov=M.jDH({token:C,factory:C.\u0275fac,providedIn:"root"})}return C})()},1672:(R,x,l)=>{l.d(x,{E8:()=>A,_v:()=>B});var f=l(6939),t=l(4438),y=l(1413),M=l(6977),D=l(9172),g=l(7806),C=l(1377),S=l(6042);function u(s,z){if(1&s&&(t.qex(0),t.nrm(1,"img",4),t.bVm()),2&s){const a=t.XpG(2);t.R7$(),t.Y8G("src",a.nzNotFoundImage,t.B4B)("alt",a.isContentString?a.nzNotFoundContent:"empty")}}function _(s,z){if(1&s&&t.DNE(0,u,2,2,"ng-container",3),2&s){const a=t.XpG();t.Y8G("nzStringTemplateOutlet",a.nzNotFoundImage)}}function h(s,z){1&s&&t.nrm(0,"nz-empty-simple")}function c(s,z){1&s&&t.nrm(0,"nz-empty-default")}function p(s,z){if(1&s&&t.DNE(0,h,1,0,"nz-empty-simple")(1,c,1,0,"nz-empty-default"),2&s){const a=t.XpG();t.vxM("simple"===a.nzNotFoundImage?0:1)}}function T(s,z){if(1&s&&(t.qex(0),t.EFF(1),t.bVm()),2&s){const a=t.XpG(2);t.R7$(),t.SpI(" ",a.isContentString?a.nzNotFoundContent:a.locale.description," ")}}function N(s,z){if(1&s&&(t.j41(0,"p",1),t.DNE(1,T,2,1,"ng-container",3),t.k0s()),2&s){const a=t.XpG();t.R7$(),t.Y8G("nzStringTemplateOutlet",a.nzNotFoundContent)}}function E(s,z){if(1&s&&(t.qex(0),t.EFF(1),t.bVm()),2&s){const a=t.XpG(2);t.R7$(),t.SpI(" ",a.nzNotFoundFooter," ")}}function O(s,z){if(1&s&&(t.j41(0,"div",2),t.DNE(1,E,2,1,"ng-container",3),t.k0s()),2&s){const a=t.XpG();t.R7$(),t.Y8G("nzStringTemplateOutlet",a.nzNotFoundFooter)}}function w(s,z){if(1&s&&t.EFF(0),2&s){const a=t.XpG(2);t.SpI(" ",a.content," ")}}function L(s,z){}function U(s,z){if(1&s&&t.DNE(0,L,0,0,"ng-template",0),2&s){const a=t.XpG(2);t.Y8G("cdkPortalOutlet",a.contentPortal)}}function $(s,z){if(1&s&&t.DNE(0,w,1,1)(1,U,1,1,null,0),2&s){const a=t.XpG();t.vxM("string"===a.contentType?0:1)}}function K(s,z){1&s&&t.nrm(0,"nz-empty",1)}function H(s,z){1&s&&t.nrm(0,"nz-empty",2)}function Y(s,z){1&s&&t.nrm(0,"nz-empty")}function W(s,z){if(1&s&&t.DNE(0,K,1,0,"nz-empty",1)(1,H,1,0,"nz-empty",2)(2,Y,1,0,"nz-empty"),2&s){let a;const d=t.XpG(2);t.vxM("normal"===(a=d.size)?0:"small"===a?1:2)}}function Z(s,z){if(1&s&&t.DNE(0,W,3,1),2&s){const a=t.XpG();t.vxM(null!==a.specificContent?0:-1)}}const J=new t.nKC("nz-empty-component-name");let V=(()=>{class s{static{this.\u0275fac=function(d){return new(d||s)}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["nz-empty-default"]],exportAs:["nzEmptyDefault"],decls:12,vars:0,consts:[["width","184","height","152","viewBox","0 0 184 152","xmlns","http://www.w3.org/2000/svg",1,"ant-empty-img-default"],["fill","none","fill-rule","evenodd"],["transform","translate(24 31.67)"],["cx","67.797","cy","106.89","rx","67.797","ry","12.668",1,"ant-empty-img-default-ellipse"],["d","M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z",1,"ant-empty-img-default-path-1"],["d","M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z","transform","translate(13.56)",1,"ant-empty-img-default-path-2"],["d","M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z",1,"ant-empty-img-default-path-3"],["d","M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z",1,"ant-empty-img-default-path-4"],["d","M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z",1,"ant-empty-img-default-path-5"],["transform","translate(149.65 15.383)",1,"ant-empty-img-default-g"],["cx","20.654","cy","3.167","rx","2.849","ry","2.815"],["d","M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"]],template:function(d,v){1&d&&(t.qSk(),t.j41(0,"svg",0)(1,"g",1)(2,"g",2),t.nrm(3,"ellipse",3)(4,"path",4)(5,"path",5)(6,"path",6)(7,"path",7),t.k0s(),t.nrm(8,"path",8),t.j41(9,"g",9),t.nrm(10,"ellipse",10)(11,"path",11),t.k0s()()())},encapsulation:2,changeDetection:0})}}return s})(),F=(()=>{class s{static{this.\u0275fac=function(d){return new(d||s)}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["nz-empty-simple"]],exportAs:["nzEmptySimple"],decls:6,vars:0,consts:[["width","64","height","41","viewBox","0 0 64 41","xmlns","http://www.w3.org/2000/svg",1,"ant-empty-img-simple"],["transform","translate(0 1)","fill","none","fill-rule","evenodd"],["cx","32","cy","33","rx","32","ry","7",1,"ant-empty-img-simple-ellipse"],["fill-rule","nonzero",1,"ant-empty-img-simple-g"],["d","M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"],["d","M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",1,"ant-empty-img-simple-path"]],template:function(d,v){1&d&&(t.qSk(),t.j41(0,"svg",0)(1,"g",1),t.nrm(2,"ellipse",2),t.j41(3,"g",3),t.nrm(4,"path",4)(5,"path",5),t.k0s()()())},encapsulation:2,changeDetection:0})}}return s})();const G=["default","simple"];let j=(()=>{class s{constructor(a,d){this.i18n=a,this.cdr=d,this.nzNotFoundImage="default",this.isContentString=!1,this.isImageBuildIn=!0,this.destroy$=new y.B}ngOnChanges(a){const{nzNotFoundContent:d,nzNotFoundImage:v}=a;if(d&&(this.isContentString="string"==typeof d.currentValue),v){const b=v.currentValue||"default";this.isImageBuildIn=G.findIndex(X=>X===b)>-1}}ngOnInit(){this.i18n.localeChange.pipe((0,M.Q)(this.destroy$)).subscribe(()=>{this.locale=this.i18n.getLocaleData("Empty"),this.cdr.markForCheck()})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static{this.\u0275fac=function(d){return new(d||s)(t.rXU(C.Og),t.rXU(t.gRc))}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["nz-empty"]],hostAttrs:[1,"ant-empty"],inputs:{nzNotFoundImage:"nzNotFoundImage",nzNotFoundContent:"nzNotFoundContent",nzNotFoundFooter:"nzNotFoundFooter"},exportAs:["nzEmpty"],features:[t.OA$],decls:5,vars:3,consts:[[1,"ant-empty-image"],[1,"ant-empty-description"],[1,"ant-empty-footer"],[4,"nzStringTemplateOutlet"],[3,"src","alt"]],template:function(d,v){1&d&&(t.j41(0,"div",0),t.DNE(1,_,1,1,"ng-container")(2,p,2,1),t.k0s(),t.DNE(3,N,2,1,"p",1)(4,O,2,1,"div",2)),2&d&&(t.R7$(),t.vxM(v.isImageBuildIn?2:1),t.R7$(2),t.vxM(null!==v.nzNotFoundContent?3:-1),t.R7$(),t.vxM(v.nzNotFoundFooter?4:-1))},dependencies:[g.C,g.m,V,F],encapsulation:2,changeDetection:0})}}return s})(),A=(()=>{class s{constructor(a,d,v,b){this.configService=a,this.viewContainerRef=d,this.cdr=v,this.injector=b,this.contentType="string",this.size="",this.destroy$=new y.B}ngOnChanges(a){a.nzComponentName&&(this.size=function k(s){switch(s){case"table":case"list":return"normal";case"select":case"tree-select":case"cascader":case"transfer":return"small";default:return""}}(a.nzComponentName.currentValue)),a.specificContent&&!a.specificContent.isFirstChange()&&(this.content=a.specificContent.currentValue,this.renderEmpty())}ngOnInit(){this.subscribeDefaultEmptyContentChange()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}renderEmpty(){const a=this.content;if("string"==typeof a)this.contentType="string";else if(a instanceof t.C4Q){const d={$implicit:this.nzComponentName};this.contentType="template",this.contentPortal=new f.VA(a,this.viewContainerRef,d)}else if(a instanceof t.ZUJ){const d=t.zZn.create({parent:this.injector,providers:[{provide:J,useValue:this.nzComponentName}]});this.contentType="component",this.contentPortal=new f.A8(a,this.viewContainerRef,d)}else this.contentType="string",this.contentPortal=void 0;this.cdr.detectChanges()}subscribeDefaultEmptyContentChange(){this.configService.getConfigChangeEventForComponent("empty").pipe((0,D.Z)(!0),(0,M.Q)(this.destroy$)).subscribe(()=>{this.content=this.specificContent||this.getUserDefaultEmptyContent(),this.renderEmpty()})}getUserDefaultEmptyContent(){return(this.configService.getConfigForComponent("empty")||{}).nzDefaultEmptyContent}static{this.\u0275fac=function(d){return new(d||s)(t.rXU(S.yx),t.rXU(t.c1b),t.rXU(t.gRc),t.rXU(t.zZn))}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["nz-embed-empty"]],inputs:{nzComponentName:"nzComponentName",specificContent:"specificContent"},exportAs:["nzEmbedEmpty"],features:[t.OA$],decls:2,vars:1,consts:[[3,"cdkPortalOutlet"],["nzNotFoundImage","simple",1,"ant-empty-normal"],["nzNotFoundImage","simple",1,"ant-empty-small"]],template:function(d,v){1&d&&t.DNE(0,$,2,1)(1,Z,1,1),2&d&&t.vxM(v.content?0:1)},dependencies:[j,f.jc,f.I3],encapsulation:2,changeDetection:0})}}return s})(),B=(()=>{class s{static{this.\u0275fac=function(d){return new(d||s)}}static{this.\u0275mod=t.$C({type:s})}static{this.\u0275inj=t.G2t({imports:[j,A]})}}return s})()},9803:(R,x,l)=>{l.d(x,{xY:()=>ut});var f=l(177),t=l(4438),y=l(713),M=l(7806),D=l(5664),g=l(6939),C=l(1413),S=l(5964),u=l(6697),_=l(6042);let w=0;class L{constructor(r,e,n){this.nzSingletonService=r,this.overlay=e,this.injector=n}remove(r){this.container&&(r?this.container.remove(r):this.container.removeAll())}getInstanceId(){return`${this.componentPrefix}-${w++}`}withContainer(r){let e=this.nzSingletonService.getSingletonWithKey(this.componentPrefix);if(e)return e;const n=this.overlay.create({hasBackdrop:!1,scrollStrategy:this.overlay.scrollStrategies.noop(),positionStrategy:this.overlay.position().global()}),i=new g.A8(r,null,this.injector),m=n.attach(i);return n.hostElement.style.zIndex="1010",e||(this.container=e=m.instance,this.nzSingletonService.registerSingletonWithKey(this.componentPrefix,e),this.container.afterAllInstancesRemoved.subscribe(()=>{this.container=void 0,this.nzSingletonService.unregisterSingletonWithKey(this.componentPrefix),n.dispose()})),e}}let U=(()=>{class o{constructor(e,n){this.cdr=e,this.nzConfigService=n,this.instances=[],this._afterAllInstancesRemoved=new C.B,this.afterAllInstancesRemoved=this._afterAllInstancesRemoved.asObservable(),this.destroy$=new C.B,this.updateConfig()}ngOnInit(){this.subscribeConfigChange()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}create(e){const n=this.onCreate(e);return this.instances.length>=this.config.nzMaxStack&&(this.instances=this.instances.slice(1)),this.instances=[...this.instances,n],this.readyInstances(),n}remove(e,n=!1){this.instances.map((i,m)=>({index:m,instance:i})).filter(({instance:i})=>i.messageId===e).forEach(({index:i,instance:m})=>{this.instances.splice(i,1),this.instances=[...this.instances],this.onRemove(m,n),this.readyInstances()}),this.instances.length||this.onAllInstancesRemoved()}removeAll(){this.instances.forEach(e=>this.onRemove(e,!1)),this.instances=[],this.readyInstances(),this.onAllInstancesRemoved()}onCreate(e){return e.options=this.mergeOptions(e.options),e.onClose=new C.B,e}onRemove(e,n){e.onClose.next(n),e.onClose.complete()}onAllInstancesRemoved(){this._afterAllInstancesRemoved.next(),this._afterAllInstancesRemoved.complete()}readyInstances(){this.cdr.detectChanges()}mergeOptions(e){const{nzDuration:n,nzAnimate:i,nzPauseOnHover:m}=this.config;return{nzDuration:n,nzAnimate:i,nzPauseOnHover:m,...e}}static{this.\u0275fac=function(n){return new(n||o)(t.rXU(t.gRc),t.rXU(_.yx))}}static{this.\u0275dir=t.FsC({type:o})}}return o})(),$=(()=>{class o{constructor(e){this.cdr=e,this.destroyed=new t.bkB,this.animationStateChanged=new C.B,this.userAction=!1}ngOnInit(){this.options=this.instance.options,this.options.nzAnimate&&(this.instance.state="enter",this.animationStateChanged.pipe((0,S.p)(e=>"done"===e.phaseName&&"leave"===e.toState),(0,u.s)(1)).subscribe(()=>{clearTimeout(this.closeTimer),this.destroyed.next({id:this.instance.messageId,userAction:this.userAction})})),this.autoClose=this.options.nzDuration>0,this.autoClose&&(this.initErase(),this.startEraseTimeout())}ngOnDestroy(){this.autoClose&&this.clearEraseTimeout(),this.animationStateChanged.complete()}onEnter(){this.autoClose&&this.options.nzPauseOnHover&&(this.clearEraseTimeout(),this.updateTTL())}onLeave(){this.autoClose&&this.options.nzPauseOnHover&&this.startEraseTimeout()}destroy(e=!1){this.userAction=e,this.options.nzAnimate?(this.instance.state="leave",this.cdr.detectChanges(),this.closeTimer=setTimeout(()=>{this.closeTimer=void 0,this.destroyed.next({id:this.instance.messageId,userAction:e})},200)):this.destroyed.next({id:this.instance.messageId,userAction:e})}initErase(){this.eraseTTL=this.options.nzDuration,this.eraseTimingStart=Date.now()}updateTTL(){this.autoClose&&(this.eraseTTL-=Date.now()-this.eraseTimingStart)}startEraseTimeout(){this.eraseTTL>0?(this.clearEraseTimeout(),this.eraseTimer=setTimeout(()=>this.destroy(),this.eraseTTL),this.eraseTimingStart=Date.now()):this.destroy()}clearEraseTimeout(){null!==this.eraseTimer&&(clearTimeout(this.eraseTimer),this.eraseTimer=void 0)}static{this.\u0275fac=function(n){return new(n||o)(t.rXU(t.gRc))}}static{this.\u0275dir=t.FsC({type:o})}}return o})();var V=l(6977),F=l(317),G=l(1025),j=l(6969);const k=(o,r)=>({$implicit:o,data:r}),A=o=>({$implicit:o});function B(o,r){}function s(o,r){if(1&o&&t.DNE(0,B,0,0,"ng-template",1),2&o){const e=t.XpG();t.Y8G("ngTemplateOutlet",e.instance.template)("ngTemplateOutletContext",t.l_i(2,k,e,null==e.instance.options?null:e.instance.options.nzData))}}function z(o,r){1&o&&t.nrm(0,"span",6)}function a(o,r){1&o&&t.nrm(0,"span",7)}function d(o,r){1&o&&t.nrm(0,"span",8)}function v(o,r){1&o&&t.nrm(0,"span",9)}function b(o,r){if(1&o&&(t.qex(0),t.nrm(1,"div",14),t.bVm()),2&o){const e=t.XpG(2);t.R7$(),t.Y8G("innerHTML",e.instance.title,t.npT)}}function X(o,r){if(1&o&&(t.qex(0),t.nrm(1,"div",14),t.bVm()),2&o){const e=t.XpG(2);t.R7$(),t.Y8G("innerHTML",e.instance.content,t.npT)}}function Q(o,r){}function q(o,r){if(1&o&&(t.j41(0,"span",13),t.DNE(1,Q,0,0,"ng-template",1),t.k0s()),2&o){const e=t.XpG(2);t.R7$(),t.Y8G("ngTemplateOutlet",r)("ngTemplateOutletContext",t.eq3(2,A,e))}}function tt(o,r){if(1&o&&(t.j41(0,"div",2)(1,"div",2)(2,"div"),t.DNE(3,z,1,0,"span",6)(4,a,1,0,"span",7)(5,d,1,0,"span",8)(6,v,1,0,"span",9),t.j41(7,"div",10),t.DNE(8,b,2,1,"ng-container",11),t.k0s(),t.j41(9,"div",12),t.DNE(10,X,2,1,"ng-container",11),t.k0s(),t.DNE(11,q,2,4,"span",13),t.k0s()()()),2&o){let e,n;const i=t.XpG();t.R7$(2),t.AVh("ant-notification-notice-with-icon","blank"!==i.instance.type),t.R7$(),t.vxM("success"===(e=i.instance.type)?3:"info"===e?4:"warning"===e?5:"error"===e?6:-1),t.R7$(5),t.Y8G("nzStringTemplateOutlet",i.instance.title),t.R7$(2),t.Y8G("nzStringTemplateOutlet",i.instance.content),t.R7$(),t.vxM((n=null==i.instance.options?null:i.instance.options.nzButton)?11:-1,n)}}function et(o,r){if(1&o&&(t.qex(0),t.nrm(1,"nz-icon",15),t.bVm()),2&o){const e=r.$implicit;t.R7$(),t.Y8G("nzType",e)}}function nt(o,r){if(1&o&&t.DNE(0,et,2,1,"ng-container",11),2&o){const e=t.XpG();t.Y8G("nzStringTemplateOutlet",null==e.instance.options?null:e.instance.options.nzCloseIcon)}}function ot(o,r){1&o&&t.nrm(0,"nz-icon",5)}function it(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","topLeft")}function st(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","topRight")}function at(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","bottomLeft")}function ct(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","bottomRight")}function rt(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","top")}function lt(o,r){if(1&o){const e=t.RV6();t.j41(0,"nz-notification",7),t.bIt("destroyed",function(i){t.eBV(e);const m=t.XpG();return t.Njj(m.remove(i.id,i.userAction))}),t.k0s()}2&o&&t.Y8G("instance",r.$implicit)("placement","bottom")}let pt=(()=>{class o extends ${constructor(e){super(e),this.destroyed=new t.bkB}ngOnDestroy(){super.ngOnDestroy(),this.instance.onClick.complete()}onClick(e){this.instance.onClick.next(e)}close(){this.destroy(!0)}get state(){if("enter"!==this.instance.state)return this.instance.state;switch(this.placement){case"topLeft":case"bottomLeft":return"enterLeft";case"topRight":case"bottomRight":default:return"enterRight";case"top":return"enterTop";case"bottom":return"enterBottom"}}static{this.\u0275fac=function(n){return new(n||o)(t.rXU(t.gRc))}}static{this.\u0275cmp=t.VBU({type:o,selectors:[["nz-notification"]],inputs:{instance:"instance",index:"index",placement:"placement"},outputs:{destroyed:"destroyed"},exportAs:["nzNotification"],features:[t.Vt3],decls:7,vars:7,consts:[[1,"ant-notification-notice","ant-notification-notice-closable",3,"click","mouseenter","mouseleave"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"ant-notification-notice-content"],["tabindex","0",1,"ant-notification-notice-close",3,"click"],[1,"ant-notification-notice-close-x"],["nzType","close",1,"ant-notification-close-icon"],["nz-icon","","nzType","check-circle",1,"ant-notification-notice-icon","ant-notification-notice-icon-success"],["nz-icon","","nzType","info-circle",1,"ant-notification-notice-icon","ant-notification-notice-icon-info"],["nz-icon","","nzType","exclamation-circle",1,"ant-notification-notice-icon","ant-notification-notice-icon-warning"],["nz-icon","","nzType","close-circle",1,"ant-notification-notice-icon","ant-notification-notice-icon-error"],[1,"ant-notification-notice-message"],[4,"nzStringTemplateOutlet"],[1,"ant-notification-notice-description"],[1,"ant-notification-notice-btn"],[3,"innerHTML"],[3,"nzType"]],template:function(n,i){1&n&&(t.j41(0,"div",0),t.bIt("@notificationMotion.done",function(I){return i.animationStateChanged.next(I)})("click",function(I){return i.onClick(I)})("mouseenter",function(){return i.onEnter()})("mouseleave",function(){return i.onLeave()}),t.DNE(1,s,1,5,null,1)(2,tt,12,6,"div",2),t.j41(3,"a",3),t.bIt("click",function(){return i.close()}),t.j41(4,"span",4),t.DNE(5,nt,1,1,"ng-container")(6,ot,1,0,"nz-icon",5),t.k0s()()()),2&n&&(t.Aen((null==i.instance.options?null:i.instance.options.nzStyle)||null),t.HbH((null==i.instance.options?null:i.instance.options.nzClass)||""),t.Y8G("@notificationMotion",i.state),t.R7$(),t.vxM(i.instance.template?1:2),t.R7$(4),t.vxM(null!=i.instance.options&&i.instance.options.nzCloseIcon?5:6))},dependencies:[D.Y3,D.Dn,M.C,M.m,f.T3],encapsulation:2,data:{animation:[y.AJ]}})}}return o})();const P="notification",mt={nzTop:"24px",nzBottom:"24px",nzPlacement:"topRight",nzDuration:4500,nzMaxStack:8,nzPauseOnHover:!0,nzAnimate:!0,nzDirection:"ltr"};let dt=(()=>{class o extends U{constructor(e,n){super(e,n),this.dir="ltr",this.instances=[],this.topLeftInstances=[],this.topRightInstances=[],this.bottomLeftInstances=[],this.bottomRightInstances=[],this.topInstances=[],this.bottomInstances=[];const i=this.nzConfigService.getConfigForComponent(P);this.dir=i?.nzDirection||"ltr"}create(e){const n=this.onCreate(e),i=n.options.nzKey,m=this.instances.find(I=>I.options.nzKey===e.options.nzKey);return i&&m?this.replaceNotification(m,n):(this.instances.length>=this.config.nzMaxStack&&(this.instances=this.instances.slice(1)),this.instances=[...this.instances,n]),this.readyInstances(),n}onCreate(e){return e.options=this.mergeOptions(e.options),e.onClose=new C.B,e.onClick=new C.B,e}subscribeConfigChange(){this.nzConfigService.getConfigChangeEventForComponent(P).pipe((0,V.Q)(this.destroy$)).subscribe(()=>{this.updateConfig();const e=this.nzConfigService.getConfigForComponent(P);if(e){const{nzDirection:n}=e;this.dir=n||this.dir}})}updateConfig(){this.config={...mt,...this.config,...this.nzConfigService.getConfigForComponent(P)},this.top=(0,F.j3)(this.config.nzTop),this.bottom=(0,F.j3)(this.config.nzBottom),this.cdr.markForCheck()}replaceNotification(e,n){e.title=n.title,e.content=n.content,e.template=n.template,e.type=n.type,e.options=n.options}readyInstances(){const e={topLeft:[],topRight:[],bottomLeft:[],bottomRight:[],top:[],bottom:[]};this.instances.forEach(n=>{switch(n.options.nzPlacement){case"topLeft":e.topLeft.unshift(n);break;case"topRight":default:e.topRight.unshift(n);break;case"bottomLeft":e.bottomLeft.unshift(n);break;case"bottomRight":e.bottomRight.unshift(n);break;case"top":e.top.unshift(n);break;case"bottom":e.bottom.unshift(n)}}),this.topLeftInstances=e.topLeft,this.topRightInstances=e.topRight,this.bottomLeftInstances=e.bottomLeft,this.bottomRightInstances=e.bottomRight,this.topInstances=e.top,this.bottomInstances=e.bottom,this.cdr.detectChanges()}mergeOptions(e){const{nzDuration:n,nzAnimate:i,nzPauseOnHover:m,nzPlacement:I}=this.config;return{nzDuration:n,nzAnimate:i,nzPauseOnHover:m,nzPlacement:I,...e}}static{this.\u0275fac=function(n){return new(n||o)(t.rXU(t.gRc),t.rXU(_.yx))}}static{this.\u0275cmp=t.VBU({type:o,selectors:[["nz-notification-container"]],exportAs:["nzNotificationContainer"],features:[t.Vt3],decls:18,vars:40,consts:[[1,"ant-notification","ant-notification-topLeft"],[3,"instance","placement"],[1,"ant-notification","ant-notification-topRight"],[1,"ant-notification","ant-notification-bottomLeft"],[1,"ant-notification","ant-notification-bottomRight"],[1,"ant-notification","ant-notification-top"],[1,"ant-notification","ant-notification-bottom"],[3,"destroyed","instance","placement"]],template:function(n,i){1&n&&(t.j41(0,"div",0),t.Z7z(1,it,1,2,"nz-notification",1,t.fX1),t.k0s(),t.j41(3,"div",2),t.Z7z(4,st,1,2,"nz-notification",1,t.fX1),t.k0s(),t.j41(6,"div",3),t.Z7z(7,at,1,2,"nz-notification",1,t.fX1),t.k0s(),t.j41(9,"div",4),t.Z7z(10,ct,1,2,"nz-notification",1,t.fX1),t.k0s(),t.j41(12,"div",5),t.Z7z(13,rt,1,2,"nz-notification",1,t.fX1),t.k0s(),t.j41(15,"div",6),t.Z7z(16,lt,1,2,"nz-notification",1,t.fX1),t.k0s()),2&n&&(t.xc7("top",i.top)("left","0px"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.topLeftInstances),t.R7$(2),t.xc7("top",i.top)("right","0px"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.topRightInstances),t.R7$(2),t.xc7("bottom",i.bottom)("left","0px"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.bottomLeftInstances),t.R7$(2),t.xc7("bottom",i.bottom)("right","0px"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.bottomRightInstances),t.R7$(2),t.xc7("top",i.top)("left","50%")("transform","translateX(-50%)"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.topInstances),t.R7$(2),t.xc7("bottom",i.bottom)("left","50%")("transform","translateX(-50%)"),t.AVh("ant-notification-rtl","rtl"===i.dir),t.R7$(),t.Dyx(i.bottomInstances))},dependencies:[pt],encapsulation:2,changeDetection:0})}}return o})(),ft=0,ut=(()=>{class o extends L{constructor(e,n,i){super(e,n,i),this.componentPrefix="notification-"}success(e,n,i){return this.create("success",e,n,i)}error(e,n,i){return this.create("error",e,n,i)}info(e,n,i){return this.create("info",e,n,i)}warning(e,n,i){return this.create("warning",e,n,i)}blank(e,n,i){return this.create("blank",e,n,i)}create(e,n,i,m){return this.createInstance({type:e,title:n,content:i},m)}template(e,n){return this.createInstance({template:e},n)}generateMessageId(){return`${this.componentPrefix}-${ft++}`}createInstance(e,n){return this.container=this.withContainer(dt),this.container.create({...e,createdAt:new Date,messageId:n?.nzKey||this.generateMessageId(),options:n})}static{this.\u0275fac=function(n){return new(n||o)(t.KVO(G.HL),t.KVO(j.hJ),t.KVO(t.zZn))}}static{this.\u0275prov=t.jDH({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})()},6368:(R,x,l)=>{l.d(x,{A:()=>h});const t={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let y;const M=new Uint8Array(16);function D(){if(!y){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");y=crypto.getRandomValues.bind(crypto)}return y(M)}const g=[];for(let c=0;c<256;++c)g.push((c+256).toString(16).slice(1));const h=function _(c,p,T){if(t.randomUUID&&!p&&!c)return t.randomUUID();const N=(c=c||{}).random||(c.rng||D)();if(N[6]=15&N[6]|64,N[8]=63&N[8]|128,p){T=T||0;for(let E=0;E<16;++E)p[T+E]=N[E];return p}return function C(c,p=0){return(g[c[p+0]]+g[c[p+1]]+g[c[p+2]]+g[c[p+3]]+"-"+g[c[p+4]]+g[c[p+5]]+"-"+g[c[p+6]]+g[c[p+7]]+"-"+g[c[p+8]]+g[c[p+9]]+"-"+g[c[p+10]]+g[c[p+11]]+g[c[p+12]]+g[c[p+13]]+g[c[p+14]]+g[c[p+15]]).toLowerCase()}(N)}}}]);