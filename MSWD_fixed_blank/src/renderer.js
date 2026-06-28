const $ = (id) => document.getElementById(id);
const route = (page) => { window.location.href = page; };
const assetLogo = '../assets/LGU_sanjuan.jpg';

const DEFAULT_MUNICIPALITY = 'San Juan';
const DEFAULT_PROVINCE = 'Southern Leyte';

const defaults = {
  categories: [
    {id:1,name:'Indigent',description:'Low-income household requiring MSWD assistance.',status:'Active'},
    {id:2,name:'Senior Citizen',description:'Resident aged 60 years old and above.',status:'Active'},
    {id:3,name:'PWD',description:'Person with Disability verified by MSWD.',status:'Active'},
    {id:4,name:'Solo Parent',description:'Resident registered as solo parent.',status:'Active'},
    {id:5,name:'Unemployed',description:'Resident without regular employment.',status:'Active'},
    {id:6,name:'4Ps',description:'Member/household under Pantawid Pamilyang Pilipino Program.',status:'Active'}
  ],
  barangays: [
    {id:1,name:'Agay-ay',description:'San Juan, Southern Leyte',status:'Active'},
    {id:2,name:'Basak',description:'San Juan, Southern Leyte',status:'Active'},
    {id:3,name:'Bobon A',description:'San Juan, Southern Leyte',status:'Active'},
    {id:4,name:'Bobon B',description:'San Juan, Southern Leyte',status:'Active'},
    {id:5,name:'Garrido',description:'San Juan, Southern Leyte',status:'Active'},
    {id:6,name:'Minoyho',description:'San Juan, Southern Leyte',status:'Active'},
    {id:7,name:'Poblacion',description:'San Juan, Southern Leyte',status:'Active'},
    {id:8,name:'San Jose',description:'San Juan, Southern Leyte',status:'Active'},
    {id:9,name:'Sua',description:'San Juan, Southern Leyte',status:'Active'},
    {id:10,name:'Timba',description:'San Juan, Southern Leyte',status:'Active'}
  ],
  programs: [
    {id:1,name:'AICS',amount:10000,frequency:'Once every 6 months',description:'Assistance to Individuals in Crisis Situation',status:'Active'},
    {id:2,name:'Senior Citizen Assistance',amount:2000,frequency:'Once every 6 months',description:'Financial assistance for senior citizens',status:'Active'},
    {id:3,name:'PWD Assistance',amount:3000,frequency:'Once every 6 months',description:'Assistance for Persons with Disability',status:'Active'},
    {id:4,name:'Solo Parent Assistance',amount:1500,frequency:'Once every 6 months',description:'Assistance for solo parents',status:'Active'},
    {id:5,name:'TUPAD Program',amount:5000,frequency:'Per employment cycle',description:'Emergency employment assistance',status:'Active'}
  ],
  roles: [
    {id:1,name:'Super Admin',description:'Full system access.',users:1,status:'Active',permissions:['Dashboard','Residents','Beneficiaries','Claims','Programs','Reports','Blockchain','Master Data','User Management','Audit Logs','Settings']},
    {id:2,name:'Admin',description:'Most modules except critical system settings.',users:1,status:'Active',permissions:['Dashboard','Residents','Beneficiaries','Claims','Programs','Reports','Master Data']},
    {id:3,name:'Social Worker',description:'Manage residents, beneficiaries, and claims.',users:1,status:'Active',permissions:['Dashboard','Residents','Beneficiaries','Claims','Reports']},
    {id:4,name:'Encoder',description:'Encode and update resident records.',users:1,status:'Active',permissions:['Dashboard','Residents']},
    {id:5,name:'Auditor',description:'View reports, blockchain, and audit logs.',users:1,status:'Active',permissions:['Dashboard','Reports','Blockchain','Audit Logs']}
  ],
  users: [
    {id:1,fullName:'Super Admin',username:'admin',email:'admin@mswd.local',contact:'09000000000',role:'Super Admin',status:'Active'},
    {id:2,fullName:'Maria Santos',username:'msantos',email:'maria@mswd.local',contact:'09123456789',role:'Admin',status:'Active'},
    {id:3,fullName:'Juan Encoder',username:'jencoder',email:'encoder@mswd.local',contact:'09990000001',role:'Encoder',status:'Active'}
  ],
  beneficiaries: [
    {id:1,resident:'Juan S. Dela Cruz',program:'Senior Citizen Assistance',category:'Senior Citizen',status:'Active',approved:'2026-06-01'},
    {id:2,resident:'Maria B. Santos',program:'Solo Parent Assistance',category:'Solo Parent',status:'Pending',approved:'2026-06-12'}
  ],
  claims: [
    {id:1,code:'CLM-0001',resident:'Juan S. Dela Cruz',program:'Senior Citizen Assistance',amount:2000,status:'Released',fingerprint:'Verified',date:'2026-06-20'}
  ],
  blockchain: [
    {id:1,tx:'TX-0001',claim:'CLM-0001',resident:'Juan S. Dela Cruz',hash:'a7f9d3e2c8b4410bd1',status:'Verified',date:'2026-06-20 10:40 AM'}
  ],
  audit: [
    {id:1,user:'Super Admin',action:'Logged in',record:'System',ip:'127.0.0.1',date:'2026-06-26 08:00 AM'},
    {id:2,user:'Super Admin',action:'Added resident',record:'RES-0001',ip:'127.0.0.1',date:'2026-06-26 08:05 AM'}
  ],
  notifications: [
    {id:1,type:'warning',title:'Resident fingerprint not enrolled',message:'2 residents still need fingerprint enrollment.'},
    {id:2,type:'danger',title:'Duplicate claim detected',message:'AICS claim for RES-0007 needs review.'},
    {id:3,type:'success',title:'Backup completed',message:'Automatic local backup finished successfully.'}
  ]
};

function getStore(key) { 
  const k = 'mswd_' + key; 
  let v = localStorage.getItem(k); 

  if (!v) { 
    localStorage.setItem(k, JSON.stringify(defaults[key] || [])); 
    return defaults[key] || []; 
  }

  try {
    return JSON.parse(v);
  } catch {
    localStorage.setItem(k, JSON.stringify(defaults[key] || [])); 
    return defaults[key] || [];
  }
}

function setStore(key, data) { 
  localStorage.setItem('mswd_' + key, JSON.stringify(data)); 
}

function nextId(arr) { 
  return arr.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1; 
}

function esc(s) { 
  return String(s ?? '').replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[m])); 
}

function badge(status) { 
  const c = String(status).toLowerCase().replace(/\s/g, '-'); 
  return `<span class="status-pill ${c}">${esc(status)}</span>`; 
}

function fmtMoney(n) { 
  return '₱' + Number(n || 0).toLocaleString(); 
}

function showToast(message) { 
  const old = document.querySelector('.toast'); 
  if (old) old.remove(); 

  const t = document.createElement('div'); 
  t.className = 'toast'; 
  t.textContent = message; 
  document.body.appendChild(t); 

  setTimeout(() => t.remove(), 3000); 
}

function modal(title, body, saveFn) {
  let m = $('modal'); 

  if (!m) {
    m = document.createElement('div');
    m.id = 'modal';
    m.className = 'modal';
    document.body.appendChild(m);
  }

  m.innerHTML = `
    <div class="modal-card">
      <h3>${title}</h3>
      ${body}
      <div class="modal-actions">
        <button class="outline-btn" onclick="closeModal()">Cancel</button>
        ${
          saveFn 
            ? `<button class="primary-btn" onclick="${saveFn}()">Save</button>` 
            : `<button class="primary-btn" onclick="closeModal()">Okay</button>`
        }
      </div>
    </div>
  `;

  m.classList.add('show');
}

function closeModal() { 
  $('modal')?.classList.remove('show'); 
}

function confirmInfo(title, msg) { 
  modal(title, `<p class="page-subtitle">${msg}</p>`, null); 
}

function val(id) { 
  return $(id)?.value?.trim() || ''; 
}

function setVal(id, value) {
  const el = $(id);
  if (el) el.value = value ?? '';
}

function logAction(action, record = 'Demo Record') { 
  const a = getStore('audit'); 
  a.unshift({
    id: nextId(a),
    user: 'Super Admin',
    action,
    record,
    ip: '127.0.0.1',
    date: new Date().toLocaleString()
  }); 
  setStore('audit', a); 
}

function sidebar(active) {
  const nav = [
    ['dashboard','🏠','Dashboard','dashboard.html'],
    ['residents','👥','Residents','residents.html'],
    ['beneficiaries','🎁','Beneficiaries','beneficiaries.html'],
    ['programs','📋','Assistance Programs','programs.html'],
    ['claims','💵','Claims','claims.html'],
    ['blockchain','⛓️','Blockchain','blockchain.html'],
    ['reports','📊','Reports','reports.html']
  ];

  return `
    <aside class="sidebar">
      <div class="brand">
        <img src="${assetLogo}" class="logo">
        <div>
          <h1>MSWD</h1>
          <p>Socio-Demographic<br>Information System</p>
        </div>
      </div>

      <div class="user-panel">
        <div class="avatar">SA</div>
        <div>
          <strong>Super Admin</strong><br>
          <small>Full Access</small>
        </div>
      </div>

      <div class="nav-section">Main Menu</div>

      ${nav.map(n => `
        <button class="nav ${active == n[0] ? 'active' : ''}" onclick="route('${n[3]}')">
          <span>${n[1]}</span>${n[2]}
        </button>
      `).join('')}

      <div class="nav-section">Management</div>

      <div class="nav-group">
        <button class="nav group-title ${['categories','barangays'].includes(active) ? 'active' : ''}">
          <span>⚙️</span>Master Data
        </button>

        <button class="sub-nav ${active == 'categories' ? 'active' : ''}" onclick="route('categories.html')">Categories</button>
        <button class="sub-nav ${active == 'barangays' ? 'active' : ''}" onclick="route('barangays.html')">Barangays</button>
        <button class="sub-nav ${active == 'programs' ? 'active' : ''}" onclick="route('programs.html')">Programs</button>
      </div>

      <div class="nav-group">
        <button class="nav group-title ${['system-users','roles'].includes(active) ? 'active' : ''}">
          <span>🔐</span>User Management
        </button>

        <button class="sub-nav ${active == 'system-users' ? 'active' : ''}" onclick="route('system-users.html')">System Users</button>
        <button class="sub-nav ${active == 'roles' ? 'active' : ''}" onclick="route('roles.html')">Roles & Permissions</button>
      </div>

      <button class="nav ${active == 'audit' ? 'active' : ''}" onclick="route('audit.html')"><span>📜</span>Audit Logs</button>
      <button class="nav ${active == 'settings' ? 'active' : ''}" onclick="route('settings.html')"><span>⚙️</span>Settings</button>

      <div class="sidebar-footer">
        <strong>San Juan, Southern Leyte</strong><br>
        Prototype v3.0<br><br>
        <button class="nav" onclick="logout()">🚪 Logout</button>
      </div>
    </aside>
  `;
}

function shell(active, title, subtitle, content) {
  document.body.className = 'app-body';

  $('app').innerHTML = `
    ${sidebar(active)}

    <main class="main-content">
      <div class="topbar">
        <div>
          <div class="crumb">${title}</div>
          <small class="helper">Municipal Social Welfare and Development Office</small>
        </div>

        <div class="user-chip">
          <div class="avatar">SA</div>
          <div>
            <strong>Super Admin</strong><br>
            <small class="helper">admin@mswd.local</small>
          </div>
        </div>
      </div>

      <div class="page-header">
        <div>
          <h1 class="page-title">${title}</h1>
          <p class="page-subtitle">${subtitle}</p>
        </div>
      </div>

      ${content}
    </main>
  `;
}

function initWelcome() {
  $('app').innerHTML = `
    <div class="welcome-shell">
      <section class="hero-panel">
        <img src="${assetLogo}" class="logo hero-logo">
        <h1>MSWD</h1>
        <p>Socio-Demographic Information System with Blockchain-Based Transaction Integrity for Municipal Social Welfare Programs.</p>
        <div class="hero-badges">
          <span>Resident Registry</span>
          <span>Fingerprint Verification</span>
          <span>Blockchain Ledger</span>
          <span>Role-Based Access</span>
        </div>
      </section>

      <section class="welcome-card">
        <h2>Welcome, Super Admin</h2>
        <p>This prototype includes the complete professional frontend design for dashboard, residents, claims, master data, users, permissions, blockchain, audit logs, settings, notifications, and backup manager.</p>
        <button class="primary-btn full" onclick="route('login.html')">Get Started</button>
      </section>
    </div>
  `;
}

function initLogin() {
  $('app').innerHTML = `
    <div class="login-shell">
      <section class="login-brand">
        <div>
          <img src="${assetLogo}" class="logo">
          <h1>MSWD System</h1>
          <p>Secure access for authorized municipal welfare staff.</p>
        </div>
        <small>San Juan, Southern Leyte · Super Admin Portal</small>
      </section>

      <section class="login-form">
        <div class="login-card">
          <h2>Sign in</h2>
          <p>Use demo account to open the system.</p>

          <div class="form-group">
            <label>Username</label>
            <input id="username" class="form-control" value="admin">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input id="password" type="password" class="form-control" value="admin123">
          </div>

          <button class="primary-btn full" onclick="login()">Login</button>
          <p class="helper">Demo: admin / admin123</p>
        </div>
      </section>
    </div>
  `;
}

function login() { 
  if (val('username') === 'admin' && val('password') === 'admin123') {
    route('dashboard.html'); 
  } else {
    showToast('Invalid account. Use admin / admin123.');
  }
}

function logout() { 
  route('login.html'); 
}

async function getDatabaseResidentCount() {
  try {
    if (!window.mswdAPI) return 0;
    const residents = await window.mswdAPI.residents.list('');
    return Array.isArray(residents) ? residents.length : 0;
  } catch {
    return 0;
  }
}

async function initDashboard() {
  const residentCount = await getDatabaseResidentCount();
  const bens = getStore('beneficiaries');
  const claims = getStore('claims');
  const bc = getStore('blockchain');
  const notes = getStore('notifications');

  shell(
    'dashboard',
    'Dashboard',
    'Executive overview for MSWD operations, welfare claims, blockchain integrity, and alerts.',
    `
    <div class="cards grid">
      ${card('👥','Total Residents',residentCount,'Registered in MySQL database')}
      ${card('🎁','Active Beneficiaries',bens.filter(x => x.status === 'Active').length,'Approved beneficiaries')}
      ${card('💵','Claims Released',claims.filter(x => x.status === 'Released').length,'Released assistance records')}
      ${card('⛓️','Blockchain Transactions',bc.length,'Recorded transaction hashes')}
      ${card('🛡️','Duplicate Claims Prevented','3','Flagged by eligibility rules')}
      ${card('✅','Integrity Status','Verified','No tampered records detected')}
      ${card('📊','Programs',getStore('programs').length,'Active assistance programs')}
      ${card('📜','Audit Logs',getStore('audit').length,'Accountability records')}
    </div>

    <div class="two-col">
      <section class="card">
        <h2>Monthly Claims Statistics</h2>
        <div class="chart">
          <div class="bar" data-label="Jan" style="height:40%"></div>
          <div class="bar" data-label="Feb" style="height:60%"></div>
          <div class="bar" data-label="Mar" style="height:45%"></div>
          <div class="bar" data-label="Apr" style="height:70%"></div>
          <div class="bar" data-label="May" style="height:62%"></div>
          <div class="bar" data-label="Jun" style="height:84%"></div>
        </div>
      </section>

      <section class="card">
        <h2>Notifications</h2>
        <div class="notification-list">
          ${notes.map(n => `
            <div class="note ${n.type}">
              <b>${esc(n.title)}</b><br>
              <span class="helper">${esc(n.message)}</span>
            </div>
          `).join('')}
        </div>

        <button class="outline-btn full" style="margin-top:14px" onclick="openNotificationModal()">Add Notification</button>
      </section>
    </div>
    `
  );
}

function card(icon, title, value, sub) { 
  return `
    <section class="card">
      <div class="card-icon">${icon}</div>
      <h3>${title}</h3>
      <div class="value">${value}</div>
      <small>${sub}</small>
    </section>
  `; 
}

/*Mao ni akong gi add sa residents tanan*/
/* DATABASE-CONNECTED RESIDENTS WITH FIXED PHOTO + WIZARD FORM */

const EDU_OPTIONS = [
  '', 'No Formal Education', 'Elementary Level', 'Elementary Graduate',
  'Junior High School Level', 'Junior High School Graduate',
  'Senior High School Level', 'Senior High School Graduate',
  'Vocational / Technical', 'College Level', 'College Graduate', 'Postgraduate'
];

const CIVIL_OPTIONS = ['', 'Single', 'Married', 'Widowed', 'Separated', 'Live-in'];

const RESIDENT_FIELDS = {
  profile_photo: 'profilePhoto',
  last_name: 'lastName',
  first_name: 'firstName',
  middle_name: 'middleName',
  suffix: 'suffix',
  sex: 'sex',
  birthplace: 'birthplace',
  civil_status: 'civilStatus',
  contact_number: 'contact',
  barangay_id: 'barangaySelect',
  category_id: 'categorySelect',
  address: 'address',
  educational_attainment: 'educationalAttainment',
  occupation: 'occupation',
  household_number: 'householdNumber',
  type_of_beneficiary: 'typeOfBeneficiary',
  status: 'status',
  problem_presented: 'problemPresented',
  brief_findings: 'briefFindings',
  recommendation: 'recommendation'
};

const RESIDENT_STEP_COUNT = 6;
const RESIDENT_PAGE_SIZE = 6;
let residentCurrentStep = 1;
let residentCurrentPage = 1;
let profileCameraStream = null;
let residentCategoryOptions = [];

function getValue(obj, ...keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  }
  return '';
}

function dateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);

  const d = new Date(value);
  if (isNaN(d)) return '';

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function calculateAgeFromDate(dateValue) {
  if (!dateValue) return '';

  const birth = new Date(dateValue);
  const today = new Date();

  if (isNaN(birth)) return '';

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? age : '';
}

function calculateAgeFromBirthdate() {
  setVal('age', calculateAgeFromDate(val('birthdate')));
  syncSmartResidentFields();
  updateResidentWizard();
}

function handleAgeInput() {
  const ageEl = $('age');
  if (!ageEl) return;

  ageEl.value = String(ageEl.value || '').replace(/\D/g, '').slice(0, 3);
  syncSmartResidentFields();
  updateResidentWizard();
}

function limitContactNumber() {
  const contact = $('contact');
  if (!contact) return;

  contact.value = String(contact.value || '').replace(/\D/g, '').slice(0, 11);
  updateResidentWizard();
}

function normalizedText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function selectedCategoryName() {
  const select = $('categorySelect');
  return select?.selectedOptions?.[0]?.textContent?.trim() || '';
}

function categoryMatches(name, target) {
  const text = normalizedText(name);
  const t = normalizedText(target);

  if (!text) return false;
  if (t === 'pwd') return text === 'pwd' || text.includes('pwd') || text.includes('disability');
  if (t === 'senior citizen') return text.includes('senior') || text.includes('elderly');
  if (t === 'solo parent') return text.includes('solo') && text.includes('parent');

  return text === t || text.includes(t);
}

function findCategoryOptionByName(target) {
  const select = $('categorySelect');
  if (!select) return null;

  return [...select.options].find(option => categoryMatches(option.textContent, target));
}

function selectCategoryByName(target) {
  const option = findCategoryOptionByName(target);
  if (option) {
    $('categorySelect').value = option.value;
    return true;
  }

  return false;
}

function isSeniorAge() {
  return Number(val('age')) >= 60;
}

function shouldPreserveManualSpecialCategory(categoryName) {
  return categoryMatches(categoryName, 'PWD') || categoryMatches(categoryName, 'Solo Parent') || categoryMatches(categoryName, 'Senior Citizen');
}

function autoSelectSeniorCategoryFromAge() {
  const select = $('categorySelect');
  if (!select || !isSeniorAge()) return;

  const currentName = selectedCategoryName();

  /* When age is 60+, auto-set Senior Citizen if the category is empty or a general category.
     If the user already selected PWD or Solo Parent, keep that category and still add Senior
     Citizen Assistance in Type of Beneficiary. */
  if (!currentName || !shouldPreserveManualSpecialCategory(currentName)) {
    selectCategoryByName('Senior Citizen');
  }
}

function getAutoBeneficiaryPrograms() {
  const programs = [];
  const add = (name) => {
    if (!programs.includes(name)) programs.push(name);
  };

  const categoryName = selectedCategoryName();

  if (categoryMatches(categoryName, 'PWD')) add('PWD Assistance');
  if (categoryMatches(categoryName, 'Senior Citizen') || isSeniorAge()) add('Senior Citizen Assistance');
  if (categoryMatches(categoryName, 'Solo Parent')) add('Solo Parent Assistance');

  return programs;
}

function syncTypeOfBeneficiary() {
  const typeBox = $('typeOfBeneficiary');
  if (!typeBox) return;

  const programs = getAutoBeneficiaryPrograms();
  typeBox.value = programs.join('\n');
}

function syncSmartResidentFields() {
  autoSelectSeniorCategoryFromAge();
  syncTypeOfBeneficiary();
  limitContactNumber();
}

function getCategoryId(category) {
  return getValue(category, 'category_id', 'id');
}

function getCategoryName(category) {
  return getValue(category, 'category_name', 'name');
}

function getBarangayId(barangay) {
  return getValue(barangay, 'barangay_id', 'id');
}

function getBarangayName(barangay) {
  return getValue(barangay, 'barangay_name', 'name');
}

function getResidentId(resident) {
  return getValue(resident, 'resident_id', 'id');
}

function getResidentCode(resident) {
  const id = getResidentId(resident);
  return resident.resident_code || resident.code || `RES-${String(id).padStart(4, '0')}`;
}

function getResidentFullName(resident) {
  return [
    getValue(resident, 'first_name', 'firstName'),
    getValue(resident, 'middle_name', 'middleName'),
    getValue(resident, 'last_name', 'lastName'),
    resident.suffix
  ].filter(Boolean).join(' ');
}

function getResidentInitials(resident) {
  const first = getValue(resident, 'first_name', 'firstName');
  const last = getValue(resident, 'last_name', 'lastName');
  return `${first.charAt(0) || ''}${last.charAt(0) || ''}`.toUpperCase() || 'R';
}

function checkDatabaseAPI() {
  if (!window.mswdAPI) {
    showToast('Database API not loaded. Check preload.js and main.js.');
    return false;
  }
  return true;
}

async function getDatabaseResidents() {
  try {
    if (!window.mswdAPI) return [];

    const residents = await window.mswdAPI.residents.list('');
    return Array.isArray(residents) ? residents : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function optionList(options, selected = '', placeholder = '') {
  return options.map(option => {
    const label = option || placeholder;
    const isSelected = String(selected) === String(option) ? 'selected' : '';
    return `<option value="${esc(option)}" ${isSelected}>${esc(label)}</option>`;
  }).join('');
}

function educationOptions(selected = '') {
  return optionList(EDU_OPTIONS, selected, 'Select educational attainment');
}

function civilStatusOptions(selected = '') {
  return optionList(CIVIL_OPTIONS, selected, 'Select civil status');
}

function updateFullAddress() {
  const barangayName = $('barangaySelect')?.selectedOptions?.[0]?.textContent?.trim() || '';

  const parts = [
    val('addressDetail'),
    barangayName ? `Brgy. ${barangayName}` : '',
    val('municipality') || DEFAULT_MUNICIPALITY,
    val('province') || DEFAULT_PROVINCE
  ].filter(Boolean);

  setVal('address', parts.join(', '));
}

function extractAddressDetail(address) {
  if (!address) return '';

  const index = String(address).indexOf(', Brgy.');
  return index >= 0 ? String(address).slice(0, index) : '';
}

function handleOccupationIncome() {
  const income = $('monthlyIncome');
  if (!income) return;

  const isStudent = val('occupation').toLowerCase().includes('student');

  income.value = isStudent ? 'None' : income.value === 'None' ? '' : income.value;
  income.readOnly = isStudent;
  income.classList.toggle('readonly-field', isStudent);
}

function normalizeMonthlyIncome() {
  const income = val('monthlyIncome');
  const isStudent = val('occupation').toLowerCase().includes('student');

  if (isStudent || !income || income.toLowerCase() === 'none') return 0;
  return income;
}

/* =========================
   PHOTO HELPERS
========================= */

function bytesToBase64(bytes) {
  if (!bytes || !bytes.length) return '';

  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }

  return btoa(binary);
}

function safePhotoSrc(photo) {
  if (!photo) return '';

  /* Supports MySQL TEXT/LONGTEXT base64, Data URL, file path, URL,
     and Buffer-like values returned by Electron IPC. */
  if (photo?.type === 'Buffer' && Array.isArray(photo.data)) {
    const base64 = bytesToBase64(photo.data);
    return base64 ? `data:image/jpeg;base64,${base64}` : '';
  }

  if (photo instanceof Uint8Array || Array.isArray(photo)) {
    const base64 = bytesToBase64(Array.from(photo));
    return base64 ? `data:image/jpeg;base64,${base64}` : '';
  }

  const p = String(photo || '').trim();
  if (!p) return '';

  if (
    p.startsWith('data:image/') ||
    p.startsWith('file:') ||
    p.startsWith('http://') ||
    p.startsWith('https://') ||
    p.startsWith('../') ||
    p.startsWith('./') ||
    p.startsWith('/')
  ) {
    return p;
  }

  /* Supports Windows local paths saved in the database, example: C:\folder\photo.jpg */
  if (/^[a-zA-Z]:[\\/]/.test(p)) {
    return 'file:///' + p.replace(/\\/g, '/');
  }

  /* Supports relative image folder paths if you manually store them, example: resident-profile-photos/photo.jpg */
  if (/\.(jpg|jpeg|png|webp)$/i.test(p)) {
    return p.replace(/\\/g, '/');
  }

  /* If the database saved only the raw base64 string, display it as image. */
  const compact = p.replace(/\s/g, '');
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(compact) && compact.length > 80) {
    return `data:image/jpeg;base64,${compact}`;
  }

  return '';
}

function brokenPhotoFallback(img) {
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) fallback.style.display = 'grid';
}

function setProfilePhotoPreview(photoData) {
  const preview = $('profilePhotoPreview');
  const placeholder = $('photoPlaceholder');

  if (!preview || !placeholder) return;

  const photo = safePhotoSrc(photoData);

  if (photo) {
    preview.src = photo;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    preview.removeAttribute('src');
    preview.style.display = 'none';
    placeholder.style.display = 'grid';
  }
}

async function startProfileCamera() {
  try {
    const video = $('profileCameraPreview');
    const empty = $('cameraEmptyState');

    if (!video) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera is not supported on this device.');
      return;
    }

    stopProfileCamera(false);

    profileCameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    video.srcObject = profileCameraStream;
    video.style.display = 'block';

    if (empty) empty.style.display = 'none';

    await video.play();
    showToast('Live camera opened.');
  } catch (error) {
    console.error(error);
    showToast('Unable to open camera. Please allow camera permission.');
  }
}

function captureProfilePhoto() {
  const video = $('profileCameraPreview');
  const canvas = $('profilePhotoCanvas');

  if (!video || !canvas || !profileCameraStream) {
    showToast('Click Live Cam first.');
    return;
  }

  if (!video.videoWidth || !video.videoHeight) {
    showToast('Camera is still loading. Try again.');
    return;
  }

  const size = Math.min(video.videoWidth, video.videoHeight);
  const startX = (video.videoWidth - size) / 2;
  const startY = (video.videoHeight - size) / 2;

  canvas.width = 360;
  canvas.height = 360;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, startX, startY, size, size, 0, 0, 360, 360);

  const photoData = canvas.toDataURL('image/jpeg', 0.76);

  setVal('profilePhoto', photoData);
  setProfilePhotoPreview(photoData);
  stopProfileCamera();

  showToast('Profile photo captured.');
  updateResidentWizard();
}


function uploadProfilePhoto(event) {
  const input = event?.target;
  const file = input?.files?.[0];

  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    showToast('Please upload a valid image file: JPG, PNG, or WEBP.');
    if (input) input.value = '';
    return;
  }

  const maxSizeMB = 8;
  if (file.size > maxSizeMB * 1024 * 1024) {
    showToast(`Image is too large. Maximum allowed size is ${maxSizeMB}MB.`);
    if (input) input.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const image = new Image();

    image.onload = () => {
      const canvas = $('profilePhotoCanvas') || document.createElement('canvas');
      const size = Math.min(image.width, image.height);
      const startX = (image.width - size) / 2;
      const startY = (image.height - size) / 2;

      canvas.width = 360;
      canvas.height = 360;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, startX, startY, size, size, 0, 0, 360, 360);

      const photoData = canvas.toDataURL('image/jpeg', 0.82);

      stopProfileCamera(false);
      setVal('profilePhoto', photoData);
      setProfilePhotoPreview(photoData);
      showToast('Profile photo uploaded.');
      updateResidentWizard();

      if (input) input.value = '';
    };

    image.onerror = () => {
      showToast('Unable to read this image. Please choose another photo.');
      if (input) input.value = '';
    };

    image.src = String(reader.result || '');
  };

  reader.onerror = () => {
    showToast('Unable to upload photo. Please try again.');
    if (input) input.value = '';
  };

  reader.readAsDataURL(file);
}

function stopProfileCamera(showMessage = false) {
  const video = $('profileCameraPreview');
  const empty = $('cameraEmptyState');

  if (profileCameraStream) {
    profileCameraStream.getTracks().forEach(track => track.stop());
    profileCameraStream = null;
  }

  if (video) {
    video.srcObject = null;
    video.style.display = 'none';
  }

  if (empty) empty.style.display = 'grid';
  if (showMessage) showToast('Camera closed.');
}

function clearProfilePhoto() {
  setVal('profilePhoto', '');
  setProfilePhotoPreview('');
  stopProfileCamera();
  showToast('Profile photo removed.');
  updateResidentWizard();
}

function profilePhotoBox() {
  return `
    <div class="profile-photo-grid">
      <div class="photo-preview-card">
        <div class="photo-preview-frame">
          <img id="profilePhotoPreview" class="profile-photo-preview" style="display:none" onerror="brokenPhotoFallback(this)">
          <div id="photoPlaceholder" class="photo-placeholder">
            <span>👤</span>
            <small>No photo captured</small>
          </div>
        </div>
        <input type="hidden" id="profilePhoto">
      </div>

      <div class="camera-card">
        <div class="camera-live-box">
          <video id="profileCameraPreview" autoplay playsinline muted style="display:none"></video>
          <div id="cameraEmptyState" class="camera-empty-state">
            <span>📷</span>
            <small>Use Live Cam or Upload Photo</small>
          </div>
          <canvas id="profilePhotoCanvas" style="display:none"></canvas>
        </div>

        <div class="camera-actions">
          <button type="button" class="photo-btn photo-btn-dark" onclick="startProfileCamera()">Live Cam</button>
          <button type="button" class="photo-btn photo-btn-upload" onclick="$('profilePhotoUpload').click()">Upload Photo</button>
          <button type="button" class="photo-btn photo-btn-green" onclick="captureProfilePhoto()">Capture</button>
          <button type="button" class="photo-btn photo-btn-light" onclick="clearProfilePhoto()">Clear</button>
          <input id="profilePhotoUpload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onchange="uploadProfilePhoto(event)" style="display:none">
        </div>
      </div>
    </div>
  `;
}

/* =========================
   HTML HELPERS
========================= */

function field(label, html, extraClass = '') {
  return `
    <div class="form-group ${extraClass}">
      <label>${label}</label>
      ${html}
    </div>
  `;
}

function inputField(id, label, attrs = '', type = 'text', extraClass = '') {
  return field(
    label,
    `<input id="${id}" type="${type}" class="form-control modern-input" ${attrs}>`,
    extraClass
  );
}

function selectField(id, label, options, attrs = '', extraClass = '') {
  return field(
    label,
    `<select id="${id}" class="form-control modern-input" ${attrs}>${options}</select>`,
    extraClass
  );
}

function textAreaField(id, label, placeholder = '') {
  return field(
    label,
    `<textarea id="${id}" class="form-control modern-input" rows="4" placeholder="${placeholder}"></textarea>`
  );
}

function section(number, title, subtitle, body, actionButton = '') {
  return `
    <div class="form-section resident-step" data-step="${number}">
      <div class="section-title ${actionButton ? 'with-action' : ''}">
        ${
          actionButton
            ? `
              <div class="section-title-left">
                <span>${number}</span>
                <div>
                  <h3>${title}</h3>
                  <p>${subtitle}</p>
                </div>
              </div>
              ${actionButton}
            `
            : `
              <span>${number}</span>
              <div>
                <h3>${title}</h3>
                <p>${subtitle}</p>
              </div>
            `
        }
      </div>
      ${body}
    </div>
  `;
}

function formGrid(items) {
  return `<div class="modern-form-grid">${items.join('')}</div>`;
}

/* =========================
   WIZARD HELPERS
========================= */

const RESIDENT_STEPS = [
  { number: 1, label: 'Photo', note: 'Complete after photo is captured.' },
  { number: 2, label: 'Personal', note: 'Complete when asterisk fields are filled.' },
  { number: 3, label: 'Address', note: 'Complete when address fields are filled.' },
  { number: 4, label: 'Socio-Demo', note: 'Complete when socio-demographic fields are filled.' },
  { number: 5, label: 'Family', note: 'Complete when family composition row is filled.' },
  { number: 6, label: 'Intake', note: 'Complete when intake fields are filled.' }
];

/* Validation still uses only required fields.
   Personal turns green based on the asterisk fields only. */
const RESIDENT_REQUIRED_FIELDS_BY_STEP = {
  2: [
    ['lastName', 'Last Name'],
    ['firstName', 'First Name'],
    ['sex', 'Sex']
  ]
};

/* Green stepper completion rules.
   Other steps become green only when their visible fields are completely filled up. */
const RESIDENT_COMPLETION_FIELDS_BY_STEP = {
  1: ['profilePhoto'],
  2: ['lastName', 'firstName', 'sex'],
  3: ['addressDetail', 'barangaySelect', 'address'],
  4: ['educationalAttainment', 'occupation', 'monthlyIncome', 'householdNumber', 'typeOfBeneficiary', 'intakeDate'],
  6: ['problemPresented', 'briefFindings', 'recommendation']
};

function residentStepper() {
  return `
    <div class="resident-stepper">
      ${RESIDENT_STEPS.map(step => `
        <div class="wizard-step" data-step-indicator="${step.number}" title="${esc(step.note)}">
          <span>${step.number}</span>
          <div class="wizard-step-text">
            <small>${esc(step.label)}</small>
            <em class="step-state">Pending</em>
          </div>
          <b class="step-check">✓</b>
        </div>
      `).join('')}
    </div>
  `;
}

function hasInputValue(id) {
  const element = $(id);
  return !!element && String(element.value || '').trim() !== '';
}

function isFamilyStepComplete() {
  const rows = [...document.querySelectorAll('#familyTableBody .family-row')];
  if (!rows.length) return false;

  const importantSelectors = [
    '.fam-full-name',
    '.fam-relationship',
    '.fam-birthdate',
    '.fam-age',
    '.fam-civil-status',
    '.fam-education',
    '.fam-occupation'
  ];

  const filledRows = rows.filter(row =>
    importantSelectors.some(selector => String(row.querySelector(selector)?.value || '').trim() !== '')
  );

  if (!filledRows.length) return false;

  return filledRows.every(row =>
    importantSelectors.every(selector => String(row.querySelector(selector)?.value || '').trim() !== '')
  );
}

function isResidentStepComplete(stepNumber) {
  if (Number(stepNumber) === 5) return isFamilyStepComplete();

  const fields = RESIDENT_COMPLETION_FIELDS_BY_STEP[stepNumber] || [];
  if (!fields.length) return false;

  return fields.every(id => hasInputValue(id));
}

function getFirstMissingResidentField(stepNumber) {
  const fields = RESIDENT_REQUIRED_FIELDS_BY_STEP[stepNumber] || [];

  for (const [id, label] of fields) {
    if (!val(id)) return { id, label };
  }

  if (Number(stepNumber) === 2 && val('contact') && val('contact').length !== 11) {
    return { id: 'contact', label: 'Contact Number must be exactly 11 digits' };
  }

  return null;
}

function updateResidentWizard() {
  document.querySelectorAll('.resident-step').forEach(step => {
    step.classList.toggle('active', Number(step.dataset.step) === residentCurrentStep);
  });

  document.querySelectorAll('.wizard-step').forEach(step => {
    const n = Number(step.dataset.stepIndicator);
    const isActive = n === residentCurrentStep;
    const isComplete = isResidentStepComplete(n);
    const isRequired = (RESIDENT_REQUIRED_FIELDS_BY_STEP[n] || []).length > 0;

    step.classList.toggle('active', isActive);
    step.classList.toggle('done', n < residentCurrentStep);
    step.classList.toggle('complete', isComplete);
    step.classList.toggle('required-step', isRequired);
    step.classList.toggle('optional-step', !isRequired);

    const state = step.querySelector('.step-state');
    if (state) {
      if (isComplete) {
        state.textContent = 'Complete';
      } else if (n === 2) {
        state.textContent = 'Required';
      } else {
        state.textContent = 'Incomplete';
      }
    }
  });

  const backBtn = $('residentBackBtn');
  const nextBtn = $('residentNextBtn');
  const saveBtn = $('residentSaveBtn');

  if (backBtn) backBtn.disabled = residentCurrentStep === 1;
  if (nextBtn) nextBtn.style.display = residentCurrentStep === RESIDENT_STEP_COUNT ? 'none' : 'inline-flex';
  if (saveBtn) saveBtn.style.display = residentCurrentStep === RESIDENT_STEP_COUNT ? 'inline-flex' : 'none';
}

function validateResidentStep(step) {
  syncSmartResidentFields();

  const missing = getFirstMissingResidentField(step);

  if (missing) {
    showToast(
      missing.id === 'contact'
        ? missing.label
        : `Please fill up ${missing.label} before continuing.`
    );
    $(missing.id)?.focus();
    return false;
  }

  return true;
}

function setupResidentWizardLiveValidation() {
  const card = document.querySelector('.resident-form-card');
  if (!card) return;

  const refresh = () => {
    syncSmartResidentFields();
    updateResidentWizard();
  };

  card.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', refresh);
    element.addEventListener('change', refresh);
  });
}

function nextResidentStep() {
  if (!validateResidentStep(residentCurrentStep)) {
    updateResidentWizard();
    return;
  }

  if (residentCurrentStep < RESIDENT_STEP_COUNT) {
    residentCurrentStep++;
    updateResidentWizard();
  }
}

function prevResidentStep() {
  if (residentCurrentStep > 1) {
    residentCurrentStep--;
    updateResidentWizard();
  }
}

function validateResidentBeforeSave() {
  for (let step = 1; step <= RESIDENT_STEP_COUNT; step++) {
    if (!validateResidentStep(step)) {
      residentCurrentStep = step;
      updateResidentWizard();
      return false;
    }
  }

  return true;
}

/* =========================
   FAMILY COMPOSITION TABLE
========================= */

function familyRowTemplate(data = {}) {
  const input = (className, value = '', attrs = '') => `
    <input class="form-control modern-input ${className}" value="${esc(value || '')}" ${attrs}>
  `;

  return `
    <tr class="family-row">
      <td class="family-row-no"></td>
      <td>${input('fam-full-name', data.full_name, 'placeholder="Full name"')}</td>
      <td>${input('fam-relationship', data.relationship, 'placeholder="Relationship"')}</td>
      <td>${input('fam-birthdate', dateInputValue(data.birthdate), 'type="date" onchange="calculateFamilyAgeFromRow(this)"')}</td>
      <td>${input('fam-age', data.age, 'type="number" placeholder="Age"')}</td>
      <td><select class="form-control modern-input fam-civil-status">${civilStatusOptions(data.civil_status)}</select></td>
      <td><select class="form-control modern-input fam-education">${educationOptions(data.educational_attainment)}</select></td>
      <td>${input('fam-occupation', data.occupation, 'placeholder="Occupation"')}</td>
      <td><button type="button" class="mini-danger-btn" onclick="removeFamilyRow(this)">Remove</button></td>
    </tr>
  `;
}

function updateFamilyRowNumbers() {
  const rows = [...document.querySelectorAll('#familyTableBody .family-row')];

  rows.forEach((row, index) => {
    row.querySelector('.family-row-no').textContent = index + 1;
    const removeBtn = row.querySelector('.mini-danger-btn');
    if (removeBtn) removeBtn.style.display = rows.length === 1 ? 'none' : 'inline-flex';
  });
}

function addFamilyRow(data = {}) {
  const body = $('familyTableBody');
  if (!body) return;
  body.insertAdjacentHTML('beforeend', familyRowTemplate(data));
  updateFamilyRowNumbers();
  setupResidentWizardLiveValidation();
  updateResidentWizard();
}

function removeFamilyRow(button) {
  const rows = document.querySelectorAll('#familyTableBody .family-row');

  if (rows.length <= 1) {
    button.closest('tr').querySelectorAll('input, select').forEach(el => el.value = '');
  } else {
    button.closest('tr').remove();
  }

  updateFamilyRowNumbers();
  updateResidentWizard();
}

function calculateFamilyAgeFromRow(input) {
  input.closest('tr').querySelector('.fam-age').value = calculateAgeFromDate(input.value);
  updateResidentWizard();
}

function populateFamilyRows(family = []) {
  const body = $('familyTableBody');
  if (!body) return;

  body.innerHTML = '';
  const rows = Array.isArray(family) && family.length ? family : [{}];
  rows.forEach(row => addFamilyRow(row));
  updateResidentWizard();
}

function getFamilyMembersPayload() {
  return [...document.querySelectorAll('#familyTableBody .family-row')]
    .map(row => ({
      full_name: row.querySelector('.fam-full-name')?.value.trim() || '',
      relationship: row.querySelector('.fam-relationship')?.value.trim() || '',
      birthdate: row.querySelector('.fam-birthdate')?.value || '',
      age: row.querySelector('.fam-age')?.value || '',
      civil_status: row.querySelector('.fam-civil-status')?.value || '',
      educational_attainment: row.querySelector('.fam-education')?.value || '',
      occupation: row.querySelector('.fam-occupation')?.value.trim() || ''
    }))
    .filter(member => Object.values(member).some(value => String(value || '').trim() !== ''));
}

function buildFamilyCompositionNotes(familyMembers) {
  return familyMembers.map((member, index) => {
    return `${index + 1}. ${member.full_name || 'Unnamed'} - ${member.relationship || '-'} - ${member.birthdate || '-'} - Age: ${member.age || '-'} - ${member.civil_status || '-'} - ${member.educational_attainment || '-'} - ${member.occupation || '-'}`;
  }).join('\n');
}

/* =========================
   RESIDENTS LIST
========================= */

async function initResidents() {
  residentCurrentPage = 1;

  shell(
    'residents',
    'Residents',
    'Click any row to open the full resident profile with profile photo.',
    `
    <div class="resident-table-card">
      <div class="resident-toolbar">
        <div>
          <h2>Resident Records</h2>
        </div>
        <div>
          <input id="residentSearch" class="form-control search resident-search" placeholder="Search residents..." oninput="resetResidentPageAndRender()">
        </div>
        <div class="resident-toolbar-actions">
          <button class="primary-btn resident-add-btn" onclick="route('add-resident.html')">+ Add Resident</button>
          <button class="outline-btn resident-fp-btn" onclick="openFingerprintModal()">Fingerprint</button>
        </div>
      </div>

      <table class="data-table resident-table">
        <colgroup>
          <col style="width:12%">
          <col style="width:24%">
          <col style="width:13%">
          <col style="width:13%">
          <col style="width:13%">
          <col style="width:9%">
          <col style="width:16%">
        </colgroup>
        <thead>
          <tr>
            ${['ID', 'Name', 'Category', 'Barangay', 'Fingerprint', 'Status', 'Actions'].map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>

        <tbody id="residentsBody">
          <tr><td colspan="7" class="empty-table">Loading residents...</td></tr>
        </tbody>
      </table>

      <div id="residentPagination" class="resident-pagination"></div>
    </div>
    `
  );

  sessionStorage.removeItem('edit_resident_id');
  await renderResidents();
}

function resetResidentPageAndRender() {
  residentCurrentPage = 1;
  renderResidents();
}

async function renderResidents() {
  const body = $('residentsBody');
  const pager = $('residentPagination');
  if (!body) return;

  if (!checkDatabaseAPI()) {
    body.innerHTML = `<tr><td colspan="7" class="empty-table">Database API not loaded. Check preload.js and main.js.</td></tr>`;
    if (pager) pager.innerHTML = '';
    return;
  }

  try {
    const residents = await window.mswdAPI.residents.list(val('residentSearch'));
    const list = Array.isArray(residents) ? residents : [];
    const totalPages = Math.max(1, Math.ceil(list.length / RESIDENT_PAGE_SIZE));

    if (residentCurrentPage > totalPages) residentCurrentPage = totalPages;
    if (residentCurrentPage < 1) residentCurrentPage = 1;

    const startIndex = (residentCurrentPage - 1) * RESIDENT_PAGE_SIZE;
    const pageRows = list.slice(startIndex, startIndex + RESIDENT_PAGE_SIZE);

    body.innerHTML = pageRows.length
      ? pageRows.map((resident, index) => residentRow(resident, startIndex + index + 1)).join('')
      : `<tr><td colspan="7" class="empty-table">No residents found.</td></tr>`;

    renderResidentPagination(list.length, totalPages, startIndex, pageRows.length);
  } catch (error) {
    console.error(error);
    body.innerHTML = `<tr><td colspan="7" class="empty-table">Failed to load residents. Check MySQL, db.js, preload.js, or main.js.</td></tr>`;
    if (pager) pager.innerHTML = '';
  }
}

function renderResidentPagination(totalItems, totalPages, startIndex, visibleCount) {
  const pager = $('residentPagination');
  if (!pager) return;

  if (!totalItems) {
    pager.innerHTML = `
      <div class="resident-page-info">Showing 0 of 0 residents</div>
      <div class="resident-page-buttons"></div>
    `;
    return;
  }

  const from = startIndex + 1;
  const to = startIndex + visibleCount;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - residentCurrentPage) <= 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  pager.innerHTML = `
    <div class="resident-page-info">Showing ${from}-${to} of ${totalItems} residents</div>
    <div class="resident-page-buttons">
      <button class="resident-page-btn" onclick="changeResidentPage(${residentCurrentPage - 1})" ${residentCurrentPage === 1 ? 'disabled' : ''}>Prev</button>
      ${pages.map(page => page === '...'
        ? `<span class="resident-page-dots">...</span>`
        : `<button class="resident-page-btn ${page === residentCurrentPage ? 'active' : ''}" onclick="changeResidentPage(${page})">${page}</button>`
      ).join('')}
      <button class="resident-page-btn" onclick="changeResidentPage(${residentCurrentPage + 1})" ${residentCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
    </div>
  `;
}

function changeResidentPage(page) {
  residentCurrentPage = Number(page) || 1;
  renderResidents();
}

function residentRow(resident, rowNumber = '') {
  const id = getResidentId(resident);

  return `
    <tr class="resident-click-row" onclick="viewResident(${id})" title="Click row to open full profile with profile photo">
      <td><span class="resident-code">${esc(getResidentCode(resident))}</span></td>
      <td><b>${esc(getResidentFullName(resident))}</b><br><small>${esc(resident.contact_number || 'No contact')}</small></td>
      <td><span class="badge resident-category">${esc(resident.category_name || 'No Category')}</span></td>
      <td>${esc(resident.barangay_name || 'No Barangay')}</td>
      <td>${badge(resident.fingerprint_status || 'Not Enrolled')}</td>
      <td>${badge(resident.status || 'Active')}</td>
      <td>
        <div class="resident-actions">
          <button class="action-btn action-edit" onclick="event.stopPropagation(); editResident(${id})">Edit</button>
          <button class="action-btn action-danger" onclick="event.stopPropagation(); deactivateResident(${id})">Deactivate</button>
        </div>
      </td>
    </tr>
  `;
}

/* =========================
   ADD / EDIT RESIDENT FORM
========================= */

async function initAddResident() {
  const editId = sessionStorage.getItem('edit_resident_id');
  const isEdit = !!editId;

  residentCurrentStep = 1;

  const personalForm = formGrid([
    inputField('lastName', 'Last Name <span class="req">*</span>', 'placeholder="Enter last name"'),
    inputField('firstName', 'First Name <span class="req">*</span>', 'placeholder="Enter first name"'),
    inputField('middleName', 'Middle Name', 'placeholder="Enter middle name"'),
    inputField('suffix', 'Suffix', 'placeholder="Jr., Sr., III"'),
    selectField('sex', 'Sex <span class="req">*</span>', '<option value="">Select sex</option><option>Male</option><option>Female</option>'),
    inputField('birthdate', 'Birthdate', 'onchange="calculateAgeFromBirthdate()"', 'date'),
    inputField('age', 'Age', 'placeholder="Auto-computed" oninput="handleAgeInput()"', 'number'),
    inputField('birthplace', 'Birthplace', 'placeholder="Enter birthplace"'),
    selectField('civilStatus', 'Civil Status', civilStatusOptions()),
    inputField('contact', 'Contact Number', 'placeholder="09XXXXXXXXX" maxlength="11" inputmode="numeric" pattern="[0-9]{11}" oninput="limitContactNumber()"'),
    selectField('categorySelect', 'Category', '<option value="">Loading categories...</option>', 'onchange="syncSmartResidentFields(); updateResidentWizard();"'),
    selectField('status', 'Status', '<option>Active</option><option>Inactive</option><option>Deactivated</option>')
  ]);

  const addressForm = formGrid([
    inputField('addressDetail', 'House No. / Purok / Street', 'placeholder="Example: Purok 2" oninput="updateFullAddress()"'),
    selectField('barangaySelect', 'Barangay', '<option value="">Loading barangays...</option>', 'onchange="updateFullAddress()"'),
    inputField('municipality', 'Municipality', `value="${DEFAULT_MUNICIPALITY}" readonly`, 'text'),
    inputField('province', 'Province', `value="${DEFAULT_PROVINCE}" readonly`, 'text'),
    field('Complete Address', '<textarea id="address" class="form-control modern-input readonly-field" rows="3" placeholder="Auto-displays after selecting barangay" readonly></textarea>', 'span-2')
  ]);

  const socioForm = formGrid([
    selectField('educationalAttainment', 'Educational Attainment', educationOptions()),
    inputField('occupation', 'Occupation', 'placeholder="Example: Student, Farmer, Vendor" oninput="handleOccupationIncome()"'),
    field('Monthly Income', '<input id="monthlyIncome" class="form-control modern-input" placeholder="0.00"><small class="field-note">If occupation is Student, income becomes None automatically.</small>'),
    inputField('householdNumber', 'Household Number', 'placeholder="Enter household number"'),
    field('Type of Beneficiary', '<textarea id="typeOfBeneficiary" class="form-control modern-input type-beneficiary-box readonly-field" rows="4" placeholder="Auto-filled based on category and age" readonly></textarea><small class="field-note">Auto-filled in separate rows for PWD, Senior Citizen, and Solo Parent programs.</small>'),
    inputField('intakeDate', 'Intake Date', '', 'date')
  ]);

  const familyForm = `
    <div class="family-table-wrap">
      <table class="family-table">
        <thead>
          <tr>${['#', 'Full Name', 'Relationship', 'Birthdate', 'Age', 'Civil Status', 'Educational Attainment', 'Occupation', 'Action'].map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody id="familyTableBody"></tbody>
      </table>
    </div>
  `;

  const intakeForm = [
    textAreaField('problemPresented', 'Problem Presented', 'Describe the concern or assistance needed'),
    textAreaField('briefFindings', 'Brief Findings / Assessment', 'Enter assessment findings'),
    textAreaField('recommendation', 'Recommendation / Action Taken', 'Enter recommendation or action taken')
  ].join('');

  shell(
    'residents',
    isEdit ? 'Edit Resident' : 'Add Resident',
    isEdit ? 'Update resident information step by step.' : 'Register a resident using a clean step-by-step form.',
    `
    <section class="resident-form-card">
      <div class="resident-form-top">
        <button class="back-icon-btn" onclick="cancelResidentForm()">← Back to List</button>
        <div>
          <h2>${isEdit ? 'Update Resident Information' : 'Resident Registration'}</h2>
          <p>Complete the resident details step by step. Required progress turns green automatically when complete.</p>
        </div>
      </div>

      ${residentStepper()}
      ${section(1, 'Profile Photo', 'Open the live camera, capture a profile photo, and save it to the resident record.', profilePhotoBox())}
      ${section(2, 'Personal Information', 'Basic identity and contact details of the resident.', personalForm)}
      ${section(3, 'Address Information', 'Barangay, municipality, and province automatically form the complete address.', addressForm)}
      ${section(4, 'Socio-Demographic Information', 'Education, employment, and beneficiary details.', socioForm)}
      ${section(5, 'Family Composition', 'Fill up each family member in a table. Click Add Row for another member.', familyForm, '<button type="button" class="add-family-btn" onclick="addFamilyRow()">+ Add Row</button>')}
      ${section(6, 'MSWD Intake Information', 'Assessment and action details.', intakeForm)}

      <div class="sticky-form-actions wizard-form-actions">
        <button id="residentBackBtn" class="outline-btn" onclick="prevResidentStep()">Back</button>
        <button id="residentNextBtn" class="primary-btn" onclick="nextResidentStep()">Next</button>
        <button id="residentSaveBtn" class="primary-btn save-resident-btn" onclick="saveResident()">${isEdit ? 'Update Resident' : 'Save Resident'}</button>
      </div>
    </section>
    `
  );

  await loadResidentDropdowns();
  populateFamilyRows();
  setupResidentWizardLiveValidation();

  if (isEdit) {
    await loadResidentForEdit(editId);
  } else {
    setVal('municipality', DEFAULT_MUNICIPALITY);
    setVal('province', DEFAULT_PROVINCE);
    setProfilePhotoPreview('');
    updateFullAddress();
    syncSmartResidentFields();
  }

  updateResidentWizard();
}

async function loadResidentDropdowns() {
  if (!checkDatabaseAPI()) return;

  try {
    const [categories, barangays] = await Promise.all([
      window.mswdAPI.masterData.categories(),
      window.mswdAPI.masterData.barangays()
    ]);

    residentCategoryOptions = Array.isArray(categories) ? categories : [];

    $('categorySelect').innerHTML = '<option value="">Select category</option>' +
      categories.map(c => `<option value="${esc(getCategoryId(c))}">${esc(getCategoryName(c))}</option>`).join('');

    $('barangaySelect').innerHTML = '<option value="">Select barangay</option>' +
      barangays.map(b => `<option value="${esc(getBarangayId(b))}">${esc(getBarangayName(b))}</option>`).join('');

    updateFullAddress();
    syncSmartResidentFields();
    updateResidentWizard();
  } catch (error) {
    console.error(error);
    showToast('Failed to load categories/barangays. Check your tables.');
  }
}

async function loadResidentForEdit(id) {
  if (!checkDatabaseAPI()) return;

  try {
    const resident = await window.mswdAPI.residents.get(id);

    if (!resident) {
      showToast('Resident not found.');
      route('residents.html');
      return;
    }

    Object.entries(RESIDENT_FIELDS).forEach(([dbKey, inputId]) => {
      if (dbKey === 'profile_photo') return;
      setVal(inputId, resident[dbKey]);
    });

    const residentPhoto = safePhotoSrc(resident.profile_photo || resident.profilePhoto || '');
    setVal('profilePhoto', residentPhoto);

    setVal('birthdate', dateInputValue(resident.birthdate));
    setVal('intakeDate', dateInputValue(resident.intake_date));
    setVal('age', resident.age);
    setVal('addressDetail', extractAddressDetail(resident.address));
    setVal('municipality', DEFAULT_MUNICIPALITY);
    setVal('province', DEFAULT_PROVINCE);
    setVal('monthlyIncome', String(resident.occupation || '').toLowerCase().includes('student') ? 'None' : resident.monthly_income);

    setProfilePhotoPreview(residentPhoto);
    handleOccupationIncome();
    syncSmartResidentFields();
    populateFamilyRows(resident.family || []);
    updateResidentWizard();
  } catch (error) {
    console.error(error);
    showToast('Failed to load resident for editing.');
  }
}

function getResidentPayload() {
  syncSmartResidentFields();
  const familyMembers = getFamilyMembersPayload();
  const payload = Object.fromEntries(Object.entries(RESIDENT_FIELDS).map(([dbKey, inputId]) => [dbKey, val(inputId)]));

  payload.profile_photo = safePhotoSrc(payload.profile_photo);

  return {
    ...payload,
    birthdate: val('birthdate'),
    age: val('age'),
    intake_date: val('intakeDate'),
    monthly_income: normalizeMonthlyIncome(),
    family_composition_notes: buildFamilyCompositionNotes(familyMembers),
    family_members: familyMembers
  };
}

async function saveResident() {
  if (!checkDatabaseAPI()) return;
  if (!validateResidentBeforeSave()) return;

  updateFullAddress();
  syncSmartResidentFields();

  const editId = sessionStorage.getItem('edit_resident_id');
  const payload = getResidentPayload();

  try {
    const result = editId
      ? await window.mswdAPI.residents.update(editId, payload)
      : await window.mswdAPI.residents.create(payload);

    if (result?.success === false) {
      showToast(result.message || 'Failed to save resident.');
      return;
    }

    stopProfileCamera();
    sessionStorage.removeItem('edit_resident_id');
    showToast(editId ? 'Resident updated successfully.' : 'Resident saved successfully.');
    route('residents.html');
  } catch (error) {
    console.error(error);
    showToast('Database error. Check terminal logs.');
  }
}

function cancelResidentForm() {
  stopProfileCamera();
  sessionStorage.removeItem('edit_resident_id');
  route('residents.html');
}

function viewResident(id) {
  sessionStorage.setItem('selected_resident', id);
  route('resident-profile.html');
}

function editResident(id) {
  sessionStorage.setItem('edit_resident_id', id);
  route('add-resident.html');
}

async function deactivateResident(id) {
  if (!confirm('Are you sure you want to deactivate this resident?') || !checkDatabaseAPI()) return;

  try {
    const result = await window.mswdAPI.residents.deactivate(id);
    if (result?.success) {
      showToast('Resident deactivated successfully.');
      await renderResidents();
    } else {
      showToast(result?.message || 'Failed to deactivate resident.');
    }
  } catch (error) {
    console.error(error);
    showToast('Database error while deactivating resident.');
  }
}


async function deleteResident(id) {
  if (!confirm('Are you sure you want to permanently delete this resident? This will also remove the saved profile photo from the folder.') || !checkDatabaseAPI()) return;

  try {
    if (!window.mswdAPI.residents.delete) {
      showToast('Delete API is not exposed in preload.js yet.');
      return;
    }

    const result = await window.mswdAPI.residents.delete(id);
    if (result?.success) {
      showToast('Resident deleted and profile photo removed.');
      await renderResidents();
    } else {
      showToast(result?.message || 'Failed to delete resident.');
    }
  } catch (error) {
    console.error(error);
    showToast('Database error while deleting resident.');
  }
}

/* =========================
   RESIDENT PROFILE
========================= */

function infoRows(rows) {
  return rows.map(([label, value]) => `<p><b>${label}:</b> ${esc(value || '-')}</p>`).join('');
}

function renderFamilyProfile(resident) {
  if (!Array.isArray(resident.family) || !resident.family.length) {
    return `<p>${esc(resident.family_composition_notes || 'No family composition encoded yet.')}</p>`;
  }

  return `
    <div class="family-profile-table-wrap">
      <table class="family-profile-table">
        <thead>
          <tr>${['#', 'Full Name', 'Relationship', 'Birthdate', 'Age', 'Civil Status', 'Educational Attainment', 'Occupation'].map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${resident.family.map((member, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${esc(member.full_name || '-')}</td>
              <td>${esc(member.relationship || '-')}</td>
              <td>${esc(member.birthdate || '-')}</td>
              <td>${esc(member.age || '-')}</td>
              <td>${esc(member.civil_status || '-')}</td>
              <td>${esc(member.educational_attainment || '-')}</td>
              <td>${esc(member.occupation || '-')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function profilePhotoDisplay(resident) {
  const photo = safePhotoSrc(resident.profile_photo || resident.profilePhoto);
  const initials = esc(getResidentInitials(resident));

  if (photo) {
    return `
      <div class="profile-page-photo-box">
        <img class="profile-page-photo" src="${esc(photo)}" alt="Resident Photo" onerror="brokenPhotoFallback(this)">
        <div class="profile-page-initial" style="display:none">${initials}</div>
      </div>
    `;
  }

  return `<div class="profile-page-initial">${initials}</div>`;
}

async function initResidentProfile() {
  const id = sessionStorage.getItem('selected_resident');

  if (!id) {
    shell('residents', 'Resident Profile', 'No resident selected.', `
      <section class="card">
        <h2>No resident selected</h2>
        <button class="primary-btn" onclick="route('residents.html')">Back to Residents</button>
      </section>
    `);
    return;
  }

  if (!checkDatabaseAPI()) return;

  try {
    const resident = await window.mswdAPI.residents.get(id);

    if (!resident) {
      shell('residents', 'Resident Profile', 'Resident not found.', `
        <section class="card">
          <h2>Resident not found</h2>
          <button class="primary-btn" onclick="route('residents.html')">Back to Residents</button>
        </section>
      `);
      return;
    }

    const residentId = getResidentId(resident);
    const income = String(resident.occupation || '').toLowerCase().includes('student')
      ? 'None'
      : `₱${Number(resident.monthly_income || 0).toLocaleString()}`;

    shell(
      'residents',
      'Resident Profile',
      'Detailed personal, socio-demographic, family, and MSWD intake information.',
      `
      <div class="two-col">
        <section class="card profile-main-card">
          <div class="profile-header-box">
            ${profilePhotoDisplay(resident)}
            <div class="profile-header-text">
              <h2>${esc(getResidentFullName(resident))}</h2>
              <p class="page-subtitle">${esc(getResidentCode(resident))} · ${esc(resident.category_name || 'No Category')} · ${esc(resident.barangay_name || 'No Barangay')}</p>
            </div>
          </div>

          <br>

          <div class="kpi-row profile-kpi-row">
            <div class="mini-kpi"><b>${esc(resident.age || '-')}</b>Age</div>
            <div class="mini-kpi"><b>${esc(resident.sex || '-')}</b>Sex</div>
            <div class="mini-kpi"><b>${esc(resident.status || '-')}</b>Status</div>
          </div>

          <h3>Personal Information</h3>
          ${infoRows([
            ['Birthdate', dateInputValue(resident.birthdate)],
            ['Birthplace', resident.birthplace],
            ['Civil Status', resident.civil_status],
            ['Contact Number', resident.contact_number],
            ['Address', resident.address]
          ])}

          <br>
          <h3>Socio-Demographic Information</h3>
          ${infoRows([
            ['Educational Attainment', resident.educational_attainment],
            ['Occupation', resident.occupation],
            ['Monthly Income', income],
            ['Household Number', resident.household_number],
            ['Type of Beneficiary', resident.type_of_beneficiary]
          ])}

          <br>
          <h3>Family Composition</h3>
          ${renderFamilyProfile(resident)}

          <br>
          <h3>MSWD Intake Information</h3>
          <p><b>Problem Presented:</b><br>${esc(resident.problem_presented || '-')}</p>
          <p><b>Brief Findings:</b><br>${esc(resident.brief_findings || '-')}</p>
          <p><b>Recommendation:</b><br>${esc(resident.recommendation || '-')}</p>

          <br>
          <button class="outline-btn" onclick="editResident(${residentId})">✏️ Edit Resident</button>
          <button class="outline-btn" onclick="route('residents.html')">Back to List</button>
        </section>

        <section class="card">
          <h2>Verification</h2>
          <p><b>Fingerprint:</b> ${badge(resident.fingerprint_status || 'Not Enrolled')}</p>
          <p><b>Blockchain Status:</b> ${badge('Verified')}</p>
          <p><b>Intake Date:</b> ${esc(dateInputValue(resident.intake_date) || '-')}</p>

          <button class="outline-btn full" onclick="openFingerprintModal(${residentId})">Register / Verify Fingerprint</button>
          <button class="primary-btn full" style="margin-top:10px" onclick="confirmInfo('Integrity Verified','Resident profile hash matches the blockchain audit trail demo.')">Verify Integrity</button>
        </section>
      </div>
      `
    );
  } catch (error) {
    console.error(error);
    shell('residents', 'Resident Profile', 'Database error.', `
      <section class="card">
        <h2>Failed to load resident profile</h2>
        <p class="page-subtitle">Please check MySQL and terminal error logs.</p>
        <button class="primary-btn" onclick="route('residents.html')">Back to Residents</button>
      </section>
    `);
  }
}

/* =========================
   FINGERPRINT MODAL
========================= */

async function openFingerprintModal(selectedId) {
  let options = '';

  try {
    const residents = await getDatabaseResidents();
    options = residents.map(resident => {
      const id = getResidentId(resident);
      const selected = String(selectedId) === String(id) ? 'selected' : '';
      return `<option value="${id}" ${selected}>${esc(getResidentCode(resident))} - ${esc(getResidentFullName(resident))}</option>`;
    }).join('');
  } catch (error) {
    console.error(error);
  }

  modal(
    'Fingerprint Registration',
    `
    <p class="page-subtitle">Demo fingerprint workflow for DigitalPersona/HID scanner integration.</p>
    <div class="form-group">
      <label>Resident</label>
      <select id="fpResident" class="form-control">${options}</select>
    </div>
    <div class="workflow">
      <div>1. Connect Scanner</div>
      <div>2. Capture Finger</div>
      <div>3. Save Template</div>
      <div>4. Verify Match</div>
      <div>5. Audit Log</div>
    </div>
    `,
    'saveFingerprint'
  );
}

function saveFingerprint() {
  closeModal();
  showToast('Fingerprint demo saved. Actual scanner SDK connection will be added later.');
}



/* OTHER MODULES */

async function initBeneficiaries() { 
  shell(
    'beneficiaries',
    'Beneficiaries',
    'Assign residents to assistance programs and manage beneficiary status.',
    tablePage(
      'beneficiaries',
      'Beneficiaries',
      'openBeneficiaryModal()',
      ['Resident','Program','Category','Status','Approved Date'],
      renderBeneficiaryRows()
    )
  ); 
}

function renderBeneficiaryRows() { 
  return getStore('beneficiaries').map(x => `
    <tr>
      <td>${esc(x.resident)}</td>
      <td>${esc(x.program)}</td>
      <td>${esc(x.category)}</td>
      <td>${badge(x.status)}</td>
      <td>${esc(x.approved)}</td>
      <td class="inline-actions">
        <button class="action-btn" onclick="openBeneficiaryModal(${x.id})">Edit</button>
        <button class="action-btn danger-btn" onclick="deleteGeneric('beneficiaries',${x.id},initBeneficiaries)">Remove</button>
      </td>
    </tr>
  `).join(''); 
}

async function openBeneficiaryModal() {
  const dbResidents = await getDatabaseResidents();

  const residentOptions = dbResidents.map(r => `
    <option>${esc(getResidentFullName(r))}</option>
  `).join('');

  modal(
    'Add Beneficiary',
    `
    <div class="form-grid two">
      <div class="form-group">
        <label>Resident</label>
        <select id="bResident" class="form-control">${residentOptions}</select>
      </div>

      <div class="form-group">
        <label>Program</label>
        <select id="bProgram" class="form-control">
          ${getStore('programs').map(p => `<option>${esc(p.name)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Category</label>
        <select id="bCategory" class="form-control">
          ${getStore('categories').map(c => `<option>${esc(c.name)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Status</label>
        <select id="bStatus" class="form-control">
          <option>Active</option>
          <option>Pending</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>
    `,
    'saveBeneficiary'
  );
}

function saveBeneficiary() { 
  const d = getStore('beneficiaries'); 

  d.push({
    id: nextId(d),
    resident: val('bResident'),
    program: val('bProgram'),
    category: val('bCategory'),
    status: val('bStatus'),
    approved: new Date().toISOString().slice(0,10)
  }); 

  setStore('beneficiaries', d); 
  closeModal(); 
  logAction('Added beneficiary', val('bResident')); 
  showToast('Beneficiary saved.'); 
  initBeneficiaries(); 
}

function initPrograms() { 
  shell(
    'programs',
    'Assistance Programs',
    'Manage AICS, Senior Citizen, PWD, Solo Parent, TUPAD, claim amount, eligibility, and status.',
    tablePage(
      'programs',
      'Programs',
      'openProgramModal()',
      ['Program','Maximum Amount','Frequency','Status'],
      renderProgramRows()
    )
  ); 
}

function renderProgramRows() { 
  return getStore('programs').map(x => `
    <tr>
      <td><b>${esc(x.name)}</b><br><small>${esc(x.description)}</small></td>
      <td>${fmtMoney(x.amount)}</td>
      <td>${esc(x.frequency)}</td>
      <td>${badge(x.status)}</td>
      <td class="inline-actions">
        <button class="action-btn" onclick="openProgramModal(${x.id})">Edit</button>
        <button class="action-btn danger-btn" onclick="toggleStatus('programs',${x.id},initPrograms)">Activate/Deactivate</button>
      </td>
    </tr>
  `).join(''); 
}

function openProgramModal() { 
  modal(
    'Add Assistance Program',
    `
    <div class="form-grid two">
      <div class="form-group">
        <label>Program Name</label>
        <input id="pName" class="form-control">
      </div>

      <div class="form-group">
        <label>Maximum Amount</label>
        <input id="pAmount" type="number" class="form-control">
      </div>

      <div class="form-group">
        <label>Claim Frequency</label>
        <input id="pFreq" class="form-control" placeholder="Once every 6 months">
      </div>

      <div class="form-group">
        <label>Status</label>
        <select id="pStatus" class="form-control">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div class="form-group span-2">
        <label>Description / Eligibility Rule</label>
        <textarea id="pDesc" class="form-control" rows="3"></textarea>
      </div>
    </div>
    `,
    'saveProgram'
  ); 
}

function saveProgram() { 
  const d = getStore('programs'); 

  d.push({
    id: nextId(d),
    name: val('pName'),
    amount: val('pAmount'),
    frequency: val('pFreq'),
    description: val('pDesc'),
    status: val('pStatus')
  }); 

  setStore('programs', d); 
  closeModal(); 
  logAction('Added program', val('pName')); 
  showToast('Program saved.'); 
  initPrograms(); 
}

function initClaims() { 
  shell(
    'claims',
    'Claims',
    'Create claims, verify fingerprint, check duplicate claims, release assistance, and generate transaction hash.',
    `
    <section class="card">
      <h2>Claim Workflow</h2>
      <div class="workflow">
        <div>Search Resident</div>
        <div>Verify Fingerprint</div>
        <div>Eligibility Check</div>
        <div>Release Assistance</div>
        <div>Blockchain Hash</div>
      </div>
    </section>
    <br>
    ` + tablePage(
      'claims',
      'Claim History',
      'openClaimModal()',
      ['Claim Code','Resident','Program','Amount','Fingerprint','Status'],
      renderClaimRows()
    )
  ); 
}

function renderClaimRows() { 
  return getStore('claims').map(x => `
    <tr>
      <td>${esc(x.code)}</td>
      <td>${esc(x.resident)}</td>
      <td>${esc(x.program)}</td>
      <td>${fmtMoney(x.amount)}</td>
      <td>${badge(x.fingerprint)}</td>
      <td>${badge(x.status)}</td>
      <td class="inline-actions">
        <button class="action-btn" onclick="verifyClaim(${x.id})">Verify</button>
        <button class="action-btn" onclick="releaseClaim(${x.id})">Release</button>
      </td>
    </tr>
  `).join(''); 
}

async function openClaimModal() {
  const dbResidents = await getDatabaseResidents();

  const residentOptions = dbResidents.map(r => `
    <option>${esc(getResidentFullName(r))}</option>
  `).join('');

  modal(
    'Create Claim',
    `
    <div class="form-grid two">
      <div class="form-group">
        <label>Resident</label>
        <select id="cResident" class="form-control">${residentOptions}</select>
      </div>

      <div class="form-group">
        <label>Program</label>
        <select id="cProgram" class="form-control">
          ${getStore('programs').map(p => `<option data-amount="${p.amount}">${esc(p.name)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Amount</label>
        <input id="cAmount" type="number" class="form-control">
      </div>

      <div class="form-group">
        <label>Status</label>
        <select id="cStatus" class="form-control">
          <option>Pending</option>
          <option>Released</option>
          <option>Cancelled</option>
        </select>
      </div>
    </div>
    `,
    'saveClaim'
  ); 
}

function saveClaim() { 
  const d = getStore('claims'); 
  const id = nextId(d); 

  const rec = {
    id,
    code: `CLM-${String(id).padStart(4,'0')}`,
    resident: val('cResident'),
    program: val('cProgram'),
    amount: val('cAmount'),
    status: val('cStatus'),
    fingerprint: 'Pending',
    date: new Date().toISOString().slice(0,10)
  }; 

  d.push(rec); 
  setStore('claims', d); 
  logAction('Created claim', rec.code); 
  closeModal(); 
  showToast('Claim created.'); 
  initClaims(); 
}

function verifyClaim(id) { 
  const d = getStore('claims'); 
  const c = d.find(x => x.id === id); 
  c.fingerprint = 'Verified'; 
  setStore('claims', d); 
  logAction('Verified fingerprint for claim', c.code); 
  showToast('Fingerprint verified.'); 
  initClaims(); 
}

function releaseClaim(id) { 
  const d = getStore('claims'); 
  const c = d.find(x => x.id === id); 
  c.status = 'Released'; 
  setStore('claims', d); 

  const b = getStore('blockchain'); 

  b.push({
    id: nextId(b),
    tx: `TX-${String(nextId(b)).padStart(4,'0')}`,
    claim: c.code,
    resident: c.resident,
    hash: Math.random().toString(16).slice(2) + Date.now().toString(16),
    status: 'Verified',
    date: new Date().toLocaleString()
  }); 

  setStore('blockchain', b); 
  logAction('Released claim and created blockchain hash', c.code); 
  showToast('Claim released and blockchain hash created.'); 
  initClaims(); 
}

function initBlockchain() { 
  shell(
    'blockchain',
    'Blockchain Ledger',
    'Transaction hashes, integrity verification, and tampered record monitoring.',
    `
    <div class="cards grid">
      ${card('⛓️','Ledger Records',getStore('blockchain').length,'Total hashes')}
      ${card('✅','Verified',getStore('blockchain').filter(x => x.status === 'Verified').length,'Passed integrity')}
      ${card('🚨','Tampered',getStore('blockchain').filter(x => x.status === 'Tampered').length,'Needs investigation')}
      ${card('🔐','Hash Algorithm','SHA-256','Demo mode')}
    </div>
    ` + tablePage(
      'blockchain',
      'Transaction Ledger',
      'runIntegrityCheck()',
      ['TX ID','Claim','Resident','Hash','Status','Date'],
      renderBlockchainRows(),
      'Run Integrity Check'
    )
  ); 
}

function renderBlockchainRows() { 
  return getStore('blockchain').map(x => `
    <tr>
      <td>${esc(x.tx)}</td>
      <td>${esc(x.claim)}</td>
      <td>${esc(x.resident)}</td>
      <td><small>${esc(x.hash)}</small></td>
      <td>${badge(x.status)}</td>
      <td>${esc(x.date)}</td>
      <td><button class="action-btn" onclick="tamperDemo(${x.id})">Mark Tampered</button></td>
    </tr>
  `).join(''); 
}

function runIntegrityCheck() { 
  confirmInfo('Integrity Verification Complete','All verified transactions match their current hash values. Tampered records are highlighted for audit review.'); 
  logAction('Ran blockchain integrity verification','Blockchain'); 
}

function tamperDemo(id) { 
  const d = getStore('blockchain'); 
  const x = d.find(a => a.id === id); 
  x.status = 'Tampered'; 
  setStore('blockchain', d); 
  logAction('Flagged tampered record', x.tx); 
  showToast('Record marked as tampered.'); 
  initBlockchain(); 
}

function initReports() { 
  shell(
    'reports',
    'Reports',
    'Resident, beneficiary, claims, program distribution, monthly reports, PDF and Excel export placeholders.',
    `
    <div class="cards grid">
      ${card('👥','Residents Report','DB','Connected to MySQL')}
      ${card('🎁','Beneficiary Report',getStore('beneficiaries').length,'Program beneficiaries')}
      ${card('💵','Claims Report',getStore('claims').length,'Claim transactions')}
      ${card('⛓️','Blockchain Report',getStore('blockchain').length,'Hash records')}
    </div>

    <section class="card">
      <h2>Report Generator</h2>

      <div class="form-grid">
        <div class="form-group">
          <label>Report Type</label>
          <select class="form-control">
            <option>Residents Report</option>
            <option>Beneficiary Report</option>
            <option>Claims Report</option>
            <option>Program Distribution Report</option>
            <option>Monthly Report</option>
            <option>Blockchain Integrity Report</option>
          </select>
        </div>

        <div class="form-group">
          <label>From</label>
          <input type="date" class="form-control">
        </div>

        <div class="form-group">
          <label>To</label>
          <input type="date" class="form-control">
        </div>
      </div>

      <button class="primary-btn" onclick="confirmInfo('Report Generated','Report preview is ready. PDF/Excel export will be connected to backend libraries later.')">Generate Report</button>
      <button class="outline-btn" onclick="showToast('PDF export placeholder clicked.')">Export PDF</button>
      <button class="outline-btn" onclick="showToast('Excel export placeholder clicked.')">Export Excel</button>
    </section>
    `
  ); 
}

function initCategories() { 
  shell(
    'categories',
    'Categories',
    'Manage resident categories used in Add Resident, filtering, eligibility rules, and reports.',
    masterTable('categories','Category','openMasterModal("categories")')
  ); 
  renderMaster('categories'); 
}

let barangayRows = [];

async function initBarangays() {
  shell(
    'barangays',
    'Barangay Management',
    'Manage barangays used in resident registration, reports, and filtering.',
    `
    <div class="table-wrap">
      <div class="table-toolbar">
        <input 
          id="barangaySearch" 
          class="form-control search" 
          placeholder="Search barangay name..." 
          oninput="renderBarangays()"
        >

        <div class="inline-actions">
          <select id="barangayStatusFilter" class="form-control" onchange="renderBarangays()">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button class="outline-btn" onclick="clearBarangayFilters()">Clear</button>
          <button class="primary-btn" onclick="openBarangayModal()">+ Add Barangay</button>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Barangay ID</th>
            <th>Barangay Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="barangaysBody"></tbody>
      </table>
    </div>
    `
  );

  await loadBarangaysFromDatabase();
}

async function loadBarangaysFromDatabase() {
  try {
    barangayRows = await window.mswdAPI.masterData.barangays();
    renderBarangays();
  } catch (error) {
    console.error(error);
    showToast('Failed to load barangays from database.');
  }
}

function renderBarangays() {
  const search = (val('barangaySearch') || '').toLowerCase();
  const statusFilter = val('barangayStatusFilter') || 'All';

  const filtered = barangayRows.filter((barangay) => {
    const matchesSearch = Object.values(barangay).join(' ').toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'All' || barangay.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  $('barangaysBody').innerHTML = filtered.length
    ? filtered.map((barangay, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>BRGY-${String(barangay.id).padStart(3, '0')}</td>
        <td><b>${esc(barangay.name)}</b></td>
        <td>${esc(barangay.description || 'San Juan, Southern Leyte')}</td>
        <td>${badge(barangay.status)}</td>
        <td class="inline-actions">
          <button class="action-btn" onclick="openBarangayModal(${barangay.id})">Edit</button>
          <button class="action-btn danger-btn" onclick="toggleBarangayStatus(${barangay.id}, '${barangay.status}')">
            ${barangay.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
    `).join('')
    : `<tr><td colspan="6" class="empty-table">No barangays found.</td></tr>`;
}

function openBarangayModal(id = null) {
  const barangay = id ? barangayRows.find((item) => item.id === id) : {};

  modal(
    id ? 'Edit Barangay' : 'Add Barangay',
    `
    <input type="hidden" id="barangayId" value="${id || ''}">

    <div class="form-group">
      <label>Barangay Name</label>
      <input 
        id="barangayName" 
        class="form-control" 
        value="${esc(barangay.name || '')}" 
        placeholder="Enter barangay name"
      >
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea 
        id="barangayDescription" 
        class="form-control" 
        rows="3"
        placeholder="Example: San Juan, Southern Leyte"
      >${esc(barangay.description || 'San Juan, Southern Leyte')}</textarea>
    </div>

    <div class="form-group">
      <label>Status</label>
      <select id="barangayStatus" class="form-control">
        <option ${barangay.status === 'Active' ? 'selected' : ''}>Active</option>
        <option ${barangay.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
      </select>
    </div>
    `,
    'saveBarangay'
  );
}

async function saveBarangay() {
  const id = val('barangayId');
  const name = val('barangayName');
  const description = val('barangayDescription') || 'San Juan, Southern Leyte';
  const status = val('barangayStatus') || 'Active';

  if (!name) {
    showToast('Please enter barangay name.');
    return;
  }

  try {
    if (id) {
      await window.mswdAPI.masterData.updateBarangay(id, {
        name,
        description,
        status
      });

      logAction('Edited barangay', name);
      showToast('Barangay updated successfully.');
    } else {
      await window.mswdAPI.masterData.createBarangay({
        name,
        description,
        status
      });

      logAction('Added barangay', name);
      showToast('Barangay added successfully.');
    }

    closeModal();
    await loadBarangaysFromDatabase();

  } catch (error) {
    console.error(error);

    if (String(error.message).includes('Duplicate')) {
      showToast('Barangay already exists.');
    } else {
      showToast('Failed to save barangay.');
    }
  }
}

async function toggleBarangayStatus(id, currentStatus) {
  try {
    if (currentStatus === 'Active') {
      await window.mswdAPI.masterData.deactivateBarangay(id);
      showToast('Barangay deactivated successfully.');
    } else {
      await window.mswdAPI.masterData.activateBarangay(id);
      showToast('Barangay activated successfully.');
    }

    logAction('Updated barangay status', `Barangay ID ${id}`);
    await loadBarangaysFromDatabase();

  } catch (error) {
    console.error(error);
    showToast('Failed to update barangay status.');
  }
}

function clearBarangayFilters() {
  $('barangaySearch').value = '';
  $('barangayStatusFilter').value = 'All';
  renderBarangays();
}

function masterTable(key, label, openFn) { 
  return `
    <div class="table-wrap">
      <div class="table-toolbar">
        <input id="${key}Search" class="form-control search" placeholder="Search ${label.toLowerCase()}..." oninput="renderMaster('${key}')">
        <button class="primary-btn" onclick='${openFn}'>+ Add ${label}</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>${label}</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="${key}Body"></tbody>
      </table>
    </div>
  `; 
}

function renderMaster(key) { 
  const q = (val(key + 'Search') || '').toLowerCase(); 
  const d = getStore(key).filter(x => Object.values(x).join(' ').toLowerCase().includes(q)); 

  $(key + 'Body').innerHTML = d.length 
    ? d.map((x, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><b>${esc(x.name)}</b></td>
        <td>${esc(x.description)}</td>
        <td>${badge(x.status)}</td>
        <td class="inline-actions">
          <button class="action-btn" onclick="openMasterModal('${key}',${x.id})">Edit</button>
          <button class="action-btn danger-btn" onclick="deleteGeneric('${key}',${x.id},()=>renderMaster('${key}'))">Delete</button>
          <button class="action-btn" onclick="toggleStatus('${key}',${x.id},()=>renderMaster('${key}'))">Activate/Deactivate</button>
        </td>
      </tr>
    `).join('')
    : `<tr><td colspan="5" class="empty-table">No records found.</td></tr>`; 
}

function openMasterModal(key, id) { 
  const rec = id ? getStore(key).find(x => x.id === id) : {}; 
  const title = (id ? 'Edit ' : 'Add ') + (key === 'categories' ? 'Category' : 'Barangay'); 

  modal(
    title,
    `
    <input type="hidden" id="mKey" value="${key}">
    <input type="hidden" id="mId" value="${id || ''}">

    <div class="form-group">
      <label>Name</label>
      <input id="mName" class="form-control" value="${esc(rec.name || '')}">
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea id="mDesc" class="form-control" rows="3">${esc(rec.description || '')}</textarea>
    </div>

    <div class="form-group">
      <label>Status</label>
      <select id="mStatus" class="form-control">
        <option ${rec.status === 'Active' ? 'selected' : ''}>Active</option>
        <option ${rec.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
      </select>
    </div>
    `,
    'saveMaster'
  ); 
}

function saveMaster() { 
  const key = val('mKey'); 
  const id = val('mId'); 
  const d = getStore(key); 

  if (id) { 
    const r = d.find(x => String(x.id) === id); 
    r.name = val('mName'); 
    r.description = val('mDesc'); 
    r.status = val('mStatus'); 
  } else {
    d.push({
      id: nextId(d),
      name: val('mName'),
      description: val('mDesc'),
      status: val('mStatus')
    }); 
  }

  setStore(key, d); 
  closeModal(); 
  logAction((id ? 'Edited ' : 'Added ') + key, val('mName')); 
  showToast('Saved successfully. It will now appear in related dropdowns after database integration.'); 
  renderMaster(key); 
}

function initUsers() { 
  shell(
    'system-users',
    'System Users',
    'Add users, assign roles, reset password, activate/deactivate, and search staff accounts.',
    `
    <div class="table-wrap">
      <div class="table-toolbar">
        <input id="usersSearch" class="form-control search" placeholder="Search users..." oninput="renderUsers()">
        <button class="primary-btn" onclick="openUserModal()">+ Add User</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="usersBody"></tbody>
      </table>
    </div>
    `
  ); 
  renderUsers(); 
}

function renderUsers() { 
  const q = (val('usersSearch') || '').toLowerCase(); 
  const d = getStore('users').filter(x => Object.values(x).join(' ').toLowerCase().includes(q)); 

  $('usersBody').innerHTML = d.map(u => `
    <tr>
      <td><b>${esc(u.fullName)}</b><br><small>${esc(u.contact)}</small></td>
      <td>${esc(u.username)}</td>
      <td>${esc(u.email)}</td>
      <td><span class="badge blue">${esc(u.role)}</span></td>
      <td>${badge(u.status)}</td>
      <td class="inline-actions">
        <button class="action-btn" onclick="openUserModal(${u.id})">Edit</button>
        <button class="action-btn" onclick="confirmInfo('Password Reset','Temporary password generated for ${esc(u.username)}.')">Reset Password</button>
        <button class="action-btn danger-btn" onclick="toggleStatus('users',${u.id},initUsers)">Activate/Deactivate</button>
      </td>
    </tr>
  `).join(''); 
}

function openUserModal(id) { 
  const u = id ? getStore('users').find(x => x.id === id) : {}; 

  modal(
    id ? 'Edit User' : 'Add System User',
    `
    <input type="hidden" id="uId" value="${id || ''}">

    <div class="form-grid two">
      <div class="form-group">
        <label>Full Name</label>
        <input id="uFull" class="form-control" value="${esc(u.fullName || '')}">
      </div>

      <div class="form-group">
        <label>Username</label>
        <input id="uUser" class="form-control" value="${esc(u.username || '')}">
      </div>

      <div class="form-group">
        <label>Password</label>
        <input id="uPass" type="password" class="form-control" placeholder="Temporary password">
      </div>

      <div class="form-group">
        <label>Role</label>
        <select id="uRole" class="form-control">
          ${getStore('roles').map(r => `<option ${u.role === r.name ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input id="uEmail" class="form-control" value="${esc(u.email || '')}">
      </div>

      <div class="form-group">
        <label>Contact Number</label>
        <input id="uContact" class="form-control" value="${esc(u.contact || '')}">
      </div>

      <div class="form-group span-2">
        <label>Status</label>
        <select id="uStatus" class="form-control">
          <option ${u.status === 'Active' ? 'selected' : ''}>Active</option>
          <option ${u.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      </div>
    </div>
    `,
    'saveUser'
  ); 
}

function saveUser() { 
  const id = val('uId'); 
  const d = getStore('users'); 

  if (id) { 
    const u = d.find(x => String(x.id) === id); 
    Object.assign(u, {
      fullName: val('uFull'),
      username: val('uUser'),
      role: val('uRole'),
      email: val('uEmail'),
      contact: val('uContact'),
      status: val('uStatus')
    }); 
  } else {
    d.push({
      id: nextId(d),
      fullName: val('uFull'),
      username: val('uUser'),
      role: val('uRole'),
      email: val('uEmail'),
      contact: val('uContact'),
      status: val('uStatus')
    }); 
  }

  setStore('users', d); 
  closeModal(); 
  logAction('Saved system user', val('uUser')); 
  showToast('User saved.'); 
  initUsers(); 
}

function initRoles() { 
  shell(
    'roles',
    'Roles & Permissions',
    'Define role-based access control so unauthorized users cannot access restricted modules.',
    `
    <div class="table-wrap">
      <div class="table-toolbar">
        <input id="rolesSearch" class="form-control search" placeholder="Search roles..." oninput="renderRoles()">
        <button class="primary-btn" onclick="openRoleModal()">+ Add Role</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Users</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody id="rolesBody"></tbody>
      </table>
    </div>

    <br>

    <section class="card">
      <h2>Permissions Matrix</h2>
      ${permissionsMatrix()}
    </section>
    `
  ); 

  renderRoles(); 
}

function renderRoles() { 
  const d = getStore('roles'); 

  $('rolesBody').innerHTML = d.map(r => `
    <tr>
      <td><b>${esc(r.name)}</b></td>
      <td>${esc(r.description)}</td>
      <td><small>${esc((r.permissions || []).join(', '))}</small></td>
      <td>${r.users || 0}</td>
      <td>${badge(r.status)}</td>
      <td class="inline-actions">
        <button class="action-btn" onclick="openRoleModal(${r.id})">Edit</button>
        <button class="action-btn danger-btn" onclick="toggleStatus('roles',${r.id},initRoles)">Activate/Deactivate</button>
      </td>
    </tr>
  `).join(''); 
}

function openRoleModal(id) { 
  const r = id ? getStore('roles').find(x => x.id === id) : {permissions:[]}; 
  const perms = ['Dashboard','Residents','Beneficiaries','Claims','Programs','Reports','Blockchain','Master Data','User Management','Audit Logs','Settings']; 

  modal(
    id ? 'Edit Role' : 'Add Role',
    `
    <input type="hidden" id="roleId" value="${id || ''}">

    <div class="form-group">
      <label>Role Name</label>
      <input id="roleName" class="form-control" value="${esc(r.name || '')}">
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea id="roleDesc" class="form-control" rows="3">${esc(r.description || '')}</textarea>
    </div>

    <div class="form-group">
      <label>Permissions</label>
      <div class="permission-grid">
        ${perms.map(p => `
          <label>
            <input type="checkbox" class="perm" value="${esc(p)}" ${(r.permissions || []).includes(p) ? 'checked' : ''}> ${esc(p)}
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label>Status</label>
      <select id="roleStatus" class="form-control">
        <option ${r.status === 'Active' ? 'selected' : ''}>Active</option>
        <option ${r.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
      </select>
    </div>
    `,
    'saveRole'
  ); 
}

function saveRole() { 
  const id = val('roleId'); 
  const d = getStore('roles'); 

  const rec = {
    name: val('roleName'),
    description: val('roleDesc'),
    status: val('roleStatus'),
    permissions: [...document.querySelectorAll('.perm:checked')].map(x => x.value)
  }; 

  if (id) {
    Object.assign(d.find(x => String(x.id) === id), rec);
  } else {
    d.push({
      id: nextId(d),
      users: 0,
      ...rec
    });
  }

  setStore('roles', d); 
  closeModal(); 
  logAction('Saved role', rec.name); 
  showToast('Role saved.'); 
  initRoles(); 
}

function permissionsMatrix() { 
  const rows = [
    ['Dashboard','✅','✅','✅','✅','✅'],
    ['Residents','✅','✅','✅','✅','👁️'],
    ['Beneficiaries','✅','✅','✅','❌','👁️'],
    ['Claims','✅','✅','✅','❌','👁️'],
    ['Programs','✅','✅','👁️','❌','👁️'],
    ['Reports','✅','✅','👁️','❌','✅'],
    ['Blockchain','✅','👁️','❌','❌','✅'],
    ['Audit Logs','✅','👁️','❌','❌','✅'],
    ['Settings','✅','❌','❌','❌','❌']
  ]; 

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Module</th>
          <th>SA</th>
          <th>Admin</th>
          <th>SW</th>
          <th>Encoder</th>
          <th>Auditor</th>
        </tr>
      </thead>

      <tbody>
        ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `; 
}

function initAudit() { 
  shell(
    'audit',
    'Audit Logs',
    'Record who performed an action, what changed, affected record, date, and IP address.',
    tablePage(
      'audit',
      'Audit Trail',
      'confirmInfo("Audit Export","Audit logs export placeholder is ready for backend integration.")',
      ['User','Action','Affected Record','Date','IP Address'],
      getStore('audit').map(x => `
        <tr>
          <td>${esc(x.user)}</td>
          <td>${esc(x.action)}</td>
          <td>${esc(x.record)}</td>
          <td>${esc(x.date)}</td>
          <td>${esc(x.ip)}</td>
          <td></td>
        </tr>
      `).join(''),
      'Export Logs'
    )
  ); 
}

function initSettings() {
  shell(
    'settings',
    'System Settings',
    'Configure general information, database, fingerprint scanner, blockchain, backup/restore, and notifications.',
    `
    <div class="tabs">
      ${['General','Database','Fingerprint Scanner','Blockchain','Backup & Restore','Notifications'].map((t, i) => `
        <button class="tab ${i == 0 ? 'active' : ''}" onclick="switchTab(${i})">${t}</button>
      `).join('')}
    </div>

    <section class="settings-panel active card">${settingsGeneral()}</section>
    <section class="settings-panel card">${settingsDatabase()}</section>
    <section class="settings-panel card">${settingsFingerprint()}</section>
    <section class="settings-panel card">${settingsBlockchain()}</section>
    <section class="settings-panel card">${settingsBackup()}</section>
    <section class="settings-panel card">${settingsNotifications()}</section>
    `
  );
}

function switchTab(i) { 
  document.querySelectorAll('.tab').forEach((t, idx) => t.classList.toggle('active', idx === i)); 
  document.querySelectorAll('.settings-panel').forEach((p, idx) => p.classList.toggle('active', idx === i));
}

function settingsGeneral() {
  return `
    <h2>General</h2>

    <div class="form-grid two">
      <div class="form-group">
        <label>Municipality Name</label>
        <input class="form-control" value="San Juan, Southern Leyte">
      </div>

      <div class="form-group">
        <label>System Name</label>
        <input class="form-control" value="MSWD Socio-Demographic Information System">
      </div>

      <div class="form-group span-2">
        <label>Office Name</label>
        <input class="form-control" value="Municipal Social Welfare and Development Office">
      </div>
    </div>

    <button class="primary-btn" onclick="showToast('General settings saved.')">Save General Settings</button>
  `;
}

function settingsDatabase() {
  return `
    <h2>Database Configuration</h2>

    <div class="form-grid two">
      <div class="form-group">
        <label>Database Type</label>
        <select class="form-control">
          <option>MySQL / MariaDB</option>
        </select>
      </div>

      <div class="form-group">
        <label>Host</label>
        <input class="form-control" value="localhost">
      </div>

      <div class="form-group">
        <label>Port</label>
        <input class="form-control" value="3306">
      </div>

      <div class="form-group">
        <label>Database</label>
        <input class="form-control" value="mswd_db">
      </div>

      <div class="form-group">
        <label>Username</label>
        <input class="form-control" value="root">
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control" placeholder="XAMPP default is empty">
      </div>
    </div>

    <button class="primary-btn" onclick="confirmInfo('Connection Test','Database is connected through db.js and main.js.')">Test Connection</button>
  `;
}

function settingsFingerprint() {
  return `
    <h2>Fingerprint Scanner</h2>

    <div class="form-grid two">
      <div class="form-group">
        <label>Scanner Name</label>
        <input class="form-control" value="DigitalPersona U.are.U 4500">
      </div>

      <div class="form-group">
        <label>Status</label>
        <select class="form-control">
          <option>Ready</option>
          <option>Disconnected</option>
          <option>Driver Missing</option>
        </select>
      </div>
    </div>

    <button class="primary-btn" onclick="confirmInfo('Scanner Test','Demo scanner status: Ready. SDK integration will be connected later.')">Test Scanner</button>
  `;
}

function settingsBlockchain() {
  return `
    <h2>Blockchain</h2>

    <div class="form-grid two">
      <div class="form-group">
        <label>Enable Blockchain</label>
        <select class="form-control">
          <option>Enabled</option>
          <option>Disabled</option>
        </select>
      </div>

      <div class="form-group">
        <label>Blockchain Node Status</label>
        <input class="form-control" value="Local Private Node - Demo">
      </div>
    </div>

    <button class="primary-btn" onclick="runIntegrityCheck()">Verify Node</button>
  `;
}

function settingsBackup() {
  return `
    <h2>Backup Manager</h2>
    <p class="page-subtitle">Backup database, restore backup, and schedule automatic daily backup.</p>

    <button class="primary-btn" onclick="showToast('Backup created successfully. Demo mode.')">Backup Now</button>
    <button class="outline-btn" onclick="showToast('Restore backup placeholder clicked.')">Restore Backup</button>
    <button class="outline-btn" onclick="showToast('Automatic daily backup enabled.')">Enable Automatic Daily Backup</button>
  `;
}

function settingsNotifications() {
  return `
    <h2>Notifications</h2>

    <div class="notification-list">
      ${getStore('notifications').map(n => `
        <div class="note ${n.type}">
          <b>${esc(n.title)}</b><br>
          <span class="helper">${esc(n.message)}</span>
        </div>
      `).join('')}
    </div>

    <br>

    <button class="primary-btn" onclick="openNotificationModal()">Add Notification</button>
  `;
}

function openNotificationModal() { 
  modal(
    'Add Notification',
    `
    <div class="form-group">
      <label>Type</label>
      <select id="nType" class="form-control">
        <option>warning</option>
        <option>danger</option>
        <option>success</option>
      </select>
    </div>

    <div class="form-group">
      <label>Title</label>
      <input id="nTitle" class="form-control">
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea id="nMessage" class="form-control" rows="3"></textarea>
    </div>
    `,
    'saveNotification'
  );
}

function saveNotification() {
  const d = getStore('notifications'); 

  d.unshift({
    id: nextId(d),
    type: val('nType'),
    title: val('nTitle'),
    message: val('nMessage')
  }); 

  setStore('notifications', d); 
  closeModal(); 
  showToast('Notification added.'); 

  if (document.body.dataset.page === 'settings') initSettings();
}

function tablePage(key, title, openFn, headers, rows, buttonText) { 
  return `
    <div class="table-wrap">
      <div class="table-toolbar">
        <h2 style="margin:0">${title}</h2>
        <button class="primary-btn" onclick="${openFn}">${buttonText || '+ Add Record'}</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          ${rows || `<tr><td colspan="${headers.length + 1}" class="empty-table">No records found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `; 
}

function deleteGeneric(key, id, cb) { 
  setStore(key, getStore(key).filter(x => x.id !== id)); 
  logAction('Deleted record', key + ' #' + id); 
  showToast('Record deleted.'); 
  cb && cb(); 
}

function toggleStatus(key, id, cb) { 
  const d = getStore(key);
  const r = d.find(x => x.id === id); 
  r.status = r.status === 'Active' ? 'Inactive' : 'Active'; 
  setStore(key, d); 
  logAction('Toggled status', key + ' #' + id); 
  showToast('Status updated.'); 
  cb && cb(); 
}

const page = document.body.dataset.page;

document.addEventListener('DOMContentLoaded', () => {
  const map = {
    welcome: initWelcome,
    login: initLogin,
    dashboard: initDashboard,
    residents: initResidents,
    'add-resident': initAddResident,
    'resident-profile': initResidentProfile,
    beneficiaries: initBeneficiaries,
    programs: initPrograms,
    claims: initClaims,
    blockchain: initBlockchain,
    reports: initReports,
    categories: initCategories,
    barangays: initBarangays,
    'system-users': initUsers,
    roles: initRoles,
    audit: initAudit,
    settings: initSettings
  };

  (map[page] || initWelcome)();
});