import{p as e,a as o,R as v,C as w,w as N}from"./chunk-OIYGIGL5-D79BV_4A.js";import{C as k}from"./ContactUsForm-OxZoTm8O.js";import{u as C}from"./useIcons-CSWW2rNl.js";import{C as P}from"./Card-DLoQ_Asu.js";import{P as E}from"./Popup-BzxeIm72.js";import{B as p}from"./BookingInput-HdvcqQo_.js";import{B as S}from"./Button-DXXD7fY8.js";import{c as _}from"./form.service-Dwh3xSm2.js";import{u as q}from"./NotificationsProvider-BLN5Zr9T.js";import{P as U}from"./PageLayout-DeQ_RBpu.js";import{H as F}from"./Header--9CW76k6.js";import"./index-BNuuj8O1.js";import"./useArrow-CIQw7HiP.js";import"./apiClient-Bl539U1V.js";function R(){return e.jsxs("div",{className:"flex flex-col items-center justify-center w-full h-[45vh] md:h-screen relative",children:[e.jsx("img",{loading:"lazy",src:"/Savoir-website/images/placeholders/teams1.jpg",alt:"",className:"w-full h-[45vh] md:h-screen object-contain md:object-cover"}),e.jsx("div",{className:"flex flex-col items-center justify-center w-full h-[45vh] md:h-screen absolute top-0 left-0 px-[45px]",children:e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-[176px] z-10",style:{background:"linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)"}})})]})}function B(){const[t,l]=o.useState(""),[r,a]=o.useState(""),[c,s]=o.useState(""),[i,x]=o.useState(""),[H,M]=v.useState(""),[d,m]=o.useState(!1),u=q(),b=()=>t.trim()?r.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.trim())?i.trim()?null:"Message is required.":"Email is invalid.":"Email is required.":"Name is required.",y=async()=>{var g,f;const h=b();if(h){u.error(h,4e3);return}m(!0);try{await _({type:"talk_to_expert",email:r.trim(),name:t.trim(),phone:c.trim(),message:i.trim()}),u.success("Enquiry sent successfully."),l(""),a(""),s(""),x("")}catch(n){const j=((f=(g=n==null?void 0:n.response)==null?void 0:g.data)==null?void 0:f.message)||(n==null?void 0:n.message)||"Failed to send enquiry.";u.error(j,6e3)}finally{m(!1)}};return e.jsxs("div",{className:"flex flex-col items-start gap-[25px] w-full px-[45px] pb-[82px]",children:[e.jsx(p,{placeholder:"Enter Full Name",value:t,onChange:l}),e.jsx(p,{type:"tel",placeholder:"Enter Phone Number",value:c,onChange:s}),e.jsx(p,{type:"email",placeholder:"Enter your Email",value:r,onChange:a}),e.jsx(p,{type:"textAria",placeholder:"Enter your Message here..",value:i,onChange:x}),e.jsx(S,{className:"!rounded-[4px] !px-[78px] !py-[15px] h-[44px] text-[18px] w-full",onClick:y,disabled:d,children:d?"Sending...":"Send Enquiry"})]})}function G(){const t=C(),l=w(),[r,a]=o.useState(!1),c=[{title:"General enquiry",subtitle:"Have a question or request? Drop us a message, and a Savior Properties expert will get back to you shortly.",icon:t.GeneralEnquiry,onClick:()=>a(!0)},{title:"Press",subtitle:"Connect with our PR team for media inquiries or press-related requests",icon:t.Press,onClick:()=>a(!0)},{title:"Partnerships",subtitle:"Let’s explore collaboration opportunities. Reach out to discuss how we can work together",icon:t.Partnerships,onClick:()=>a(!0)},{title:"Our team",subtitle:"Meet our diverse team of trusted property professionals and see what sets us apart.",icon:t.OurTeam,onClick:()=>l("/our-team")}];return e.jsxs("div",{className:"mt-[74px] grid w-full grid-cols-1 gap-[23px] lg:grid-cols-4",children:[c.map((s,i)=>e.jsx(P,{className:`
            group
            !rounded-[34px]
            border border-[#111111]/10
            bg-white
            shadow-[0_16px_42px_rgba(17,17,17,0.06)]
            transition-all
            duration-300
            hover:-translate-y-[3px]
            hover:border-[#111111]
            hover:shadow-[0_24px_58px_rgba(17,17,17,0.12)]
          `,children:e.jsxs("div",{className:"flex flex-col items-center justify-between gap-[42px] px-[14px] py-[44px] lg:w-full lg:aspect-[318/435] lg:gap-0",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[16px]",children:[e.jsx("div",{className:"flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#111111] shadow-[0_12px_28px_rgba(17,17,17,0.16)]",children:e.jsx("img",{loading:"lazy",src:s.icon,alt:"",className:"max-h-[36px] max-w-[36px] brightness-0 invert"})}),e.jsx("p",{className:"CormorantGaramond text-center text-[24px] leading-[1.15]",style:{color:"#111111",fontWeight:700,opacity:1},children:s.title}),e.jsx("p",{className:"text-center text-[16px] leading-[170%] lg:text-[17px]",style:{color:"#111111",fontWeight:600,opacity:1},children:s.subtitle})]}),e.jsx("button",{type:"button",onClick:s.onClick,className:`
                flex h-[44px] w-full items-center justify-center
                rounded-[11px] bg-[#111111] px-[18px]
                shadow-[0_12px_26px_rgba(17,17,17,0.16)]
                transition-all duration-300 hover:bg-[#000000]
              `,children:e.jsx("p",{className:"text-[16px] font-semibold text-white",children:s.title})})]})},i)),r&&e.jsx(E,{onClose:()=>a(!1),children:e.jsx(B,{})})]})}const Y=N(function(){return e.jsxs("div",{children:[e.jsx(R,{}),e.jsxs(U,{children:[e.jsx("style",{children:`
            .contact-heading-black,
            .contact-heading-black *,
            .contact-heading-black span,
            .contact-heading-black p,
            .contact-heading-black h1,
            .contact-heading-black h2 {
              color: #111111 !important;
              -webkit-text-fill-color: #111111 !important;
              opacity: 1 !important;
            }

            .contact-heading-black *::before,
            .contact-heading-black *::after {
              background: #111111 !important;
              border-color: #111111 !important;
            }
          `}),e.jsxs("div",{className:"flex w-full flex-col items-center gap-[30px]",children:[e.jsx("div",{className:"contact-heading-black",children:e.jsx(F,{className:"text-center text-[28px] leading-[1.05] lg:text-[44px]",children:"Get Started"})}),e.jsx("p",{className:"text-center text-[15px] leading-[175%] lg:text-[20px]",style:{color:"#111111",fontWeight:600,opacity:1},children:"Take the first step towards achieving your real estate goals by talking to our team. Whether you are involved in residential or commercial transactions or considering relocation, we have the support and systems for your success."})]}),e.jsx(G,{}),e.jsx(k,{})]})]})});export{Y as default};
