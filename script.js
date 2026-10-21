const filters=[...document.querySelectorAll('[data-filter]')];
const products=[...document.querySelectorAll('.product')];
const search=document.querySelector('#product-search');
let activeCategory='all';
function filterProducts(){
 const query=search.value.trim().toLowerCase(); let count=0;
 products.forEach(card=>{card.hidden=!(activeCategory==='all'||card.dataset.category===activeCategory)||!card.dataset.search.includes(query);if(!card.hidden)count++;});
 filters.forEach(button=>{const active=button.dataset.filter===activeCategory;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 document.querySelector('#catalogue-count').textContent=`Showing ${count} of ${products.length} listings`;
 document.querySelector('#no-results').hidden=count!==0;
 document.querySelectorAll('[data-group]').forEach(group=>{const shown=products.filter(card=>card.dataset.category===group.dataset.group&&!card.hidden).length;group.hidden=shown===0;group.querySelector('.group-count').textContent=shown+' '+(shown===1?'listing':'listings');});
}
filters.forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.filter;filterProducts();}));
search.addEventListener('input',filterProducts);
document.querySelector('#clear-search').addEventListener('click',()=>{activeCategory='all';search.value='';filterProducts();search.focus();});
document.querySelectorAll('[data-collection]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.collection;search.value='';filterProducts();document.querySelector('#range').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#product-select').value=button.dataset.product;document.querySelector('#enquire').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#product-select').focus({preventScroll:true});}));
// Display only a specified food region, using layout clipping instead of changing photo pixels.
function fitPhoto(frame){
 if(!frame.dataset.crop)return;
 const img=frame.querySelector('img');
 const [x,y,w,h]=frame.dataset.crop.split(',').map(Number);
 const [iw,ih]=frame.dataset.size.split(',').map(Number);
 const scale=Math.max(frame.clientWidth/w,frame.clientHeight/h);
 Object.assign(img.style,{width:iw*scale+'px',height:ih*scale+'px',left:(frame.clientWidth-w*scale)/2-x*scale+'px',top:(frame.clientHeight-h*scale)/2-y*scale+'px'});
}
const cropObserver=new ResizeObserver(entries=>entries.forEach(e=>fitPhoto(e.target)));
document.querySelectorAll('.photo-window').forEach(frame=>{cropObserver.observe(frame);fitPhoto(frame);});
const gallery=document.querySelector('#gallery');
const galleryFrame=document.querySelector('#gallery-frame');
cropObserver.observe(galleryFrame);
document.querySelectorAll('.product-image').forEach(button=>button.addEventListener('click',()=>{
 const img=button.querySelector('img'); const crop=button.querySelector('.photo-window'); const target=document.querySelector('#gallery-image');
 target.src=img.src;target.alt=img.alt;target.removeAttribute('style');
 galleryFrame.removeAttribute('style');galleryFrame.classList.remove('photo-window');delete galleryFrame.dataset.crop;delete galleryFrame.dataset.size;
 if(crop){
  galleryFrame.dataset.crop=crop.dataset.crop;galleryFrame.dataset.size=crop.dataset.size;galleryFrame.classList.add('photo-window');
  const box=crop.dataset.crop.split(',').map(Number);const ratio=box[2]/box[3];
  Object.assign(galleryFrame.style,{aspectRatio:String(ratio),width:`min(100%, ${65*ratio}vh)`,height:'auto'});
 }
 document.querySelector('#gallery-title').textContent=button.dataset.title;gallery.showModal();fitPhoto(galleryFrame);
}));
document.querySelector('.close').addEventListener('click',()=>gallery.close());
gallery.addEventListener('click',event=>{if(event.target===gallery){const r=gallery.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)gallery.close();}});
document.querySelector('#enquiry-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const body=`Hello Franky's Pies and Patisserie Supply,\n\nI'd like to enquire about wholesale supply.\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')||'Not provided'}\nProducts: ${data.get('product')}\n\nOrder details:\n${data.get('details')}\n\nThank you.`;window.location.href=`mailto:frankysppsupply@gmail.com?subject=${encodeURIComponent('Wholesale enquiry — '+data.get('business'))}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Your email draft is ready to open. If your email app doesn’t open, email frankysppsupply@gmail.com directly. Your enquiry is only sent when you send the email.';});
