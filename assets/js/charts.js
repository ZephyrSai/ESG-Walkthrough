/* Charts module — wraps ECharts with our dark theme + helpers. */

const C = {
  env: '#10b981',
  soc: '#3b82f6',
  gov: '#a855f7',
  scada: '#0ea5e9',
  twin: '#6366f1',
  ai_doc: '#10b981',
  erp: '#f59e0b',
  manual: '#94a3b8',
  high: '#16a34a',
  medium: '#eab308',
  low: '#ef4444',
  ink900: '#0f1424',
  ink800: '#161c2e',
  ink700: '#212a40',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
};

const baseTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: C.slate200, fontFamily: 'Inter, sans-serif' },
};

const chartInstances = {};
function mountChart(id, opts) {
  const el = document.getElementById(id);
  if (!el) return;
  if (chartInstances[id]) chartInstances[id].dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });
  chart.setOption(Object.assign({}, baseTheme, opts));
  chartInstances[id] = chart;
  return chart;
}
window.addEventListener('resize', () => {
  Object.values(chartInstances).forEach(c => c.resize());
});
window.resizeCharts = () => {
  Object.values(chartInstances).forEach(c => c.resize());
};

function shortLabel(value, max = 24) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

/* ============== VALUE JOURNEY ============== */

function renderEvidenceFlow(elId) {
  mountChart(elId, {
    tooltip: {
      trigger: 'item',
      formatter: p => p.dataType === 'edge'
        ? `${p.data.source} → ${p.data.target}<br/><b>${p.data.value}</b> evidence paths`
        : `<b>${p.name}</b>`
    },
    series: [{
      type: 'sankey',
      left: 10,
      right: 18,
      top: 12,
      bottom: 12,
      nodeWidth: 16,
      nodeGap: 12,
      draggable: false,
      emphasis: { focus: 'adjacency' },
      label: {
        color: C.slate200,
        fontSize: 11,
        fontWeight: 600,
        overflow: 'truncate',
        width: 130,
      },
      itemStyle: {
        borderWidth: 0,
        borderRadius: 4,
      },
      lineStyle: {
        color: 'gradient',
        opacity: 0.28,
        curveness: 0.5,
      },
      data: [
        { name: 'Energy & operations', itemStyle: { color: C.scada } },
        { name: 'Compliance documents', itemStyle: { color: C.ai_doc } },
        { name: 'ERP / HR / finance', itemStyle: { color: C.erp } },
        { name: 'Governance controls', itemStyle: { color: C.gov } },
        { name: 'Consultant inputs', itemStyle: { color: C.manual } },
        { name: 'Automated extraction', itemStyle: { color: '#14b8a6' } },
        { name: 'Computed metrics', itemStyle: { color: C.twin } },
        { name: 'Review queue', itemStyle: { color: '#eab308' } },
        { name: 'Evidence registry', itemStyle: { color: '#22c55e' } },
        { name: 'Standards mapping', itemStyle: { color: '#60a5fa' } },
        { name: 'Verified report pack', itemStyle: { color: '#f8fafc' } },
      ],
      links: [
        { source: 'Energy & operations', target: 'Computed metrics', value: 22 },
        { source: 'Energy & operations', target: 'Evidence registry', value: 16 },
        { source: 'Compliance documents', target: 'Automated extraction', value: 26 },
        { source: 'ERP / HR / finance', target: 'Automated extraction', value: 18 },
        { source: 'ERP / HR / finance', target: 'Evidence registry', value: 14 },
        { source: 'Governance controls', target: 'Automated extraction', value: 12 },
        { source: 'Consultant inputs', target: 'Review queue', value: 10 },
        { source: 'Automated extraction', target: 'Review queue', value: 17 },
        { source: 'Automated extraction', target: 'Evidence registry', value: 31 },
        { source: 'Computed metrics', target: 'Evidence registry', value: 30 },
        { source: 'Review queue', target: 'Evidence registry', value: 22 },
        { source: 'Evidence registry', target: 'Standards mapping', value: 46 },
        { source: 'Standards mapping', target: 'Verified report pack', value: 46 },
      ],
    }]
  });
}

/* ============== LANDSCAPE FIGURES ============== */

function renderSunburst(topics) {
  const byPillar = { E: [], S: [], G: [] };
  topics.forEach(t => byPillar[t.pillar].push({
    name: t.name,
    value: t.total,
    itemStyle: { color: pillarColor(t.pillar, t.total) },
  }));

  const data = [
    { name: 'Environment', value: sum(topics.filter(t=>t.pillar==='E').map(t=>t.total)),
      children: byPillar.E,
      itemStyle: { color: C.env } },
    { name: 'Social',      value: sum(topics.filter(t=>t.pillar==='S').map(t=>t.total)),
      children: byPillar.S,
      itemStyle: { color: C.soc } },
    { name: 'Governance',  value: sum(topics.filter(t=>t.pillar==='G').map(t=>t.total)),
      children: byPillar.G,
      itemStyle: { color: C.gov } },
  ];

  mountChart('chart_sunburst', {
    tooltip: { formatter: p => `<b>${p.name}</b><br/>${p.value} metrics` },
    series: [{
      type: 'sunburst',
      radius: ['18%', '90%'],
      data,
      label: { show: false },
      itemStyle: { borderColor: C.ink900, borderWidth: 2 },
      levels: [
        {},
        { r0: '18%', r: '45%', label: { show: false } },
        { r0: '45%', r: '90%', label: { show: false } },
      ],
      emphasis: { focus: 'ancestor' },
    }],
  });
}
function pillarColor(p, total) {
  const base = p === 'E' ? [16,185,129] : p === 'S' ? [59,130,246] : [168,85,247];
  const intensity = Math.min(1, total / 280);
  const a = 0.45 + intensity * 0.5;
  return `rgba(${base.join(',')},${a})`;
}
function sum(arr){ return arr.reduce((a,b)=>a+b,0); }

function renderRange(topics) {
  const sorted = [...topics].sort((a,b) => b.max - a.max);
  mountChart('chart_range', {
    grid: { left: 160, right: 24, top: 16, bottom: 30 },
    xAxis: { type: 'value', max: 130, splitLine: { lineStyle: { color: C.ink700 } },
      axisLabel: { color: C.slate400, hideOverlap: true } },
    yAxis: { type: 'category', data: sorted.map(t=>t.name),
      axisLabel: { color: C.slate200, fontSize: 11, formatter: v => shortLabel(v, 28) }, axisTick: { show: false }, axisLine: { lineStyle:{color:C.ink700}} },
    tooltip: { trigger: 'item', formatter: p => {
      const t = sorted[p.dataIndex];
      return `<b>${t.name}</b><br/>min ${t.min} · avg ${t.avg} · max ${t.max}<br/>total ${t.total} across 8 products`;
    }},
    series: [
      { name: 'range', type: 'custom',
        renderItem: function(params, api) {
          const cat = api.value(0); const min = api.value(1); const max = api.value(2);
          const p1 = api.coord([min, cat]); const p2 = api.coord([max, cat]);
          return {
            type:'group',
            children: [
              { type:'rect', shape: { x: p1[0], y: p1[1]-4, width: p2[0]-p1[0], height: 8 },
                style: { fill: pillarColor(sorted[cat].pillar, sorted[cat].total), opacity: 0.55 } },
            ]
          };
        },
        encode: { x: [1,2], y: 0 },
        data: sorted.map((t,i)=>[i, t.min, t.max]),
      },
      { type:'scatter', symbolSize: 10,
        data: sorted.map((t,i)=>({ value:[t.avg, i],
          itemStyle:{ color: pillarColor(t.pillar, t.total), borderColor:'#fff', borderWidth:1 }})),
        tooltip: { show: false },
      }
    ]
  });
}

function renderCharMix(mix) {
  mountChart('chart_charMix', {
    tooltip: { trigger:'item', formatter: '{b}: {c}%' },
    legend: { textStyle: { color: C.slate200, fontSize: 11 }, bottom: 0, itemWidth: 10, itemHeight: 10 },
    series: [{
      type:'pie', radius:['55%','85%'],
      label: { show: false },
      emphasis: { scale: true, label: { show: false } },
      data: [
        { name:'Activities',  value: mix.Activities,  itemStyle:{color:'#10b981'} },
        { name:'Outputs',     value: mix.Outputs,     itemStyle:{color:'#0ea5e9'} },
        { name:'Policies',    value: mix.Policies,    itemStyle:{color:'#6366f1'} },
        { name:'Business env',value: mix.BusinessEnv, itemStyle:{color:'#f59e0b'} },
      ]
    }]
  });
}

function renderPAOB(topics) {
  // stacked bar per topic of policies/activities/outputs/businessEnv (share)
  const sorted = [...topics].sort((a,b) => {
    const order = ['E','S','G']; return order.indexOf(a.pillar) - order.indexOf(b.pillar) || a.name.localeCompare(b.name);
  });
  const series = ['policies','activities','outputs','businessEnv'].map((k,i) => ({
    name: ['Policies','Activities','Outputs','Business env'][i],
    type:'bar', stack:'t',
    data: sorted.map(t => {
      const tot = t.policies + t.activities + t.outputs + t.businessEnv;
      return tot ? +(t[k] / tot * 100).toFixed(1) : 0;
    }),
    itemStyle: { color: ['#6366f1','#10b981','#0ea5e9','#f59e0b'][i] },
    emphasis: { focus:'series' },
  }));
  mountChart('chart_paob', {
    tooltip: { trigger:'axis', axisPointer: { type:'shadow' }, valueFormatter: v=>v+'%' },
    legend: { textStyle: { color: C.slate200, fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 10, itemGap: 10 },
    grid: { left: 150, right: 24, top: 30, bottom: 20 },
    xAxis: { type:'value', max:100, axisLabel:{color:C.slate400, formatter:'{value}%', hideOverlap: true},
      splitLine:{lineStyle:{color:C.ink700}} },
    yAxis: { type:'category', data: sorted.map(t=>t.name),
      axisLabel: { color: C.slate200, fontSize: 10, formatter: v => shortLabel(v, 26) }, axisTick:{show:false}, axisLine:{lineStyle:{color:C.ink700}} },
    series,
  });
}

function renderQual(topics) {
  const sorted = [...topics].sort((a,b) => {
    const order = ['E','S','G']; return order.indexOf(a.pillar) - order.indexOf(b.pillar) || (b.quant - a.quant);
  });
  mountChart('chart_qual', {
    tooltip: { trigger:'axis', axisPointer:{type:'shadow'}, valueFormatter: v=>v+'%' },
    legend: { textStyle: { color: C.slate200, fontSize: 10 }, top:0, itemWidth: 10, itemHeight: 10, itemGap: 12 },
    grid: { left: 150, right: 24, top: 30, bottom: 20 },
    xAxis: { type:'value', max:100, axisLabel:{color:C.slate400, formatter:'{value}%', hideOverlap: true},
      splitLine:{lineStyle:{color:C.ink700}} },
    yAxis: { type:'category', data: sorted.map(t=>t.name),
      axisLabel: { color: C.slate200, fontSize: 10, formatter: v => shortLabel(v, 26) }, axisTick:{show:false}, axisLine:{lineStyle:{color:C.ink700}} },
    series: [
      { name:'Quantitative', type:'bar', stack:'q', itemStyle:{color:'#10b981'},
        data: sorted.map(t => { const tot = t.qual+t.quant; return tot? +(t.quant/tot*100).toFixed(1):0; }) },
      { name:'Qualitative',  type:'bar', stack:'q', itemStyle:{color:'#475569'},
        data: sorted.map(t => { const tot = t.qual+t.quant; return tot? +(t.qual/tot*100).toFixed(1):0; }) },
    ]
  });
}

function renderScatter(topics) {
  const data = topics.map(t => {
    const tot = t.qual + t.quant; const tpo = t.policies+t.activities+t.outputs+t.businessEnv;
    return {
      name: t.name,
      value: [
        tot? +(t.quant/tot*100).toFixed(1):0,
        tpo? +(t.outputs/tpo*100).toFixed(1):0,
        t.total,
      ],
      itemStyle: { color: t.pillar==='E'?C.env: t.pillar==='S'?C.soc:C.gov, opacity:0.8 },
    };
  });
  mountChart('chart_scatter', {
    tooltip: { formatter: p => `<b>${p.name}</b><br/>quant ${p.value[0]}% · output ${p.value[1]}%<br/>${p.value[2]} metrics total` },
    grid: { left: 50, right: 24, top: 16, bottom: 40 },
    xAxis: { name:'% quantitative', nameLocation:'middle', nameGap: 28, min:0, max:60,
      axisLabel:{color:C.slate400, formatter:'{value}%', hideOverlap: true}, splitLine:{lineStyle:{color:C.ink700}},
      nameTextStyle:{color:C.slate400} },
    yAxis: { name:'% output-based', nameLocation:'middle', nameGap: 36, min:0, max:60,
      axisLabel:{color:C.slate400, formatter:'{value}%', hideOverlap: true}, splitLine:{lineStyle:{color:C.ink700}},
      nameTextStyle:{color:C.slate400} },
    series: [{
      type:'scatter',
      symbolSize: v => Math.sqrt(v[2]) * 2.2 + 8,
      data,
      label: { show:false, formatter: p => p.name, color:C.slate200, fontSize:9,
        position: 'right', distance: 4 },
      emphasis: { focus:'self', label: { show: true, fontSize: 11, fontWeight:600 } },
    }]
  });
}

function renderSupply(items) {
  const sorted = [...items].sort((a,b) => a.count - b.count);
  mountChart('chart_supply', {
    tooltip: { trigger:'axis' },
    grid: { left: 180, right: 60, top: 12, bottom: 24 },
    xAxis: { type:'value', axisLabel:{color:C.slate400}, splitLine:{lineStyle:{color:C.ink700}} },
    yAxis: { type:'category', data: sorted.map(t=>t.topic),
      axisLabel:{color:C.slate200, fontSize:11, formatter: v => shortLabel(v, 30)}, axisTick:{show:false}, axisLine:{lineStyle:{color:C.ink700}} },
    series: [{
      type:'bar',
      data: sorted.map(t => ({ value: t.count,
        itemStyle:{ color: pillarFromTopic(t.topic) }
      })),
      label: { show:false, position:'right', color:C.slate200, fontSize:11 },
      emphasis: { label: { show:true, fontWeight:600 } },
    }]
  });
}
function pillarFromTopic(name){
  const E = ['GHG Emissions','Environmental Management','Biodiversity & Land Use','Climate Resilience & Adaptation','Pollution & Waste','Water Management','Energy Management'];
  const G = ['Corporate Governance','Corruption, bribery & fraud','Business Resilience','Business Ethics','Product Stewardship','Taxation','Competition','Corporate Responsibility'];
  if (E.includes(name)) return C.env;
  if (G.includes(name)) return C.gov;
  return C.soc;
}

/* ============== SCHEMA TREES (sunburst per pillar) ============== */

function renderPillarTree(elId, schema, pillarColor) {
  const data = {
    name: schema.pillar,
    itemStyle: { color: pillarColor },
    children: schema.categories.map(cat => ({
      name: cat.name,
      itemStyle: { color: shade(pillarColor, 0.15) },
      children: cat.subcategories.map(sub => ({
        name: sub.name,
        itemStyle: { color: shade(pillarColor, 0.3) },
        children: sub.parameters.map(p => ({
          name: p.name,
          value: 1,
          itemStyle: { color: autoColor(p.automation) },
        }))
      }))
    }))
  };

  mountChart(elId, {
    tooltip: { formatter: p => `<b>${p.name}</b>` },
    series: [{
      type:'sunburst', radius:['8%','95%'], data:[data],
      sort: null,
      label: { show: false },
      itemStyle: { borderColor: C.ink900, borderWidth: 1 },
      levels: [
        {},
        { r0:'8%',  r:'22%', label:{show:false} },
        { r0:'22%', r:'45%', label:{show:false} },
        { r0:'45%', r:'70%', label:{show:false} },
        { r0:'70%', r:'95%', label:{show:false}, itemStyle:{borderWidth:0.5} },
      ],
      emphasis: { focus:'ancestor' },
    }]
  });
}
function shade(hex, dark) {
  // crude darken
  const c = parseInt(hex.slice(1),16);
  const r = (c>>16)&0xff, g=(c>>8)&0xff, b=c&0xff;
  const f = 1-dark;
  return `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`;
}
function autoColor(a){ return a==='high' ? C.high : a==='medium' ? C.medium : C.low; }

/* ============== PILLAR DONUT ============== */

function renderDonut(elId, schema, pillarColor) {
  const data = schema.categories.map((cat,i) => {
    const count = cat.subcategories.reduce((a,s) => a + s.parameters.length, 0);
    return { name: cat.id + ' · ' + cat.name, value: count,
      itemStyle: { color: gradient(pillarColor, i, schema.categories.length) } };
  });
  mountChart(elId, {
    tooltip: { formatter: '{b}<br/>{c} parameters ({d}%)' },
    legend: { textStyle:{color:C.slate200, fontSize:10}, type:'scroll', bottom: 0, itemWidth: 10, itemHeight: 10 },
    series: [{
      type:'pie', radius:['55%','85%'], avoidLabelOverlap: true,
      label: { show: false },
      emphasis: { scale: true, label: { show: false } },
      data,
    }]
  });
}
function gradient(hex, i, n) {
  const c = parseInt(hex.slice(1),16);
  const r = (c>>16)&0xff, g=(c>>8)&0xff, b=c&0xff;
  const t = i / Math.max(1, n-1);
  const f = 0.5 + t*0.5;
  return `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`;
}

/* ============== ENV CAPTURE & AUTOMATION ============== */

function renderCaptureBar(elId, captureCounts) {
  const order = ['scada','twin','ai_doc','erp','manual'];
  const labels = { scada:'SCADA', twin:'Digital Twin', ai_doc:'AI Docs', erp:'ERP', manual:'Manual' };
  mountChart(elId, {
    tooltip: { trigger:'axis' },
    grid: { left: 90, right: 30, top: 16, bottom: 24 },
    xAxis: { type:'value', axisLabel:{color:C.slate400}, splitLine:{lineStyle:{color:C.ink700}} },
    yAxis: { type:'category', data: order.map(k=>labels[k]),
      axisLabel:{color:C.slate200}, axisTick:{show:false}, axisLine:{lineStyle:{color:C.ink700}} },
    series: [{
      type:'bar',
      data: order.map(k => ({ value: captureCounts[k] || 0,
        itemStyle:{ color: C[k] } })),
      label: { show:false, position:'right', color:C.slate200 },
      emphasis: { label: { show:true, fontWeight:600 } },
    }]
  });
}

function renderAutomationLevel(elId, autoCounts) {
  mountChart(elId, {
    tooltip: { trigger:'item' },
    legend: { textStyle:{color:C.slate200, fontSize:11}, bottom:0, itemWidth: 10, itemHeight: 10 },
    series: [{
      type:'pie', radius:['55%','85%'],
      label: { show: false },
      emphasis: { scale: true, label: { show: false } },
      data: [
        { name:'High',   value: autoCounts.high,   itemStyle:{color:C.high} },
        { name:'Medium', value: autoCounts.medium, itemStyle:{color:C.medium} },
        { name:'Low',    value: autoCounts.low,    itemStyle:{color:C.low} },
      ]
    }]
  });
}

function renderHeatmap(elId, matrix, rowLabels, colLabels) {
  const data = [];
  matrix.forEach((row, i) => row.forEach((v, j) => data.push([j, i, v])));
  const max = Math.max(...data.map(d => d[2]));
  const labelFloor = Math.max(2, Math.ceil((max || 1) * 0.25));
  mountChart(elId, {
    tooltip: { position:'top', formatter: p => `${rowLabels[p.value[1]]} × ${colLabels[p.value[0]]}<br/><b>${p.value[2]} params</b>` },
    grid: { left: 220, right: 30, top: 30, bottom: 50 },
    xAxis: { type:'category', data: colLabels,
      axisLabel:{color:C.slate200, rotate: 25, hideOverlap: true, formatter: v => shortLabel(v, 16)}, splitArea: { show: true } },
    yAxis: { type:'category', data: rowLabels,
      axisLabel:{color:C.slate200, fontSize:11, formatter: v => shortLabel(v, 30)}, splitArea: { show: true } },
    visualMap: {
      min: 0, max: max || 1, calculable: false, show: true,
      orient: 'horizontal', left: 'center', bottom: 0,
      textStyle: { color: C.slate200 },
      inRange: { color: ['#0f1424','#1d4ed8','#10b981','#fbbf24'] },
    },
    series: [{
      type:'heatmap', data,
      label: { show:true, color:'#fff', fontSize:10, formatter: p => p.value[2] >= labelFloor ? p.value[2] : '' },
      itemStyle: { borderColor: C.ink900, borderWidth: 1 },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: '#fff' },
        label: { show: true, formatter: p => p.value[2] || '' },
      },
    }]
  });
}
