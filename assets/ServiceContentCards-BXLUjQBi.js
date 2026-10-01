import{p as e}from"./chunk-OIYGIGL5-D79BV_4A.js";const h={color:"#111111",fontWeight:600,opacity:1},m={color:"#111111",fontWeight:700,opacity:1},f="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)";function b({items:p,visitSiteIndexes:c=[],stretchImageIndexes:o=[],getVisitLink:n}){return e.jsx("div",{className:"flex w-full flex-col items-center gap-[56px] lg:gap-[70px]",children:p.map((l,t)=>{const i=t%2===0,g=c.includes(t),s=l.text.length>520,x=o.includes(t),d=(n==null?void 0:n(l,t))??l.link,r=e.jsxs("div",{className:"flex w-full min-w-0 flex-col items-start lg:flex-1",children:[e.jsx("div",{className:`
                mb-[22px] flex w-full items-center
                border-l-[3px] border-[#111111]
                px-[16px] py-[10px]
                lg:px-[18px] lg:py-[12px]
              `,style:{background:f},children:e.jsx("h2",{className:"CormorantGaramond text-[20px] leading-[1.12] lg:text-[30px]",style:m,children:l.title})}),e.jsx("p",{className:"whitespace-pre-line text-[14px] leading-[175%] lg:text-[17px]",style:h,children:l.text.replace(/\./g,`.
`)}),g&&e.jsx("a",{href:d,target:"_blank",rel:"noreferrer",className:`
                  mt-[24px] inline-flex items-center justify-center
                  rounded-[8px] bg-[#111111]
                  px-[24px] py-[11px]
                  text-[14px] font-semibold text-white
                  transition-all duration-300
                  hover:scale-[1.02] hover:bg-[#000000]
                  hover:shadow-[0_14px_32px_rgba(17,17,17,0.18)]
                `,children:"Visit The Site"})]}),a=e.jsx("div",{className:`flex w-full shrink-0 justify-center lg:w-[420px] ${x?"":s?"lg:sticky lg:top-[130px]":""}`,children:e.jsx("img",{loading:"lazy",src:l.image,alt:l.title,className:`w-full max-w-[420px] rounded-[18px] object-cover object-center shadow-[0_18px_44px_rgba(0,0,0,0.08)] ${x?"h-[235px] lg:h-[520px]":s?"h-[250px] lg:h-[300px]":"h-[235px] lg:h-[305px]"}`})});return e.jsx("section",{className:`
              w-full max-w-[1100px]
              rounded-[18px]
              border border-[#E8DFD2]
              bg-white
              px-[22px] py-[28px]
              shadow-[0_22px_60px_rgba(0,0,0,0.055)]
              lg:px-[32px] lg:py-[32px]
            `,children:e.jsx("div",{className:"flex w-full flex-col gap-[30px] lg:flex-row lg:gap-[46px] lg:items-start",children:i?e.jsxs(e.Fragment,{children:[r,a]}):e.jsxs(e.Fragment,{children:[a,r]})})},l.title)})})}export{b as S};
