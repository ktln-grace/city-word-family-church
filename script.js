const body=document.body,page=body.dataset.page||"home";
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer=matchMedia("(pointer:fine)").matches;
const main=document.querySelector("main");
if(main){main.id="main-content";const skip=document.createElement("a");skip.className="skip-link";skip.href="#main-content";skip.textContent="Skip to main content";body.prepend(skip)}

// Shared shell
const navHost=document.querySelector("[data-nav]");
if(navHost)navHost.innerHTML=`<nav class="site-nav" aria-label="Main navigation"><a class="brand" href="index.html" aria-label="City Word Family Church home"><i>C</i><span>CITY WORD<br><b>FAMILY CHURCH</b></span></a><div class="links" id="main-menu"><a href="about.html">About</a><a href="ministries.html">Ministries</a><a href="events.html">Events</a><a href="sermons.html">Watch</a><a href="next-steps.html">Next Steps</a><a href="care.html">Care</a></div><a class="pill coral magnetic" href="contact.html">Plan your visit ↗</a><button class="menu" aria-label="Open navigation" aria-controls="main-menu" aria-expanded="false"><span></span><span></span></button></nav>`;
const footerHost=document.querySelector("[data-footer]");
if(footerHost)footerHost.innerHTML=`<footer><div class="footer-lead"><a class="brand" href="index.html"><i>C</i><span>CITY WORD<br><b>FAMILY CHURCH</b></span></a><h2>There is a place<br>for <em>you.</em></h2></div><div class="footer-links"><div><b>EXPLORE</b><a href="about.html">Our Story</a><a href="ministries.html">Ministries</a><a href="events.html">Events</a><a href="sermons.html">Messages</a></div><div><b>CONNECT</b><a href="next-steps.html">Next Steps</a><a href="care.html">Pastoral Care</a><a href="contact.html">Plan a Visit</a><a href="giving.html">Give</a></div><div><b>YOUTH</b><a href="generations-shakers.html">Generations Shakers</a><a href="generations-shakers.html#stories">Stories</a><a href="generations-shakers.html#connect">Join the Movement</a></div><div><b>STAY IN THE LOOP</b><p>Hope, stories, and what’s coming up—straight to your inbox.</p><form data-form-name="Newsletter"><input required type="email" placeholder="Your email address" aria-label="Email address"><button aria-label="Subscribe">→</button></form></div></div><p class="legal">© 2026 CITY WORD FAMILY CHURCH – ANTIPOLO <span>PRIVACY · TERMS</span></p></footer>`;

// Page entrance and persistent controls
const loader=document.createElement("div");loader.className="page-loader";loader.innerHTML='<div class="loader-mark">C</div><span>CITY WORD</span>';body.prepend(loader);
const progress=document.querySelector(".progress")||body.appendChild(Object.assign(document.createElement("div"),{className:"progress"}));
const topButton=body.appendChild(Object.assign(document.createElement("button"),{className:"back-top",innerHTML:"↑",ariaLabel:"Back to top"}));topButton.onclick=()=>scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"});
addEventListener("load",()=>setTimeout(()=>{loader.classList.add("done");body.classList.add("page-ready")},reduceMotion?0:450));

// Navigation and scrolling
document.querySelectorAll(".links a").forEach(a=>{if(a.getAttribute("href").startsWith(page)){a.classList.add("current");a.setAttribute("aria-current","page")}});
const menu=document.querySelector(".menu"),links=document.querySelector(".links");
const closeMenu=()=>{links?.classList.remove("open");menu?.setAttribute("aria-expanded","false");menu?.setAttribute("aria-label","Open navigation");body.classList.remove("menu-open")};
if(menu)menu.onclick=()=>{const open=!links.classList.contains("open");links.classList.toggle("open",open);menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation");body.classList.toggle("menu-open",open)};
links?.querySelectorAll("a").forEach(a=>a.onclick=closeMenu);
let ticking=false;
const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight,ratio=max?scrollY/max:0;progress.style.width=ratio*100+"%";document.querySelector(".site-nav")?.classList.toggle("scrolled",scrollY>40);topButton.classList.toggle("show",scrollY>600);if(!reduceMotion)document.querySelectorAll("[data-parallax]").forEach(el=>el.style.transform=`translate3d(0,${(scrollY-el.offsetTop)*Number(el.dataset.parallax||.08)}px,0)`);ticking=false};
addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();

// Staggered reveal system
const revealTargets=document.querySelectorAll(".reveal,.story-card,.ministry-tile,.care-card,.impact-card,.event-list article,.sermon-grid article,.roadmap article,.cards article,.values article");
revealTargets.forEach((el,i)=>{el.classList.add("motion-item");el.style.setProperty("--delay",Math.min(i%8,6)*70+"ms")});
if("IntersectionObserver"in window&&!reduceMotion){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("seen");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -35px"});revealTargets.forEach(el=>observer.observe(el))}else revealTargets.forEach(el=>el.classList.add("seen"));

// Filters
document.querySelectorAll("[data-filter]").forEach(btn=>btn.onclick=()=>{const group=btn.parentElement;group.querySelectorAll("[data-filter]").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");document.querySelectorAll("[data-category]").forEach(card=>{const show=btn.dataset.filter==="all"||card.dataset.category===btn.dataset.filter;card.hidden=!show;if(show){card.classList.remove("filter-in");requestAnimationFrame(()=>card.classList.add("filter-in"))}})});

// Accessible accordion
document.querySelectorAll(".accordion article").forEach((item,i)=>{const btn=item.querySelector("button"),panel=item.querySelector("p"),id="answer-"+i;btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls",id);panel.id=id;panel.hidden=true;btn.onclick=()=>{const open=!item.classList.contains("open");document.querySelectorAll(".accordion article").forEach(x=>{x.classList.remove("open");x.querySelector("button").setAttribute("aria-expanded","false");x.querySelector("p").hidden=true});item.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));panel.hidden=!open}});

// Accessible modals
let activeModal=null,lastFocus=null;
const closeModal=()=>{if(!activeModal)return;activeModal.classList.remove("open");activeModal.setAttribute("aria-hidden","true");body.classList.remove("modal-open");lastFocus?.focus();activeModal=null};
document.querySelectorAll(".modal").forEach(m=>{m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-hidden","true");m.onclick=e=>{if(e.target===m)closeModal()}});
document.querySelectorAll("[data-modal]").forEach(btn=>btn.onclick=()=>{const modal=document.querySelector(btn.dataset.modal);if(!modal)return;lastFocus=btn;activeModal=modal;modal.classList.add("open");modal.setAttribute("aria-hidden","false");body.classList.add("modal-open");modal.querySelector("input,select,textarea,button")?.focus()});
document.querySelectorAll(".modal-close").forEach(btn=>btn.onclick=closeModal);
addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeMenu()}if(e.key==="Tab"&&activeModal){const nodes=[...activeModal.querySelectorAll("button,input,select,textarea,a[href]")];if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

// Forms and feedback
const toast=body.appendChild(Object.assign(document.createElement("div"),{className:"toast",role:"status",ariaLive:"polite"}));
const showToast=message=>{toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),4200)};
document.querySelectorAll("form").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}const submit=form.querySelector('button[type="submit"],button:not([type])');submit?.classList.add("is-loading");setTimeout(()=>{submit?.classList.remove("is-loading");const note=form.querySelector(".form-note");if(note)note.textContent="Thank you—your request is ready for the team.";showToast("Thank you! We’ll be in touch soon.");form.reset()},650)}));

// Premium pointer interactions
document.querySelectorAll(".pill,.circle-btn,.care-card button").forEach(el=>{el.classList.add("ripple-host");el.addEventListener("click",e=>{const r=document.createElement("span"),box=el.getBoundingClientRect();r.className="ripple";r.style.left=e.clientX-box.left+"px";r.style.top=e.clientY-box.top+"px";el.appendChild(r);setTimeout(()=>r.remove(),650)})});
if(finePointer&&!reduceMotion){const cursor=body.appendChild(Object.assign(document.createElement("div"),{className:"cursor-glow"}));addEventListener("pointermove",e=>{cursor.animate({left:e.clientX+"px",top:e.clientY+"px"},{duration:350,fill:"forwards"})});document.querySelectorAll(".magnetic").forEach(el=>{el.onpointermove=e=>{const b=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.12}px,${(e.clientY-b.top-b.height/2)*.12}px)`};el.onpointerleave=()=>el.style.transform=""})}

// Countdown
const countdown=document.querySelector("[data-countdown]");if(countdown){const target=new Date(Date.now()+12*86400000+6*3600000);const draw=()=>{let d=Math.max(0,target-Date.now()),days=Math.floor(d/86400000),h=Math.floor(d/3600000)%24,m=Math.floor(d/60000)%60;countdown.innerHTML=`<b>${days}<small>DAYS</small></b><b>${h}<small>HOURS</small></b><b>${m}<small>MIN</small></b>`};draw();setInterval(draw,60000)}
