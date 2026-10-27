/**
 * NEURONEXUS - Zero-Dependency SVG & Canvas Chart Engine
 * Clean, accessible, responsive data visualizations designed specifically
 * for educational mastery, timeline dynamics, and improvement comparisons.
 */

const NeuroCharts = {
  // Render a responsive horizontal or vertical bar chart for subtopic accuracy
  renderSubtopicBars(containerId, subtopicBreakdown) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(subtopicBreakdown);
    if (entries.length === 0) {
      container.innerHTML = `<div class="text-sm text-slate-400 italic">No subtopic data available.</div>`;
      return;
    }

    let html = `<div class="space-y-4">`;
    entries.forEach(([subtopic, stats]) => {
      const acc = stats.accuracy;
      let barColor = "bg-rose-500";
      let badgeColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
      let statusLabel = "Needs Practice";

      if (acc >= 75) {
        barColor = "bg-emerald-500";
        badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        statusLabel = "Mastered";
      } else if (acc >= 50) {
        barColor = "bg-amber-500";
        badgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
        statusLabel = "Developing";
      }

      html += `
        <div>
          <div class="flex justify-between items-center text-sm mb-1.5">
            <span class="font-medium text-slate-200">${subtopic}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded-full border ${badgeColor}">${statusLabel}</span>
              <span class="font-semibold text-slate-100">${acc}%</span>
              <span class="text-xs text-slate-400">(${stats.correct}/${stats.total})</span>
            </div>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div class="${barColor} h-2.5 rounded-full transition-all duration-700" style="width: ${acc}%"></div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  },

  // Render a side-by-side Delta comparison for follow-up attempts
  renderComparisonBars(containerId, comparison) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!comparison.hasBaseline) {
      container.innerHTML = `<div class="text-sm text-slate-400">${comparison.message}</div>`;
      return;
    }

    const deltas = Object.entries(comparison.subtopicDeltas);
    let html = `
      <div class="space-y-5">
        <div class="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center mb-4">
          <div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Baseline</div>
            <div class="text-2xl font-bold text-slate-300">${comparison.previousPercentage}%</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Current</div>
            <div class="text-2xl font-bold text-emerald-400">${comparison.currentPercentage}%</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">Net Delta</div>
            <div class="text-2xl font-bold ${comparison.percentageDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
              ${comparison.percentageDiff >= 0 ? '+' : ''}${comparison.percentageDiff}%
            </div>
          </div>
        </div>
    `;

    deltas.forEach(([subtopic, d]) => {
      const isPositive = d.diff >= 0;
      html += `
        <div class="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800/80">
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="font-medium text-slate-200">${subtopic}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}">
              ${isPositive ? '▲ +' : '▼ '}${d.diff}%
            </span>
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="w-16">Baseline:</span>
              <div class="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="bg-slate-400 h-1.5 rounded-full" style="width: ${d.prevAccuracy}%"></div>
              </div>
              <span class="w-10 text-right">${d.prevAccuracy}%</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-emerald-300">
              <span class="w-16 font-medium">Current:</span>
              <div class="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: ${d.currAccuracy}%"></div>
              </div>
              <span class="w-10 text-right font-bold">${d.currAccuracy}%</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  // Focus Dynamics Timeline (SVG Line + Area Chart with honest quality markers)
  renderFocusTimeline(containerId, session) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!session || !session.timelineData || session.timelineData.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-400">No session timeline available.</div>`;
      return;
    }

    if (session.signalQualityStatus === "INSUFFICIENT") {
      container.innerHTML = `
        <div class="p-8 text-center bg-rose-950/20 rounded-2xl border border-rose-500/30">
          <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 class="text-base font-semibold text-rose-300 mb-1">Focus Estimate Unavailable</h4>
          <p class="text-sm text-slate-300 max-w-md mx-auto mb-3">
            Focus estimate unavailable because the session does not contain enough valid signal data (valid coverage ${session.validDataCoveragePercent}% < 70% threshold).
          </p>
          <span class="inline-block text-xs font-mono px-3 py-1 bg-rose-900/40 text-rose-300 rounded-full border border-rose-700/50">
            TRANSPARENT REJECTION: No fabricated estimate generated
          </span>
        </div>
      `;
      return;
    }

    const data = session.timelineData;
    const width = 640;
    const height = 220;
    const padding = { top: 25, right: 30, bottom: 40, left: 45 };

    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const maxMin = Math.max(...data.map(d => d.minute));
    const minMin = Math.min(...data.map(d => d.minute));

    const getX = min => padding.left + ((min - minMin) / (maxMin - minMin || 1)) * graphWidth;
    const getY = val => padding.top + graphHeight - (val / 100) * graphHeight;

    // Build SVG path
    let pathD = "";
    let areaD = `M ${getX(data[0].minute)} ${padding.top + graphHeight}`;

    data.forEach((pt, i) => {
      const x = getX(pt.minute);
      const y = getY(pt.focus);
      if (i === 0) {
        pathD += `M ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }
    });

    areaD += ` L ${getX(data[data.length - 1].minute)} ${padding.top + graphHeight} Z`;

    // Grid lines
    let gridLines = "";
    [25, 50, 75, 100].forEach(level => {
      const y = getY(level);
      gridLines += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#1e293b" stroke-dasharray="3 3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="#64748b" font-size="10" text-anchor="end">${level}%</text>
      `;
    });

    // Time points
    let pointsHtml = "";
    data.forEach(pt => {
      const x = getX(pt.minute);
      const y = getY(pt.focus);
      pointsHtml += `
        <g class="cursor-pointer group">
          <circle cx="${x}" cy="${y}" r="4.5" fill="#10b981" stroke="#064e3b" stroke-width="2" class="transition-transform group-hover:scale-150" />
          <text x="${x}" y="${padding.top + graphHeight + 20}" fill="#94a3b8" font-size="10" text-anchor="middle">${pt.minute}m</text>
          <title>${pt.state}: ${pt.focus}% focus (Signal Quality: ${pt.quality}%)</title>
        </g>
      `;
    });

    container.innerHTML = `
      <div class="relative w-full overflow-x-auto">
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto">
          <defs>
            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          ${gridLines}
          <path d="${areaD}" fill="url(#focusGradient)" />
          <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ${pointsHtml}
        </svg>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Estimated Contextual Focus Indicator</span>
        </div>
        <div>
          <span>Coverage: <strong class="text-slate-200">${session.validDataCoveragePercent}%</strong></span>
          <span class="mx-2">•</span>
          <span>Hardware: <span class="text-slate-300">${session.hardware}</span></span>
        </div>
      </div>
    `;
  },

  // Spectral Power Band Breakdown (Theta / Alpha / Beta / Gamma)
  renderSpectralDonut(containerId, spectral) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!spectral) {
      container.innerHTML = `<div class="text-sm text-slate-400 italic">Spectral features unavailable.</div>`;
      return;
    }

    const bands = [
      { name: "Alpha (8-13 Hz)", val: spectral.alpha, desc: "Relaxed focus / bridge state", color: "bg-cyan-500", text: "text-cyan-400" },
      { name: "Beta (14-30 Hz)", val: spectral.beta, desc: "Active problem solving", color: "bg-indigo-500", text: "text-indigo-400" },
      { name: "Theta (4-7 Hz)", val: spectral.theta, desc: "Memory consolidation / encoding", color: "bg-teal-500", text: "text-teal-400" },
      { name: "Gamma (>30 Hz)", val: spectral.gamma, desc: "High-level cognitive synthesis", color: "bg-violet-500", text: "text-violet-400" }
    ];

    let html = `<div class="grid grid-cols-2 gap-3">`;
    bands.forEach(b => {
      html += `
        <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-semibold ${b.text}">${b.name}</span>
            <span class="text-sm font-bold text-slate-200">${b.val}%</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div class="${b.color} h-1.5 rounded-full" style="width: ${b.val}%"></div>
          </div>
          <div class="text-[11px] text-slate-400 leading-tight">${b.desc}</div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }
};

window.NeuroCharts = NeuroCharts;
