const o=t=>{if(t==null||t==="")return"";const n=typeof t=="string"?parseFloat(t.replace(/,/g,"")):t;return isNaN(n)?String(t):n.toLocaleString("en-US",{maximumFractionDigits:0})};export{o as f};
