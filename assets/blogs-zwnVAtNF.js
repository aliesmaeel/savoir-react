import{B as h,C as f,y as u,a as b,p as e,w}from"./chunk-OIYGIGL5-D79BV_4A.js";import{B as j,g as v}from"./BlogCard-BRIigT9S.js";import{C as N}from"./CustomPagination-C-SRL5Ko.js";import{P as _}from"./PageLayout-DeQ_RBpu.js";import"./apiClient-Bl539U1V.js";import"./useIcons-CSWW2rNl.js";import"./Card-DLoQ_Asu.js";function y(){const{blogs:i,currentPage:r,totalPages:c,total:x}=h(),p=f(),o=u(),[a,n]=b.useState(!1),d=new URLSearchParams(o.search).get("sort_field")||"title",m=t=>{const s=new URL(window.location.href);s.searchParams.set("page",String(t)),p(`${o.pathname}?${s.searchParams.toString()}`,{preventScrollReset:!0})},g=t=>{const s=new URL(window.location.href);s.searchParams.set("sort_field",t),s.searchParams.set("page","1"),p(`${o.pathname}?${s.searchParams.toString()}`,{preventScrollReset:!0}),n(!1)};return e.jsxs("div",{className:"flex w-full flex-col items-start gap-[50px]",children:[e.jsxs("div",{className:"flex w-full flex-col items-start justify-between gap-[18px] lg:flex-row lg:items-center",children:[e.jsx("div",{className:"flex max-w-[835px] flex-col items-start gap-[9px] lg:gap-[15px]",children:e.jsxs("div",{className:"flex flex-col items-start gap-[4px]",children:[e.jsx("p",{className:"CormorantGaramond text-[14px] leading-[1.45] lg:text-[22px]",style:{color:"#111111",fontWeight:700,opacity:1},children:"Here, you can find articles covering a variety of topics that interest you"}),e.jsxs("p",{className:"CormorantGaramond text-[14px] leading-[1.2] lg:text-[22px]",style:{color:"#111111",fontWeight:700,opacity:1},children:[x," results"]})]})}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{type:"button",onClick:()=>n(t=>!t),className:`
              flex h-[38px] min-w-[190px] items-center justify-between
              rounded-[10px] bg-[#2B2B2B] px-[16px]
              shadow-[0_10px_24px_rgba(43,43,43,0.18)]
              transition-all duration-300 hover:bg-[#242424]
              lg:h-[40px] lg:min-w-[205px] lg:px-[17px]
            `,children:[e.jsxs("div",{className:"flex items-center gap-[13px]",children:[e.jsx("span",{className:"text-[19px] font-semibold leading-none text-white",children:"⇅"}),e.jsx("span",{className:"h-[22px] w-px bg-white/45"}),e.jsxs("span",{className:"text-[13px] font-semibold text-white lg:text-[14px]",children:["Sort by : ",d==="date"?"Date":"Title"]})]}),e.jsx("span",{className:"flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white/70 bg-[#2B2B2B] text-[14px] font-bold leading-none text-white",children:a?"⌃":"⌄"})]}),a&&e.jsxs("div",{className:"absolute right-0 top-[48px] z-30 w-full overflow-hidden rounded-[10px] bg-[#2B2B2B] shadow-[0_12px_28px_rgba(43,43,43,0.22)]",children:[e.jsx("button",{type:"button",onClick:()=>g("title"),className:"flex h-[38px] w-full items-center px-[16px] text-left text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#242424]",children:"Title"}),e.jsx("button",{type:"button",onClick:()=>g("date"),className:"flex h-[38px] w-full items-center px-[16px] text-left text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#242424]",children:"Date"})]})]})]}),e.jsx("div",{className:`
          grid w-full grid-cols-1 gap-x-[30px] gap-y-[45px] lg:grid-cols-3

          [&_p]:!text-[#111111]
          [&_p]:!font-semibold
          [&_p]:!opacity-100
          [&_h1]:!text-[#111111]
          [&_h1]:!font-bold
          [&_h2]:!text-[#111111]
          [&_h2]:!font-bold
          [&_h3]:!text-[#111111]
          [&_h3]:!font-bold
          [&_span]:!text-[#111111]
          [&_span]:!font-semibold
          [&_span]:!opacity-100
          [&_a]:!font-semibold
        `,children:i.map((t,s)=>e.jsx(j,{blog:t},t.id||s))}),e.jsx(N,{currentPage:r,totalPages:c,onPageChange:m})]})}function P(){return e.jsxs("div",{className:"relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",children:[e.jsx("img",{loading:"lazy",src:"/Savoir-website/images/placeholders/hero.webp",alt:"",className:"h-screen w-full object-cover brightness-[0.42]"}),e.jsxs("div",{className:"absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center px-[16px] lg:px-[45px]",children:[e.jsx("div",{className:"absolute inset-0 bg-black/20"}),e.jsx("div",{className:"relative z-10 flex w-full max-w-[1226px] flex-col items-center",children:e.jsx("h1",{className:`
              CormorantGaramond
              text-center
              text-[32px]
              leading-[1.12]
              text-white
              drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]
              lg:text-[64px]
            `,style:{fontWeight:500,opacity:1,textShadow:"0 4px 18px rgba(0,0,0,0.75)"},children:"Our Blogs"})}),e.jsx("div",{className:"absolute bottom-0 left-0 z-10 h-[176px] w-full",style:{background:"linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)"}})]})]})}async function F({request:i}){const r=new URL(i.url),c=Math.max(1,parseInt(r.searchParams.get("page")||"1",10)),x=9,p=r.searchParams.get("sort_field")||"title",o=r.searchParams.get("sort_order")||"desc";try{const a=await v(c,x,p,o),n=a.data??[],l=a.pagination??{},d=l.last_page??Math.max(1,Math.ceil((Number(l.total)||n.length)/(Number(l.per_page)||x)));return{blogs:n,currentPage:Number(l.current_page)||c,totalPages:d,total:Number(l.total)||n.length}}catch{return{blogs:[],currentPage:1,totalPages:1,total:0}}}const M=w(function(){return e.jsxs("div",{children:[e.jsx(P,{}),e.jsx(_,{children:e.jsx(y,{})})]})});export{F as clientLoader,M as default};
