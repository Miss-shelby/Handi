/**
 * Handi Protocol - Smart Contract & DApp Interactive Application Engine
 */

// Initial State Store
const state = {
  jobs: [
    {
      id: 101,
      title: "Solar Panel & Inverter Installation",
      desc: "Install a 5kW hybrid inverter and 8 rooftop solar panels for residential property.",
      finder: "G...3X9A (Client)",
      artisan: "G...8K2L (David M. - Solar Tech)",
      token: "XLM",
      amount: 450,
      status: "InProgress",
      deadline: "14 Days",
      category: "Electrical & Solar"
    },
    {
      id: 102,
      title: "Custom Oak Kitchen Cabinetry",
      desc: "Handcraft and fit custom solid oak cabinets with soft-close hinges.",
      finder: "G...9M1V (Client)",
      artisan: null,
      token: "XLM",
      amount: 800,
      status: "Open",
      deadline: "21 Days",
      category: "Carpentry & Joinery"
    },
    {
      id: 103,
      title: "Emergency Pipe Leak Repair & Valve Replacement",
      desc: "Fix main line water pipe pressure leak and replace corroded shutoff valves.",
      finder: "G...4B7N (Client)",
      artisan: "G...2P9Q (Sarah B. - Plumber)",
      token: "XLM",
      amount: 250,
      status: "Completed",
      deadline: "Delivered",
      category: "Plumbing Services"
    },
    {
      id: 104,
      title: "Smart Home HVAC System Maintenance",
      desc: "Inspect dual duct HVAC units, replace HEPA filters, and sync thermostat controller.",
      finder: "G...7L4W (Client)",
      artisan: "G...5X1D (Marcus C. - HVAC Tech)",
      token: "XLM",
      amount: 320,
      status: "Disputed",
      deadline: "Juror Review",
      category: "HVAC & Climate"
    }
  ],
  artisans: [
    {
      id: "art-1",
      name: "David Mensah",
      address: "G...8K2L",
      category: "Electrical & Renewable Energy",
      skills: ["Solar PV", "Inverters", "Wiring", "Battery Systems"],
      rating: "4.95 ★",
      verified: true,
      jobsDone: 28,
      avatar: "⚡"
    },
    {
      id: "art-2",
      name: "Sarah Bennett",
      address: "G...2P9Q",
      category: "Master Plumbing",
      skills: ["Pipe Fitting", "Drainage", "Water Heaters", "Leak Detection"],
      rating: "5.00 ★",
      verified: true,
      jobsDone: 42,
      avatar: "🔧"
    },
    {
      id: "art-3",
      name: "Marcus Chen",
      address: "G...5X1D",
      category: "HVAC & Refrigeration",
      skills: ["AC Repair", "Heat Pumps", "Ductwork", "Smart Thermostats"],
      rating: "4.88 ★",
      verified: true,
      jobsDone: 19,
      avatar: "❄️"
    },
    {
      id: "art-4",
      name: "Elena Rostova",
      address: "G...9W4K",
      category: "Custom Carpentry",
      skills: ["Custom Furniture", "Framing", "Cabinetry", "Decking"],
      rating: "4.92 ★",
      verified: false,
      jobsDone: 14,
      avatar: "🪵"
    }
  ],
  logs: []
};

// Console Logging helper
function appendLog(message, type = 'info') {
  const consoleBox = document.getElementById('consoleBox');
  if (!consoleBox) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`;
  
  consoleBox.appendChild(entry);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

// Render Jobs
function renderJobs() {
  const container = document.getElementById('jobGrid');
  if (!container) return;

  container.innerHTML = state.jobs.map(job => {
    let statusClass = `job-card status-${job.status.toLowerCase()}`;
    let badgeClass = `status-badge-${job.status.toLowerCase()}`;

    return `
      <div class="${statusClass}">
        <div class="job-top">
          <span class="job-id">#JOB-${job.id}</span>
          <span class="job-status-badge ${badgeClass}">${job.status}</span>
        </div>
        <div class="job-title">${job.title}</div>
        <div class="job-desc">${job.desc}</div>
        <div class="job-meta-row">
          <div class="job-budget">
            <span class="meta-label">Escrow Budget</span>
            <span class="budget-val">${job.amount} ${job.token}</span>
          </div>
          <div style="text-align: right;">
            <span class="meta-label">Assigned Artisan</span>
            <div style="font-size: 13px; font-weight: 600; color: #cbd5e1;">${job.artisan || 'Unassigned'}</div>
          </div>
        </div>
        <div class="job-actions">
          ${job.status === 'Open' ? `
            <button class="btn-primary" onclick="applyJob(${job.id})">Apply as Artisan</button>
          ` : ''}
          ${job.status === 'InProgress' ? `
            <button class="btn-primary" onclick="confirmDelivery(${job.id})">Confirm & Release</button>
            <button class="btn-outline" onclick="raiseDispute(${job.id})">Dispute</button>
          ` : ''}
          ${job.status === 'Completed' ? `
            <button class="btn-outline" disabled style="opacity: 0.6; cursor: default;">Escrow Released</button>
          ` : ''}
          ${job.status === 'Disputed' ? `
            <button class="btn-outline" onclick="resolveDisputeModal(${job.id})">Juror Arbitration</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Render Artisans
function renderArtisans() {
  const container = document.getElementById('artisanGrid');
  if (!container) return;

  container.innerHTML = state.artisans.map(artisan => `
    <div class="artisan-card">
      <div class="artisan-avatar">
        ${artisan.avatar}
        ${artisan.verified ? `<span class="artisan-verified-badge" title="Verified Curator Badge">✓</span>` : ''}
      </div>
      <div class="artisan-name">${artisan.name}</div>
      <div class="artisan-category">${artisan.category}</div>
      <div class="tag-list">
        ${artisan.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
        <span>Rating: <strong style="color: #f59e0b;">${artisan.rating}</strong></span>
        <span>Jobs Completed: <strong>${artisan.jobsDone}</strong></span>
      </div>
      <button class="btn-outline" style="width: 100%;" onclick="viewArtisanProfile('${artisan.id}')">
        ${artisan.verified ? 'View Verified Credential' : 'Approve Verification'}
      </button>
    </div>
  `).join('');
}

// Smart Contract Simulations
function applyJob(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;

  appendLog(`[Invoking] handi_market.wasm -> apply_for_job(env, artisan="G...8K2L", job_id=${jobId})`, 'info');
  setTimeout(() => {
    job.status = 'InProgress';
    job.artisan = "G...8K2L (David M.)";
    appendLog(`[Success] Event JobAssigned(id=${jobId}, artisan="G...8K2L"). Escrow state set to InProgress.`, 'success');
    renderJobs();
  }, 400);
}

function confirmDelivery(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;

  appendLog(`[Invoking] handi_market.wasm -> confirm_delivery(env, finder="Client", job_id=${jobId})`, 'info');
  setTimeout(() => {
    job.status = 'Completed';
    appendLog(`[Success] Transferring ${job.amount} XLM escrow to ${job.artisan}. Event DeliveryConfirmed(id=${jobId}).`, 'success');
    renderJobs();
    updateStats();
  }, 400);
}

function raiseDispute(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;

  appendLog(`[Invoking] handi_market.wasm -> raise_dispute(env, caller="Client", job_id=${jobId})`, 'error');
  setTimeout(() => {
    job.status = 'Disputed';
    appendLog(`[State Update] Job #${jobId} status -> Disputed. Juror arbitration initiated.`, 'info');
    renderJobs();
  }, 400);
}

function createJobFromModal() {
  const title = document.getElementById('newJobTitle').value;
  const amount = document.getElementById('newJobAmount').value;
  const desc = document.getElementById('newJobDesc').value;
  const category = document.getElementById('newJobCategory').value;

  if (!title || !amount) {
    alert("Please fill in Job Title and Escrow Amount.");
    return;
  }

  const newId = 100 + state.jobs.length + 1;
  const newJob = {
    id: newId,
    title: title,
    desc: desc || "Standard service request under Handi Protocol contract escrow.",
    finder: "G...3X9A (Client)",
    artisan: null,
    token: "XLM",
    amount: parseFloat(amount),
    status: "Open",
    deadline: "14 Days",
    category: category
  };

  appendLog(`[Invoking] handi_market.wasm -> create_job(finder="G...3X9A", token="XLM", amount=${amount})`, 'info');
  setTimeout(() => {
    state.jobs.unshift(newJob);
    appendLog(`[Success] Contract Created Job #${newId}. Locked ${amount} XLM in market contract storage.`, 'success');
    closeModal();
    renderJobs();
    updateStats();
  }, 350);
}

function updateStats() {
  const totalValue = state.jobs.reduce((acc, j) => acc + j.amount, 0);
  const activeJobs = state.jobs.filter(j => j.status !== 'Completed').length;
  
  document.getElementById('statTotalJobs').innerText = state.jobs.length;
  document.getElementById('statTotalEscrow').innerText = `${totalValue} XLM`;
  document.getElementById('statActiveJobs').innerText = activeJobs;
}

// Modal handling
function openModal() {
  document.getElementById('createJobModal').classList.add('active');
}

function closeModal() {
  document.getElementById('createJobModal').classList.remove('active');
}

// Tab navigation
document.addEventListener('DOMContentLoaded', () => {
  renderJobs();
  renderArtisans();
  updateStats();

  appendLog("Initialized Handi Protocol DApp Environment connected to Soroban Local Instance.", "success");
  appendLog("Contracts Loaded: [market: 0x9f...a4] | [registry: 0x3d...f8]", "info");

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(targetTab).classList.add('active');
    });
  });
});
