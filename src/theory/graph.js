let chartData = [];

export function initGraph() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawReadingGraph(canvas);
    }, 150);
  });
  
  // Initial draw
  drawReadingGraph(canvas);
}

export function addGraphReading(outputPower) {
  chartData.push(outputPower);
  const canvas = document.getElementById('graph-canvas');
  drawReadingGraph(canvas);
}

export function clearGraphReadings() {
  chartData = [];
  const canvas = document.getElementById('graph-canvas');
  drawReadingGraph(canvas);
}

function drawReadingGraph(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const parent = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const rect = parent.getBoundingClientRect();
  
  // Set display size
  const displayW = rect.width;
  const displayH = canvas.offsetHeight || 250;
  
  // Set actual scale
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  ctx.scale(dpr, dpr);

  const W = displayW;
  const H = displayH;

  ctx.clearRect(0, 0, W, H);

  const padL = 45, padR = 15, padT = 15, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  if (plotW <= 0 || plotH <= 0) return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(248,250,252,0.05)' : 'rgba(15,23,42,0.05)';
  const bgPlotColor = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

  // Background
  ctx.fillStyle = bgPlotColor;
  ctx.beginPath();
  ctx.roundRect(padL, padT, plotW, plotH, 8);
  ctx.fill();
  
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke(); // Y
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke(); // X

  ctx.fillStyle = textColor;
  ctx.font = '500 10px Inter, sans-serif';
  
  let maxY = Math.max(...chartData, 100); 
  maxY = Math.ceil(maxY / 10) * 10;
  const gridLinesY = 4;
  
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= gridLinesY; i++) {
    const val = maxY - (i / gridLinesY) * maxY;
    const y = padT + (i / gridLinesY) * plotH;
    ctx.strokeStyle = gridColor;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
    ctx.fillText(val.toFixed(0), padL - 8, y);
  }

  const totalReadings = Math.max(chartData.length, 5); 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const stepX = plotW / totalReadings;
  for (let i = 0; i <= totalReadings; i++) {
     const x = padL + i * stepX;
     if (i > 0) {
       ctx.strokeStyle = gridColor;
       ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
     }
     ctx.fillText(i.toString(), x, padT + plotH + 8);
  }

  // Titles
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('Reading Index', padL + plotW / 2, H - 12);
  
  if (chartData.length === 0) return;

  const points = chartData.map((val, idx) => {
    const x = padL + (idx + 1) * stepX;
    const y = padT + plotH - (val / maxY) * plotH;
    return { x, y };
  });

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#ff3366';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  // Highlight points
  points.forEach(pt => {
    ctx.beginPath();
    ctx.fillStyle = '#00d2ff';
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}
