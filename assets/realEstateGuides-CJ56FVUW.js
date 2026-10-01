import{a as l,p as t,w as C,B as D}from"./chunk-OIYGIGL5-D79BV_4A.js";import{P as k}from"./PageLayout-DeQ_RBpu.js";import{B as y}from"./Button-DXXD7fY8.js";import{P as G}from"./Popup-BzxeIm72.js";import{B as f}from"./BookingInput-HdvcqQo_.js";import{A as _}from"./apiClient-Bl539U1V.js";import{u as S}from"./NotificationsProvider-BLN5Zr9T.js";import"./useIcons-CSWW2rNl.js";import"./useArrow-CIQw7HiP.js";import"./index-BNuuj8O1.js";const j=new _;async function B(){return j.get("/api/real-estate-guides")}async function P(n){return j.post("/api/who-downloads-guide",n)}function F({guideId:n,brochureName:d,onClose:a,onDownload:p}){const[i,u]=l.useState(""),[r,x]=l.useState(""),[e,s]=l.useState(""),[c,g]=l.useState(!1),m=S(),v=()=>i.trim()?r.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.trim())?e.trim()?null:"Phone is required.":"Email is invalid.":"Email is required.":"Name is required.",N=async()=>{var w,b;const h=v();if(h){m.error(h,4e3);return}g(!0);try{await P({email:r.trim(),name:i.trim(),phone:e.trim(),brochure_name:d}),m.success("Thank you! Downloading your guide..."),a(),p()}catch(o){const E=((b=(w=o==null?void 0:o.response)==null?void 0:w.data)==null?void 0:b.message)||(o==null?void 0:o.message)||"Failed to submit information.";m.error(E,6e3)}finally{g(!1)}};return t.jsxs("div",{className:"flex flex-col items-start gap-[25px] w-full px-[45px] pb-[82px]",children:[t.jsx(f,{placeholder:"Enter Full Name",value:i,onChange:u}),t.jsx(f,{type:"tel",placeholder:"Enter Phone Number",value:e,onChange:s}),t.jsx(f,{type:"email",placeholder:"Enter your Email",value:r,onChange:x}),t.jsx(y,{className:"!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full",onClick:N,disabled:c,children:c?"Submitting...":"Download Guide"})]})}async function H(){try{const n=await B();return{guides:n.data??n??[]}}catch{return{guides:[]}}}const J=C(function(){const{guides:d}=D(),[a,p]=l.useState(null),i=(e,s)=>{p({id:e,pdf:s})},u=()=>{p(null)},r=async e=>{if(!e)return;const c=`/api/download-guide/${e.id}`;window.open(c,"_blank","noopener,noreferrer")},x=e=>e?e.startsWith("http")?e:`/${e}`:"";return t.jsxs("div",{className:"mt-[100px]",children:[t.jsx(k,{children:t.jsxs("div",{className:"flex w-full flex-col items-start gap-[58px]",children:[t.jsxs("div",{className:"flex w-full flex-col items-start gap-[22px]",children:[t.jsx("p",{className:"CormorantGaramond text-[28px] font-semibold leading-[1.05] capitalize text-[#111111] lg:text-[44px]",children:"Real estate guides from industry experts"}),t.jsx("p",{className:"text-[14px] font-semibold leading-[160%] text-[#111111] lg:text-[18px]",children:"From buying or selling a property to discovering Dubai's key areas and investments, the Savior Properties guides are packed with essential information and key market insights."})]}),t.jsx("div",{className:"grid w-full grid-cols-1 gap-[28px] md:grid-cols-2 lg:grid-cols-3",children:d.map((e,s)=>t.jsxs("div",{className:`
                  flex w-full flex-col items-center
                  rounded-[16px]
                  border border-[#E8DFD2]
                  bg-white
                  px-[16px]
                  py-[18px]
                  shadow-[0_14px_38px_rgba(17,17,17,0.045)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:shadow-[0_20px_48px_rgba(17,17,17,0.08)]
                `,children:[t.jsx("div",{className:"flex h-[260px] w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#FBFAF7] lg:h-[280px]",children:t.jsx("img",{src:x(e.image),alt:e.title||"",className:"h-full w-auto max-w-full object-contain object-center",style:{imageRendering:"auto",filter:"none"}})}),t.jsxs("div",{className:"mt-[16px] flex w-full items-center justify-between gap-[12px]",children:[t.jsx("p",{className:"CormorantGaramond text-[20px] leading-[1.1] text-[#111111] lg:text-[23px]",children:e.title}),t.jsx(y,{onClick:()=>i(e.id,e.pdf),className:`
                      h-[30px]
                      w-fit
                      shrink-0
                      !rounded-[5px]
                      !bg-[#2B2B2B]
                      !px-[10px]
                      !py-[4px]
                      text-[12px]
                      font-semibold
                      !text-white
                      shadow-[0_8px_18px_rgba(43,43,43,0.14)]
                      transition-all
                      duration-300
                      hover:!bg-[#242424]
                      lg:h-[32px]
                      lg:px-[12px]
                      lg:text-[13px]
                    `,children:"Download"})]})]},e.id??s))})]})}),a&&t.jsx(G,{title:"Download Guide",onClose:u,children:t.jsx(F,{guideId:a.id,brochureName:a.pdf,onClose:u,onDownload:()=>r(a)})})]})});export{H as clientLoader,J as default};
