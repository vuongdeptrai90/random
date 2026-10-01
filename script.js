/* ==================== ÂM THANH SỰ KIỆN ==================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'success') {
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } else if (type === 'hit') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }
}

/* ==================== ĐỔI CHỦ ĐỀ MÀU SẮC ==================== */
function toggleTheme() {
  playSound('click');
  document.body.classList.toggle("theme-purple");
  let isPurple = document.body.classList.contains("theme-purple");
  localStorage.setItem("theme", isPurple ? "purple" : "cyan");
}
if(localStorage.getItem("theme") === "purple") {
  document.body.classList.add("theme-purple");
}

/* ==================== THỐNG KÊ LƯỢT TRUY CẬP & LƯỢT QUAY ==================== */
let totalVisits = Number(localStorage.getItem("totalVisits")) || 0;
totalVisits++;
localStorage.setItem("totalVisits", totalVisits);
document.getElementById("totalVisits").innerText = totalVisits;

if (localStorage.getItem("userSpins") === null) {
  localStorage.setItem("userSpins", "1");
}

function updateSpinUI() {
  let spins = Number(localStorage.getItem("userSpins")) || 0;
  document.getElementById("userSpins").innerText = spins;
}
updateSpinUI();

/* ==================== XÁC THỰC VƯỢT LINK & CHUYỂN HƯỚNG ==================== */
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("verify") === "link4m") {
    let currentSpins = Number(localStorage.getItem("userSpins")) || 0;
    localStorage.setItem("userSpins", currentSpins + 3);
    updateSpinUI();
    showToast("🎉 Xác thực vượt link thành công! Nhận thêm 3 lượt!");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

function redirectToGetLink() {
  playSound('click');
  showToast("🔗 Đang chuyển hướng sang trang vượt link...");
  window.location.href = "https://link4m.org/PG4XgJ";
}

/* ==================== ĐIỂM DANH HÀNG NGÀY ==================== */
function checkDailyCheckinStatus() {
  let lastCheckin = localStorage.getItem("lastCheckinDate");
  let today = new Date().toDateString();
  if (lastCheckin === today) {
    document.getElementById("checkinText").innerText = "✅ Hôm nay bạn đã điểm danh nhận quà rồi!";
    document.getElementById("checkinBtn").style.display = "none";
  }
}

function claimDailyCheckin() {
  playSound('success');
  let today = new Date().toDateString();
  localStorage.setItem("lastCheckinDate", today);
  
  let currentSpins = Number(localStorage.getItem("userSpins")) || 0;
  localStorage.setItem("userSpins", currentSpins + 1);
  updateSpinUI();
  
  showToast("🎉 Điểm danh thành công! Bạn nhận được thêm 1 lượt!");
  checkDailyCheckinStatus();
}
checkDailyCheckinStatus();

/* ==================== PHẦN THÔNG BÁO TOAST ==================== */
function showToast(message) {
  let toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "show";
  setTimeout(function(){ 
    toast.className = toast.className.replace("show", ""); 
  }, 2500);
}

/* ==================== CHUYỂN TAB ==================== */
function switchTab(evt, tabId) {
  playSound('click');
  let contents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
  }

  let buttons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

/* ==================== PHẦN RANDOM ACC ==================== */
const defaultAccounts = [
  {user:"Shin2xx2", pass:"123456789az"},
  {user:"tranmychau4x", pass:"1100110a"},
  {user:"bestpro08", pass:"9630621q"},
  {user:"mudamudawrys", pass:"kocomk123"},
  {user:"yinumber1", pass:"0981921745kito"},
  {user:"vothanhdanh978", pass:"trinh12345"},
  {user:"taodzquabodoi", pass:"Huy050611@"},
  {user:"megatrolls117", pass:"trong1131994"},
  {user:"accphu5657", pass:"st0mstfr"},
  {user:"thanchet_ace", pass:"Matkhaumoi@96"},
  {user:"Hitle22082000", pass:"ducha22082000"},
  {user:"mylop5a2", pass:"mybenhtri123"},
  {user:"truong111pk", pass:"truong01"},
  {user:"tanxuan_xm", pass:"Abcd@0307"},
  {user:"nat.no1", pass:"mklaginhi1102"},
  {user:"lamdat2016", pass:"1212007nhi"},
  {user:"33gatopk", pass:"0962262843khoa"},
  {user:"binlovely1000", pass:"Phamchinh1997"},
  {user:"phodo11v", pass:"Whatiyou1"},
  {user:"LaViex", pass:"Longkhanh06"},
  {user:"ngheancuchuoi", pass:"liulo123"},
  {user:"u243230469", pass:"longaa09"},
  {user:"nghicungchan3", pass:"trong1989"},
  {user:"tenthatngau1235", pass:"bestyasuo1234"},
  {user:"hishiron05", pass:"FAllinlove123"},
  {user:"phonghuy59", pass:"trongnghia1"},
  {user:"wader_hnh", pass:"lalungemtoi6"},
  {user:"khiemtmt111", pass:"chumlmht123"},
  {user:"Lemon8102010", pass:"lemon2010"},
  {user:"Trung_2k1012345", pass:"clmmcclao012345"},
  {user:"long2512205", pass:"tuan00000"},
  {user:"u01276853980", pass:"Anhyeuem123"},
  {user:"Trieubui001", pass:"trieubui2003"},
  {user:"hahieu6996", pass:"trang10040104"},
  {user:"trung5e4", pass:"0906099771Aa@"},
  {user:"Tranduyanyou857", pass:"An01635874469"},
  {user:"lengoclong2003@gmail.com", pass:"long555666664"},
  {user:"accgametk15298", pass:"Kabaneri113"},
  {user:"BAYMAX-1", pass:"yeutrang7A"},
  {user:"DuyyCuteWasDi", pass:"lnkcutis1tg"},
  {user:"dung19992007", pass:"can2252009"},
  {user:"0842yeu", pass:"thoinhe123"},
  {user:"Lehung1996H", pass:"Hung1996hung"},
  {user:"Ngocduyphi", pass:"hoanganh123"},
  {user:"Chinh892003", pass:"chinhngoc2606"},
  {user:"Teamfltk1", pass:"Quanganh@123"},
  {user:"cuagiathu99", pass:"14011999hdh"},
  {user:"tukupj1997", pass:"sang01636602"},
  {user:"jejez0909", pass:"ngocphuc123"},
  {user:"msmsnsns@gmail.com", pass:"hoangprohh00"},
  {user:"locert222", pass:"truong0608"},
  {user:"giang005.vn", pass:"01627024481dai"},
  {user:"dieudong.123", pass:"dieudong123"},
  {user:"truong02041996", pass:"02041996@As"},
  {user:"qqqqqqqwasa", pass:"d20102002"},
  {user:"hoannnhut0501", pass:"mikita789"},
  {user:"trucbap456", pass:"ntuyen0123"},
  {user:"henrydavid2004", pass:"nguyennamhai11"},
  {user:"thinhbadao4823", pass:"048230KenJ!"},
  {user:"ayanhto", pass:"T01659550871"},
  {user:"phamquochuy2003", pass:"0937272017da"},
  {user:"minhlo2011", pass:"minhku2011"},
  {user:"Thienkyo1234", pass:"thien123"},
  {user:"thao_231002", pass:"thao2002"},
  {user:"Thien19971997A", pass:"thien1997"},
  {user:"thanhtamcute123", pass:"baongan123"},
  {user:"Xuanhuyhp123", pass:"tantin123"},
  {user:"quangtony2k2", pass:"quanglinh2k2"},
  {user:"matkute1482", pass:"nitranh123"},
  {user:"nhothoi2018", pass:"nhothoi2018"},
  {user:"0338108346Aa", pass:"1234567890Aa"},
  {user:"lechuong22392", pass:"vulam2110"},
  {user:"bien8byg", pass:"732003chung"},
  {user:"Michenhoang2k8", pass:"michenhoang2008"},
  {user:"Phuctn24071992", pass:"phuctn1992"},
  {user:"thanglon.c0m", pass:"teo01293057500"},
  {user:"hangoc891888", pass:"minhngoc@1234"},
  {user:"dieuyeuthao99", pass:"dieu2k2thao99"},
  {user:"nguyennghia937", pass:"truongphu15"},
  {user:"vuong250lk", pass:"whatthefuck12345"},
  {user:"tuan-5b", pass:"anhtuan123"},
  {user:"tim9109", pass:"hoangdai0397"},
  {user:"Lamtac7a2", pass:"tuongem066vn"},
  {user:"Titiproma2000", pass:"titiiucam123"},
  {user:"captain111303", pass:"3643248z"},
  {user:"Giumm1715", pass:"tatuantulq2010"},
  {user:"lekimnhi2k8", pass:"nhi12345"},
  {user:"yeuem-83", pass:"Ahndte4785@@"},
  {user:"Minh-quang2015", pass:"Hjeplx111@"},
  {user:"draculapain", pass:"0352283978duc"},
  {user:"Yeuuni", pass:"Mhl160309."},
  {user:"Asdf_2004", pass:"Toan08052k6"},
  {user:"Ik67tut", pass:"trang2017"},
  {user:"mjnk9xttpro", pass:"anhtrung123"},
  {user:"cooi2103", pass:"gaubongnguyen1"},
  {user:"dungtientri123", pass:"0188dung"},
  {user:"Iloveyou140403", pass:"fclongxuan123"},
  {user:"lion425885", pass:"phong02112005"},
  {user:"trieuluu383", pass:"Aztrieuluu"},
  {user:"Thanhluan084", pass:"HauyeuNhi591"},
  {user:"1935toan", pass:"thienanh1479"},
  {user:"taokovui1235", pass:"cmktstad3"},
  {user:"locgai1", pass:"01662933171loc"},
  {user:"hiepbg89", pass:"taokocanbiet1"},
  {user:"John2008FF", pass:"ancutchau2008"},
  {user:"keo1522005", pass:"1522005keo"},
  {user:"taphilong2002", pass:"longcong2002"},
  {user:"hoatienpvp", pass:"iamtheboss999"},
  {user:"luongdung93", pass:"lenkcngay123"},
  {user:"Kingofking_hanu", pass:"161066bf"},
  {user:"Bienphongqn", pass:"za1234567"},
  {user:"cutai99@gmail.com", pass:"Tai12345678"},
  {user:"K1tram", pass:"xuantrong1707"},
  {user:"galatao1973", pass:"Hlb@761322"},
  {user:"Nyanis59", pass:"minhhai95"},
  {user:"Pika1195", pass:"Mon2002@"},
  {user:"Thanh2002q", pass:"123456789Azx#"},
  {user:"trucool2k8", pass:"tranthanhtruc2k8"},
  {user:"chipichipi1181", pass:"minhtan123"},
  {user:"manhseven179", pass:"vanmanh77"},
  {user:"thapthapvttttnn", pass:"Thong184"},
  {user:"minhtienlolypo3", pass:"nhocminhtien123"},
  {user:"tam_tran_2003", pass:"koiuthithui123"},
  {user:"Tcttlvn1", pass:"anhthien93"},
  {user:"anhemtoi2106", pass:"anhtien2106"},
  {user:"Lethanhson24", pass:"tron12121997"},
  {user:"nongvanden113", pass:"76qnkhanhtrinh"},
  {user:"tantuo7c", pass:"tan12102001"},
  {user:"Nghivy99", pass:"thaiquoc99"},
  {user:"accxin1078", pass:"Qwer56789"},
  {user:"hoaiphuongngo", pass:"thanhnobita1"},
  {user:"heocoma245", pass:"mtp20122"},
  {user:"bayheocon09", pass:"anhlabay0990"},
  {user:"lequythong07", pass:"taolapro111"},
  {user:"Crayonpay", pass:"emgaimua1728"},
  {user:"vvnv20111999", pass:"anhhieu2005"},
  {user:"5xdo016", pass:"Qw1nb888"},
  {user:"uttuan111", pass:"TranQuang147"},
  {user:"lyhung1991hn", pass:"huuthong0310t"},
  {user:"Nghiast97", pass:"Nghia7991"},
  {user:"Laopom1234", pass:"pumpum1995"},
  {user:"daikapk00", pass:"dailol123"},
  {user:"Moinha2007", pass:"Tung0101@"},
  {user:"gaplagietha", pass:"duongtheanh107"},
  {user:"ronandol17984", pass:"01658499285Aa"},
  {user:"Tamvskhanh", pass:"htt882650"},
  {user:"rdfbwebmoi11", pass:"delcanbiet1"},
  {user:"vinhphubui01@gmail.com", pass:"@Phubui8892"},
  {user:"nghiahoang0206", pass:"isme27thfeb"},
  {user:"nguyenhien1181", pass:"vuong12345"},
  {user:"haunguyen01011", pass:"Lamhau123209"},
  {user:"quan30724", pass:"long20102004ok"},
  {user:"mganga1903", pass:"quachtuanan12345"},
  {user:"tunglee159", pass:"tutimdi456"},
  {user:"thaikhang34556", pass:"34556thaikhang"},
  {user:"cucho2k", pass:"Quochuy1212@"},
  {user:"dauanh123456", pass:"anhanh95"},
  {user:"minhkhanh131310@gmail.com", pass:"khanh13122010"},
  {user:"meosamsung4@gmail.com", pass:"Levankien26@"},
  {user:"baubanhbeo2004", pass:"tuanbau123"},
  {user:"tan0398812661", pass:"tan0777822931"},
  {user:"lqcongly55201", pass:"Neqbiuee"},
  {user:"gamethu.123", pass:"Gamethu.123"},
  {user:"kaka_hihi", pass:"maxcool123"},
  {user:"omaiman1", pass:"hoilamchi1"},
  {user:"SVSTOP", pass:"Garena.vn"},
  {user:"DH01639998942", pass:"thanhhuy123"},
  {user:"accroh102", pass:"11212212Zz"},
  {user:"thataochucmang", pass:"binh10082006"},
  {user:"nhungnhung36", pass:"Tupro113kK@"},
  {user:"BichNgoc224203", pass:"tranminhluan2k3"},
  {user:"buituananh6a", pass:"hoicaicc12345"},
  {user:"duytv54321", pass:"duyliz123"},
  {user:"dtudepzai2008@gmail.com", pass:"Mixigaming@123"},
  {user:"AK47SGG", pass:"babyboy256311"},
  {user:"longhackvlog1", pass:"longhack1"},
  {user:"boygari123", pass:"Huytvph32189@"},
  {user:"avocado27092007", pass:"man27092007"},
  {user:"Ckloan_1999", pass:"tranoanh1"},
  {user:"naucomnhao2", pass:"minhquy12"},
  {user:"Hoanghoaicn", pass:"1998hoai"},
  {user:"rdlq68l812", pass:"Tuong@2653211"},
  {user:"Akcheck123", pass:"thaithi151"},
  {user:"nghiadx1010", pass:"anhemno1997"},
  {user:"Gvd466rhd", pass:"vietanh239"},
  {user:"Thuan18052", pass:"thuan2003t"},
  {user:"Viet2004hp", pass:"viet2004"},
  {user:"cuthoc15041995", pass:"anhson150495"},
  {user:"kimdang_99", pass:"dangdinhtam01"},
  {user:"0327375751l", pass:"manh2005"},
  {user:"phucla321", pass:"taiprovip3"},
  {user:"kunpro_n0_1", pass:"sonthach9999"},
  {user:"nguyenchanol", pass:"depzai123"},
  {user:"acciehrhr3994", pass:"phanlinh301094"},
  {user:"kennybiet1", pass:"hieutn97"},
  {user:"huybu902008", pass:"yasuott7"},
  {user:"ToanLai76", pass:"Toanln2007"},
  {user:"123thuankhucna", pass:"huy1611200644"},
  {user:"Libragemini01", pass:"1234567As."},
  {user:"khai2k6pbtn", pass:"Duongkhai2"},
  {user:"bocanhbac123", pass:"tien23112004"},
  {user:"Taodayss1", pass:"Luongduy2007@"},
  {user:"trandiemqna", pass:"0328998864tr"},
  {user:"haidang012a-z", pass:"haidang6789a-z"},
  {user:"ykz1069", pass:"hackaccbanoi2k"},
  {user:"fantahong", pass:"anhthien123"},
  {user:"pg532011@gmail.com", pass:"Pndtre25cm@"},
  {user:"gunnyigh999", pass:"Khangcony999@"},
  {user:"CVBQ3010", pass:"06102003Quy"},
  {user:"Sonkon195", pass:"Phung-van-son"},
  {user:"rdlq09842124", pass:"tranphi0905"},
  {user:"Belinhkdam", pass:"12345679hieu"},
  {user:"xuantung11211", pass:"tung11211"},
  {user:"thammy978", pass:"anhyeuem088"},
  {user:"racingboy01663", pass:"thanh01652637481"},
  {user:"duong2004Azok", pass:"ongnoi123Az"},
  {user:"nguyenminhfg", pass:"Trongkoi1999"},
  {user:"yenthanhhoa123", pass:"01265765489dao"},
  {user:"cuixuongls1", pass:"Hahiepls@2005"},
  {user:"Ledinh78960", pass:"ledinh1234567890"},
  {user:"Mr.Keen1456", pass:"Keendfhdfh96"},
  {user:"haukg28041998", pass:"dinhnam96"},
  {user:"namxb2k3", pass:"doimatkhau123"},
  {user:"shacovl", pass:"phamduong94"},
  {user:"andesong1998", pass:"01686369801tung"},
  {user:"HUYxMGK", pass:"huy0347706838"},
  {user:"bosshausex", pass:"hung2007"},
  {user:"123minhz123", pass:"vai2000tb"},
  {user:"Songnguusinh303", pass:"hoilamgi315"},
  {user:"cala098", pass:"anhne1992"},
  {user:"nicklqvn8014", pass:"Nhokjcung99999x"},
  {user:"anhtukk2020", pass:"anhtu123456789"},
  {user:"Van01652125728", pass:"321729521Van"},
  {user:"tandaicasoncong", pass:"levantuan123"},
  {user:"AngocgiauZ", pass:"xinloianhZ01"},
  {user:"o468525", pass:"baoson30102006"},
  {user:"trungiuai", pass:"01235634667khai"},
  {user:"Trungthai281", pass:"trungthai9110"},
  {user:"trungthuy542", pass:"kocomk2k3"},
  {user:"Tunbumtun11", pass:"PMTtri@123456789"},
  {user:"huybubo02", pass:"botran9804"},
  {user:"khanh10081008", pass:"20072007@"},
  {user:"ThanhLuong_0147", pass:"0978711736A"},
  {user:"son191838", pass:"thedeath1415"},
  {user:"Docco003", pass:"matkhaugi113"},
  {user:"milodn1990", pass:"milo21134121"},
  {user:"accvipc35", pass:"vyvy2007"},
  {user:"ngodoan980", pass:"buitoanvien@"},
  {user:"ollsoszk", pass:"0899983742aaa"},
  {user:"Anhfcchuc", pass:"chuc1412003"},
  {user:"boloqj", pass:"hung0512"},
  {user:"daison555", pass:"thienthan555"},
  {user:"hoangday2005w", pass:"hoangday2005W."},
  {user:"pikoloii", pass:"hdml1o77"},
  {user:"halseyhan99", pass:"yukinohana0911"},
  {user:"thuong17112022", pass:"Thuongyeu1711"},
  {user:"trongken198", pass:"trongken11"},
  {user:"hohoainhieu", pass:"1nick2xai"},
  {user:"bboyxnxx9", pass:"123456qaz"},
  {user:"qthaids123@gmail.com", pass:"afk150909"},
  {user:"bop.bop2004", pass:"thaocuonn2004"},
  {user:"danhhau1111", pass:"hauboycf123"},
  {user:"lucka132", pass:"110055@i"},
  {user:"taibach09052012@gmail.com", pass:"bach09052012"},
  {user:"hoangvanloi1993", pass:"hoangvanloi93"},
  {user:"Acclq68a964", pass:"dktiunpu2305"},
  {user:"Thanhlac2134", pass:"thanhlac2k7"},
  {user:"hello1111333", pass:"hello111133"},
  {user:"songkhoaisk", pass:"DUNGHOITAO99"},
  {user:"Doteamhet", pass:"tryhard123"},
  {user:"DUYLE8685", pass:"huyvip123"},
  {user:"decoduocem", pass:"0946918264phuong"},
  {user:"anlun132", pass:"an582004"},
  {user:"hienhaitra_09", pass:"hienhaitra98"},
  {user:"0944878825a", pass:"0944878825a"},
  {user:"chicoj", pass:"2107dung"},
  {user:"Khiemhp89", pass:"huy123456"},
  {user:"namsilvernga", pass:"123456789a"},
  {user:"meongokg", pass:"tynkok1303"},
  {user:"huy2003tn123", pass:"Loncho123"},
  {user:"zatuanv31f", pass:"kocanbiet1"},
  {user:"hung997uy", pass:"occhokm1"},
  {user:"quang_dung2506", pass:"@Minh123456"},
  {user:"khetang12345", pass:"khetang54321"},
  {user:"phucpro749@gmail.com", pass:"0915135600nguyen"},
  {user:"tanjirodietquy", pass:"animehay123"},
  {user:"thanhquan131295", pass:"thanhquan131295"},
  {user:"kenkendz123", pass:"xuantrong123"},
  {user:"nhozz09", pass:"nhozz123"},
  {user:"kely_FiFa", pass:"sasuke5349"},
  {user:"Asunaunderworld", pass:"hung6688"},
  {user:"quan11102009", pass:"phuc140598"},
  {user:"anhprolovengoc", pass:"quocviet150907"},
  {user:"mdc97", pass:"a01663445653159"},
  {user:"trankyquang234", pass:"123456789l"},
  {user:"nhoccho3321", pass:"0896404659co"},
  {user:"giaosuhien2k", pass:"huylun2001"},
  {user:"hayhohohay223", pass:"duyanhhy123"},
  {user:"baohihi1235", pass:"susi1236"},
  {user:"Zkanhtungzk", pass:"lytung123"},
  {user:"zinprotq14", pass:"tamtq123"},
  {user:"dhung2004", pass:"vu1234ns"},
  {user:"tai_ronaldo7", pass:"Sieunhan123"},
  {user:"Dattrandz", pass:"abcxyz123"},
  {user:"boisaigon456", pass:"triet123456"},
  {user:"Hoanglichbk", pass:"kienkien1102"},
  {user:"sonman16081993", pass:"mint1108"},
  {user:"thinhcoi1231", pass:"thaihoc113"},
  {user:"01216857418h", pass:"nguyen13579"},
  {user:"Accnhucec1", pass:"Hieubaodoi123@"},
  {user:"danchoi11cute", pass:"zUCGMM8EUO"},
  {user:"duc150127", pass:"duc150127@"},
  {user:"L0786914621", pass:"nhoncld12"},
  {user:"philippnam2005", pass:"quyennguyen2212"},
  {user:"fl.huanmx", pass:"Huanvp131020039"},
  {user:"quoclinhhk", pass:"linhhien1234"},
  {user:"gatremai123", pass:"yamahar15"},
  {user:"Neoux627", pass:"Thang103@"},
  {user:"netnetnet2016vn", pass:"01865032634vn"},
  {user:"pThinhtran11", pass:"Nguyenhoangnhan1"},
  {user:"vi2008raz", pass:"vi123456789"},
  {user:"phamngockimphuc", pass:"phuc56789"},
  {user:"Bbinguyen123", pass:"vanvip123"},
  {user:"namxeommm", pass:"nam162211"},
  {user:"thangdzai0999", pass:"hoangthang99"},
  {user:"sasakk1z", pass:"0924140757thong"},
  {user:"kohoigi", pass:"chunggau1993"},
  {user:"Thanhvolam", pass:"minhthanh399"},
  {user:"regcan.111", pass:"them1landau"},
  {user:"namspeed2010", pass:"killbill3592054"},
  {user:"khang0164khang", pass:"123123123k"},
  {user:"Quanghuong-19", pass:"Daohanh19@"},
  {user:"phuocgacon0", pass:"Rockkeane01"},
  {user:"khanglehm.123", pass:"ngoanle123"},
  {user:"yeutrangvcl22", pass:"thangcuto00"},
  {user:"coockinggoi", pass:"cuonggo1107"},
  {user:"ntthfff1410@gmail.com", pass:"thinh1410"},
  {user:"tiettong", pass:"trieulinh12"},
  {user:"tuntun188", pass:"dangbui9211"},
  {user:"Ladykiller509", pass:"Coccoc509"},
  {user:"spm889", pass:"Huyenmy14"},
  {user:"phubanlinh", pass:"@@123456789"},
  {user:"Kilonhi997", pass:"Longvahien@997"},
  {user:"Baosaigonvn", pass:"suong2002"},
  {user:"anhsuc2004", pass:"theanh2004"},
  {user:"becodon0611", pass:"h14226@@@"},
  {user:"duongdepzai4991", pass:"Duong4991"},
  {user:"Baocong0", pass:"Aa01658809015"},
  {user:"nguyenthinh1806", pass:"vanthinh2005"},
  {user:"gsxnhi6463", pass:"way12345678@"},
  {user:"Dongaids", pass:"dong3112002"},
  {user:"ATKquanks", pass:"Minhpubg123"},
  {user:"dzcogisaizz", pass:"dzsaicaigi123"},
  {user:"Chuhoang254", pass:"Lathu500@"},
  {user:"votudi37", pass:"anhnhoemnhieu37"},
  {user:"Tykhum1200", pass:"01678194959aa"},
  {user:"namvip200k2", pass:"namvip01"},
  {user:"dienco9104", pass:"son11111"},
  {user:"vienpham093", pass:"814160Cong@"},
  {user:"besstrivenahihi", pass:"f02012002a"},
  {user:"Huonglmht", pass:"huyyeuhuong123"},
  {user:"chiyeuminh11223", pass:"kamasucha123"},
  {user:"Phuocfucker", pass:"minhminhk8"},
  {user:"trannamart", pass:"truong123456"},
  {user:"lolnhucac213", pass:"binhpro123"},
  {user:"hoan2k41412", pass:"tencuatao01"},
  {user:"nhattanlon", pass:"gagaga123"},
  {user:"Nvvinh300498@gmail.com", pass:"300498@@Vv"},
  {user:"lachoapro", pass:"huuloc1994"},
  {user:"Emgiaroiak", pass:"ba110200ba"},
  {user:"thanhsatthu2710", pass:"thanh123456789"},
  {user:"Nick2481036", pass:"anhtinh280795"},
  {user:"reggau19", pass:"namcony24"},
  {user:"Khangvoihtn", pass:"laonhi0123"},
  {user:"nguyentthht", pass:"trung12042007"},
  {user:"yeejthojxwb", pass:"yeejthojxwb1"},
  {user:"duykhuong1911", pass:"duykhuong1"},
  {user:"ht1459", pass:"tai123456789"},
  {user:"thuyhai31520", pass:"thuyoccho315"},
  {user:"huonghethan", pass:"Taodeonoi.1"},
  {user:"lynl1996", pass:"1996lynl"},
  {user:"phamvanthuan198", pass:"vannhan1"},
  {user:"acccjvbv", pass:"huynhvan1234"},
  {user:"hunghe1999", pass:"Hung123456@"},
  {user:"starminh", pass:"vuthang1996"},
  {user:"xakutara7890", pass:"Tung070890"},
  {user:"q01626198365", pass:"quanghitler1004"},
  {user:"acmila", pass:"Hungthuy.1990"},
  {user:"lamthephol", pass:"thephol123"},
  {user:"sonbanhcuon1234", pass:"anhhiep03nd"},
  {user:"diepphuc2006", pass:"phuc2006"},
  {user:"accvip33z", pass:"vinhbq2951992"},
  {user:"chicothang9", pass:"anhzalongoc10"},
  {user:"Cudangsung2.0", pass:"phong12345"},
  {user:"Corona992008", pass:"hieusneo9"},
  {user:"Huong_xu_0104", pass:"huong0104"},
  {user:"Hieu145315", pass:"hieunguyen1"},
  {user:"lactranhh", pass:"VIET12345a"},
  {user:"HaiCongTu2911", pass:"quy25092006"},
  {user:"Nguyenanh88ht", pass:"nguyenanh520"},
  {user:"Maiyeucuimia", pass:"tn0966999002"},
  {user:"Binsupper0123", pass:"binlun0123"},
  {user:"ZATAxxxRAZ", pass:"Raz12345"},
  {user:"duongsui305", pass:"Duong@123cxz"},
  {user:"Quocdan2x", pass:"Quocdan2xx"},
  {user:"duonglonduong", pass:"duonglon2"},
  {user:"bang_bmt9xxxx", pass:"Kietphuong2407"},
  {user:"cudenthui2810", pass:"Truong010321@"},
  {user:"Thanhtailx30", pass:"01635167963NTT"},
  {user:"padaoks113", pass:"haicoc6a123"},
  {user:"trinnhhung", pass:"trinh102002"},
  {user:"azipok.4", pass:"anhembattu1470"},
  {user:"Dieptu231292", pass:"dieptu231292"},
  {user:"Blackcat3by", pass:"anhlavp1991"},
  {user:"Sonsx2002", pass:"01657811240sx"},
  {user:"vuthuanthien2001@gmail.com", pass:"Thien2001@"},
  {user:"nhaho2016as", pass:"buinhattinh113"},
  {user:"bipt63459@gmail.com", pass:"quang20092110"},
  {user:"linhpkvp_ruby", pass:"thideothem123"},
  {user:"u16011991", pass:"vuhaoconha1"},
  {user:"tamxauxi2000", pass:"13022000q"},
  {user:"phamtuyeni", pass:"tuyen123456789"},
  {user:"caveday1245", pass:"vkngaiuem111"},
  {user:"samlonvaidai123", pass:"levanhung123"},
  {user:"manh_skip", pass:"Manh@2kk9"},
  {user:"luumanh207", pass:"anhban12"},
  {user:"milada17", pass:"mothai34"},
  {user:"luanfcm", pass:"huyenll1"},
  {user:"ne03699", pass:"HTht0945679391"},
  {user:"Hieudaubo37", pass:"koy371995"},
  {user:"Nguoila2008", pass:"thanhquang1706"},
  {user:"thuanpro7707", pass:"thanhtuan1"},
  {user:"bun_bun_bun1237", pass:"Tan@1997"},
  {user:"nhungsoaica", pass:"thanhliem123"},
  {user:"Nhokbuipq", pass:"1998@1998"},
  {user:"ahungxabeng1133", pass:"0932133867h"},
  {user:"tomm_tayy", pass:"tomtay123"},
  {user:"truongphuung", pass:"truong2005"},
  {user:"162yasuo1", pass:"162maiyeuhuyen"},
  {user:"leecris2", pass:"Azz@@zyk@79"},
  {user:"pikackuasd", pass:"vuong0905645878"},
  {user:"namthanphong91", pass:"canhuytap102"},
  {user:"Votinh899", pass:"Hoai0101@"},
  {user:"lenzoj3", pass:"vaa32xo%fcj"},
  {user:"Cuminhtrieu12", pass:"trieu9a6kt"},
  {user:"Vuhoanghaian157", pass:"rk82x7ka"},
  {user:"boydzkochim123", pass:"Tanhdz123"},
  {user:"S2ducvuhps2", pass:"nhudao993"},
  {user:"vinhcenzo", pass:"vinh30122010"},
  {user:"abcphuvan2001", pass:"0332506298H"},
  {user:"phuocro20000", pass:"yeunga2006"},
  {user:"K2sunni1987", pass:"quyetlop9"},
  {user:"123quandz1", pass:"Aa0211201@"},
  {user:"tuonghlubmai", pass:"tushlub@.com"},
  {user:"zingka1617", pass:"thuong118"},
  {user:"adkhung1", pass:"01674455457a"},
  {user:"giangvo1121", pass:"zs1234567"},
  {user:"An-ki-nay234", pass:"anhmatlon123"},
  {user:"Hieu12122006", pass:"hieu1212"},
  {user:"hiitle1997", pass:"0971856971nguyen"},
  {user:"joogkoonkhhi", pass:"Handsome123"},
  {user:"HTMIMI", pass:"vanthat91"},
  {user:"Pronkk", pass:"thang1207"},
  {user:"Fycraftvn1", pass:"minhhuy877"},
  {user:"phovn123a", pass:"BoyLanhLung123"},
  {user:"hieucuksuk@gmail.c", pass:"hieu2005"},
  {user:"hoangchienmasoi@gmail.com", pass:"anhchienvip99kk2"},
  {user:"hamsterpro1234", pass:"123456789q"},
  {user:"12anhyeuemlam12", pass:"nhanyeu227"},
  {user:"conca10x", pass:"ngochuynh0202"},
  {user:"sskyboss1", pass:"etyu123Kbma"},
  {user:"huyzer000", pass:"minhhuy252"},
  {user:"hieu6e789", pass:"anhhieu123"},
  {user:"minhquang1gv", pass:"hoimetaoy16"},
  {user:"duongtuhuynhi", pass:"phucanlon1"},
  {user:"reg-blue71", pass:"Phong0983185597"},
  {user:"ManhHaoSoi2006", pass:"Lovanhao2006"},
  {user:"khoibep11", pass:"ngaoaban11"},
  {user:"mirgu4165", pass:"10091987Adn"},
  {user:"Phattai99x", pass:"tanh01656149730"},
  {user:"jenbum", pass:"Moiyeu1234%"},
  {user:"kajanaha", pass:"them1landau"},
  {user:"anhuy29112016", pass:"benhi17102005"},
  {user:"trunghieumk231", pass:"Wibuneverdie"},
  {user:"vinh_98qs", pass:"tanvinh1409"},
  {user:"Lethequang124", pass:"DieuLinh146@"},
  {user:"hoangbelam1004", pass:"lamvannen1004"},
  {user:"chimcugay1357", pass:"nguyentuanvu12"},
  {user:"diepnguyencute2", pass:"Diepnguyen1"},
  {user:"Pqh1504", pass:"hungcon1504"},
  {user:"pham_thiet92", pass:"nguyendainghia94"},
  {user:"Zminh98", pass:"0762138571An@"},
  {user:"phucvtzc11", pass:"123123az"},
  {user:"emyeu132109", pass:"Trang2002"},
  {user:"duc2k2d", pass:"01639405914zz"},
  {user:"thuan12578", pass:"ngoclinh12"},
  {user:"bachkim275", pass:"123456Aa"},
  {user:"taoghetmay26", pass:"taolameo1"},
  {user:"duy-ka", pass:"suppergor1"},
  {user:"phu_gl115", pass:"hoanghuy01"},
  {user:"thequang2k6hy", pass:"buoiemdai12cm"},
  {user:"Nguyenbaobin203", pass:"18012003bin"},
  {user:"Mboyhd999", pass:"anhduonghd123"},
  {user:"ducuyfa", pass:"Hacker123@@"},
  {user:"lqmbno7778@gmail.com", pass:"hieudz11"},
  {user:"Daccau2k8", pass:"1234567890As@"},
  {user:"dong100w", pass:"Dinhlam2002"},
  {user:"yeumoi10", pass:"anhday1997"},
  {user:"ncskin.a7", pass:"Bao_le483"},
  {user:"baorong189", pass:"rongtute01"},
  {user:"AZ09az09sa", pass:"vansi2002"},
  {user:"anhtun51", pass:"phamthioanh435"},
  {user:"Hoahaihuo", pass:"hoa17012002"},
  {user:"nhokphucvippro", pass:"chichkhongdi11"},
  {user:"hellotuan2016", pass:"vantuan1"},
  {user:"Shanks@hooy.com", pass:"thanh1123"},
  {user:"tienboy1990cute", pass:"hoilamgi123"},
  {user:"gdjbcdi5", pass:"gaugauem123"},
  {user:"damthue12345678", pass:"damthue1"},
  {user:"tuupqbt_03", pass:"01699643732f2"},
  {user:"minhkhoi211121", pass:"khoitran1234"},
  {user:"hunghd96x", pass:"hunghd196x"},
  {user:"thanh05102k1", pass:"thanhdung1"},
  {user:"becunanha", pass:"a15112002"},
  {user:"a---z---nono", pass:"vaolmj2202"},
  {user:"thai01694437325", pass:"trandinhlam02"},
  {user:"yangyo69", pass:"Phanhuuhoa2004@"},
  {user:"Duong_250112", pass:"duong250112"},
  {user:"vudai12800", pass:"namquan2kk7"},
  {user:"hocthingu12@gmail.com", pass:"xuankute2003"},
  {user:"anhteu789", pass:"hungnhung37"},
  {user:"Kephahoai1404", pass:"Lethien1404@"},
  {user:"t.banhanh", pass:"Matkhaunhucu"},
  {user:"hai6c_01", pass:"01646853934k"},
  {user:"quyidol2909", pass:"quenmatkhau1"},
  {user:"drtansang01257", pass:"nguyentansang114"},
  {user:"Phutai487", pass:"phutai0987"},
  {user:"diepvietdan", pass:"Dan31122007"},
  {user:"camsucmuoi", pass:"matkhau00"},
  {user:"tuthancm1999", pass:"01269168436a"},
  {user:"anhduya4123", pass:"phamduy111"},
  {user:"phuc.vip.per", pass:"0123456789phuc"},
  {user:"emiuxetang", pass:"Nhoctuanyeuem123"},
  {user:"Z0376604055z", pass:"ZZ0376604055"},
  {user:"dung-22-10-2004", pass:"dung-22-10-2004"},
  {user:"cdtman07", pass:"ThLoVeNh123"},
  {user:"nguyenvinh0719", pass:"07101999v"},
  {user:"kalami18", pass:"thetruyen13"},
  {user:"anhhungasd2002", pass:"01233247097a"},
  {user:"R9_delima", pass:"Thinh1997"},
  {user:"vang1904", pass:"vangtran1904"},
  {user:"duc8b11", pass:"duc0366721005"},
  {user:"Tionega", pass:"0888400917bin"},
  {user:"xolokgae2", pass:"0927116370@"},
  {user:"ngchn52", pass:"top1brightdoiten"},
  {user:"thaongan016", pass:"gioiyeungan016"},
  {user:"Vannhieuu0222", pass:"29112002abcd"},
  {user:"Baosky1907", pass:"ngoclinh1"},
  {user:"Loaccngon2", pass:"1234vip*@64H#"},
  {user:"soul-knights", pass:"Nhok210525@"},
  {user:"allyashi9277", pass:"k123456789"},
  {user:"mymomminh", pass:"Thuymy1@"},
  {user:"huuquan005", pass:"huylacho123"},
  {user:"Nholoncho123", pass:"Asd0386865758"},
  {user:"thuat111123h", pass:"phongzhou123"},
  {user:"manhduc4az", pass:"conlaunhe1"},
  {user:"Sieuphamnm", pass:"Anhyeuem2002"},
  {user:"hoquangnam09@gmail.com", pass:"nam15032009"},
  {user:"nguoicodon2k2", pass:"ngucatinh123"},
  {user:"Emlaai13k", pass:"timemodau123"},
  {user:"vanlea", pass:"tai12345"},
  {user:"bao9999zz", pass:"12345678zz"},
  {user:"trongphat692005", pass:"Phat2005"},
  {user:"cointroll0218", pass:"0773919230@Khanh"},
  {user:"Ct.hero", pass:"saolozwadi1"},
  {user:"huyetma42016", pass:"vubui12345"},
  {user:"danganhsang1", pass:"minhanh123"},
  {user:"Lamtrinh195", pass:"kakagioma1"},
  {user:"Miraik70", pass:"duongnhatquang12"},
  {user:"auto1x428", pass:"ouzsv1fp"},
  {user:"nhatxuan971@gmail.com", pass:"huuan1213"},
  {user:"0979157044t", pass:"18102005t"},
  {user:"hpct2021", pass:"camtu2021"},
  {user:"Lamngocbao7", pass:"Ngocbao2007"},
  {user:"blueskytrieu01", pass:"thuanlavip123"},
  {user:"Tramphong1988", pass:"Anhbavu123!!!"},
  {user:"daotrang123", pass:"dainang2509"},
  {user:"vanthat277", pass:"yennhi2000"},
  {user:"Thanholyveraz", pass:"Touliver3#"},
  {user:"lequanpvt@gmail.com", pass:"lmqpvt24"},
  {user:"hannhocna", pass:"soi123456"},
  {user:"heroman29614", pass:"ac243626"},
  {user:"mr_fami", pass:"leprodq12"},
  {user:"Vtcvcl117117", pass:"kietquy.123"},
  {user:"nhatkhanggg209", pass:"Quancutovl2010."},
  {user:"Top1sever-Tau", pass:"xamnach123"},
  {user:"thaokhu2k4", pass:"Quangteok1"},
  {user:"khuikhu123", pass:"tintinne2003"},
  {user:"trungdf555", pass:"01639444205a"},
  {user:"crossholy1230", pass:"khang1409"},
  {user:"Atduccuong", pass:"0936310323S"},
  {user:"hoangvansong01", pass:"hoangvansong02"},
  {user:"vinh10062006", pass:"vinh1234567890"},
  {user:"vietcaohvip", pass:"vietcao123"},
  {user:"thanhtuandz187", pass:"tuandz1872005"},
  {user:"long2482k", pass:"long2482000"},
  {user:"afk.pp", pass:"3006123a"},
  {user:"thangyouti2", pass:"091461qaz"},
  {user:"sangpk2004", pass:"khanhpk123"},
  {user:"Phucphon123az", pass:"yeuthuong9xhp"},
  {user:"nthnth1", pass:"01092003Thanh@"},
  {user:"hoangxl5", pass:"097381883111dang"},
  {user:"hoathannb1234", pass:"hoathannb123"},
  {user:"caovipnlbk", pass:"Tommy20@04"},
  {user:"phamvinh225", pass:"TRANVANTY2001"},
  {user:"vaocantat", pass:"namvb1102"},
  {user:"123xucbot", pass:"banhanh56"},
  {user:"le543678", pass:"giang999"},
  {user:"Trungquan2003FA", pass:"nguyengjang95"},
  {user:"duongngocthai", pass:"Thanh0916969019"},
  {user:"Pkiachay", pass:"Chuong12072008@"},
  {user:"nkocly001", pass:"minhhuan01"},
  {user:"cong140505", pass:"cong2005"},
  {user:"Huy_Mon", pass:"HuyMon424"},
  {user:"fb.lamn15222006", pass:"HoaiLam15222006"},
  {user:"Phuongyumtv2008", pass:"Vthanh1234"},
  {user:"hacongha123", pass:"anhvip123"},
  {user:"anhnamcala", pass:"nguyennam98"},
  {user:"kohaybayacc", pass:"Matkhau11"},
  {user:"duydat131", pass:"tahuuhoang37"},
  {user:"chauxinh214", pass:"01657735679chau"},
  {user:"provips100s", pass:"*kid-1412*"},
  {user:"ynh321", pass:"vinhk0909383866"},
  {user:"kino.z7", pass:"30052004Bat$"},
  {user:"haivip7sao", pass:"haichit9912345"},
  {user:"honguyendacduy1", pass:"Duylanhho1901"},
  {user:"zzkotezz27", pass:"myloveisMai"},
  {user:"hoanghai89a", pass:"hoanghai1"},
  {user:"Kayenpro1", pass:"Tangocquan1."},
  {user:"Thaibaodom", pass:"123456789A"},
  {user:"Ptx1234567", pass:"Thanhcong"},
  {user:"Tuyen07102001", pass:"nguyenthituyen22"},
  {user:"Grndh123", pass:"tuananh1801"},
  {user:"hungtatoanxiro", pass:"hung1234"},
  {user:"ahuypro123z", pass:"a123456789"},
  {user:"thanh-123.5", pass:"thanhf1pro"},
  {user:"Linhnam2018", pass:"123456789vbnm"},
  {user:"Maduongpho123", pass:"avatar123456789"},
  {user:"caubebadao02", pass:"mnbvcxz321"},
  {user:"trngh14", pass:"trong0801"},
  {user:"ngductria1", pass:"ductria1"},
  {user:"sangheo0304", pass:"thanhsang0102"},
  {user:"lephutb", pass:"phuphu123"},
  {user:"wiliam_kun", pass:"81J3mpnc"},
  {user:"yeuanhhayanhyeu", pass:"@0914948905"},
  {user:"gocc147225", pass:"I1d1zh5m"},
  {user:"phongzzzpro", pass:"xinloiem90"},
  {user:"0354566367l", pass:"vanh28102008"},
  {user:"namthe.69", pass:"toilanam97"},
  {user:"Lienquan1925492", pass:"buiduchanh2001"},
  {user:"dkdkza8", pass:"minhthien123"},
  {user:"bacadu123321", pass:"0387117328a"},
  {user:"Khongsomahaha", pass:"Nhan123@"},
  {user:"piido2705", pass:"vinhky2008"},
  {user:"bo30@gmail.com", pass:"vinh3052010"},
  {user:"Sky.wind.zsm", pass:"Trungthang123@"},
  {user:"Thuongga2k3", pass:"manhdz7976"},
  {user:"choredabong45", pass:"hoang062"},
  {user:"leha2000005z", pass:"123456789z"},
  {user:"meplop", pass:"a123456789b"},
  {user:"lyly441993", pass:"Huy12346@@"},
  {user:"ducga77u", pass:"asdfghjkl150"},
  {user:"hfgfjgjvng", pass:"shopacc236054@"},
  {user:"quocvinh-2008", pass:"Az1234567890@"},
  {user:"CUONG2118", pass:"Nguyentuancuong"},
  {user:"sangvip14745625", pass:"Sangvip147456"},
  {user:"khangty1278", pass:"chuhe123"},
  {user:"Linhnhisshn", pass:"Ln28022022@"},
  {user:"lekongu", pass:"LEKONGU09032007"},
  {user:"nakbboysv@gmail.com", pass:"zkpqfm6i"},
  {user:"Channyyyyy2002", pass:"tuanphan122002@"},
  {user:"onechamp_2k2", pass:"linh0987654321"},
  {user:"baokiet133", pass:"baokiet123"},
  {user:"lhnooo00000", pass:"haona2097"},
  {user:"fc.doclap", pass:"lethidiep2003"},
  {user:"shopgameLQ69", pass:"vinh12345"},
  {user:"TinhCa4004", pass:"T5121977"},
  {user:"Yeunakrod", pass:"123456aa"},
  {user:"khangxama852", pass:"Zzz0988733728"},
  {user:"Vanthai1010", pass:"thai1010"},
  {user:"Baonekmnui", pass:"Phuctran123?"},
  {user:"Duanhoai78", pass:"duanhoai2458"},
  {user:"Namvnzx", pass:"12345qwert"},
  {user:"buivinh1702", pass:"v17022001"},
  {user:"hanquocdm02", pass:"dennguyen1"},
  {user:"haivaquoc123", pass:"tuanboro123"},
  {user:"Bietdoi1987", pass:"toila1987"},
  {user:"Duchuynhdepzy", pass:"Duchuynh0368"},
  {user:"PTB-10l", pass:"buoncuaanh9520"},
  {user:"dang11082006", pass:"Dang@2006"},
  {user:"anhdz123kk@gmail.com", pass:"anhdz123kk"},
  {user:"kiepngheo_1102", pass:"22061996a"},
  {user:"trang13062005", pass:"trang13062005"},
  {user:"vinhtukuda9x", pass:"tukuda9x"},
  {user:"mydreamof2002", pass:"22432645aA@."},
  {user:"conchobogo123", pass:"112413112413_NPV"},
  {user:"toanminh.tnn", pass:"22toan22"},
  {user:"FGtv.hauchoingu", pass:"Thanhnhat09123@"},
  {user:"Xxvvccbbnn", pass:"0385830313de"},
  {user:"dungblack009", pass:"manhblack123"},
  {user:"thanhsao202", pass:"sdt01472583690"},
  {user:"xindunganem123", pass:"thang8911"},
  {user:"luvanghoang96", pass:"buiducanh11"},
  {user:"ba.daovkl", pass:"Haohyccc"},
  {user:"taolabo_123", pass:"10031998nam"},
  {user:"cuem06051997", pass:"VANKHANH290601"},
  {user:"Minhlklk2014", pass:"01267303411asd"},
  {user:"Gumsenpai", pass:"thangdepzai0000"},
  {user:"comaixohey2", pass:"19/10/2003"},
  {user:"acantho", pass:"0967678522aZ"},
  {user:"Kyvy2k4", pass:"kyVY@240724"},
  {user:"Kundepzoai2002", pass:"kun30102002"},
  {user:"dragoncitydong", pass:"tiendung2002"},
  {user:"daulacden", pass:"trung2311"},
  {user:"cuong2004nha", pass:"trong2k61842006"},
  {user:"lamtygame", pass:"tuanlinh98"},
  {user:"LTB12345113", pass:"LTB12345"},
  {user:"Callukko", pass:"phongle1205"},
  {user:"Toandaica2002s", pass:"thuylinh18"},
  {user:"TOITHIEUTHINH", pass:"truong201"},
  {user:"dinhvietabc3", pass:"Dinhvietabc3"},
  {user:"quylienminh2002", pass:"anthao123"},
  {user:"Shizukabk123", pass:"htaby7677"},
  {user:"congvipbs2k", pass:"Cong2992k@"},
  {user:"thanguoc", pass:"0969818876a"},
  {user:"NNguyenDuyQuang", pass:"phung1123"},
  {user:"duong0553", pass:"01632043977tan"},
  {user:"huydensi123", pass:"huydensi123456"},
  {user:"Hanh0huc90", pass:"Hung16122005@@@@"},
  {user:"Kietpoilo", pass:"01636027802a"},
  {user:"cuongkdhb2005", pass:"cuong2005"},
  {user:"Taijr2603", pass:"huutai00"},
  {user:"tai0968779137", pass:"uyen0968779137"},
  {user:"trolldevilnoten", pass:"phucnhu831"},
  {user:"fayeuem159", pass:"truongdamtho123"},
  {user:"salillarestor", pass:"bi0923666259pi"},
  {user:"thehung2404", pass:"!@#dsaasd123"},
  {user:"Yeuem.194", pass:"cucau102"},
  {user:"dangcap73H", pass:"chuotmt2005"},
  {user:"Tunglilac14", pass:"afaffafafa35"},
  {user:"Nguyenbaokid", pass:"26072002kid"},
  {user:"linzzzz16", pass:"quangdz123"},
  {user:"Kietkhlacdtrai", pass:"F5gICa56xk"},
  {user:"Haihovo9a4", pass:"minhnguyen123"},
  {user:"tridien_tuanvy", pass:"tridien1992"},
  {user:"ishisake", pass:"conduylon123"},
  {user:"vinhdog2019", pass:"thanhpro01983633"},
  {user:"concu1963", pass:"bang123456789"},
  {user:"dan-choi-pp", pass:"yeuem123"},
  {user:"0762262558lan", pass:"nghiacu12345"},
  {user:"akailyy", pass:"thanh111"},
  {user:"binh2k2x", pass:"Thinh161196"},
  {user:"Ngokxl", pass:"long123456"},
  {user:"anhtrung2510", pass:"trung2000"},
  {user:"nguyenvancuong1912211@gmail.com", pass:"Tieuthu2711$$"},
  {user:"maithanhtri0901", pass:"maithanhtri0901"},
  {user:"Ducquang8300", pass:"langvantung2004"},
  {user:"QWERcove", pass:"cuong2003"},
  {user:"lamanhba201", pass:"12345678l"},
  {user:"trcun1234", pass:"tri119411"},
  {user:"phuongk6c", pass:"A123456789"},
  {user:"anhlong_free", pass:"thuyhuynhks147"}
];

let accounts = JSON.parse(localStorage.getItem("accList")) || defaultAccounts;
let count = Number(localStorage.getItem("count")) || 0;

document.getElementById("count").innerText = count;
document.getElementById("remaining").innerText = accounts.length;

function randomAcc() {
  playSound('click');
  
  let userSpins = Number(localStorage.getItem("userSpins")) || 0;
  if (userSpins <= 0) {
    showToast("❌ Bạn đã hết lượt! Vui lòng vượt link ngắn để nhận thêm lượt.");
    return;
  }

  if (!accounts || accounts.length === 0) {
    accounts = [...defaultAccounts];
  }

  userSpins--;
  localStorage.setItem("userSpins", userSpins);
  updateSpinUI();

  let randomIndex = Math.floor(Math.random() * accounts.length);
  let acc = accounts.splice(randomIndex, 1)[0];
  
  count++;
  localStorage.setItem("count", count);
  localStorage.setItem("accList", JSON.stringify(accounts));

  document.getElementById("count").innerText = count;
  document.getElementById("remaining").innerText = accounts.length;

  let resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <p style="color:#00ff88; font-weight:bold; margin-bottom:4px;">🎉 Chúc mừng bạn đã nhận được tài khoản:</p>
    <p>👤 Tài khoản: <span style="color:var(--primary-color)">${acc.user}</span></p>
    <p>🔑 Mật khẩu: <span style="color:var(--primary-color)">${acc.pass}</span></p>
    <button class="btn-action copy" onclick="copyAcc('${acc.user}', '${acc.pass}')">📋 SAO CHÉP TÀI KHOẢN</button>
  `;
  playSound('success');
}

function copyAcc(user, pass) {
  let text = `Tài khoản: ${user}\nMật khẩu: ${pass}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Đã sao chép tài khoản thành công!");
    playSound('success');
  });
}

function resetData() {
  playSound('click');
  if(confirm("Bạn có chắc muốn nạp lại kho tài khoản ban đầu không?")) {
    accounts = [...defaultAccounts];
    count = 0;
    localStorage.setItem("accList", JSON.stringify(accounts));
    localStorage.setItem("count", count);
    document.getElementById("count").innerText = count;
    document.getElementById("remaining").innerText = accounts.length;
    document.getElementById("result").style.display = "none";
    showToast("🔄 Đã làm mới kho tài khoản thành công!");
  }
}

function copyScript(id) {
  playSound('click');
  let text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Đã sao chép Script thành công!");
    playSound('success');
  });
}

/* ==================== BẬT / TẮT NHẠC NỀN ==================== */
function toggleMusic(event) {
  let music = document.getElementById("bgMusic");
  let btn = event.target;
  
  if (music.paused) {
    music.play();
    btn.innerHTML = "🔇 Tắt Nhạc";
    if (typeof showToast === 'function') showToast("🎶 Đã bật nhạc nền!");
  } else {
    music.pause();
    btn.innerHTML = "Đừng Bấm Vào💀";
    if (typeof showToast === 'function') showToast("🔇 Đã tắt nhạc nền!");
  }
}

/* ==================== BẢO VỆ CHỐNG F12 & CHUỘT PHẢI ==================== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.keyCode === 123 || 
     (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
     (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))) {
    e.preventDefault();
    return false;
  }
});
    
