const C='jw-kyushu-no-hotel-float-20260817';
const CORE=["./", "./OFFLINE_TEST_REPORT.txt", "./all_days_route_overview.png", "./day1_photo_16x9.jpg", "./day1_route_16x9.png", "./day2_huis_ten_bosch_route.png", "./day2_photo_16x9.jpg", "./day2_route_16x9.png", "./day3_photo_16x9.jpg", "./day3_route_16x9.png", "./day3_route_detail.jpg", "./day4_photo_16x9.jpg", "./day4_route_16x9.png", "./day4_route_detail.jpg", "./day5_photo_16x9.jpg", "./day5_route_16x9.png", "./day5_route_detail.jpg", "./day6_photo_16x9.jpg", "./day6_route_16x9.png", "./day6_route_detail.jpg", "./day7_photo_16x9.jpg", "./day7_route_16x9.png", "./icon.svg", "./index.html", "./manifest.webmanifest", "./vercel.json"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname==='/'||u.pathname.endsWith('/index.html')){
   e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{caches.open(C).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
   return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
