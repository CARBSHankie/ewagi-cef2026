/* CEF 2026 — closure-challenge chart: the SPIRAL-BREAK across THREE seeds.
   Output holds and unemployment rises then STABILIZES around 5% — shown as a
   min-max BAND across three deterministic seeds (42/123/777, jobs 33376128/130/132,
   the ENERGY-FIXED matrix), mean as the bold line, so cross-seed robustness is visible.
   T120: unemployment 4.0-5.2% (~5%), output 437-444B (~440B). No ratchet.
   Fonts/strokes sized for back-row projection legibility. */
(function () {
  var INK = '#14232F', PETROL = '#2A6F77', EMBER = '#C8553D',
      MUTED = '#566570', LINE = 'rgba(20,35,47,.09)', MONO = "'IBM Plex Mono', monospace";

  var T   = [1,6,12,18,24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120];
  // output (€B): min / mean / max across the three seeds
  var OUT_LO = [510.5,460.4,428.3,414.2,408.4,405.4,403.7,404.1,405.4,415.4,414.0,422.8,421.7,427.9,428.7,429.6,431.0,431.2,435.7,435.7,436.9];
  var OUT_M  = [510.5,461.1,429.2,415.2,409.3,406.3,404.7,405.2,411.8,415.7,419.5,424.4,426.3,429.8,431.3,434.6,435.3,434.6,438.1,436.8,441.2];
  var OUT_HI = [510.6,462.1,430.1,415.8,409.8,407.9,405.9,406.8,415.2,416.2,424.8,426.5,429.2,431.4,434.9,438.3,439.0,437.5,441.7,438.9,444.4];
  // unemployment (%): min / mean / max across the three seeds
  var UN_LO  = [1.02,1.94,2.31,2.68,3.03,3.46,4.20,4.97,3.49,4.42,3.55,4.60,3.47,4.27,4.05,3.81,4.21,4.59,3.78,4.61,3.97];
  var UN_M   = [1.05,2.07,2.45,2.73,3.09,3.66,4.36,5.10,3.86,4.69,4.30,4.82,4.28,4.70,4.95,4.46,4.75,5.06,4.73,5.15,4.54];
  var UN_HI  = [1.08,2.17,2.56,2.81,3.19,3.78,4.53,5.20,4.50,4.89,5.64,4.96,5.57,5.15,5.46,5.09,5.30,5.50,5.22,5.54,5.17];

  function edge(color, axis) {   // an invisible band-edge line
    return { data: null, yAxisID: axis, borderColor: 'transparent', borderWidth: 0,
             pointRadius: 0, tension: .3, fill: false };
  }

  function build() {
    if (typeof Chart === 'undefined') return;
    var cv = document.getElementById('closureChart');
    if (!cv || cv._built) return;
    cv._built = true;

    var dsOutLo = Object.assign(edge(PETROL, 'yL'), { label: 'oL', data: OUT_LO });
    var dsOutHi = Object.assign(edge(PETROL, 'yL'), { label: 'oH', data: OUT_HI, fill: '-1', backgroundColor: 'rgba(42,111,119,.15)' });
    var dsUnLo  = Object.assign(edge(EMBER, 'yR'),  { label: 'uL', data: UN_LO });
    var dsUnHi  = Object.assign(edge(EMBER, 'yR'),  { label: 'uH', data: UN_HI, fill: '-1', backgroundColor: 'rgba(200,85,61,.15)' });

    var chart = new Chart(cv.getContext('2d'), {
      type: 'line',
      data: {
        labels: T,
        datasets: [
          dsOutLo, dsOutHi,
          { label: 'Output (€B)', data: OUT_M, yAxisID: 'yL', borderColor: PETROL, borderWidth: 4.5,
            tension: .3, fill: false,
            pointRadius: T.map(function (_, i) { return i === T.length - 1 ? 8 : 0; }),
            pointBackgroundColor: PETROL, pointBorderColor: '#fff', pointBorderWidth: 2 },
          dsUnLo, dsUnHi,
          { label: 'Unemployment (%)', data: UN_M, yAxisID: 'yR', borderColor: EMBER, borderWidth: 4.5,
            tension: .3, fill: false,
            pointRadius: T.map(function (_, i) { return i === T.length - 1 ? 8 : 0; }),
            pointBackgroundColor: EMBER, pointBorderColor: '#fff', pointBorderWidth: 2 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 8, right: 6, left: 2, bottom: 0 } },
        plugins: {
          legend: { position: 'top', align: 'end',
            labels: { font: { family: MONO, size: 15, weight: '600' }, color: INK, usePointStyle: true, pointStyle: 'rectRounded', padding: 20, boxWidth: 14,
              filter: function (item) { return item.text === 'Output (€B)' || item.text === 'Unemployment (%)'; } } },
          tooltip: { backgroundColor: INK, titleFont: { family: MONO, size: 13 }, bodyFont: { family: MONO, size: 14 },
            padding: 12, cornerRadius: 3, displayColors: true,
            filter: function (it) { return it.dataset.label === 'Output (€B)' || it.dataset.label === 'Unemployment (%)'; },
            callbacks: { title: function (it) { return 'month ' + it[0].label + '  ·  band = 3 seeds'; } } }
        },
        scales: {
          x: { title: { display: true, text: 'month (tick)', font: { family: MONO, size: 14 }, color: MUTED },
            grid: { color: LINE }, ticks: { font: { family: MONO, size: 14 }, color: MUTED,
              callback: function (v, i) { return (T[i] % 24 === 0 || T[i] === 1) ? T[i] : ''; }, maxRotation: 0 } },
          yL: { type: 'linear', position: 'left', min: 380, max: 540,
            title: { display: true, text: 'Output  €B', font: { family: MONO, size: 15, weight: '600' }, color: PETROL },
            grid: { color: LINE }, ticks: { font: { family: MONO, size: 14 }, color: PETROL, stepSize: 40 } },
          yR: { type: 'linear', position: 'right', min: 0, max: 10,
            title: { display: true, text: 'Unemployment  %', font: { family: MONO, size: 15, weight: '600' }, color: EMBER },
            grid: { drawOnChartArea: false }, ticks: { font: { family: MONO, size: 14 }, color: EMBER, stepSize: 2 } }
        }
      }
    });
    window.closureChartInstance = chart;
    var fb = document.getElementById('fullscreenBtn');
    if (fb) fb.addEventListener('click', function () { setTimeout(function () { try { chart.resize(); } catch (_) {} }, 320); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 60); });
  else setTimeout(build, 60);
})();
