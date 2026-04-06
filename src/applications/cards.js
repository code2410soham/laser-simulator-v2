export function initCards() {
  const container = document.getElementById('app-cards-container');
  if(!container) return;

  const applications = [
    {
      title: "Medical",
      icon: "🏥",
      desc: "Precise tissue ablation in LASIK eye surgery and dermatology.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Industrial",
      icon: "🏭",
      desc: "High power cutting, welding, and engraving of metals and plastics.",
      color: "from-brand-red to-orange-500"
    },
    {
      title: "Holography",
      icon: "🌈",
      desc: "Recording and phase reconstruction to create perfect 3D images.",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Telecom",
      icon: "📡",
      desc: "Fiber optic communications transmitting data at the speed of light.",
      color: "from-green-400 to-emerald-600"
    }
  ];

  applications.forEach(app => {
    const card = document.createElement('div');
    card.className = "glassmorphism rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 cursor-pointer overflow-hidden relative group";
    
    card.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div class="text-4xl mb-4 relative z-10">${app.icon}</div>
      <h3 class="text-2xl font-bold mb-2 relative z-10">${app.title}</h3>
      <p class="opacity-80 relative z-10">${app.desc}</p>
    `;
    container.appendChild(card);
  });
}
