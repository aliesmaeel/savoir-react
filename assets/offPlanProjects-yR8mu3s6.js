import{a as m,p as e,B as N,C as P,y as C,z as k,w as S}from"./chunk-OIYGIGL5-D79BV_4A.js";import{g as D,a as R}from"./offPlan.service-BGgRT3sm.js";import{u as _}from"./useArrow-CIQw7HiP.js";import{u as b}from"./useIcons-CSWW2rNl.js";import{A as O,m as B}from"./proxy-yAaU2hUn.js";import{S as A,a as G}from"./SelectSearch-C_wR2eSE.js";import{S as v}from"./SearchSortBy-t-xmed8u.js";import{C as L}from"./Card-DLoQ_Asu.js";import{a as z}from"./formatPrice-gx4Yvc2f.js";import{u as M}from"./useIsMobile-DSQW0VRi.js";import{P as $}from"./PageLayout-DeQ_RBpu.js";import{C as E}from"./CustomPagination-C-SRL5Ko.js";import"./apiClient-Bl539U1V.js";import"./assertThisInitialized-ByOjVySJ.js";import"./index-CnyDuYXe.js";import"./index-BNuuj8O1.js";function j({options:l,selected:t,onChange:r,label:i="Type",placeholder:o="Select Your Type",maxWidthClass:c="max-w-[211px]"}){const n=_(),f=b(),[p,d]=m.useState(!1),h=m.useRef(null);m.useEffect(()=>{const s=x=>{h.current&&(h.current.contains(x.target)||d(!1))};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]);const g=s=>{const a=(t[0]??null)===s?[]:[s];r(a)},u=m.useMemo(()=>{if(t.length===0)return o;const s=l.find(x=>x.code===t[0]);return(s==null?void 0:s.label)??o},[t,l,o]);return e.jsxs("div",{className:`relative w-full ${c}`,ref:h,children:[e.jsx("button",{type:"button",onClick:()=>d(s=>!s),className:"w-full","aria-haspopup":"listbox","aria-expanded":p,"aria-label":`${i} filter`,children:e.jsxs("div",{className:"flex w-full items-center justify-between gap-[10px]",children:[e.jsx("p",{className:"Jakarta truncate text-[16px] font-semibold leading-none text-black",children:t.length>0?u:i}),e.jsx("div",{className:"flex shrink-0 items-center gap-[12px]",children:e.jsx("img",{loading:"lazy",src:n.smallBoldWhite,alt:"",className:`w-[10px] brightness-0 transition-transform ${p?"rotate-180":""}`})})]})}),e.jsx(O,{initial:!1,children:p&&e.jsx(B.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.2,ease:"easeInOut"},style:{overflow:"hidden"},role:"listbox","aria-multiselectable":"false",className:"absolute left-0 top-[160%] z-10 w-[307px] rounded-[20px] bg-[#4A4A4A] py-[19px] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] lg:w-[382px]",children:e.jsx("div",{className:"flex flex-col items-start gap-[14px] w-full h-[272px] overflow-y-scroll small-scroll",children:l.map((s,x)=>{const a=t[0]===s.code;return e.jsxs("button",{type:"button",role:"option","aria-selected":a,onClick:()=>{g(s.code),d(!1)},className:"w-full text-left px-[32px]",children:[e.jsxs("div",{className:"flex items-center justify-between pb-[14px]",children:[e.jsx("p",{className:"text-white text-[18px] leading-[22px]",children:s.label}),a&&e.jsx("img",{loading:"lazy",src:f.checkGold,alt:""})]}),x<l.length-1&&e.jsx("div",{className:"h-px bg-white/10"})]},s.code)})})})})]})}function F(){const{searchRes:l,filters:t}=N(),[r,i]=m.useState(t.developers??[]),[o,c]=m.useState(t.completion_date?[t.completion_date]:[]),[n,f]=m.useState(t.locations??[]),p=P(),d=C(),h=m.useMemo(()=>(l.developers||[]).map(a=>({label:a,code:a})),[l]),g=m.useMemo(()=>(l.completion_date||[]).map(a=>({label:a,code:a})),[l]),u=((r==null?void 0:r.length)??0)>0||((o==null?void 0:o.length)??0)>0||((n==null?void 0:n.length)??0)>0,s=()=>{const a=new URL(window.location.href);a.searchParams.set("page","1"),r.length?a.searchParams.set("developers",r.join(",")):a.searchParams.delete("developers");const w=o[0];w?a.searchParams.set("date",w):a.searchParams.delete("date"),n.length?a.searchParams.set("locations",n.join(",")):a.searchParams.delete("locations"),p(`${d.pathname}?${a.searchParams.toString()}`,{preventScrollReset:!0})},x=()=>{i([]),c([]),f([]);const a=new URL(window.location.href);a.searchParams.delete("developers"),a.searchParams.delete("date"),a.searchParams.delete("locations"),a.searchParams.set("page","1"),p(`${d.pathname}?${a.searchParams.toString()}`,{preventScrollReset:!0})};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
          .offplan-filter-cormorant,
          .offplan-filter-cormorant *,
          .offplan-filter-cormorant input,
          .offplan-filter-cormorant button,
          .offplan-filter-cormorant span,
          .offplan-filter-cormorant p,
          .offplan-filter-cormorant div {
            font-family: CormorantGaramond, "Cormorant Garamond", serif !important;
            font-weight: 600 !important;
            color: #111111 !important;
            opacity: 1 !important;
          }

          .offplan-filter-cormorant input::placeholder {
            font-family: CormorantGaramond, "Cormorant Garamond", serif !important;
            font-weight: 600 !important;
            color: #111111 !important;
            opacity: 1 !important;
          }

          .offplan-filter-cormorant [class*="absolute"][class*="bg-"] *,
          .offplan-filter-cormorant [class*="fixed"][class*="bg-"] *,
          .offplan-filter-cormorant [class*="rounded"][class*="bg-"] *,
          .offplan-filter-cormorant [class*="shadow"] [class*="cursor"] *,
          .offplan-filter-cormorant [class*="shadow"] button,
          .offplan-filter-cormorant [class*="shadow"] button *,
          .offplan-filter-cormorant [class*="shadow"] li,
          .offplan-filter-cormorant [class*="shadow"] li *,
          .offplan-filter-cormorant [class*="shadow"] p,
          .offplan-filter-cormorant [class*="shadow"] span,
          .offplan-filter-cormorant [role="listbox"] *,
          .offplan-filter-cormorant [role="menu"] *,
          .offplan-filter-cormorant [role="option"],
          .offplan-filter-cormorant [role="option"] *,
          .offplan-filter-cormorant [role="menuitem"],
          .offplan-filter-cormorant [role="menuitem"] * {
            font-family: CormorantGaramond, "Cormorant Garamond", serif !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            opacity: 1 !important;
          }

          body [data-radix-popper-content-wrapper] *,
          body [role="listbox"] *,
          body [role="menu"] *,
          body [role="option"],
          body [role="option"] *,
          body [role="menuitem"],
          body [role="menuitem"] *,
          body [class*="dropdown"] *,
          body [class*="Dropdown"] *,
          body [class*="popover"] *,
          body [class*="Popover"] *,
          body [class*="menu"] li,
          body [class*="menu"] li *,
          body [class*="Menu"] li,
          body [class*="Menu"] li * {
            font-family: CormorantGaramond, "Cormorant Garamond", serif !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            opacity: 1 !important;
          }
        `}),e.jsxs("div",{className:"CormorantGaramond offplan-filter-cormorant relative z-[25] flex w-full flex-col bg-white shadow-[0_12px_34px_rgba(0,0,0,0.1)] lg:h-[58px] lg:flex-row lg:items-stretch",children:[e.jsxs("div",{className:"grid w-full grid-cols-1 border-b border-[#E6E6E6] sm:grid-cols-2 lg:flex lg:w-auto lg:border-b-0",children:[e.jsx("div",{className:"flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[220px]",children:e.jsx(j,{options:h,selected:r,onChange:i,label:"Developer",placeholder:"Select Developer",maxWidthClass:"max-w-full"})}),e.jsx("div",{className:"flex min-h-[54px] items-center border-r border-[#D5D5D5] px-[16px] lg:h-[58px] lg:w-[220px]",children:e.jsx(j,{options:g,selected:o,onChange:c,label:"Completion Date",placeholder:"Completion Date",maxWidthClass:"max-w-full"})})]}),e.jsx("div",{className:"flex min-h-[54px] min-w-0 flex-1 items-center px-[10px] lg:h-[58px] lg:min-w-[320px]",children:e.jsx(A,{variant:"listing",search:l.locations,onChange:f,value:n,placeholder:"Search by location or project...",hideIndicators:!0})}),e.jsxs("div",{className:"flex w-full shrink-0 items-stretch lg:w-auto",children:[e.jsx("div",{className:"w-full shrink-0 lg:w-[112px]",children:e.jsx(G,{onClick:s,variant:"listing",showIcon:!1})}),u&&e.jsx("button",{type:"button",onClick:x,className:"CormorantGaramond w-full border-t border-[#D5D5D5] px-[14px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111111] underline hover:text-[#C6A45A] lg:w-auto lg:border-l lg:border-t-0",children:"Reset"})]})]})]})}function W(){return e.jsxs("div",{className:"relative flex h-[520px] w-full flex-col items-center justify-center lg:h-[350px]",children:[e.jsx("img",{loading:"lazy",src:"/Savoir-website/images/placeholders/hero.webp",alt:"",className:"h-full w-full object-cover brightness-[0.42]"}),e.jsx("div",{className:"absolute inset-0 bg-black/20"}),e.jsxs("div",{className:"absolute left-0 top-0 flex h-full w-full flex-col items-center justify-start pt-[74px] lg:pt-[54px]",children:[e.jsxs("div",{className:"flex w-full flex-col items-center gap-[12px] lg:gap-[20px]",children:[e.jsx(F,{}),e.jsx("div",{className:"mt-[55px] flex w-full flex-col items-center px-[16px] lg:mt-[24px] lg:px-[45px]",children:e.jsx("h1",{className:`
                max-w-[1100px]
                text-center
                text-[30px]
                leading-[1.16]
                text-white
                drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]
                lg:text-[56px]
              `,children:"Discover the Best Off-Plan Projects"})})]}),e.jsx("div",{className:"absolute bottom-0 left-0 z-10 h-[140px] w-full lg:h-[110px]",style:{background:"linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)"}})]})]})}function I({project:l}){const t=b();return e.jsx(L,{className:"w-full max-w-[390px] !bg-white !shadow-[0_4px_16px_rgba(0,0,0,0.12)] lg:max-w-[352px]",children:e.jsxs(k,{to:`/off-plan/${l.slug}`,className:"block w-full px-[18px] pb-[20px] pt-[16px] lg:px-[14px] lg:pb-[14px] lg:pt-[13px]",children:[e.jsxs("div",{className:"relative w-full",children:[e.jsx("img",{loading:"lazy",src:l.image,alt:"",className:"aspect-[386/238] w-full rounded-[10px] object-cover lg:aspect-[386/210]"}),e.jsx("span",{className:"Jakarta absolute left-[14px] top-[14px] rounded-[7px] bg-[#2B2B2B] px-[13px] py-[7px] text-[14px] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(43,43,43,0.16)] lg:left-[12px] lg:top-[12px] lg:px-[11px] lg:py-[6px] lg:text-[13px]",children:"Off-plan"})]}),e.jsx("p",{className:"CormorantGaramond mt-[14px] max-w-[319px] text-[19px] leading-[1.25] text-black lg:mt-[10px] lg:text-[18px] lg:leading-[1.18]",style:{fontWeight:700,opacity:1,textShadow:"0 0 0.18px #111111"},children:l.title}),e.jsxs("div",{className:"mt-[10px] flex flex-col items-start gap-[8px] lg:mt-[7px] lg:gap-[6px]",children:[e.jsxs("div",{className:"flex items-center gap-[6px]",children:[e.jsx("img",{loading:"lazy",src:t.locationBlack,alt:"",className:"w-[20px] lg:w-[17px]"}),e.jsx("p",{className:"Jakarta text-[15px] text-black lg:text-[14px]",style:{fontWeight:550,opacity:1,textShadow:"0 0 0.1px #111111"},children:l.location})]}),e.jsx("div",{className:"flex items-center gap-[6px]",children:e.jsx("p",{className:"Jakarta text-[15px] text-black lg:text-[14px]",style:{fontWeight:550,opacity:1,textShadow:"0 0 0.1px #111111"},children:l.developer})})]}),e.jsx("hr",{className:"mt-[18px] w-full border-[#00000080] lg:mt-[12px]"}),e.jsxs("p",{className:"Jakarta mt-[14px] text-[16px] text-black lg:mt-[10px] lg:text-[14px]",style:{fontWeight:550,opacity:1,textShadow:"0 0 0.1px #111111"},children:["Handover in ",l.completion_date]}),e.jsxs("div",{className:"Jakarta mt-[18px] flex h-[40px] w-full items-center justify-center rounded-[10.5px] bg-[#2B2B2B] px-[18px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(43,43,43,0.16)] transition-all duration-300 hover:bg-[#242424] lg:mt-[12px] lg:h-[36px] lg:px-[14px] lg:text-[14px]",children:["From ",z(l.starting_price)]})]})})}function J({offPlan:l}){_(),b();const t=M();return e.jsxs("div",{className:"flex flex-col items-start gap-[50px] lg:gap-[20px] w-full",children:[e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("div",{className:"flex flex-col items-start gap-[9px] lg:gap-[15px] w-full",children:e.jsx("div",{className:"flex items-center justify-between w-full",children:t&&e.jsx(v,{items:["Name","Date"]})})}),!t&&e.jsx(v,{items:["Name","Date"]})]}),e.jsx("div",{className:"grid grid-cols-1 justify-items-center lg:grid-cols-3 w-full gap-[37px]",children:l.map((r,i)=>e.jsx(I,{project:r},i))})]})}function y(l){return(l??"").split(",").map(t=>t.trim()).filter(Boolean)}async function re({request:l}){const t=new URL(l.url),r=Math.max(1,parseInt(t.searchParams.get("page")||"1",10)),i=6,o=y(t.searchParams.get("developers")),c=y(t.searchParams.get("locations")),n=t.searchParams.get("date"),f=t.searchParams.get("sort_field")||"updated_at",p=t.searchParams.get("sort_order")||"desc",d={developers:o.length?o:null,completion_date:n||null,locations:c.length?c:null};try{const h=await D(),g=await R(r,i,d,f,p),u=g.data??[],s=g.pagination??{},x=s.total_pages??Math.max(1,Math.ceil((Number(s.total)||u.length)/(Number(s.per_page)||i))),a={developers:o,completion_date:n||null,locations:c,hasActive:o.length>0||!!n||c.length>0};return{searchRes:h,offPlan:u,currentPage:Number(s.current_page)||r,totalPages:x,filters:a}}catch{return{searchRes:[],offPlan:[],currentPage:1,totalPages:1,filters:{developers:[],completion_date:null,locations:[],hasActive:!1}}}}const ne=S(function(){const{offPlan:t,currentPage:r,totalPages:i}=N(),o=P(),c=C(),n=f=>{const p=new URL(window.location.href);p.searchParams.set("page",String(f)),o(`${c.pathname}?${p.searchParams.toString()}`,{preventScrollReset:!0})};return e.jsxs("div",{className:"relative",children:[e.jsx(W,{}),e.jsx("div",{className:"relative z-20 lg:-mt-[140px]",children:e.jsxs($,{children:[e.jsx(J,{offPlan:t}),e.jsx(E,{currentPage:r,totalPages:i,onPageChange:n})]})})]})});export{re as clientLoader,ne as default};
