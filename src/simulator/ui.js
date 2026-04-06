import { LaserSimulator } from './LaserSimulator.js';
import { addGraphReading, clearGraphReadings } from '../theory/graph.js';

export function initSimulator() {
  const sim = new LaserSimulator('laser-canvas');

  // Control Elements
  const btnToggle = document.getElementById('toggle-laser');
  const inpWave = document.getElementById('wavelength');
  const valWave = document.getElementById('wavelength-val');
  
  const inpPump = document.getElementById('pump-power');
  const valPump = document.getElementById('pump-val');
  
  const selMedium = document.getElementById('medium-select');
  
  const inpMirror = document.getElementById('mirror-align');
  const valMirror = document.getElementById('mirror-val');

  // Stats Elements
  const statPhotons = document.getElementById('stat-photons');
  const statInversion = document.getElementById('stat-inversion');
  const statOutput = document.getElementById('stat-output');

  // Table and Reading controls
  const btnAddReading = document.getElementById('add-reading-btn');
  const btnClearReadings = document.getElementById('clear-readings-btn');
  const tableBody = document.getElementById('readings-tbody');
  let readingCount = 0;

  // Listeners
  btnToggle.addEventListener('click', () => {
    const isRunning = sim.toggle();
    if(isRunning) {
      btnToggle.textContent = "⚡ POWER OFF";
      btnToggle.classList.remove('bg-brand-blue', 'hover:bg-blue-600');
      btnToggle.classList.add('bg-brand-red', 'hover:bg-red-600');
    } else {
      btnToggle.textContent = "⚡ POWER ON";
      btnToggle.classList.add('bg-brand-blue', 'hover:bg-blue-600');
      btnToggle.classList.remove('bg-brand-red', 'hover:bg-red-600');
      
      statPhotons.textContent = "0";
      statInversion.textContent = "Low";
      statOutput.textContent = "0 mW";
    }
  });

  inpWave.addEventListener('input', (e) => {
    valWave.textContent = `${e.target.value} nm`;
    sim.updateParams({ wavelength: parseFloat(e.target.value) });
  });

  inpPump.addEventListener('input', (e) => {
    valPump.textContent = `${e.target.value}%`;
    sim.updateParams({ pumpPower: parseFloat(e.target.value) });
  });

  selMedium.addEventListener('change', (e) => {
    sim.updateParams({ medium: e.target.value });
  });

  inpMirror.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    let lbl = "Perfect";
    if(val < 90) lbl = "Good";
    if(val < 50) lbl = "Poor";
    if(val < 20) lbl = "Critical";
    valMirror.textContent = lbl;

    sim.updateParams({ mirrorAlignment: val });
  });

  btnAddReading.addEventListener('click', () => {
    if (!sim.running) {
      alert("Please turn POWER ON to take a reading.");
      return;
    }

    if (readingCount === 0) {
      tableBody.innerHTML = ''; // clear default message
    }

    readingCount++;
    const outputRounded = Math.round(sim.stats.output);
    const mediumText = selMedium.options[selMedium.selectedIndex].text;

    const row = document.createElement('tr');
    row.className = "border-b border-gray-500/10 hover:bg-white/5 transition-colors";
    row.innerHTML = `
      <td class="py-2 px-3 font-bold">${readingCount}</td>
      <td class="py-2 px-3">${sim.params.wavelength} nm</td>
      <td class="py-2 px-3">${sim.params.pumpPower}%</td>
      <td class="py-2 px-3">${mediumText}</td>
      <td class="py-2 px-3">${sim.params.mirrorAlignment}%</td>
      <td class="py-2 px-3">${sim.stats.photonCount}</td>
      <td class="py-2 px-3 font-mono text-brand-red font-bold">${outputRounded}</td>
    `;
    tableBody.appendChild(row);

    // Call graph plotter update
    addGraphReading(outputRounded);
  });

  btnClearReadings.addEventListener('click', () => {
    readingCount = 0;
    tableBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center opacity-50 italic">Run the simulator and click "Add Reading" to log data.</td></tr>`;
    clearGraphReadings();
  });

  // UI Update loop
  function updateStats() {
    if(sim.running) {
      statPhotons.textContent = sim.stats.photonCount;
      const invPct = Math.round(sim.stats.inversion * 100);
      statInversion.textContent = invPct > 50 ? "High" : "Low";
      statOutput.textContent = `${Math.round(sim.stats.output)} mW`;
    }
    requestAnimationFrame(updateStats);
  }
  updateStats();
}
