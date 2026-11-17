import{A as l}from"./apiClient-Bl539U1V.js";import{p as t,z as n}from"./chunk-OIYGIGL5-D79BV_4A.js";import{C as i}from"./Card-DLoQ_Asu.js";const s=new l;async function o(e,a){return s.get(`/api/news?page=${e}&limit=${a}`)}async function c(e){return s.get(`/api/news/${e}`)}async function d(e){return s.get(`/api/updateShares/${e}?type=news`)}function g({newsItem:e}){return t.jsx(i,{className:"!rounded-[46.534px] !px-[23px] !py-[27px]",children:t.jsxs("div",{className:"flex w-full flex-col items-start gap-[21px]",children:[t.jsx("img",{loading:"lazy",src:e.image,alt:"",className:"aspect-[375/277] w-full rounded-[10px] object-cover"}),t.jsxs("div",{className:"flex flex-col items-start gap-[11px]",children:[t.jsxs("div",{className:"flex flex-col items-start gap-[4px]",children:[t.jsx("p",{className:"text-[15px] leading-[1.45]",style:{color:"#111111",fontWeight:700,opacity:1},children:e.title}),t.jsx("p",{className:"text-[14px]",style:{color:"#111111",fontWeight:600,opacity:1},children:e.created_at})]}),t.jsx(n,{to:`/news/${e.slug}`,className:`
              flex h-[30px] items-center justify-center rounded-[6px]
              bg-[#2B2B2B] px-[13px]
              text-[12px] font-semibold text-white
              shadow-[0_8px_18px_rgba(43,43,43,0.16)]
              transition-all duration-300 hover:bg-[#242424]
              lg:h-[32px] lg:px-[15px] lg:text-[13px]
            `,children:"Read more"})]})]})})}export{g as N,d as a,c as b,o as g};
