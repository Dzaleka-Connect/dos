import"./hoisted.42cdea16.js";const i=document.getElementById("testForm"),t=document.getElementById("response");i.addEventListener("submit",async r=>{r.preventDefault(),t.innerHTML='<div class="bg-blue-50 p-4 rounded-md">Submitting...</div>';try{const e=new FormData(r.target);console.log("Form data entries:");for(let[o,a]of e.entries())console.log(o,a);const s=await fetch("/api/events",{method:"POST",body:e,headers:{Accept:"application/json"}}),n=await s.json();s.ok?t.innerHTML=`
                    <div class="bg-green-50 p-4 rounded-md">
                        <h3 class="text-green-800 font-medium">Success!</h3>
                        <pre class="mt-2 text-sm text-green-700 whitespace-pre-wrap">${JSON.stringify(n,null,2)}</pre>
                    </div>
                `:t.innerHTML=`
                    <div class="bg-yellow-50 p-4 rounded-md">
                        <h3 class="text-yellow-800 font-medium">Response (Status: ${s.status})</h3>
                        <pre class="mt-2 text-sm text-yellow-700 whitespace-pre-wrap">${JSON.stringify(n,null,2)}</pre>
                    </div>
                `}catch(e){t.innerHTML=`
                <div class="bg-red-50 p-4 rounded-md">
                    <h3 class="text-red-800 font-medium">Error</h3>
                    <pre class="mt-2 text-sm text-red-700">${e.message}</pre>
                </div>
            `,console.error("Submission error:",e)}});
