import{p as e}from"./chunk-OIYGIGL5-D79BV_4A.js";const g={color:"#111111",fontWeight:600,opacity:1},d={color:"#111111",fontWeight:700,opacity:1},h="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)";function m({items:a,visitSiteIndexes:p=[],getVisitLink:t}){return e.jsx("div",{className:"flex w-full flex-col items-center gap-[56px] lg:gap-[70px]",children:a.map((l,n)=>{const o=n%2===0,c=p.includes(n),x=l.text.length>520,i=(t==null?void 0:t(l,n))??l.link,r=e.jsxs("div",{className:"flex w-full min-w-0 flex-col items-start lg:flex-1",children:[e.jsx("div",{className:`
                mb-[22px] flex w-full items-center
                border-l-[3px] border-[#111111]
                px-[16px] py-[10px]
                lg:px-[18px] lg:py-[12px]
              `,style:{background:h},children:e.jsx("h2",{className:"CormorantGaramond text-[20px] leading-[1.12] lg:text-[30px]",style:d,children:l.title})}),e.jsx("p",{className:"whitespace-pre-line text-[14px] leading-[175%] lg:text-[17px]",style:g,children:l.text.replace(/\./g,`.
`)}),c&&e.jsx("a",{href:i,target:"_blank",rel:"noreferrer",className:`
                  mt-[24px] inline-flex items-center justify-center
                  rounded-[8px] bg-[#111111]
                  px-[24px] py-[11px]
                  text-[14px] font-semibold text-white
                  transition-all duration-300
                  hover:scale-[1.02] hover:bg-[#000000]
                  hover:shadow-[0_14px_32px_rgba(17,17,17,0.18)]
                `,children:"Visit the Site"})]}),s=e.jsx("div",{className:`flex w-full shrink-0 justify-center lg:w-[420px] ${x?"lg:sticky lg:top-[130px]":""}`,children:e.jsx("img",{loading:"lazy",src:l.image,alt:l.title,className:`w-full max-w-[420px] rounded-[18px] object-cover object-center shadow-[0_18px_44px_rgba(0,0,0,0.08)] ${x?"h-[250px] lg:h-[300px]":"h-[235px] lg:h-[305px]"}`})});return e.jsx("section",{className:`
              w-full max-w-[1100px]
              rounded-[18px]
              border border-[#E8DFD2]
              bg-white
              px-[22px] py-[28px]
              shadow-[0_22px_60px_rgba(0,0,0,0.055)]
              lg:px-[32px] lg:py-[32px]
            `,children:e.jsx("div",{className:"flex w-full flex-col gap-[30px] lg:flex-row lg:items-start lg:gap-[46px]",children:o?e.jsxs(e.Fragment,{children:[r,s]}):e.jsxs(e.Fragment,{children:[s,r]})})},l.title)})})}export{m as S};
