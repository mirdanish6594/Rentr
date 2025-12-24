import { http, HttpResponse, delay } from 'msw'

// --- 1. LOCAL STORAGE HELPERS ---
const loadData = (key, defaultData) => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- 2. DATA GENERATOR ---
const generateMockJobs = () => {
  const jobTypes = [
    { type: 'Plumbing', titles: ['Fix Leaking Kitchen Sink', 'Replace Bathroom Faucet', 'Unclog Main Drain', 'Install Water Heater'] },
    { type: 'Electrical', titles: ['Install Ceiling Fan', 'Replace Circuit Breaker', 'Install Outdoor Lighting', 'Fix Flickering Lights'] },
    { type: 'Carpentry', titles: ['Repair Drywall', 'Build Custom Shelves', 'Fix Door Frame', 'Install Baseboards'] },
    { type: 'HVAC', titles: ['AC Maintenance Service', 'Fix Heating Unit', 'Clean Air Ducts', 'Thermostat Installation'] }
  ];

  return Array.from({ length: 25 }).map((_, i) => {
    const category = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const title = category.titles[Math.floor(Math.random() * category.titles.length)];
    
    return {
      id: i + 1,
      title: title,
      type: category.type,
      description: 'Standard maintenance work required. Please provide a quote for labor and materials.',
      budget: Math.floor(Math.random() * 500) + 100,
      status: 'Open',
      applicants: [],
      assignedTo: null,
      invoice: null
    };
  });
};

const MOCK_CONTRACTORS = [
  { id: 101, name: "Agent Smith", role: "General Contractor", rating: 4.9, jobsCompleted: 42, bio: "Specialist in residential plumbing.", history: [] },
  { id: 102, name: "Bob the Builder", role: "Carpenter", rating: 4.7, jobsCompleted: 128, bio: "Master carpenter.", history: [] },
];

// --- 3. HANDLERS ---
export const handlers = [
  // GET Jobs
  http.get('/api/jobs', async () => {
    await delay(300);
    return HttpResponse.json(loadData('rentr_jobs', generateMockJobs()));
  }),

  // GET Profile
  http.get('/api/contractors/:id', async ({ params }) => {
    await delay(200);
    const contractor = MOCK_CONTRACTORS.find(c => c.id === Number(params.id)) || {
      id: Number(params.id), name: "Contractor", role: "General Specialist", rating: 4.5, jobsCompleted: 10, bio: "Dynamically generated profile.", history: []
    };
    return HttpResponse.json(contractor);
  }),

  // POST Create Job
  http.post('/api/jobs', async ({ request }) => {
    await delay(500);
    const newJob = await request.json();
    const jobs = loadData('rentr_jobs', []);
    jobs.unshift({ ...newJob, id: Date.now(), status: 'Open', applicants: [], invoice: null });
    saveData('rentr_jobs', jobs);
    return HttpResponse.json({ success: true });
  }),

  // POST Apply
  http.post('/api/jobs/:id/apply', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const body = await request.json();
    const jobs = loadData('rentr_jobs', []);
    const job = jobs.find(j => j.id === Number(id));

    if (job) {
      job.applicants.push({
        id: Date.now(),
        contractorId: 101, // Mock linking
        name: body.contractorName,
        rating: 4.8,
        bid: body.bid,
        proposal: body.proposal,
        date: new Date().toISOString()
      });
      saveData('rentr_jobs', jobs);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // POST Assign
  http.post('/api/jobs/:id/assign', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const { contractorName } = await request.json();
    const jobs = loadData('rentr_jobs', []);
    const job = jobs.find(j => j.id === Number(id));
    
    if (job) {
      job.status = 'Assigned';
      job.assignedTo = contractorName;
      saveData('rentr_jobs', jobs);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // POST Status Update (Start/Complete)
  http.post('/api/jobs/:id/status', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const { status } = await request.json(); // e.g., 'In Progress' or 'Completed'
    const jobs = loadData('rentr_jobs', []);
    const job = jobs.find(j => j.id === Number(id));

    if (job) {
      job.status = status;
      saveData('rentr_jobs', jobs);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // POST Invoice
  http.post('/api/jobs/:id/invoice', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const invoice = await request.json();
    const jobs = loadData('rentr_jobs', []);
    const job = jobs.find(j => j.id === Number(id));
    
    if (job) {
      job.status = 'Invoiced';
      job.invoice = { ...invoice, id: `INV-${Date.now().toString().slice(-6)}` };
      saveData('rentr_jobs', jobs);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // PUT Update Job (Edit)
  http.put('/api/jobs/:id', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const updates = await request.json();
    const jobs = loadData('rentr_jobs', []);
    const jobIndex = jobs.findIndex(j => j.id === Number(id));

    if (jobIndex > -1) {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updates }; // Merge updates
      saveData('rentr_jobs', jobs);
      return HttpResponse.json(jobs[jobIndex]);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // POST Pay
  http.post('/api/jobs/:id/pay', async ({ params }) => {
    await delay(500);
    const { id } = params;
    const jobs = loadData('rentr_jobs', []);
    const job = jobs.find(j => j.id === Number(id));
    if (job) {
      job.status = 'Paid';
      saveData('rentr_jobs', jobs);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  })
];