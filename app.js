/* ══════════════════════════════════
   TaskFlow — app.js
   هاد الملف مؤقت للاختبار بس
   لما تربط TypeScript بتستبدله بـ app.ts
   ══════════════════════════════════ */

/* ── State ── */
let tasks = JSON.parse(localStorage.getItem('tf2-tasks')||'[]').map(t=>({
  ...t,
  dueDate: t.dueDate ? new Date(t.dueDate) : null,
  createdAt: new Date(t.createdAt),
  completedAt: t.completedAt ? new Date(t.completedAt) : null
}));

let editId       = null;
let searchQ      = '';
let listFilter   = 'today';
let focusDur     = 25;
let focusTaskId  = null;
let timerLeft    = 0;
let timerTotal   = 0;
let timerTick    = null;
let timerRunning = false;
let sessions     = 0;
let dragId       = null;
let currentView  = 'list';
let focusActive  = false; // هل الـ Focus Mode شاشة كاملة؟

/* ── Persist ── */
function save(){ localStorage.setItem('tf2-tasks', JSON.stringify(tasks)) }

/* ── Date helpers ── */
function isToday(d){
  if(!d) return false;
  const n=new Date();
  return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate()
}
function isTomorrow(d){
  if(!d) return false;
  const t=new Date(); t.setDate(t.getDate()+1);
  return d.toDateString()===t.toDateString()
}
function isUpcoming(d){
  if(!d) return false;
  const n=new Date(); n.setHours(0,0,0,0);
  const nd=new Date(d); nd.setHours(0,0,0,0);
  return nd>n
}
function fmtDate(d){
  if(!d) return '';
  if(isToday(d)) return 'Today';
  if(isTomorrow(d)) return 'Tomorrow';
  return d.toLocaleDateString('en-gb',{day:'numeric',month:'short'})
}

/* ── Tag color ── */
function tagCls(t){
  const m={work:'blue',design:'purple',research:'amber',content:'green',dev:'cyan',bug:'red',test:'amber',personal:'green'};
  const k=Object.keys(m).find(k=>t.toLowerCase().includes(k));
  return 'chip chip-'+(m[k]||'purple')
}

/* ══ RENDER LIST ══ */
function renderList(){
  const c = document.getElementById('list-container');
  let items = [...tasks];

  if(searchQ) items = items.filter(t=>
    t.title.toLowerCase().includes(searchQ)||
    t.description.toLowerCase().includes(searchQ)
  );

  if(listFilter==='today')    items = items.filter(t=>isToday(t.dueDate)&&t.status!=='done');
  else if(listFilter==='upcoming') items = items.filter(t=>isUpcoming(t.dueDate)&&t.status!=='done');
  else if(listFilter==='done')     items = items.filter(t=>t.status==='done');

  if(!items.length){
    c.innerHTML=`<div class="empty-state">
      <div class="empty-icon">✦</div>
      <div class="empty-title">All clear here</div>
      <div class="empty-sub">No tasks match this filter</div>
    </div>`;
    updateStats(); return;
  }

  const today    = items.filter(t=>isToday(t.dueDate)&&t.status!=='done');
  const upcoming = items.filter(t=>isUpcoming(t.dueDate)&&t.status!=='done'&&!isToday(t.dueDate));
  const done     = items.filter(t=>t.status==='done');
  const other    = items.filter(t=>!isToday(t.dueDate)&&!isUpcoming(t.dueDate)&&t.status!=='done');

  let html='';
  if(listFilter==='today')    html+=makeSection('Today',today);
  else if(listFilter==='upcoming') html+=makeSection('Upcoming',upcoming);
  else if(listFilter==='done')     html+=makeSection('Completed',done);
  else {
    if(today.length)    html+=makeSection('Today',today);
    if(upcoming.length) html+=makeSection('Upcoming',upcoming);
    if(other.length)    html+=makeSection('Other',other);
    if(done.length)     html+=makeSection('Completed',done);
  }
  c.innerHTML=html;
  updateStats();
}

function makeSection(label,arr){
  if(!arr.length) return '';
  return `<div class="list-section">
    <div class="section-head">
      <div class="section-label">${label}</div>
      <div class="section-line"></div>
      <div class="section-count">${arr.length}</div>
    </div>
    ${arr.map((t,i)=>taskHTML(t,i)).join('')}
  </div>`;
}

function taskHTML(t,i){
  const chips = t.tags.map(tg=>`<span class="${tagCls(tg)}">${tg}</span>`).join('');
  const isDone = t.status==='done';
  // زر Focus يظهر فقط للمهام غير المكتملة
  const focusBtn = isDone ? '' :
    `<button class="icon-btn focus-icon-btn" onclick="event.stopPropagation();setFocusTask(${t.id})" title="Focus">◎</button>`;

  return `<div class="task-card p-${t.priority}${isDone?' done':''}"
    style="animation-delay:${i*0.04}s"
    onclick="openModal(${t.id})">
    <div class="check-wrap${isDone?' checked':''}"
      onclick="event.stopPropagation();toggleDone(${t.id})"></div>
    <div class="task-body">
      <div class="task-title">${t.title}</div>
      <div class="task-meta">
        ${chips}
        ${t.dueDate?`<span class="date-chip">📅 ${fmtDate(t.dueDate)}</span>`:''}
        <span class="chip chip-${t.priority==='high'?'red':t.priority==='medium'?'amber':'green'}">${t.priority}</span>
      </div>
    </div>
    <div class="task-right">
      ${focusBtn}
      <button class="icon-btn del" onclick="event.stopPropagation();delTask(${t.id})" title="Delete">✕</button>
    </div>
  </div>`;
}

/* ══ RENDER KANBAN ══ */
function renderKanban(){
  const cols=[
    {k:'todo',     label:'Todo',        color:'#5b8fff'},
    {k:'inProgress',label:'In Progress',color:'#fbbf24'},
    {k:'done',     label:'Done',        color:'#4ade80'}
  ];
  document.getElementById('kanban-board').innerHTML = cols.map(col=>{
    const items = tasks.filter(t=>t.status===col.k);
    return `<div class="k-col" style="--col-color:${col.color}">
      <div class="k-col-head">
        <div class="k-dot"></div>
        <div class="k-title">${col.label}</div>
        <div class="k-count">${items.length}</div>
      </div>
      <div class="k-body" id="kb-${col.k}"
        ondragover="kDragOver(event,this)"
        ondrop="kDrop(event,'${col.k}')"
        ondragleave="kDragLeave(this)">
        ${items.map((t,i)=>kCard(t,i,col.k)).join('')}
        <button class="k-add-btn" onclick="openModalStatus('${col.k}')">+ Add task</button>
      </div>
    </div>`;
  }).join('');
}

function kCard(t,i,colStatus){
  const chips = t.tags.slice(0,2).map(tg=>`<span class="${tagCls(tg)}">${tg}</span>`).join('');
  const isDone = colStatus==='done';
  // زر Focus يختفي من عمود Done
  const focusBtn = isDone ? '' :
    `<button class="k-focus-btn" onclick="event.stopPropagation();setFocusTask(${t.id})">◎ Focus</button>`;

  return `<div class="k-card${isDone?' k-done':''}" draggable="true" data-id="${t.id}"
    style="animation-delay:${i*0.05}s"
    ondragstart="kDragStart(event,${t.id})"
    onclick="openModal(${t.id})">
    <div class="k-card-title">${t.title}</div>
    ${t.description?`<div class="k-card-desc">${t.description.slice(0,70)}${t.description.length>70?'...':''}</div>`:''}
    <div class="k-card-foot">
      ${chips}
      ${t.dueDate?`<span class="date-chip">📅 ${fmtDate(t.dueDate)}</span>`:''}
      ${focusBtn}
    </div>
  </div>`;
}

/* ── Drag & Drop ── */
function kDragStart(e,id){
  dragId=id;
  setTimeout(()=>document.querySelector(`[data-id="${id}"]`)?.classList.add('dragging'),0)
}
function kDragOver(e,el){ e.preventDefault(); el.classList.add('drag-over') }
function kDragLeave(el){ el.classList.remove('drag-over') }
function kDrop(e,status){
  e.preventDefault();
  document.querySelectorAll('.k-body').forEach(b=>b.classList.remove('drag-over'));
  if(dragId===null) return;
  const t = tasks.find(t=>t.id===dragId);
  if(t){
    t.status=status;
    if(status==='done'&&!t.completedAt) t.completedAt=new Date();
    if(status!=='done') t.completedAt=null;
    save(); renderKanban(); updateStats();
    toast(`Moved to ${status==='inProgress'?'In Progress':status==='done'?'Done':'Todo'}`, 'blue');
  }
  dragId=null;
}

/* ── Task actions ── */
function toggleDone(id){
  const t = tasks.find(t=>t.id===id);
  if(!t) return;
  t.status = t.status==='done'?'todo':'done';
  t.completedAt = t.status==='done'?new Date():null;
  save(); renderList(); renderKanban(); updateStats();
  toast(t.status==='done'?'Task completed! 🎉':'Task reopened', t.status==='done'?'green':'amber');
}
function delTask(id){
  if(!confirm('Delete this task?')) return;
  tasks=tasks.filter(t=>t.id!==id);
  save(); renderList(); renderKanban(); updateStats();
  toast('Task deleted','red');
}

/* ── Modal ── */
function openModal(id){
  editId=id||null;
  const t=id?tasks.find(t=>t.id===id):null;
  document.getElementById('modal-h').textContent=t?'Edit Task':'Add Task';
  document.getElementById('f-title').value=t?.title||'';
  document.getElementById('f-desc').value=t?.description||'';
  document.getElementById('f-pri').value=t?.priority||'medium';
  document.getElementById('f-stat').value=t?.status||'todo';
  document.getElementById('f-date').value=t?.dueDate?t.dueDate.toISOString().split('T')[0]:'';
  document.getElementById('f-tags').value=t?.tags?.join(', ')||'';
  document.getElementById('overlay').classList.add('open');
  document.getElementById('f-title').focus();
}
function openModalStatus(status){
  openModal();
  setTimeout(()=>document.getElementById('f-stat').value=status,10)
}
function closeModal(){
  document.getElementById('overlay').classList.remove('open');
  editId=null;
}
function saveTask(){
  const title=document.getElementById('f-title').value.trim();
  if(!title){ document.getElementById('f-title').style.borderColor='var(--red)'; return }
  document.getElementById('f-title').style.borderColor='';
  const dateVal=document.getElementById('f-date').value;
  const tagsRaw=document.getElementById('f-tags').value;
  const data={
    title,
    description: document.getElementById('f-desc').value.trim(),
    priority:    document.getElementById('f-pri').value,
    status:      document.getElementById('f-stat').value,
    tags: tagsRaw?tagsRaw.split(',').map(s=>s.trim()).filter(Boolean):[],
    dueDate: dateVal?new Date(dateVal):null
  };
  if(editId){
    const t=tasks.find(t=>t.id===editId);
    if(t){ Object.assign(t,data); if(data.status==='done'&&!t.completedAt) t.completedAt=new Date(); }
  } else {
    tasks.push({id:Date.now(),...data,createdAt:new Date(),completedAt:data.status==='done'?new Date():null});
  }
  save(); closeModal(); renderList(); renderKanban(); updateStats();
  toast(editId?'Task updated!':'Task added! ✓','green');
}

/* ── View switching ── */
function setView(name,el){
  currentView=name;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.view-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(name+'-panel').classList.add('active');
  document.getElementById('list-tabs').style.display=name==='list'?'flex':'none';
  const titles={list:'Today',kanban:'Kanban Board',focus:'Focus Mode'};
  document.getElementById('h-title').textContent=titles[name];
  if(name==='list') renderList();
  if(name==='kanban') renderKanban();
  // لو خرجنا من focus بدون giveUp، نرجع الـ UI
  if(name!=='focus') exitFocusUI();
}
function setListFilter(f){ listFilter=f; renderList() }
function switchTab(el){
  document.querySelectorAll('#list-tabs .view-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}
function onSearch(v){ searchQ=v.toLowerCase(); renderList() }

/* ══ FOCUS MODE ══ */

/* إخفاء الـ Sidebar والـ Header بأنيميشن */
function enterFocusUI(){
  if(focusActive) return;
  focusActive=true;
  document.getElementById('sidebar').classList.add('focus-hidden');
  document.getElementById('header').classList.add('focus-hidden');
  document.getElementById('focus-wrap').classList.add('fullscreen');
}

/* إرجاع الـ Sidebar والـ Header */
function exitFocusUI(){
  if(!focusActive) return;
  focusActive=false;
  document.getElementById('sidebar').classList.remove('focus-hidden');
  document.getElementById('header').classList.remove('focus-hidden');
  document.getElementById('focus-wrap').classList.remove('fullscreen');
}

function setFocusTask(id){
  const t=tasks.find(t=>t.id===id);
  // منع تحديد مهمة مكتملة
  if(!t||t.status==='done'){
    toast('Cannot focus on a completed task','amber');
    return;
  }
  focusTaskId=id;
  document.getElementById('ft-title').textContent=t.title;
  document.getElementById('ft-sub').textContent=t.description||'No description';
  document.getElementById('run-title').textContent=t.title;
  setView('focus',document.getElementById('nav-focus'));
  toast('Task selected for focus ◎','blue');
}

function setDur(min,el){
  focusDur=min;
  document.querySelectorAll('.dur-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  if(!timerRunning) dispTime(min*60);
}

function showFS(name){
  document.querySelectorAll('.focus-content').forEach(s=>s.classList.remove('show'));
  document.getElementById('fs-'+name).classList.add('show');
}

function startFocus(){
  timerLeft=focusDur*60; timerTotal=timerLeft;
  timerRunning=true;
  showFS('run');
  document.getElementById('pause-btn').textContent='⏸ Pause';
  document.getElementById('t-mode').textContent='Focusing';
  document.getElementById('run-mode-lbl').textContent='Focusing';
  // هنا يختفي الـ Sidebar والـ Header
  enterFocusUI();
  runTick();
}

function runTick(){
  clearInterval(timerTick);
  timerTick=setInterval(()=>{
    if(!timerRunning) return;
    timerLeft--;
    dispTime(timerLeft);
    const circ=2*Math.PI*108;
    document.getElementById('t-ring').style.strokeDashoffset=circ-(circ*(timerLeft/timerTotal));
    if(timerLeft<=0){
      clearInterval(timerTick); timerRunning=false;
      sessions++;
      renderPips();
      showFS('done');
    }
  },1000);
}

function dispTime(s){
  const m=Math.floor(s/60),sec=s%60;
  document.getElementById('t-disp').textContent=`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function pauseResume(){
  timerRunning=!timerRunning;
  document.getElementById('pause-btn').textContent=timerRunning?'⏸ Pause':'▶ Resume';
  document.getElementById('t-mode').textContent=timerRunning?'Focusing':'Paused';
  // عند الإيقاف المؤقت، نرجع الـ UI
  if(!timerRunning){
    exitFocusUI();
  } else {
    enterFocusUI();
    runTick();
  }
}

function giveUp(){
  clearInterval(timerTick); timerRunning=false;
  document.getElementById('t-ring').style.strokeDashoffset=0;
  dispTime(focusDur*60);
  showFS('start');
  // نرجع الـ UI عند الاستسلام
  exitFocusUI();
}

function exitFocusMode(){
  clearInterval(timerTick); timerRunning=false;
  showFS('start');
  exitFocusUI();
}

function markFocusDone(){
  if(focusTaskId){
    const t=tasks.find(t=>t.id===focusTaskId);
    if(t){ t.status='done'; t.completedAt=new Date(); save(); renderList(); renderKanban(); updateStats(); toast('Task completed! 🎉','green'); }
  }
  showFS('start');
  exitFocusUI();
}

function renderPips(){
  document.getElementById('session-pips').innerHTML=
    Array.from({length:sessions},(_,i)=>`<div class="session-pip" style="animation-delay:${i*0.1}s"></div>`).join('');
}

/* ── Stats ── */
function updateStats(){
  document.getElementById('s-todo').textContent=tasks.filter(t=>t.status==='todo').length;
  document.getElementById('s-prog').textContent=tasks.filter(t=>t.status==='inProgress').length;
  document.getElementById('s-done').textContent=tasks.filter(t=>t.status==='done').length;
  const n=tasks.filter(t=>isToday(t.dueDate)&&t.status!=='done').length;
  document.getElementById('badge-today').textContent=n;
  document.getElementById('h-sub').textContent=`${n} task${n!==1?'s':''} remaining today`;
}

/* ── Toast ── */
function toast(msg,type='green'){
  const colors={green:'var(--green)',blue:'var(--blue)',amber:'var(--amber)',red:'var(--red)'};
  document.getElementById('t-dot').style.background=colors[type]||colors.green;
  document.getElementById('t-msg').textContent=msg;
  const el=document.getElementById('toast');
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2800);
}

/* ── Keyboard ── */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('overlay').classList.contains('open')) closeModal();
    else if(focusActive) { giveUp(); }
  }
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){
    e.preventDefault();
    document.getElementById('search-inp').focus();
  }
});
document.getElementById('overlay').addEventListener('click',e=>{
  if(e.target===document.getElementById('overlay')) closeModal()
});

/* ── Sample data ── */
if(!tasks.length){
  const today=new Date();
  const tomorrow=new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const next3=new Date(today); next3.setDate(next3.getDate()+3);
  tasks=[
    {id:1,title:'Design homepage mockup',description:'Create wireframes for the new landing page',status:'todo',priority:'high',tags:['design','work'],dueDate:today,createdAt:new Date(),completedAt:null},
    {id:2,title:'Write blog post',description:'Productivity tips for developers',status:'inProgress',priority:'medium',tags:['content','work'],dueDate:today,createdAt:new Date(),completedAt:null},
    {id:3,title:'Fix login bug',description:'Users cannot login with Google OAuth',status:'done',priority:'high',tags:['dev','bug'],dueDate:today,createdAt:new Date(),completedAt:new Date()},
    {id:4,title:'Market research',description:'Analyze competitor products',status:'todo',priority:'low',tags:['research'],dueDate:next3,createdAt:new Date(),completedAt:null},
    {id:5,title:'Team meeting prep',description:'Prepare slides for weekly standup',status:'todo',priority:'medium',tags:['work'],dueDate:tomorrow,createdAt:new Date(),completedAt:null},
  ];
  save();
}

document.getElementById('f-date').value=new Date().toISOString().split('T')[0];
renderList();
renderKanban();
updateStats();
