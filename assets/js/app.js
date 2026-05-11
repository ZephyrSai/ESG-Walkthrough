/* Main app — loads data, renders sections, hooks up interactivity. */

const State = {
  env: null, soc: null, gov: null, std: null, oecd: null,
  envFilter: 'all',
  walkthroughIndex: 0,
  activeCategory: null,
};

const WALKTHROUGH_STEPS = [
  {
    title: 'The ESG gap starts with fragmented evidence',
    short: 'Fragmented evidence',
    subtitle: 'Ratings, standards, consultants, and auditors all ask for evidence, but the source data lives across operations, documents, enterprise systems, and human review.',
    bullets: [
      'ESG programs usually fail at the evidence layer before they fail at the reporting layer.',
      'Energy data is important, but it is only one part of the evidence footprint.',
      'The real gap is connecting operational telemetry, policies, permits, invoices, supplier records, controls, and consultant assumptions into one usable model.'
    ],
    cta: 'Start with the ratings problem, then show the evidence gap.'
  },
  {
    title: 'We normalize ESG into auditable parameters',
    short: 'Normalize the ask',
    subtitle: 'Every disclosure requirement becomes a parameter with a unit, source, automation route, standard tag, confidence level, and review status.',
    bullets: [
      'The taxonomy gives consultants a working map instead of a pile of disconnected files.',
      'Parameters are grouped by E, S, and G but remain traceable down to line-item evidence.',
      'This makes it clear which data can be automated, which needs review, and which needs stakeholder input.'
    ],
    cta: 'Use the pillar cards as the consultant discovery map.'
  },
  {
    title: 'Our services capture data where it already exists',
    short: 'Capture at source',
    subtitle: 'We combine operational systems, smart automation, document intelligence, and enterprise integrations so evidence is collected before reporting season starts.',
    bullets: [
      'SCADA, IoT, and digital twins provide measured and computed operational evidence.',
      'AI document ingestion extracts compliance evidence from permits, certificates, supplier files, contracts, policies, invoices, and audit packs.',
      'ERP, HR, procurement, finance, maintenance, and governance systems bring non-energy evidence into the same model.'
    ],
    cta: 'Position the platform as ESG evidence automation, not an energy-only tool.'
  },
  {
    title: 'Consultants get a usable review workspace',
    short: 'Review and resolve',
    subtitle: 'Automation does not remove professional judgment. It gives consultants cleaner evidence, fewer manual chases, and a controlled path for exceptions.',
    bullets: [
      'High-confidence data can flow directly into calculation and disclosure workflows.',
      'Medium-confidence evidence is queued for review with source files, assumptions, and extraction context.',
      'Missing or qualitative evidence is surfaced as a gap, not hidden in a spreadsheet.'
    ],
    cta: 'Show the automation split as a controls and confidence story.'
  },
  {
    title: 'The output is a verified report pack',
    short: 'Report and assure',
    subtitle: 'The final value is an auditable data package that supports standards mapping, assurance review, and verified ESG reporting.',
    bullets: [
      'Each metric can be traced back to its system, document, calculation basis, and reviewer decision.',
      'Consultants can generate draft disclosures from usable data instead of rebuilding the evidence base manually.',
      'The report pack supports assurance because lineage, exceptions, and supporting files are preserved.'
    ],
    cta: 'End on verified reporting, not dashboards.'
  }
];

const CHART_INSIGHTS = {
  chart_sunburst: {
    kicker: 'OECD landscape',
    title: 'Metric coverage is uneven by topic',
    subtitle: 'Uneven topic coverage is one reason ESG ratings diverge before the underlying company performance is even interpreted.',
    bullets: [
      'Governance-heavy topics dominate the metric universe.',
      'Biodiversity, taxation, and competition receive far thinner metric coverage.',
      'When the market cannot agree on what to measure, companies need a transparent source taxonomy.'
    ]
  },
  chart_range: {
    kicker: 'Provider spread',
    title: 'The same topic can have a 100+ metric spread',
    subtitle: 'This is the clearest argument for standardizing the underlying data model.',
    bullets: [
      'Corporate governance ranges from a small set of metrics to a very broad one across providers.',
      'The average alone hides how inconsistent provider coverage can be.',
      'A source-level parameter model lets a customer support multiple ratings and standards without rebuilding data capture.'
    ]
  },
  chart_charMix: {
    kicker: 'Metric quality',
    title: 'Most metrics are still input-based',
    subtitle: 'Policies and activities dominate over directly measured outputs.',
    bullets: [
      'Input-heavy ESG creates room for narrative divergence.',
      'Output metrics are where telemetry, ERP, and documents can improve repeatability.',
      'The walkthrough should position automation as evidence depth, not just workflow efficiency.'
    ]
  },
  chart_paob: {
    kicker: 'Topic profile',
    title: 'Policies, activities, outputs, and context vary sharply',
    subtitle: 'This view is best used as a topic comparison, not a text-heavy chart.',
    bullets: [
      'Some topics are naturally evidence-heavy; others depend on policy and external context.',
      'Climate resilience needs business-environment context that cannot be solved by sensors alone.',
      'This supports a blended capture model instead of a single-source ESG platform claim.'
    ]
  },
  chart_qual: {
    kicker: 'Data type',
    title: 'Qualitative metrics still dominate ESG ratings',
    subtitle: 'Even operational topics retain a substantial qualitative layer.',
    bullets: [
      'Quantitative capture helps, but it does not replace disclosure judgment.',
      'AI document ingestion is important because ESG evidence often already exists in reports, certificates, contracts, and policies.',
      'The automation story should preserve a review layer where evidence is interpretive.'
    ]
  },
  chart_scatter: {
    kicker: 'Automation fit',
    title: 'Quantitative output topics cluster separately',
    subtitle: 'The top-right topics are the strongest fit for high automation.',
    bullets: [
      'GHG, energy, and pollution are easier to connect to measured or computed operational data.',
      'Biodiversity and climate resilience need more external and qualitative evidence.',
      'Automation level varies because each ESG topic depends on a different mix of source evidence.'
    ]
  },
  chart_supply: {
    kicker: 'Supply chain',
    title: 'Supply-chain metrics remain sparse',
    subtitle: 'Scope 3 carries most of the supply-chain burden.',
    bullets: [
      'Most ESG topics have very few explicit supply-chain metrics.',
      'Supplier documents, PCFs, procurement systems, and logistics records become the practical evidence layer.',
      'This is a strong place to show the role of AI documents plus ERP integration.'
    ]
  },
  chart_envDonut: {
    kicker: 'Environmental taxonomy',
    title: 'Environmental is weighted toward climate and GHG',
    subtitle: 'The chart summarizes the schema; detailed rows belong in the category drill-down.',
    bullets: [
      'Climate is the deepest category because it includes Scope 1, 2, 3, targets, transition planning, and risk.',
      'The remaining categories round out water, pollution, biodiversity, circularity, energy, and management systems.',
      'Category summaries keep the structure clear while preserving access to detailed line-item evidence.'
    ]
  },
  chart_envCapture: {
    kicker: 'Environmental capture',
    title: 'Environmental automation is multi-source',
    subtitle: 'No single capture method covers the whole environmental pillar.',
    bullets: [
      'SCADA and digital twin methods cover measured and computed operating data.',
      'AI documents and ERP handle invoices, certificates, procurement, spend, and narrative evidence.',
      'Manual inputs should stay visible for stakeholder or external-survey evidence.'
    ]
  },
  chart_envTree: {
    kicker: 'Environmental schema',
    title: 'The tree is a drill-down map, not a reading surface',
    subtitle: 'The page now keeps labels lighter and lets users inspect details through tooltips and modals.',
    bullets: [
      'The chart communicates breadth and structure quickly.',
      'Detailed parameter evidence remains available through the category cards.',
      'This keeps the visual schema readable while preserving audit-level traceability.'
    ]
  },
  chart_socDonut: {
    kicker: 'Social taxonomy',
    title: 'Social parameters are concentrated in workforce evidence',
    subtitle: 'HR and policy data dominate the social pillar.',
    bullets: [
      'Own workforce has the largest parameter set.',
      'Value-chain workers, communities, and consumers remain important but lighter in this dataset.',
      'The strongest capture paths are ERP/HRIS and AI document ingestion.'
    ]
  },
  chart_socTree: {
    kicker: 'Social schema',
    title: 'Social detail is better handled as guided drill-down',
    subtitle: 'The tree should communicate structure; the modal should carry the line-item detail.',
    bullets: [
      'The tree keeps the S1-S4 hierarchy visible.',
      'Detailed rows are searchable in the category modal.',
      'This prevents the main page from becoming a long compliance appendix.'
    ]
  },
  chart_govDonut: {
    kicker: 'Governance taxonomy',
    title: 'Governance is document and control-system heavy',
    subtitle: 'Governance data is less sensor-driven and more evidence-driven.',
    bullets: [
      'Board, ethics, risk, tax, lobbying, cyber, and AI governance are captured mainly through documents and enterprise systems.',
      'The automation claim should emphasize traceability and extraction accuracy.',
      'This supports the AI document ingestion and ERP parts of the stack.'
    ]
  },
  chart_govTree: {
    kicker: 'Governance schema',
    title: 'Governance detail needs clean evidence inspection',
    subtitle: 'Governance evidence is easier to understand when controls and documents are grouped into clear categories.',
    bullets: [
      'The tree gives structure, not exhaustive readability.',
      'Open category details to inspect controls, standards, and automation level.',
      'This makes governance feel operational rather than text-only.'
    ]
  },
  chart_autoLevel: {
    kicker: 'Coverage',
    title: 'Automation level is the core positioning metric',
    subtitle: 'This chart summarizes what the stack can automate versus what still needs review.',
    bullets: [
      'High automation should be treated as repeatable capture from source systems.',
      'Medium automation means structured evidence plus human validation.',
      'Low automation should be transparent because it usually depends on stakeholder input or third-party assessment.'
    ]
  },
  chart_captureFootprint: {
    kicker: 'Coverage',
    title: 'Capture footprint shows the implementation path',
    subtitle: 'This is the most practical chart for a technical buyer.',
    bullets: [
      'It shows which systems need to be integrated first.',
      'AI document ingestion is broad because ESG evidence is often already stored in unstructured files.',
      'SCADA and digital twin integrations make the environmental pillar more defensible.'
    ]
  },
  chart_heatmap: {
    kicker: 'Coverage',
    title: 'The heatmap should guide discovery, not overwhelm',
    subtitle: 'It helps identify where each capture method matters by category.',
    bullets: [
      'The heatmap prioritizes implementation workstreams by category and source system.',
      'High-intensity cells show where a method has the most parameter coverage.',
      'Exact counts are available through hover instead of being printed into every cell.'
    ]
  },
  chart_evidenceFlow: {
    kicker: 'Value bridge',
    title: 'Evidence becomes report-ready through a controlled service flow',
    subtitle: 'This is the clearest journey chart for presenting what we provide beyond energy monitoring.',
    bullets: [
      'Operational systems, documents, enterprise records, and consultant inputs all feed the same evidence layer.',
      'Smart automation extracts, computes, validates, and routes evidence instead of leaving consultants to rebuild it manually.',
      'The output is not just a dashboard: it is a standards-mapped, auditable report pack with lineage and review context.'
    ]
  }
};

(async function init() {
  try {
    const [env, soc, gov, std, oecd] = await Promise.all([
      fetch('data/environmental.json', { cache: 'no-store' }).then(r=>r.json()),
      fetch('data/social.json', { cache: 'no-store' }).then(r=>r.json()),
      fetch('data/governance.json', { cache: 'no-store' }).then(r=>r.json()),
      fetch('data/standards.json', { cache: 'no-store' }).then(r=>r.json()),
      fetch('data/oecd-findings.json', { cache: 'no-store' }).then(r=>r.json()),
    ]);
    State.env = env; State.soc = soc; State.gov = gov; State.std = std; State.oecd = oecd;
    renderAll();
    setupNav();
  } catch (e) {
    console.error('Failed to load data:', e);
    document.body.insertAdjacentHTML('afterbegin',
      '<div class="bg-red-500 text-white p-4">Failed to load data files. If you opened index.html directly via file://, please serve via a local HTTP server (e.g. `python3 -m http.server` in this directory) — browsers block fetch() from file://.</div>');
  }
})();

function renderAll() {
  renderOverview();
  renderSchemaExplorer();
  renderLandscape();
  renderPillar('env', State.env, '#10b981', '#envExplorer', '#envSummary', '#envKpi',
               '#chart_envDonut', '#chart_envCapture', '#chart_envTree');
  renderPillar('soc', State.soc, '#3b82f6', '#socExplorer', '#socSummary', null,
               '#chart_socDonut', null, '#chart_socTree');
  renderPillar('gov', State.gov, '#a855f7', '#govExplorer', '#govSummary', null,
               '#chart_govDonut', null, '#chart_govTree');
  renderCoverage();
  renderStandards();
  setupChartInsightButtons();
}

/* ============== OVERVIEW ============== */
function paramCount(schema) {
  let n = 0;
  schema.categories.forEach(c => c.subcategories.forEach(s => n += s.parameters.length));
  return n;
}
function countAuto(schema, level) {
  let n = 0;
  schema.categories.forEach(c => c.subcategories.forEach(s => s.parameters.forEach(p => { if(p.automation===level) n++; })));
  return n;
}
function countCapture(schema, method) {
  let n = 0;
  schema.categories.forEach(c => c.subcategories.forEach(s => s.parameters.forEach(p => { if(p.capture && p.capture.includes(method)) n++; })));
  return n;
}
function categoryCaptureTags(cat) {
  const tags = new Set();
  cat.subcategories.forEach(s => s.parameters.forEach(p => (p.capture || []).forEach(c => tags.add(c))));
  return [...tags].join(',');
}
function topCapture(params) {
  const labels = { scada:'SCADA', twin:'Twin', ai_doc:'AI Docs', erp:'ERP', manual:'Manual' };
  const counts = { scada:0, twin:0, ai_doc:0, erp:0, manual:0 };
  params.forEach(p => (p.capture || []).forEach(c => { if (c in counts) counts[c]++; }));
  const key = Object.keys(counts).sort((a,b) => counts[b] - counts[a])[0];
  return { key, label: labels[key], count: counts[key] };
}
function allParams(schemas) {
  const out = [];
  schemas.forEach(sch => sch.categories.forEach(c => c.subcategories.forEach(s => s.parameters.forEach(p => out.push({ ...p, _pillar: sch.code, _cat: c.id, _sub: s.id })))));
  return out;
}

function categoryMethodCounts(cat) {
  const counts = { scada:0, twin:0, ai_doc:0, erp:0, manual:0 };
  cat.subcategories.forEach(sub => sub.parameters.forEach(p => {
    (p.capture || []).forEach(c => { if (c in counts) counts[c]++; });
  }));
  return counts;
}

function methodLabel(key) {
  return ({ scada:'SCADA', twin:'Twin', ai_doc:'AI Docs', erp:'Enterprise', manual:'Review' })[key] || key;
}

function methodClass(key) {
  return ({ scada:'pill-scada', twin:'pill-twin', ai_doc:'pill-ai_doc', erp:'pill-erp', manual:'pill-manual' })[key] || '';
}

function renderOverview() {
  const envN = paramCount(State.env);
  const socN = paramCount(State.soc);
  const govN = paramCount(State.gov);
  document.getElementById('statEnv').textContent = envN;
  document.getElementById('statSoc').textContent = socN;
  document.getElementById('statGov').textContent = govN;
  document.getElementById('statStd').textContent = State.std.standards.length;

  const all = allParams([State.env, State.soc, State.gov]);
  const high = all.filter(p => p.automation === 'high').length;
  document.getElementById('statHigh').textContent = high + ' / ' + all.length;

  // Capture methods grid (uses env's capture_legend since same dict)
  const cm = State.env.capture_legend;
  const grid = document.getElementById('captureMethods');
  grid.innerHTML = Object.keys(cm).map(k => {
    const m = cm[k];
    return `<div class="capture-tile" style="border-color:${m.color}55">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" style="background:${m.color}"></span>
        <h4>${m.label}</h4>
      </div>
      <p>${m.desc}</p>
    </div>`;
  }).join('');

  renderCascade();
  renderEvidenceFlow('chart_evidenceFlow');
}

function renderCascade() {
  const shell = document.getElementById('cascadeSteps');
  if (!shell) return;
  shell.innerHTML = `<div class="cascade-rail">${WALKTHROUGH_STEPS.map((step, i) => `
    <button class="cascade-step ${i === State.walkthroughIndex ? 'active' : ''}" data-step="${i}">
      <span class="step-index">${String(i + 1).padStart(2, '0')}</span>
      <h3>${step.short}</h3>
      <p>${step.title}</p>
    </button>
  `).join('')}</div>`;
  shell.querySelectorAll('[data-step]').forEach(btn => {
    btn.addEventListener('click', () => openWalkthroughModal(Number(btn.dataset.step)));
  });
  document.getElementById('startWalkthrough')?.addEventListener('click', () => openWalkthroughModal(0));
}

/* ============== SCHEMA EXPLORER ============== */

function renderSchemaExplorer() {
  const schemas = [State.env, State.soc, State.gov];
  const all = allParams(schemas);
  const high = all.filter(p => p.automation === 'high').length;
  const med = all.filter(p => p.automation === 'medium').length;
  const low = all.filter(p => p.automation === 'low').length;
  const categories = schemas.flatMap(schema => schema.categories.map(cat => {
    const params = cat.subcategories.flatMap(sub => sub.parameters);
    const methodCounts = categoryMethodCounts(cat);
    const sortedMethods = Object.keys(methodCounts).sort((a,b) => methodCounts[b] - methodCounts[a]);
    return { schema, cat, params, methodCounts, sortedMethods };
  }));

  document.getElementById('schemaKpi').innerHTML = `
    <div class="stat-card"><div class="stat-num text-accent-500">${all.length}</div><div class="stat-label">Total parameters collected</div></div>
    <div class="stat-card"><div class="stat-num text-env">${paramCount(State.env)}</div><div class="stat-label">Environmental</div></div>
    <div class="stat-card"><div class="stat-num text-soc">${paramCount(State.soc)}</div><div class="stat-label">Social</div></div>
    <div class="stat-card"><div class="stat-num text-gov">${paramCount(State.gov)}</div><div class="stat-label">Governance</div></div>
  `;

  const colorByPillar = { E:'#10b981', S:'#3b82f6', G:'#a855f7' };
  document.getElementById('schemaExplorer').innerHTML = categories.map(({ schema, cat, params, methodCounts, sortedMethods }) => {
    const top = sortedMethods[0];
    const highCount = params.filter(p => p.automation === 'high').length;
    const methodBars = sortedMethods.map(m => {
      const pct = params.length ? Math.round(methodCounts[m] / params.length * 100) : 0;
      return `<div class="schema-method-row">
        <div><span class="pill ${methodClass(m)}">${methodLabel(m)}</span></div>
        <div class="schema-bar"><span style="width:${Math.min(100, pct)}%"></span></div>
        <strong>${methodCounts[m]}</strong>
      </div>`;
    }).join('');
    return `
      <div class="schema-card" data-schema-pillar="${schema.code}">
        <div class="schema-card-head">
          <div>
            <div class="cat-kicker"><span class="cat-dot" style="background:${colorByPillar[schema.code]}"></span>${schema.code} · ${cat.id}</div>
            <h3>${cat.name}</h3>
          </div>
          <span class="count-badge">${params.length}</span>
        </div>
        <p>${cat.description || cat.standard_anchor || ''}</p>
        <div class="schema-summary-row">
          <div><strong>${cat.subcategories.length}</strong><span>subcategories</span></div>
          <div><strong>${highCount}</strong><span>high automation</span></div>
          <div><strong>${methodLabel(top)}</strong><span>primary route</span></div>
        </div>
        <div class="schema-methods">${methodBars}</div>
        <button class="btn-subtle" data-open-schema-cat="${schema.code}:${cat.id}" type="button">Open parameters</button>
      </div>`;
  }).join('');

  document.querySelectorAll('[data-schema-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-schema-filter]').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.schemaFilter;
      document.querySelectorAll('#schemaExplorer .schema-card').forEach(card => {
        card.classList.toggle('is-hidden', !(filter === 'all' || card.dataset.schemaPillar === filter));
      });
    });
  });

  document.querySelectorAll('[data-open-schema-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [pillar, catId] = btn.dataset.openSchemaCat.split(':');
      const schema = schemas.find(s => s.code === pillar);
      const color = colorByPillar[pillar] || '#10b981';
      if (schema) openCategoryModal(schema, catId, color);
    });
  });
}

/* ============== LANDSCAPE ============== */

function renderLandscape() {
  const o = State.oecd;
  document.getElementById('headlineStats').innerHTML = o.headline_stats.map(s =>
    `<div class="stat-card"><div class="stat-num text-accent-500">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('');

  renderSunburst(o.topics);
  renderRange(o.topics);
  renderCharMix(o.metric_characteristic_overall);
  renderPAOB(o.topics);
  renderQual(o.topics);
  renderScatter(o.topics);
  renderSupply(o.supply_chain_metrics);

  document.getElementById('divergenceCallouts').innerHTML =
    o.divergence_callouts.map(c => `<div class="callout">⚠️ ${c}</div>`).join('');
}

/* ============== PILLAR EXPLORER ============== */

function renderPillar(prefix, schema, color, explorerSel, summarySel, kpiSel, donutSel, captureSel, treeSel) {
  if (summarySel) document.querySelector(summarySel).textContent = schema.summary;

  if (kpiSel) {
    const n = paramCount(schema);
    const high = countAuto(schema, 'high');
    const scadaN = countCapture(schema, 'scada');
    const aiN = countCapture(schema, 'ai_doc');
    document.querySelector(kpiSel).innerHTML = `
      <div class="stat-card"><div class="stat-num" style="color:${color}">${n}</div><div class="stat-label">Total parameters</div></div>
      <div class="stat-card"><div class="stat-num text-emerald-400">${high}</div><div class="stat-label">High automation</div></div>
      <div class="stat-card"><div class="stat-num text-sky-400">${scadaN}</div><div class="stat-label">Captured via SCADA</div></div>
      <div class="stat-card"><div class="stat-num text-emerald-300">${aiN}</div><div class="stat-label">Captured via AI doc ingest</div></div>
    `;
  }

  if (donutSel)   renderDonut(donutSel.slice(1), schema, color);
  if (treeSel)    renderPillarTree(treeSel.slice(1), schema, color);
  if (captureSel) {
    const counts = { scada: countCapture(schema,'scada'), twin: countCapture(schema,'twin'),
      ai_doc: countCapture(schema,'ai_doc'), erp: countCapture(schema,'erp'), manual: countCapture(schema,'manual') };
    renderCaptureBar(captureSel.slice(1), counts);
  }

  // Presentation-friendly category explorer
  const exp = document.querySelector(explorerSel);
  exp.innerHTML = schema.categories.map(cat => {
    const total = cat.subcategories.reduce((a,s)=>a+s.parameters.length,0);
    const params = cat.subcategories.flatMap(s => s.parameters);
    const high = params.filter(p => p.automation === 'high').length;
    const primaryCapture = topCapture(params);
    const shownSubs = cat.subcategories.slice(0, 5).map(sub =>
      `<span class="subcat-token">${sub.id} · ${sub.name}</span>`).join('');
    const extra = cat.subcategories.length > 5 ? `<span class="subcat-token">+${cat.subcategories.length - 5} more</span>` : '';
    return `
      <div class="cat-card" data-cat-id="${cat.id}" data-cat-capture="${categoryCaptureTags(cat)}">
        <div class="cat-head">
          <div>
            <div class="cat-kicker"><span class="cat-dot" style="background:${color}"></span>${cat.id}</div>
            <div class="cat-title">${cat.name}</div>
            <div class="cat-standard">${cat.standard_anchor || ''}</div>
          </div>
          <span class="count-badge">${total}</span>
        </div>
        <div class="cat-body">
          ${cat.description ? `<p class="cat-description">${cat.description}</p>` : ''}
          <div class="cat-metrics">
            <div>
              <div class="metric-chip"><strong>${total}</strong><span>parameters</span></div>
            </div>
            <div>
              <div class="metric-chip"><strong>${high}</strong><span>high automation</span></div>
            </div>
            <div>
              <div class="metric-chip"><strong>${primaryCapture.label}</strong><span>top capture path</span></div>
            </div>
          </div>
          <div class="subcat-list">${shownSubs}${extra}</div>
          <div class="cat-actions">
            <span class="filter-note">${cat.subcategories.length} subcategories</span>
            <button class="btn-subtle" data-open-cat="${cat.id}" type="button">Open parameter map</button>
          </div>
        </div>
      </div>`;
  }).join('');

  exp.querySelectorAll('[data-open-cat]').forEach(btn => {
    btn.addEventListener('click', () => openCategoryModal(schema, btn.dataset.openCat, color));
  });

  if (prefix === 'env') applyEnvFilter();
}

function renderParamRow(p, prefix) {
  const tags = (p.capture || []).map(c => `<span class="pill pill-${c}">${c}</span>`).join('');
  const autoTag = `<span class="pill auto-${p.automation}">${p.automation}</span>`;
  const searchText = [p.id, p.name, p.unit, p.desc, ...(p.standards || []), ...(p.capture || [])].join(' ').replace(/"/g, '&quot;');
  return `<div class="param-row" data-pid="${p.id}" data-pillar="${prefix}" data-capture="${(p.capture||[]).join(',')}" data-auto="${p.automation}" data-search="${searchText}">
    <div class="pid">${p.id}</div>
    <div>
      <div class="pname">${p.name}</div>
      <div class="pmeta">${p._subName ? p._subName + ' · ' : ''}${p.unit || 'No unit'} · click for standards and evidence path</div>
    </div>
    <div class="ptags">${tags}${autoTag}</div>
  </div>`;
}

function findParam(schema, id) {
  for (const cat of schema.categories)
    for (const sub of cat.subcategories)
      for (const p of sub.parameters)
        if (p.id === id) return p;
  return null;
}

/* ============== ENV FILTER ============== */

document.querySelectorAll('[data-env-filter]').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-env-filter]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    State.envFilter = b.dataset.envFilter;
    applyEnvFilter();
  });
});
function applyEnvFilter() {
  document.querySelectorAll('#envExplorer .cat-card').forEach(card => {
    const c = (card.dataset.catCapture || '').split(',');
    card.classList.toggle('is-hidden', !(State.envFilter === 'all' || c.includes(State.envFilter)));
  });
}

/* ============== MODAL ============== */

function openModal(p, schema) {
  document.getElementById('modalId').textContent = p.id;
  document.getElementById('modalName').textContent = p.name;
  const cm = State.env.capture_legend;
  const captureRows = (p.capture||[]).map(c => `<span class="pill pill-${c}">${c}</span> <span class="text-xs text-slate-300">${cm[c]?.label || c}</span>`).join('<br/>');
  const stdRows = (p.standards||[]).map(s => `<span class="pill" style="background:#1f2937; color:#d1d5db; border:1px solid #374151">${s}</span>`).join(' ');
  document.getElementById('modalBody').innerHTML = `
    <table>
      <tr><td>Unit</td><td><span class="font-mono text-emerald-300">${p.unit||'—'}</span></td></tr>
      <tr><td>Capture methods</td><td>${captureRows}</td></tr>
      <tr><td>Automation</td><td><span class="pill auto-${p.automation}">${p.automation}</span></td></tr>
      <tr><td>Standards</td><td class="leading-loose">${stdRows}</td></tr>
      <tr><td>Description</td><td class="text-slate-300 leading-relaxed">${p.desc||''}</td></tr>
    </table>
  `;
  document.getElementById('paramModal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('paramModal').classList.add('hidden');
}
window.closeModal = closeModal;
document.getElementById('paramModal').addEventListener('click', e => {
  if (e.target.id === 'paramModal') closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeCategoryModal();
    closeInsightModal();
    closeWalkthroughModal();
  }
});

/* ============== CATEGORY DRILL-DOWN ============== */

function openCategoryModal(schema, catId, color) {
  const cat = schema.categories.find(c => c.id === catId);
  if (!cat) return;
  State.activeCategory = { schema, catId, color };
  const params = cat.subcategories.flatMap(sub => sub.parameters.map(p => ({ ...p, _sub: sub.id, _subName: sub.name })));
  const high = params.filter(p => p.automation === 'high').length;
  const medium = params.filter(p => p.automation === 'medium').length;
  const low = params.filter(p => p.automation === 'low').length;

  document.getElementById('categoryModalKicker').textContent = `${schema.pillar} · ${cat.id}`;
  document.getElementById('categoryModalTitle').textContent = cat.name;
  document.getElementById('categoryModalSubtitle').textContent = cat.description || cat.standard_anchor || '';
  document.getElementById('categoryModalBody').innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="stat-card"><div class="stat-num" style="color:${color}">${params.length}</div><div class="stat-label">Parameters</div></div>
      <div class="stat-card"><div class="stat-num text-emerald-400">${high}</div><div class="stat-label">High automation</div></div>
      <div class="stat-card"><div class="stat-num text-amber-400">${medium}</div><div class="stat-label">Partial automation</div></div>
      <div class="stat-card"><div class="stat-num text-rose-400">${low}</div><div class="stat-label">Manual / qualitative</div></div>
    </div>
    <div class="parameter-toolbar">
      <input class="param-search" id="categoryParamSearch" type="search" placeholder="Search parameters, units, standards, or descriptions" />
      <button class="filter-btn active" data-param-filter="all">All</button>
      <button class="filter-btn" data-param-filter="high">High</button>
      <button class="filter-btn" data-param-filter="medium">Medium</button>
      <button class="filter-btn" data-param-filter="low">Low</button>
    </div>
    <div class="grid md:grid-cols-2 gap-3 mb-4">
      ${cat.subcategories.map(sub => `
        <div class="metric-chip">
          <strong>${sub.parameters.length}</strong>
          <span>${sub.id} · ${sub.name}</span>
        </div>
      `).join('')}
    </div>
    <div class="param-list" id="categoryParamList">
      ${params.map(p => renderParamRow(p, schema.code.toLowerCase())).join('')}
    </div>
  `;

  const modal = document.getElementById('categoryModal');
  modal.classList.remove('hidden');
  wireCategoryModalFilters();
  document.querySelectorAll('#categoryParamList .param-row').forEach(el => {
    el.addEventListener('click', () => {
      const p = findParam(schema, el.dataset.pid);
      if (p) openModal(p, schema);
    });
  });
}

function wireCategoryModalFilters() {
  let autoFilter = 'all';
  const search = document.getElementById('categoryParamSearch');
  const rows = () => [...document.querySelectorAll('#categoryParamList .param-row')];
  const apply = () => {
    const q = (search?.value || '').trim().toLowerCase();
    rows().forEach(row => {
      const matchesAuto = autoFilter === 'all' || row.dataset.auto === autoFilter;
      const matchesText = !q || (row.dataset.search || row.textContent).toLowerCase().includes(q);
      row.classList.toggle('is-hidden', !(matchesAuto && matchesText));
    });
  };
  search?.addEventListener('input', apply);
  document.querySelectorAll('[data-param-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-param-filter]').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      autoFilter = btn.dataset.paramFilter;
      apply();
    });
  });
}

function closeCategoryModal() {
  document.getElementById('categoryModal')?.classList.add('hidden');
}
window.closeCategoryModal = closeCategoryModal;
document.getElementById('categoryModal').addEventListener('click', e => {
  if (e.target.id === 'categoryModal') closeCategoryModal();
});

/* ============== CHART INSIGHTS ============== */

function setupChartInsightButtons() {
  Object.keys(CHART_INSIGHTS).forEach(id => {
    const chart = document.getElementById(id);
    const card = chart?.closest('.chart-card');
    if (!card || card.dataset.insightReady) return;
    card.dataset.insightReady = 'true';
    const tools = document.createElement('div');
    tools.className = 'chart-tools';
    tools.innerHTML = `<button class="btn-subtle" type="button" data-chart-insight="${id}">Explain this chart</button>`;
    const purpose = card.querySelector('.chart-purpose');
    const sub = card.querySelector('.chart-sub');
    if (purpose) purpose.insertAdjacentElement('afterend', tools);
    else if (sub) sub.insertAdjacentElement('afterend', tools);
    else card.insertAdjacentElement('afterbegin', tools);
    tools.querySelector('button').addEventListener('click', () => openInsightModal(id));
  });
}

function openInsightModal(id) {
  const insight = CHART_INSIGHTS[id];
  if (!insight) return;
  document.getElementById('insightModalKicker').textContent = insight.kicker || 'Chart insight';
  document.getElementById('insightModalTitle').textContent = insight.title;
  document.getElementById('insightModalSubtitle').textContent = insight.subtitle || '';
  document.getElementById('insightModalBody').innerHTML = `
    <div class="insight-grid">
      <ul class="insight-list">${insight.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="stat-card">
        <div class="stat-label">Why it matters</div>
        <div class="text-slate-200 text-sm leading-relaxed mt-3">
          The chart connects the market problem to the evidence model: inconsistent ESG metrics require traceable, reusable, and auditable source data.
        </div>
      </div>
    </div>
  `;
  document.getElementById('insightModal').classList.remove('hidden');
}

function closeInsightModal() {
  document.getElementById('insightModal')?.classList.add('hidden');
}
window.closeInsightModal = closeInsightModal;
document.getElementById('insightModal').addEventListener('click', e => {
  if (e.target.id === 'insightModal') closeInsightModal();
});

/* ============== GUIDED WALKTHROUGH ============== */

function openWalkthroughModal(index = 0) {
  State.walkthroughIndex = Math.max(0, Math.min(WALKTHROUGH_STEPS.length - 1, index));
  renderCascade();
  const step = WALKTHROUGH_STEPS[State.walkthroughIndex];
  document.getElementById('walkthroughModalKicker').textContent = `Step ${State.walkthroughIndex + 1} of ${WALKTHROUGH_STEPS.length}`;
  document.getElementById('walkthroughModalTitle').textContent = step.title;
  document.getElementById('walkthroughModalSubtitle').textContent = step.subtitle;
  document.getElementById('walkthroughModalBody').innerHTML = `
    <ul class="insight-list">${step.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    <div class="mt-4 stat-card">
      <div class="stat-label">Presentation move</div>
      <div class="text-slate-200 text-sm leading-relaxed mt-3">${step.cta}</div>
    </div>
  `;
  document.getElementById('walkthroughPrev').disabled = State.walkthroughIndex === 0;
  document.getElementById('walkthroughNext').textContent = State.walkthroughIndex === WALKTHROUGH_STEPS.length - 1 ? 'Finish' : 'Next';
  document.getElementById('walkthroughModal').classList.remove('hidden');
}

function closeWalkthroughModal() {
  document.getElementById('walkthroughModal')?.classList.add('hidden');
}
window.closeWalkthroughModal = closeWalkthroughModal;
document.getElementById('walkthroughModal').addEventListener('click', e => {
  if (e.target.id === 'walkthroughModal') closeWalkthroughModal();
});
document.getElementById('walkthroughPrev')?.addEventListener('click', () => openWalkthroughModal(State.walkthroughIndex - 1));
document.getElementById('walkthroughNext')?.addEventListener('click', () => {
  if (State.walkthroughIndex === WALKTHROUGH_STEPS.length - 1) closeWalkthroughModal();
  else openWalkthroughModal(State.walkthroughIndex + 1);
});

/* ============== COVERAGE ============== */

function renderCoverage() {
  const all = allParams([State.env, State.soc, State.gov]);
  const high = all.filter(p => p.automation === 'high').length;
  const med  = all.filter(p => p.automation === 'medium').length;
  const low  = all.filter(p => p.automation === 'low').length;

  const sc = all.filter(p => (p.capture||[]).includes('scada')).length;
  const tw = all.filter(p => (p.capture||[]).includes('twin')).length;
  const ai = all.filter(p => (p.capture||[]).includes('ai_doc')).length;
  const er = all.filter(p => (p.capture||[]).includes('erp')).length;
  const mn = all.filter(p => (p.capture||[]).includes('manual')).length;

  document.getElementById('coverageKpi').innerHTML = `
    <div class="stat-card"><div class="stat-num text-emerald-400">${high}</div><div class="stat-label">Parameters fully automatable</div></div>
    <div class="stat-card"><div class="stat-num text-amber-400">${med}</div><div class="stat-label">Partial automation (data + structured review)</div></div>
    <div class="stat-card"><div class="stat-num text-rose-400">${low}</div><div class="stat-label">Requires stakeholder / qualitative input</div></div>
  `;

  renderAutomationLevel('chart_autoLevel', { high, medium: med, low });
  renderCaptureBar('chart_captureFootprint', { scada:sc, twin:tw, ai_doc:ai, erp:er, manual:mn });

  // Heatmap: category × capture method
  const cats = [];
  [State.env, State.soc, State.gov].forEach(sch => sch.categories.forEach(c => cats.push({ id: c.id, name: c.name, pillar: sch.code, subs: c.subcategories })));
  const methods = ['scada','twin','ai_doc','erp','manual'];
  const labels  = ['SCADA','Twin','AI Docs','ERP','Manual'];
  const matrix = cats.map(c => methods.map(m => {
    let n = 0;
    c.subs.forEach(s => s.parameters.forEach(p => { if((p.capture||[]).includes(m)) n++; }));
    return n;
  }));
  renderHeatmap('chart_heatmap', matrix, cats.map(c => `${c.pillar}·${c.id} ${c.name}`), labels);
}

/* ============== STANDARDS ============== */

function renderStandards() {
  const g = document.getElementById('standardsGrid');
  g.innerHTML = State.std.standards.map(s => `
    <div class="std-card">
      <div class="code">${s.code} · ${s.pillar.join(' · ')}</div>
      <div class="name">${s.name}</div>
      <div class="text-xs text-slate-500 mt-1">Issuer: ${s.issuer}</div>
      <div class="scope">${s.scope}</div>
      <div class="status">${s.status}</div>
      <a href="${s.url}" target="_blank" rel="noopener" class="url">${s.url} ↗</a>
    </div>
  `).join('');
}

/* ============== NAV ============== */

function setupNav() {
  const pageIds = ['overview','schema','landscape','environmental','social','governance','coverage','standards'];
  const pages = pageIds.map(id => document.getElementById(id)).filter(Boolean);
  const links = document.querySelectorAll('[data-nav]');

  const showPage = (id, shouldScroll = true) => {
    const activeId = pageIds.includes(id) ? id : 'overview';
    pages.forEach(page => page.classList.toggle('active', page.id === activeId));
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + activeId));
    document.body.classList.add('js-ready');
    if (shouldScroll) window.scrollTo({ top: 0, behavior: 'auto' });
    window.setTimeout(() => window.resizeCharts?.(), 40);
  };

  // Mobile toggle
  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.toggle('hidden');
  });

  // Close mobile nav on link click
  document.querySelectorAll('#mobileNav a, .directory-card').forEach(a => {
    a.addEventListener('click', () => document.getElementById('mobileNav').classList.add('hidden'));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      const target = (link.getAttribute('href') || '#overview').replace('#', '');
      showPage(target);
    });
  });

  window.addEventListener('hashchange', () => {
    showPage((location.hash || '#overview').replace('#', ''));
  });

  showPage((location.hash || '#overview').replace('#', ''), true);
}
