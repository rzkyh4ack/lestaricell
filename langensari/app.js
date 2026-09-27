// Lestari Cell Langen - katalog + cart + WA checkout
// GANTI nomor WA toko di sini (format 62...)
const WA_NUMBER = "6281234567890";
const STORE_NAME = "Lestari Cell Langen";

const PRODUCTS = [
  {id:"ip13-128", name:"iPhone 13 128GB Second Mulus Fullset", cat:"iphone second", price:7750000, old:8500000, tag:"second", label:"Second", img:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop"},
  {id:"ip12-64", name:"iPhone 12 64GB Second BH 85%+", cat:"iphone second", price:6200000, old:6900000, tag:"second", label:"Second", img:"https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=600&auto=format&fit=crop"},
  {id:"ip11-64", name:"iPhone 11 64GB Second - Favorit Pelajar", cat:"iphone second", price:4650000, old:5200000, tag:"second", label:"Second", img:"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop"},
  {id:"samsung-a15", name:"Samsung Galaxy A15 8/256 Baru Resmi", cat:"samsung", price:2899000, old:3199000, tag:"new", label:"Baru", img:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"},
  {id:"samsung-a05s", name:"Samsung Galaxy A05s 6/128 Baru", cat:"samsung", price:1999000, old:2299000, tag:"new", label:"Baru", img:"https://images.unsplash.com/photo-1567581036844-4a03cf02a99b?q=80&w=600&auto=format&fit=crop"},
  {id:"redmi-13", name:"Xiaomi Redmi 13 8/256 Baru", cat:"xiaomi", price:1999000, old:2199000, tag:"hot", label:"Promo", img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop"},
  {id:"poco-m6", name:"POCO M6 Pro 8/256 Baru", cat:"xiaomi", price:2799000, old:2999000, tag:"hot", label:"Promo", img:"https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop"},
  {id:"oppo-a58", name:"Oppo A58 6/128 Baru Resmi", cat:"oppo-vivo", price:2399000, old:2599000, tag:"new", label:"Baru", img:"https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop"},
  {id:"vivo-y28", name:"Vivo Y28 8/128 Baru Resmi", cat:"oppo-vivo", price:2399000, old:2599000, tag:"new", label:"Baru", img:"https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop"},
  {id:"samsung-a54-2nd", name:"Samsung A54 8/256 Second Mulus", cat:"samsung second", price:3750000, old:4200000, tag:"second", label:"Second", img:"https://images.unsplash.com/photo-1533228100845-08145b01de14?q=80&w=600&auto=format&fit=crop"},
];

const fmt = n => "Rp " + n.toLocaleString("id-ID");
let cart = {};
try { cart = JSON.parse(localStorage.getItem("lestari_cart")||"{}"); } catch(e){ cart = {}; }
let activeCat = "all";
let keyword = "";

function saveCart(){ try{localStorage.setItem("lestari_cart", JSON.stringify(cart));}catch(e){} renderCart(); }
function cartCount(){ return Object.values(cart).reduce((a,b)=>a+b,0); }
function cartTotal(){ return Object.entries(cart).reduce((t,[id,q])=>{ const p=PRODUCTS.find(x=>x.id===id); return t+(p?p.price*q:0); },0); }

function toast(msg){
  let el=document.getElementById("toast");
  if(!el){ el=document.createElement("div"); el.id="toast"; el.className="toast"; document.body.appendChild(el); }
  el.textContent=msg; el.classList.add("show");
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove("show"),2000);
}

function addToCart(id){ cart[id]=(cart[id]||0)+1; saveCart(); toast("Ditambah ke keranjang"); }
function dec(id){ cart[id]--; if(cart[id]<=0) delete cart[id]; saveCart(); }
function removeItem(id){ delete cart[id]; saveCart(); }

function matchCat(p){
  if(activeCat==="all") return true;
  if(activeCat==="second") return p.cat.includes("second");
  return p.cat===activeCat;
}

function renderProducts(){
  const grid=document.getElementById("productGrid");
  if(!grid) return;
  const list=PRODUCTS.filter(p=>matchCat(p) && p.name.toLowerCase().includes(keyword.toLowerCase()));
  grid.innerHTML=list.map(p=>`
    <div class="product">
      <img src="${p.img}" alt="${p.name} - ${STORE_NAME}" loading="lazy">
      <div class="product-body">
        <span class="tag ${p.tag}">${p.label}</span>
        <h3>${p.name}</h3>
        <div><span class="old">${fmt(p.old)}</span><div class="price">${fmt(p.price)}</div></div>
        <div class="product-actions">
          <button class="small-btn add" onclick="addToCart('${p.id}')">+ Keranjang</button>
          <a class="small-btn shopee" target="_blank" rel="noopener" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo "+STORE_NAME+", apakah "+p.name+" masih ada?")}">Tanya WA</a>
        </div>
      </div>
    </div>`).join("") || "<p>Stok yang dicari sedang habis. Chat WA untuk inden.</p>";
}

function renderCart(){
  const c=document.getElementById("cartCount");
  if(c) c.textContent=cartCount();
  const box=document.getElementById("cartItems");
  if(!box) return;
  const entries=Object.entries(cart);
  if(!entries.length){ box.innerHTML="<p>Keranjang kosong. Pilih HP di katalog.</p>"; }
  else{
    box.innerHTML=entries.map(([id,q])=>{
      const p=PRODUCTS.find(x=>x.id===id); if(!p) return "";
      return `<div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div style="flex:1"><strong style="font-size:14px">${p.name}</strong><div style="font-size:14px">${fmt(p.price)}</div>
        <div class="qty"><button onclick="dec('${id}')">-</button><span>${q}</span><button onclick="addToCart('${id}')">+</button>
        <a href="#" onclick="removeItem('${id}');return false" style="margin-left:auto;font-size:12px;color:#c00">hapus</a></div></div>
      </div>`;
    }).join("");
  }
  const t=document.getElementById("cartTotal");
  if(t) t.textContent=fmt(cartTotal());
}

function checkoutWA(){
  const entries=Object.entries(cart);
  if(!entries.length){ toast("Keranjang masih kosong"); return; }
  let lines=["Halo "+STORE_NAME+", saya mau order:"];
  entries.forEach(([id,q])=>{
    const p=PRODUCTS.find(x=>x.id===id);
    lines.push("- "+p.name+" x"+q+" ("+fmt(p.price)+")");
  });
  lines.push("Total: "+fmt(cartTotal()));
  lines.push("Area antar: Banjar / Ciamis / Pangandaran (tulis salah satu)");
  window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(lines.join("\n")),"_blank");
}

function setFilter(cat, btn){
  activeCat=cat;
  document.querySelectorAll(".filter-bar button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  renderProducts();
}

let slideIdx=0, timer=null;
function showSlide(i){
  const slides=document.querySelectorAll(".slide");
  const dots=document.querySelectorAll(".dot");
  if(!slides.length) return;
  slideIdx=(i+slides.length)%slides.length;
  slides.forEach((s,k)=>s.classList.toggle("active",k===slideIdx));
  dots.forEach((d,k)=>d.classList.toggle("active",k===slideIdx));
}
function nextSlide(){ showSlide(slideIdx+1); restartAuto(); }
function prevSlide(){ showSlide(slideIdx-1); restartAuto(); }
function restartAuto(){ clearInterval(timer); timer=setInterval(()=>showSlide(slideIdx+1),5000); }

document.addEventListener("DOMContentLoaded",()=>{
  renderProducts(); renderCart(); restartAuto();
  const s=document.getElementById("searchInput");
  if(s) s.addEventListener("input",e=>{keyword=e.target.value; renderProducts();});
});