
/* ===== Runtime performance helpers ===== */
const JWPerf = (() => {
  let raf = 0;
  const frame = (fn) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fn);
  };
  const idle = (fn) => {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, {timeout:1200});
    else setTimeout(fn, 80);
  };
  return {frame, idle};
})();

function show(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');let b=document.querySelector('[data-p="'+id+'"]');if(b)b.classList.add('active');scrollTo(0,0)}document.querySelector('.tabs').onclick=e=>{let b=e.target.closest('button[data-p]');if(b)show(b.dataset.p)};
const dep=new Date('2027-03-25T15:30:00+08:00');function tick(){let x=dep-new Date(),e=document.getElementById('count');if(x<=0){e.textContent='🇯🇵 九州旅行開始！';return}let d=Math.floor(x/86400000);x%=86400000;let h=Math.floor(x/3600000);x%=3600000;let m=Math.floor(x/60000);e.textContent=d+' 天 '+h+' 小時 '+m+' 分'}tick();setInterval(tick,60000);
document.querySelectorAll('#depart input,#return input,#tripChecks input').forEach(c=>{let k='jw3_'+c.dataset.k;c.checked=localStorage.getItem(k)==='1';c.onchange=()=>{localStorage.setItem(k,c.checked?'1':'0');progress();updateTravelChecklists()}});
function progress(){let a=[...document.querySelectorAll('#tripChecks input')],n=a.filter(x=>x.checked).length,p=Math.round(n/a.length*100);document.getElementById('tripBar').style.width=p+'%';document.getElementById('tripText').textContent='已完成 '+n+' / '+a.length+'｜'+p+'%'}progress();
function load(type){let a=JSON.parse(localStorage.getItem('jw3_'+type)||'[]'),el=document.getElementById(type+'List');el.innerHTML='';a.forEach((x,i)=>{let r=document.createElement('div');r.className='check';r.innerHTML='<input type="checkbox" '+(x.done?'checked':'')+'><label>'+x.text.replace(/</g,'&lt;')+'</label><button class="del">刪除</button>';r.querySelector('input').onchange=e=>{a[i].done=e.target.checked;localStorage.setItem('jw3_'+type,JSON.stringify(a));load(type)};r.querySelector('.del').onclick=()=>{a.splice(i,1);localStorage.setItem('jw3_'+type,JSON.stringify(a));load(type)};el.appendChild(r)})}
function addItem(type){let i=document.getElementById(type+'Input'),t=i.value.trim();if(!t)return;let a=JSON.parse(localStorage.getItem('jw3_'+type)||'[]');a.push({text:t,done:false});localStorage.setItem('jw3_'+type,JSON.stringify(a));i.value='';load(type)}load('buy');load('eat');
let n=document.getElementById('notes');n.value=localStorage.getItem('jw3_notes')||'';n.oninput=()=>localStorage.setItem('jw3_notes',n.value);
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

const tripReminders = {
  "2027-03-25": {
    title:"DAY 1｜今日出發 ✈️",
    text:"12:10 小港機場接送 → BR120 15:30。抵達福岡後先入住靜鐵 Hotel Prezio 博多站前。",
    nav:"https://www.google.com/maps/search/?api=1&query=Kaohsiung+International+Airport"
  },
  "2027-03-26": {
    title:"DAY 2｜豪斯登堡＋煙火 🎆",
    text:"提早到博多站確認特急與月台。煙火結束後優先往車站移動，回程直達特急優先。",
    nav:"https://www.google.com/maps/search/?api=1&query=Hakata+Station"
  },
  "2027-03-27": {
    title:"DAY 3｜福岡賞櫻＋天神 🌸",
    text:"上午賞櫻、下午太宰府。由舞鶴公園前往太宰府時，記得在天神轉西鐵。",
    nav:"https://www.google.com/maps/search/?api=1&query=Maizuru+Park+Fukuoka"
  },
  "2027-03-28": {
    title:"DAY 4｜由布院 🌿",
    text:"出發前確認 JR 實際車次與指定席；回程也請預留足夠時間到由布院站。",
    nav:"https://www.google.com/maps/search/?api=1&query=Yufuin+Station"
  },
  "2027-03-29": {
    title:"DAY 5｜糸島夫婦岩＋夕陽 🌅",
    text:"主目標是夫婦岩與夕陽。最重要：出發前再次確認二見浦回程巴士末班時間。",
    nav:"https://www.google.com/maps/search/?api=1&query=Sakurai+Futamigaura+Itoshima"
  },
  "2027-03-30": {
    title:"DAY 6｜博多站休閒＋伴手禮 🛍️",
    text:"今天不用趕車：博多站周邊吃吃、MING／DEITOS 買伴手禮，晚上回飯店整理行李。",
    nav:"https://www.google.com/maps/search/?api=1&query=Ming+Hakata"
  },
  "2027-03-31": {
    title:"DAY 7｜返台 ✈️",
    text:"退房前完成回程清單；預留足夠時間前往福岡機場國際線搭乘 BR119。",
    nav:"https://www.google.com/maps/search/?api=1&query=Fukuoka+Airport+International+Terminal"
  }
};

function tokyoDateString(offsetDays=0){
  const now = new Date();
  const tokyoMs = now.getTime() + (9*60 + now.getTimezoneOffset())*60000;
  const tokyo = new Date(tokyoMs);
  tokyo.setUTCDate(tokyo.getUTCDate()+offsetDays);
  const y=tokyo.getUTCFullYear(), m=String(tokyo.getUTCMonth()+1).padStart(2,'0'), d=String(tokyo.getUTCDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function updateSmartReminder(){
  const todayKey = tokyoDateString(0);
  const tomorrowKey = tokyoDateString(1);
  const box = document.getElementById('smartReminder');
  const label = document.getElementById('reminderLabel');
  const title = document.getElementById('reminderTitle');
  const text = document.getElementById('reminderText');
  const nav = document.getElementById('reminderNavBtn');

  let data=null, mode='';
  if(tripReminders[todayKey]){ data=tripReminders[todayKey]; mode='today'; }
  else if(tripReminders[tomorrowKey]){ data=tripReminders[tomorrowKey]; mode='tomorrow'; }

  if(!data){ box.classList.add('hidden'); return; }

  box.classList.remove('hidden','tomorrow','todaynow');
  box.classList.add(mode==='today'?'todaynow':'tomorrow');
  label.textContent = mode==='today' ? '今日提醒' : '明日提醒';
  title.textContent = data.title;
  text.textContent = data.text;
  nav.href = data.nav;
}
updateSmartReminder();
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) updateSmartReminder(); });


function openRouteImage(src){const m=document.getElementById('routeImageModal'),i=document.getElementById('routeImageModalImg');if(!m||!i)return;i.src=src;m.classList.add('open');document.body.style.overflow='hidden'}
function forceCloseRouteImage(){const m=document.getElementById('routeImageModal');if(m)m.classList.remove('open');document.body.style.overflow=''}

const JAPANESE_PHRASES = [{"cat": "基本", "zh": "不好意思／打擾一下", "ja": "すみません。", "romaji": "Sumimasen."}, {"cat": "基本", "zh": "非常感謝", "ja": "ありがとうございます。", "romaji": "Arigatou gozaimasu."}, {"cat": "基本", "zh": "我不會說日文", "ja": "日本語が話せません。", "romaji": "Nihongo ga hanasemasen."}, {"cat": "基本", "zh": "可以請您說慢一點嗎？", "ja": "ゆっくり話していただけますか？", "romaji": "Yukkuri hanashite itadakemasu ka?"}, {"cat": "基本", "zh": "麻煩再說一次", "ja": "もう一度お願いします。", "romaji": "Mou ichido onegaishimasu."}, {"cat": "基本", "zh": "可以請您寫下來嗎？", "ja": "書いていただけますか？", "romaji": "Kaite itadakemasu ka?"}, {"cat": "基本", "zh": "可以在地圖上告訴我嗎？", "ja": "地図で教えていただけますか？", "romaji": "Chizu de oshiete itadakemasu ka?"}, {"cat": "基本", "zh": "可以請您看一下這個嗎？", "ja": "これを見ていただけますか？", "romaji": "Kore o mite itadakemasu ka?"}, {"cat": "JR／地鐵", "zh": "請問博多站在哪裡？", "ja": "博多駅はどこですか？", "romaji": "Hakata-eki wa doko desu ka?"}, {"cat": "JR／地鐵", "zh": "這班電車有到博多站嗎？", "ja": "この電車は博多駅に行きますか？", "romaji": "Kono densha wa Hakata-eki ni ikimasu ka?"}, {"cat": "JR／地鐵", "zh": "搭這班車對嗎？", "ja": "この電車で合っていますか？", "romaji": "Kono densha de atteimasu ka?"}, {"cat": "JR／地鐵", "zh": "請問是第幾月台？", "ja": "何番ホームですか？", "romaji": "Nanban hoomu desu ka?"}, {"cat": "JR／地鐵", "zh": "需要轉車嗎？", "ja": "乗り換えは必要ですか？", "romaji": "Norikae wa hitsuyou desu ka?"}, {"cat": "JR／地鐵", "zh": "請問在哪裡轉車？", "ja": "どこで乗り換えますか？", "romaji": "Doko de norikaemasu ka?"}, {"cat": "JR／地鐵", "zh": "有指定席嗎？", "ja": "指定席はありますか？", "romaji": "Shiteiseki wa arimasu ka?"}, {"cat": "JR／地鐵", "zh": "麻煩兩位的票", "ja": "二人分お願いします。", "romaji": "Futari-bun onegaishimasu."}, {"cat": "JR／地鐵", "zh": "下一班車幾點？", "ja": "次の電車は何時ですか？", "romaji": "Tsugi no densha wa nanji desu ka?"}, {"cat": "JR／地鐵", "zh": "末班車幾點？", "ja": "最終電車は何時ですか？", "romaji": "Saishuu densha wa nanji desu ka?"}, {"cat": "JR／地鐵", "zh": "這張票可以搭這班車嗎？", "ja": "この切符でこの電車に乗れますか？", "romaji": "Kono kippu de kono densha ni noremasu ka?"}, {"cat": "JR／地鐵", "zh": "這班車需要預約嗎？", "ja": "この電車は予約が必要ですか？", "romaji": "Kono densha wa yoyaku ga hitsuyou desu ka?"}, {"cat": "豪斯登堡", "zh": "我想去豪斯登堡", "ja": "ハウステンボスに行きたいです。", "romaji": "Huis Ten Bosch ni ikitai desu."}, {"cat": "豪斯登堡", "zh": "這班車有到豪斯登堡嗎？", "ja": "この電車はハウステンボスに行きますか？", "romaji": "Kono densha wa Huis Ten Bosch ni ikimasu ka?"}, {"cat": "豪斯登堡", "zh": "煙火幾點開始？", "ja": "花火は何時からですか？", "romaji": "Hanabi wa nanji kara desu ka?"}, {"cat": "豪斯登堡", "zh": "在哪裡可以看煙火？", "ja": "花火はどこで見られますか？", "romaji": "Hanabi wa doko de miraremasu ka?"}, {"cat": "豪斯登堡", "zh": "豪斯登堡站往哪邊？", "ja": "ハウステンボス駅はどちらですか？", "romaji": "Huis Ten Bosch-eki wa dochira desu ka?"}, {"cat": "豪斯登堡", "zh": "我要回博多", "ja": "博多まで帰りたいです。", "romaji": "Hakata made kaeritai desu."}, {"cat": "豪斯登堡", "zh": "有直達博多嗎？", "ja": "博多まで直通ですか？", "romaji": "Hakata made chokutsuu desu ka?"}, {"cat": "豪斯登堡", "zh": "需要在早岐轉車嗎？", "ja": "早岐で乗り換えますか？", "romaji": "Haiki de norikaemasu ka?"}, {"cat": "豪斯登堡", "zh": "回博多的末班車幾點？", "ja": "博多行きの最終列車は何時ですか？", "romaji": "Hakata-yuki no saishuu ressha wa nanji desu ka?"}, {"cat": "由布院", "zh": "我要去由布院", "ja": "由布院に行きたいです。", "romaji": "Yufuin ni ikitai desu."}, {"cat": "由布院", "zh": "這班車有到由布院嗎？", "ja": "この電車は由布院に行きますか？", "romaji": "Kono densha wa Yufuin ni ikimasu ka?"}, {"cat": "由布院", "zh": "由布院站在哪裡？", "ja": "由布院駅はどこですか？", "romaji": "Yufuin-eki wa doko desu ka?"}, {"cat": "由布院", "zh": "金鱗湖怎麼走？", "ja": "金鱗湖へはどう行けばいいですか？", "romaji": "Kinrinko e wa dou ikeba ii desu ka?"}, {"cat": "由布院", "zh": "回博多的車幾點？", "ja": "博多行きの電車は何時ですか？", "romaji": "Hakata-yuki no densha wa nanji desu ka?"}, {"cat": "糸島", "zh": "我要去櫻井二見浦", "ja": "桜井二見ヶ浦に行きたいです。", "romaji": "Sakurai Futamigaura ni ikitai desu."}, {"cat": "糸島", "zh": "夫婦岩在哪裡？", "ja": "夫婦岩はどこですか？", "romaji": "Meoto Iwa wa doko desu ka?"}, {"cat": "糸島", "zh": "巴士站在哪裡？", "ja": "バス停はどこですか？", "romaji": "Basutei wa doko desu ka?"}, {"cat": "糸島", "zh": "這班巴士有到夫婦岩嗎？", "ja": "このバスは夫婦岩に行きますか？", "romaji": "Kono basu wa Meoto Iwa ni ikimasu ka?"}, {"cat": "糸島", "zh": "我要回九大学研都市站", "ja": "九大学研都市駅に戻りたいです。", "romaji": "Kyudai-Gakkentoshi-eki ni modoritai desu."}, {"cat": "糸島", "zh": "末班巴士幾點？", "ja": "最終バスは何時ですか？", "romaji": "Saishuu basu wa nanji desu ka?"}, {"cat": "糸島", "zh": "看完夕陽後還有巴士嗎？", "ja": "夕日を見た後でもバスはありますか？", "romaji": "Yuuhi o mita ato demo basu wa arimasu ka?"}, {"cat": "太宰府", "zh": "我要去太宰府", "ja": "太宰府に行きたいです。", "romaji": "Dazaifu ni ikitai desu."}, {"cat": "太宰府", "zh": "需要在西鐵二日市轉車嗎？", "ja": "西鉄二日市で乗り換えますか？", "romaji": "Nishitetsu Futsukaichi de norikaemasu ka?"}, {"cat": "太宰府", "zh": "太宰府天滿宮怎麼走？", "ja": "太宰府天満宮へはどう行けばいいですか？", "romaji": "Dazaifu Tenmangu e wa dou ikeba ii desu ka?"}, {"cat": "太宰府", "zh": "回天神要搭哪一班？", "ja": "天神に戻るにはどの電車に乗ればいいですか？", "romaji": "Tenjin ni modoru ni wa dono densha ni noreba ii desu ka?"}, {"cat": "飯店", "zh": "我要辦理入住", "ja": "チェックインをお願いします。", "romaji": "Chekku-in o onegaishimasu."}, {"cat": "飯店", "zh": "我有預約", "ja": "予約しています。", "romaji": "Yoyaku shiteimasu."}, {"cat": "飯店", "zh": "護照在這裡", "ja": "パスポートはこちらです。", "romaji": "Pasupooto wa kochira desu."}, {"cat": "飯店", "zh": "可以幫我寄放行李嗎？", "ja": "荷物を預かっていただけますか？", "romaji": "Nimotsu o azukatte itadakemasu ka?"}, {"cat": "飯店", "zh": "退房後可以寄放行李嗎？", "ja": "チェックアウト後も荷物を預けられますか？", "romaji": "Chekku-auto go mo nimotsu o azukeraremasu ka?"}, {"cat": "飯店", "zh": "可以幫忙叫計程車嗎？", "ja": "タクシーを呼んでいただけますか？", "romaji": "Takushii o yonde itadakemasu ka?"}, {"cat": "飯店", "zh": "請告訴我 Wi-Fi 密碼", "ja": "Wi-Fiのパスワードを教えてください。", "romaji": "Wi-Fi no pasuwaado o oshiete kudasai."}, {"cat": "餐廳", "zh": "兩位", "ja": "二人です。", "romaji": "Futari desu."}, {"cat": "餐廳", "zh": "我們沒有預約", "ja": "予約していません。", "romaji": "Yoyaku shiteimasen."}, {"cat": "餐廳", "zh": "現在可以入店嗎？", "ja": "今、入れますか？", "romaji": "Ima, hairemasu ka?"}, {"cat": "餐廳", "zh": "大概要等多久？", "ja": "どのくらい待ちますか？", "romaji": "Dono kurai machimasu ka?"}, {"cat": "餐廳", "zh": "推薦什麼？", "ja": "おすすめは何ですか？", "romaji": "Osusume wa nan desu ka?"}, {"cat": "餐廳", "zh": "我要這個", "ja": "これをお願いします。", "romaji": "Kore o onegaishimasu."}, {"cat": "餐廳", "zh": "一樣的請給我兩份", "ja": "同じものを二つお願いします。", "romaji": "Onaji mono o futatsu onegaishimasu."}, {"cat": "餐廳", "zh": "會辣嗎？", "ja": "辛いですか？", "romaji": "Karai desu ka?"}, {"cat": "餐廳", "zh": "麻煩給我水", "ja": "お水をお願いします。", "romaji": "Omizu o onegaishimasu."}, {"cat": "餐廳", "zh": "麻煩結帳", "ja": "お会計をお願いします。", "romaji": "Okaikei o onegaishimasu."}, {"cat": "餐廳", "zh": "可以刷卡嗎？", "ja": "クレジットカードは使えますか？", "romaji": "Kurejitto kaado wa tsukaemasu ka?"}, {"cat": "餐廳", "zh": "可以外帶嗎？", "ja": "持ち帰りできますか？", "romaji": "Mochikaeri dekimasu ka?"}, {"cat": "餐廳", "zh": "非常好吃，謝謝", "ja": "とてもおいしかったです。ありがとうございます。", "romaji": "Totemo oishikatta desu. Arigatou gozaimasu."}, {"cat": "購物", "zh": "這個多少錢？", "ja": "これはいくらですか？", "romaji": "Kore wa ikura desu ka?"}, {"cat": "購物", "zh": "有其他顏色嗎？", "ja": "他の色はありますか？", "romaji": "Hoka no iro wa arimasu ka?"}, {"cat": "購物", "zh": "還有庫存嗎？", "ja": "在庫はありますか？", "romaji": "Zaiko wa arimasu ka?"}, {"cat": "購物", "zh": "可以免稅嗎？", "ja": "免税できますか？", "romaji": "Menzei dekimasu ka?"}, {"cat": "購物", "zh": "麻煩給我袋子", "ja": "袋をお願いします。", "romaji": "Fukuro o onegaishimasu."}, {"cat": "購物", "zh": "這是要送人的伴手禮", "ja": "お土産用です。", "romaji": "Omiyage-you desu."}, {"cat": "購物", "zh": "哪一個最受歡迎？", "ja": "人気の商品はどれですか？", "romaji": "Ninki no shouhin wa dore desu ka?"}, {"cat": "購物", "zh": "可以分開裝袋嗎？", "ja": "別々の袋に入れていただけますか？", "romaji": "Betsubetsu no fukuro ni irete itadakemasu ka?"}, {"cat": "問路", "zh": "請問要怎麼去？", "ja": "どうやって行けばいいですか？", "romaji": "Dou yatte ikeba ii desu ka?"}, {"cat": "問路", "zh": "可以走路到嗎？", "ja": "歩いて行けますか？", "romaji": "Aruite ikemasu ka?"}, {"cat": "問路", "zh": "從這裡大約幾分鐘？", "ja": "ここから何分くらいですか？", "romaji": "Koko kara nanpun kurai desu ka?"}, {"cat": "問路", "zh": "最近的車站在哪裡？", "ja": "一番近い駅はどこですか？", "romaji": "Ichiban chikai eki wa doko desu ka?"}, {"cat": "問路", "zh": "入口在哪裡？", "ja": "入り口はどこですか？", "romaji": "Iriguchi wa doko desu ka?"}, {"cat": "問路", "zh": "出口在哪裡？", "ja": "出口はどこですか？", "romaji": "Deguchi wa doko desu ka?"}, {"cat": "問路", "zh": "洗手間在哪裡？", "ja": "トイレはどこですか？", "romaji": "Toire wa doko desu ka?"}, {"cat": "問路", "zh": "可以幫我們拍照嗎？", "ja": "写真を撮っていただけますか？", "romaji": "Shashin o totte itadakemasu ka?"}, {"cat": "緊急", "zh": "我迷路了", "ja": "道に迷いました。", "romaji": "Michi ni mayoimashita."}, {"cat": "緊急", "zh": "請幫幫我", "ja": "助けてください。", "romaji": "Tasukete kudasai."}, {"cat": "緊急", "zh": "我的錢包不見了", "ja": "財布をなくしました。", "romaji": "Saifu o nakushimashita."}, {"cat": "緊急", "zh": "我的手機不見了", "ja": "携帯電話をなくしました。", "romaji": "Keitai denwa o nakushimashita."}, {"cat": "緊急", "zh": "我的護照不見了", "ja": "パスポートをなくしました。", "romaji": "Pasupooto o nakushimashita."}, {"cat": "緊急", "zh": "派出所在哪裡？", "ja": "交番はどこですか？", "romaji": "Kouban wa doko desu ka?"}, {"cat": "緊急", "zh": "醫院在哪裡？", "ja": "病院はどこですか？", "romaji": "Byouin wa doko desu ka?"}, {"cat": "緊急", "zh": "請幫我叫救護車", "ja": "救急車を呼んでください。", "romaji": "Kyuukyuusha o yonde kudasai."}, {"cat": "緊急", "zh": "我身體不舒服", "ja": "気分が悪いです。", "romaji": "Kibun ga warui desu."}, {"cat": "溝通", "zh": "請問會說中文嗎？", "ja": "中国語は話せますか？", "romaji": "Chuugokugo wa hanasemasu ka?"}, {"cat": "溝通", "zh": "請問會說英文嗎？", "ja": "英語は話せますか？", "romaji": "Eigo wa hanasemasu ka?"}, {"cat": "溝通", "zh": "可以使用翻譯 App 嗎？", "ja": "翻訳アプリを使ってもいいですか？", "romaji": "Honyaku apuri o tsukatte mo ii desu ka?"}];
let phraseCat = '全部';

function setupPhraseGuide(){
  const cats=['全部',...Array.from(new Set(JAPANESE_PHRASES.map(x=>x.cat)))];
  const box=document.getElementById('phraseCats');
  if(!box)return;
  box.innerHTML='';
  cats.forEach(c=>{
    const b=document.createElement('button');
    b.textContent=c;
    if(c===phraseCat)b.classList.add('active');
    b.onclick=()=>{phraseCat=c;document.querySelectorAll('#phraseCats button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderPhrases();};
    box.appendChild(b);
  });
  const s=document.getElementById('phraseSearch');
  if(s)s.addEventListener('input',renderPhrases);
  renderPhrases();
}
function renderPhrases(){
  const list=document.getElementById('phraseList'); if(!list)return;
  const q=(document.getElementById('phraseSearch')?.value||'').trim().toLowerCase();
  const arr=JAPANESE_PHRASES.filter(x=>(phraseCat==='全部'||x.cat===phraseCat)&&(!q||x.zh.toLowerCase().includes(q)||x.ja.toLowerCase().includes(q)||x.romaji.toLowerCase().includes(q)));
  document.getElementById('phraseCount').textContent=`顯示 ${arr.length} / ${JAPANESE_PHRASES.length} 句`;
  list.innerHTML='';
  arr.forEach((x)=>{
    const c=document.createElement('div'); c.className='phrase-card';
    c.innerHTML=`<div class="label">${x.cat}</div><div class="phrase-zh">${escapeHtml(x.zh)}</div><div class="phrase-ja">${escapeHtml(x.ja)}</div><div class="phrase-romaji">${escapeHtml(x.romaji)}</div><div class="phrase-actions"><button onclick='speakJapanese(${JSON.stringify(x.ja)})'>🔊 播放日文</button><button class="showbig" onclick='showPhraseBig(${JSON.stringify(x.zh)},${JSON.stringify(x.ja)})'>🔎 放大給對方看</button></div>`;
    list.appendChild(c);
  });
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function speakJapanese(text){
  if(!('speechSynthesis' in window)){alert('這台裝置目前不支援語音播放');return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text); u.lang='ja-JP'; u.rate=0.85; speechSynthesis.speak(u);
}
function showPhraseBig(zh,ja){
  document.getElementById('phraseModalZh').textContent=zh;
  document.getElementById('phraseModalJa').textContent=ja;
  document.getElementById('phraseModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closePhraseModal(){
  document.getElementById('phraseModal').classList.remove('open');
  document.body.style.overflow='';
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', setupPhraseGuide);
}else{
  setupPhraseGuide();
}



function autoOpenTodayAccordion(){
  const map={
    '2027-03-25':'1','2027-03-26':'2','2027-03-27':'3',
    '2027-03-28':'4','2027-03-29':'5','2027-03-30':'6','2027-03-31':'7'
  };
  try{
    const parts=new Intl.DateTimeFormat('en-CA',{
      timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'
    }).format(new Date());
    const d=map[parts];
    if(d){
      const el=document.querySelector('.day-accordion[data-day="'+d+'"]');
      if(el) el.open=true;
    }
  }catch(e){}
}
document.addEventListener('DOMContentLoaded',autoOpenTodayAccordion);

const TRIP_ALERTS = {
 '2027-03-25':[
  ['high','✈️ 今日出發','12:10 小港機場接送；BR120 15:30。護照、手機、eSIM、行李再次確認。'],
  ['low','🏨 抵達福岡後','先入住飯店，再安排博多站周邊晚餐與散步。']
 ],
 '2027-03-26':[
  ['high','🎆 豪斯登堡日','提早抵達博多站，確認特急、月台與指定席。'],
  ['high','🚆 煙火後回程','煙火結束後優先往豪斯登堡站移動；正式車次公布後再更新。']
 ],
 '2027-03-27':[
  ['mid','🌸 賞櫻＋太宰府','上午舞鶴公園；下午往太宰府前確認西鐵轉乘。']
 ],
 '2027-03-28':[
  ['high','🌿 由布院','前一晚確認 JR 車次與指定席；回程班次也先記好。']
 ],
 '2027-03-29':[
  ['high','🌅 糸島夫婦岩＋夕陽','今天最重要：出發前再次確認二見浦回程巴士末班時間。'],
  ['mid','📸 夕陽拍攝','建議提早抵達海邊，夕陽後不要停留太久。']
 ],
 '2027-03-30':[
  ['low','🛍️ 博多休閒日','集中吃吃、買伴手禮；晚上回飯店整理行李與確認重量。']
 ],
 '2027-03-31':[
  ['high','✈️ 回程日','退房前完成回程清單；預留充裕時間前往福岡機場國際線。']
 ]
};
function tokyoDate(){
  try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
  catch(e){return new Date().toISOString().slice(0,10)}
}
function renderAlerts(){
  const box=document.getElementById('alertCenter'); if(!box)return;
  const key=tokyoDate(), arr=TRIP_ALERTS[key]||[];
  if(arr.length===0){
    box.innerHTML='<div class="alert-card low"><div class="alert-title">✅ 目前沒有當日警示</div><div class="alert-text">旅程開始前，這裡會在前一天／當天顯示真正需要注意的資訊。</div></div>';
    return;
  }
  box.innerHTML=arr.map(a=>`<div class="alert-card ${a[0]}"><div class="alert-title">${a[1]}</div><div class="alert-text">${a[2]}</div></div>`).join('');
}
function updateNetState(){
  const online=navigator.onLine;
  document.body.classList.toggle('offline',!online);
  const b=document.getElementById('offlineBadge');
  if(b){b.textContent=online?'● 線上':'● 離線模式';b.className='offline-badge '+(online?'ok':'no');}
}
function calcYen(){
  const y=parseFloat(document.getElementById('yenInput')?.value||0);
  const r=parseFloat(document.getElementById('rateInput')?.value||0);
  const el=document.getElementById('yenResult'); if(el)el.textContent='約 NT$ '+Math.round(y*r).toLocaleString('zh-TW');
}
function setYen(v){const e=document.getElementById('yenInput');if(e){e.value=v;calcYen();}}
function saveRate(){const e=document.getElementById('rateInput');if(e)localStorage.setItem('jw_yen_rate',e.value);}
function loadRate(){const e=document.getElementById('rateInput');if(e){const r=localStorage.getItem('jw_yen_rate');if(r)e.value=r;calcYen();}}
async function copyText(t){
  try{await navigator.clipboard.writeText(t);alert('已複製');}
  catch(e){prompt('請複製以下內容：',t);}
}
document.addEventListener('DOMContentLoaded',()=>{renderAlerts();updateNetState();loadRate();});
addEventListener('online',updateNetState);addEventListener('offline',updateNetState);


function localDateKey(){
  const d=new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function allChecked(selector){
  const a=[...document.querySelectorAll(selector)];
  return a.length>0 && a.every(x=>x.checked);
}
function checkedCount(selector){
  const a=[...document.querySelectorAll(selector)];
  return [a.filter(x=>x.checked).length,a.length];
}
function updateTravelChecklists(){
  const now=localDateKey();
  const departBox=document.getElementById('departChecklist');
  const returnBox=document.getElementById('returnChecklist');
  const departDone=allChecked('#depart input');
  const returnDone=allChecked('#return input');
  const [dc,dt]=checkedCount('#depart input');
  const [rc,rt]=checkedCount('#return input');
  const ds=document.getElementById('departStatus');
  const rs=document.getElementById('returnStatus');

  if(ds) ds.textContent=departDone ? `✅ 已確認 ${dc}/${dt}` : `${dc}/${dt} 已確認｜3/18 起自動展開`;
  if(rs) rs.textContent=returnDone ? `✅ 已確認 ${rc}/${rt}` : `${rc}/${rt} 已確認｜3/30 起自動展開`;

  if(departBox){
    departBox.classList.toggle('checklist-done',departDone);
    if(departDone){
      departBox.open=false;
      localStorage.setItem('jw_depart_completed','1');
    }else if(now>='2027-03-18' && now<='2027-03-25'){
      departBox.open=true;
    }
  }

  if(returnBox){
    returnBox.classList.toggle('checklist-done',returnDone);
    if(returnDone){
      returnBox.open=false;
      localStorage.setItem('jw_return_completed','1');
    }else if(now>='2027-03-30' && now<='2027-03-31'){
      returnBox.open=true;
    }
  }
}
document.addEventListener('DOMContentLoaded',updateTravelChecklists);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateTravelChecklists()});


function initFukuokaReco(){
  document.querySelectorAll('.fukuoka-reco-check').forEach(c=>{
    const k='jw_'+c.dataset.key;
    c.checked=localStorage.getItem(k)==='1';
    c.addEventListener('change',()=>localStorage.setItem(k,c.checked?'1':'0'));
  });
}
document.addEventListener('DOMContentLoaded',initFukuokaReco);


function weatherCodeText(c){
 const m={0:'晴朗',1:'大致晴朗',2:'局部多雲',3:'陰天',45:'有霧',48:'霧凇',
 51:'毛毛雨',53:'毛毛雨',55:'較強毛毛雨',61:'小雨',63:'中雨',65:'大雨',
 71:'小雪',73:'中雪',75:'大雪',80:'陣雨',81:'陣雨',82:'強陣雨',95:'雷雨',96:'雷雨',99:'強雷雨'};
 return m[c]||'天氣變化';
}
function renderWeather(w,offline=false){
 const $=id=>document.getElementById(id);
 if($('weatherTemp')) $('weatherTemp').textContent=Math.round(w.temp)+'°';
 if($('weatherDesc')) $('weatherDesc').textContent=weatherCodeText(w.code);
 if($('weatherRain')) $('weatherRain').textContent=Math.round(w.rainProb)+'%';
 if($('weatherHigh')) $('weatherHigh').textContent=Math.round(w.high)+'°';
 if($('weatherLow')) $('weatherLow').textContent=Math.round(w.low)+'°';
 if($('weatherUpdated')) $('weatherUpdated').textContent=(offline?'離線快取｜':'更新｜')+w.updated;
 let title,note;
 if(w.rainProb>=70 || w.precip>=3){title='🌧️ 建議一定攜帶雨具';note='今天降雨風險高，建議折傘＋輕便防水外套。';}
 else if(w.rainProb>=40 || w.precip>0){title='☂️ 建議攜帶折疊傘';note='有降雨可能，帶一把輕量折疊傘比較安心。';}
 else if(w.rainProb>=20){title='🌂 可帶輕量折疊傘';note='降雨機率不高，但長時間在外可帶小傘備用。';}
 else {title='☀️ 今天可不特別帶雨具';note='目前預報降雨風險低；出門前仍可再確認一次。';}
 if($('umbrellaTitle')) $('umbrellaTitle').textContent=title;
 if($('umbrellaNote')) $('umbrellaNote').textContent=note;
}
async function loadFukuokaWeather(){
 const cached=localStorage.getItem('jw_fukuoka_weather');
 if(!navigator.onLine && cached){try{return renderWeather(JSON.parse(cached),true)}catch(e){}}
 try{
  const url='https://api.open-meteo.com/v1/forecast?latitude=33.5902&longitude=130.4017&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Asia%2FTokyo&forecast_days=1';
  const r=await fetch(url,{cache:'no-store'}); if(!r.ok)throw new Error('weather');
  const d=await r.json();
  const w={temp:d.current.temperature_2m,code:d.current.weather_code,
   high:d.daily.temperature_2m_max[0],low:d.daily.temperature_2m_min[0],
   rainProb:d.daily.precipitation_probability_max[0]??0,precip:d.daily.precipitation_sum[0]??0,
   updated:new Date().toLocaleString('zh-TW',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})};
  localStorage.setItem('jw_fukuoka_weather',JSON.stringify(w)); renderWeather(w,false);
 }catch(e){
  if(cached){try{return renderWeather(JSON.parse(cached),true)}catch(x){}}
  const u=document.getElementById('weatherUpdated'); if(u)u.textContent='目前無法取得天氣';
  const t=document.getElementById('umbrellaTitle'); if(t)t.textContent='🌂 建議先帶折疊傘備用';
 }
}
document.addEventListener('DOMContentLoaded',()=>JWPerf.idle(loadFukuokaWeather));
addEventListener('online',()=>JWPerf.idle(loadFukuokaWeather),{passive:true});
