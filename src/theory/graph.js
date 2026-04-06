let chartData = [];

export function initGraph() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;

  window.addEventListener('resize', () => {
    drawReadingGraph(canvas);
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
  canvas.width = parent.clientWidth - 40; // padding adjustment
  canvas.height = canvas.offsetHeight || 220;

  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const padL = 50, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  // Give the graph area a solid, slightly contrasting background to pop
  const bgPlotColor = isDark ? '#1a1a1a' : '#f8f9fa';

  // Fill Background of entire plot area
  ctx.fillStyle = bgPlotColor;
  ctx.beginPath();
  ctx.roundRect(padL, padT, plotW, plotH, 4);
  ctx.fill();
  
  // Create solid border along X and Y axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke(); // Y
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke(); // X

  // Labels & Fonts
  ctx.fillStyle = textColor;
  ctx.font = '12px Inter, sans-serif';
  
  // Y-axis Logic
  let maxY = Math.max(...chartData, 100); 
  maxY = Math.ceil(maxY / 10) * 10;
  const gridLinesY = 5;
  
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= gridLinesY; i++) {
    const val = maxY - (i / gridLinesY) * maxY;
    const y = padT + (i / gridLinesY) * plotH;
    
    // Draw horizontal grid line
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
    
    // Draw Y tick
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(padL - 4, y); ctx.lineTo(padL, y); ctx.stroke();
    
    // Y numbering
    ctx.fillText(val.toFixed(0), padL - 8, y);
  }

  // X-axis Logic
  const totalReadings = Math.max(chartData.length, 5); 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Make ticks for each reading integer, up to totalReadings
  for (let i = 0; i <= totalReadings; i++) {
     const x = padL + (i / totalReadings) * plotW;
     // Draw vertical grid line
     if (i > 0) {
       ctx.strokeStyle = gridColor;
       ctx.lineWidth = 1;
       ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
     }
     
     // Draw X tick
     ctx.strokeStyle = textColor;
     ctx.lineWidth = 2;
     ctx.beginPath(); ctx.moveTo(x, padT + plotH); ctx.lineTo(x, padT + plotH + 4); ctx.stroke();
     
     // X numbering
     ctx.fillText(i.toString(), x, padT + plotH + 8);
  }

  // Axis Titles
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.fillText('Reading #', padL + plotW / 2, H - 15);
  
  ctx.save();
  ctx.translate(14, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Output (mW)', 0, 0);
  ctx.restore();

  // Plot Data points
  if (chartData.length === 0) return;

  const points = chartData.map((val, idx) => {
    // Note: idx is 0-based, readings start at 1, so x maps to idx + 1
    const x = padL + ((idx + 1) / totalReadings) * plotW;
    const y = padT + plotH - (val / maxY) * plotH;
    return { x, y, val, idx };
  });

  // Draw connecting line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,51,102,1)'; // Brand red solid
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  // Draw circle points
  points.forEach(pt => {
    ctx.beginPath();
    ctx.fillStyle = '#00d2ff'; // Brand blue
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}
