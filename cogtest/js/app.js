/**
 * Main App Controller — UI rendering, navigation, report generation
 */
(function() {
  const DA = window.DementiaApp;
  const MODULES = DA.MODULES;
  let currentModule = -1; // -1 = welcome
  let answers = {};
  let psychiatricConsented = false;

  // ── Initialization ──
  function init() {
    document.getElementById('disclaimerText').textContent = window.t(DA.DISCLAIMER);
  }

  // ── Navigation ──
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    const total = MODULES.length;
    const pct = Math.round(((currentModule + 1) / total) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = `${window.t('Step')} ${currentModule + 1} ${window.t('of')} ${total}`;
  }

  window.App = {
    reRender: function() {
      // Re-render currently active screen when language changes
      if (currentModule === -1) {
        // Welcome screen is mostly static HTML, already handled by translateDOM
      } else if (currentModule < MODULES.length) {
        renderModule();
      } else {
        generateReport();
      }
    },
    updateProgress: updateProgress,

    startAssessment: function() {
      currentModule = 0;
      document.getElementById('progressContainer').style.display = '';
      renderModule();
      showScreen('screen-module');
      updateProgress();
    },

    nextModule: function() {
      collectCurrentModule();
      if (currentModule < MODULES.length - 1) {
        currentModule++;
        renderModule();
        showScreen('screen-module');
        updateProgress();
      } else {
        generateReport();
      }
    },

    prevModule: function() {
      if (currentModule > 0) {
        collectCurrentModule();
        currentModule--;
        renderModule();
        showScreen('screen-module');
        updateProgress();
      }
    },

    skipModule: function() {
      if (currentModule < MODULES.length - 1) {
        currentModule++;
        renderModule();
        showScreen('screen-module');
        updateProgress();
      } else {
        generateReport();
      }
    },

    restartAssessment: function() {
      currentModule = -1;
      answers = {};
      psychiatricConsented = false;
      document.getElementById('progressContainer').style.display = 'none';
      showScreen('screen-welcome');
    },

    exportPDF: function() {
      window.print();
    }
  };

  // ── Form Rendering ──
  function renderModule() {
    const mod = MODULES[currentModule];
    const container = document.getElementById('moduleContent');
    let html = '';

    // Module header
    html += '<div class="module-header">';
    if (mod.badge) {
      const cls = mod.badgeClass || (mod.tier === 1 ? 'tier1' : 'tier2');
      html += `<div class="module-badge ${cls}">${window.t(mod.badge)}</div>`;
    }
    html += `<h2>${mod.icon} ${window.t(mod.title)}</h2>`;
    html += `<p>${window.t(mod.subtitle)}</p>`;
    html += '</div>';

    // Consent gate for psychiatric
    if (mod.consentGated && !psychiatricConsented) {
      html += '<div class="consent-gate">';
      html += `<h3>🔒 ${window.t('This section requires your consent')}</h3>`;
      html += `<p>${window.t(mod.consentText)}</p>`;
      html += '<div class="btn-row" style="justify-content:center; margin-top:20px;">';
      html += `<button class="btn btn-secondary" onclick="App.skipModule()">${window.t('Skip This Section')}</button>`;
      html += `<button class="btn btn-primary" onclick="document.querySelector('.consent-gate').remove(); window._psychiatricConsented=true; App._renderConsentedModule()">${window.t('I Understand — Continue')}</button>`;
      html += '</div></div>';
      container.innerHTML = html;
      document.getElementById('btnSkip').style.display = 'none';
      document.getElementById('btnNext').style.display = 'none';
      return;
    }

    html += renderGroups(mod);
    container.innerHTML = html;
    restoreValues(mod);
    setupPills();
    setupConditionals(mod);
    document.getElementById('btnSkip').style.display = '';
    document.getElementById('btnNext').style.display = '';
    document.getElementById('btnBack').style.display = currentModule > 0 ? '' : 'none';
  }

  window.App._renderConsentedModule = function() {
    psychiatricConsented = true;
    const mod = MODULES[currentModule];
    const container = document.getElementById('moduleContent');
    let html = '<div class="module-header">';
    const cls = mod.badgeClass || 'optional';
    html += `<div class="module-badge ${cls}">${window.t(mod.badge)}</div>`;
    html += `<h2>${mod.icon} ${window.t(mod.title)}</h2><p>${window.t(mod.subtitle)}</p></div>`;
    html += renderGroups(mod);
    container.innerHTML = html;
    restoreValues(mod);
    setupPills();
    document.getElementById('btnSkip').style.display = '';
    document.getElementById('btnNext').style.display = '';
  };

  function renderGroups(mod) {
    let html = '';
    mod.groups.forEach(group => {
      html += '<div class="question-group">';
      html += `<h3><span class="icon">${group.icon}</span> ${window.t(group.title)}</h3>`;
      group.fields.forEach(f => {
        html += renderField(f);
      });
      html += '</div>';
    });
    return html;
  }

  function renderField(f) {
    let html = `<div class="field" id="field-${f.id}" ${f.showIf ? 'style="display:none"' : ''}>`;

    if (f.type === 'checkbox') {
      html += '<div class="check-group"><label class="check-item">';
      html += `<input type="checkbox" id="${f.id}" data-path="${f.dataPath}">`;
      html += `<label for="${f.id}">${window.t(f.label)}</label>`;
      html += '</label></div>';
    } else if (f.type === 'number') {
      html += `<label for="${f.id}">${window.t(f.label)}`;
      if (f.lowConfidence) html += `<span class="low-confidence-badge">${window.t(f.lowConfidenceNote || 'Limited evidence')}</span>`;
      html += '</label>';
      html += `<input type="number" id="${f.id}" min="${f.min || ''}" max="${f.max || ''}" step="${f.step || 1}" placeholder="${f.placeholder ? window.t(f.placeholder) : ''}" data-path="${f.dataPath}">`;
    } else if (f.type === 'pills') {
      html += `<label>${window.t(f.label)}</label>`;
      html += `<div class="pill-group" data-field="${f.id}" data-path="${f.dataPath}">`;
      f.options.forEach(o => {
        html += `<div class="pill-option" data-value="${o.value}">${window.t(o.label)}</div>`;
      });
      html += '</div>';
    } else if (f.type === 'range') {
      html += `<label for="${f.id}">${window.t(f.label)}</label>`;
      html += `<div class="range-field">`;
      html += `<div class="range-value" id="rv-${f.id}">${f.value}</div>`;
      html += `<input type="range" id="${f.id}" min="${f.min}" max="${f.max}" value="${f.value}" data-path="${f.dataPath}" oninput="document.getElementById('rv-${f.id}').textContent=this.value">`;
      html += `<div class="range-labels"><span>${window.t(f.minLabel)}</span><span>${window.t(f.maxLabel)}</span></div>`;
      html += '</div>';
    } else if (f.type === 'select') {
      html += `<label for="${f.id}">${window.t(f.label)}</label>`;
      html += `<select id="${f.id}" data-path="${f.dataPath}"><option value="">— ${window.t('Select')} —</option>`;
      f.options.forEach(o => { html += `<option value="${o.value}">${window.t(o.label)}</option>`; });
      html += '</select>';
    }

    if (f.hint) html += `<div class="hint">${window.t(f.hint)}</div>`;
    html += '</div>';
    return html;
  }

  function setupPills() {
    document.querySelectorAll('.pill-group').forEach(group => {
      group.querySelectorAll('.pill-option').forEach(pill => {
        pill.addEventListener('click', function() {
          group.querySelectorAll('.pill-option').forEach(p => p.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    });
  }

  function setupConditionals(mod) {
    mod.groups.forEach(group => {
      group.fields.forEach(f => {
        if (!f.showIf) return;
        // Parse simple conditions
        const match = f.showIf.match(/^(\w+)\s*(!==|===|)\s*"?(\w+)"?$/);
        if (!match) return;
        const [, depId, op, val] = match;

        const checkVisibility = () => {
          const depEl = document.getElementById(depId);
          const fieldEl = document.getElementById('field-' + f.id);
          if (!depEl || !fieldEl) return;
          let show = false;
          if (depEl.type === 'checkbox') {
            show = op === '' ? depEl.checked : (op === '!==' ? !depEl.checked : depEl.checked);
          } else {
            // Check pill selection
            const pillGroup = document.querySelector(`[data-field="${depId}"]`);
            if (pillGroup) {
              const sel = pillGroup.querySelector('.selected');
              const selVal = sel ? sel.dataset.value : '';
              show = op === '!==' ? selVal !== val : selVal === val;
            }
          }
          fieldEl.style.display = show ? '' : 'none';
        };

        const depEl = document.getElementById(depId);
        if (depEl) depEl.addEventListener('change', checkVisibility);
        // Also listen on pill clicks
        const pillGroup = document.querySelector(`[data-field="${depId}"]`);
        if (pillGroup) {
          pillGroup.querySelectorAll('.pill-option').forEach(p => {
            p.addEventListener('click', () => setTimeout(checkVisibility, 10));
          });
        }
        checkVisibility();
      });
    });
  }

  // ── Data Collection ──
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function getNestedValue(obj, path) {
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function collectCurrentModule() {
    const mod = MODULES[currentModule];
    if (!mod) return;
    if (mod.consentGated && !psychiatricConsented) return;
    if (mod.consentGated && psychiatricConsented) {
      setNestedValue(answers, 'tier2_psychiatric.consented', true);
    }

    mod.groups.forEach(group => {
      group.fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (f.type === 'pills') {
          const pillGroup = document.querySelector(`[data-field="${f.id}"]`);
          if (pillGroup) {
            const sel = pillGroup.querySelector('.selected');
            if (sel) setNestedValue(answers, f.dataPath, sel.dataset.value);
          }
        } else if (f.type === 'checkbox') {
          if (el) setNestedValue(answers, f.dataPath, el.checked);
        } else if (f.type === 'number') {
          if (el && el.value !== '') setNestedValue(answers, f.dataPath, parseFloat(el.value));
        } else if (f.type === 'range') {
          if (el) setNestedValue(answers, f.dataPath, parseInt(el.value));
        } else if (f.type === 'select') {
          if (el && el.value) setNestedValue(answers, f.dataPath, el.value);
        }
      });
    });
  }

  function restoreValues(mod) {
    mod.groups.forEach(group => {
      group.fields.forEach(f => {
        const val = getNestedValue(answers, f.dataPath);
        if (val === undefined) return;
        const el = document.getElementById(f.id);

        if (f.type === 'pills') {
          const pillGroup = document.querySelector(`[data-field="${f.id}"]`);
          if (pillGroup) {
            pillGroup.querySelectorAll('.pill-option').forEach(p => {
              p.classList.toggle('selected', p.dataset.value === val);
            });
          }
        } else if (f.type === 'checkbox') {
          if (el) el.checked = val;
        } else if (f.type === 'number') {
          if (el && val != null) el.value = val;
        } else if (f.type === 'range') {
          if (el) {
            el.value = val;
            const rv = document.getElementById('rv-' + f.id);
            if (rv) rv.textContent = val;
          }
        } else if (f.type === 'select') {
          if (el) el.value = val;
        }
      });
    });
  }

  // ── Report Generation ──
  function generateReport() {
    collectCurrentModule();
    document.getElementById('progressContainer').style.display = 'none';

    const result = DA.computeScore(answers);
    const recs = DA.getRecommendations(result);
    const container = document.getElementById('reportContent');
    let html = '';

    // Disclaimer
    html += '<div class="disclaimer-box" style="margin-bottom:24px;">';
    html += `<div class="disclaimer-title">⚠️ ${window.t('Important Reminder')}</div>`;
    html += `<p>${window.t(DA.DISCLAIMER)}</p></div>`;

    // Band
    const bandIcons = { below_average: '🛡️', average: '📊', above_average: '⚡', high: '🔔' };
    html += `<div class="report-band" style="border:1px solid ${result.band.color}33;">`;
    html += `<div class="band-icon">${bandIcons[result.band.key] || '📊'}</div>`;
    html += `<h2 style="color:${result.band.color}">${window.t(result.band.label)}</h2>`;
    html += `<p class="band-desc">${window.t(result.band.description)}</p>`;
    html += '</div>';

    // Balance visualization
    html += '<div class="balance-viz">';
    html += '<div class="balance-side risk">';
    html += `<h3>⚠️ ${window.t('Risk Factors Present')}</h3>`;
    if (result.riskFactors.length === 0) {
      html += `<p style="color:var(--text-muted);font-size:13px;">${window.t('No significant risk factors identified.')}</p>`;
    }
    result.riskFactors.forEach(f => {
      const badge = f.tier === 1 ? `<span class="factor-badge tier1-badge">${window.t('Established')}</span>` :
                    f.informationalOnly ? `<span class="factor-badge" style="background:rgba(167,139,250,0.12);color:#a78bfa;">${window.t('Informational')}</span>` :
                    `<span class="factor-badge tier2-badge">${window.t('Emerging')}</span>`;
      html += `<div class="factor-item"><span class="factor-name">${window.t(f.label)}</span>${badge}</div>`;
    });
    html += '</div>';

    html += '<div class="balance-side protective">';
    html += `<h3>✅ ${window.t('Protective Factors')}</h3>`;
    if (result.protectiveFactors.length === 0) {
      html += `<p style="color:var(--text-muted);font-size:13px;">${window.t('Keep building healthy habits!')}</p>`;
    }
    result.protectiveFactors.forEach(f => {
      const badge = f.tier === 1 ? `<span class="factor-badge tier1-badge">${window.t('Established')}</span>` :
                    `<span class="factor-badge tier2-badge">${window.t('Emerging')}</span>`;
      html += `<div class="factor-item"><span class="factor-name">${window.t(f.label)}</span>${badge}</div>`;
    });
    html += '</div></div>';

    // Top recommendations
    if (recs.length > 0) {
      html += '<div class="report-section">';
      html += `<h3>🎯 ${window.t('Your Top Opportunities')}</h3>`;
      recs.forEach(r => {
        html += '<div class="rec-card">';
        html += `<div class="rec-icon">${r.icon}</div>`;
        html += '<div class="rec-content">';
        html += `<h4>${window.t(r.title)}</h4>`;
        html += `<p class="rec-action">${window.t(r.action)}</p>`;
        html += `<p class="rec-evidence">${window.t(r.evidence)}</p>`;
        html += '</div></div>';
      });
      html += `<div class="multi-domain-note"><strong>${window.t('A note on expectations:')}</strong> ${window.t(DA.MULTI_DOMAIN_NOTE)}</div>`;
      html += '</div>';
    }

    // Background / non-modifiable factors
    if (result.backgroundRisks.length > 0) {
      html += '<div class="report-section">';
      html += '<div class="neutral-box">';
      html += `<h4>🌿 ${window.t("Things you can't change — and that's OK")}</h4>`;
      html += `<p>${window.t('Some factors like education level, past injuries, and environmental exposure are part of your history. They provide context but are not failures or things to feel guilty about.')}</p>`;
      html += '<ul style="margin-top:10px;padding-left:20px;">';
      result.backgroundRisks.forEach(f => {
        html += `<li style="margin:4px 0;">${window.t(f.label)}${f.backgroundNote ? ' — <em>' + window.t(f.backgroundNote) + '</em>' : ''}</li>`;
      });
      html += '</ul></div></div>';
    }

    // Psychiatric informational
    if (result.informationalRisks.length > 0) {
      html += '<div class="report-section">';
      html += '<div class="neutral-box" style="background:rgba(244,162,97,0.06);border-color:rgba(244,162,97,0.15);">';
      html += `<h4 style="color:var(--accent-amber);">ℹ️ ${window.t('Psychiatric History — Informational Context')}</h4>`;
      html += `<p>${window.t('The following psychiatric conditions have been associated with dementia risk in research, but psychiatric symptoms can also be an early manifestation of dementia itself (reverse causation). These are presented as informational context only, not as modifiable risk factors.')}</p>`;
      html += '<ul style="margin-top:10px;padding-left:20px;">';
      result.informationalRisks.forEach(f => {
        html += `<li style="margin:4px 0;">${window.t(f.label)}</li>`;
      });
      html += '</ul>';
      html += `<p style="margin-top:10px;"><strong>${window.t('Recommendation:')}</strong> ${window.t('Discuss these findings with your doctor for personalised guidance.')}</p>`;
      html += '</div></div>';
    }

    // Support resources (show if routed or always)
    if (result.routeToSupport) {
      html += '<div class="support-box">';
      html += `<h4>💜 ${window.t('We noticed some of your responses suggest you may be going through a difficult time')}</h4>`;
      html += `<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">${window.t('Regardless of any risk assessment, your wellbeing matters right now. Please consider reaching out:')}</p>`;
      DA.SUPPORT_RESOURCES.items.forEach(r => {
        if (r.type === 'phone') html += `<p style="margin:6px 0;font-size:13px;">📞 ${window.t(r.label)}: <strong>${r.value}</strong></p>`;
        else html += `<p style="margin:6px 0;font-size:13px;">🔗 <a href="${r.value}" target="_blank">${window.t(r.label)}</a></p>`;
      });
      html += '</div>';
    }

    // Resources footer
    html += '<div class="resources-footer">';
    html += `<h3>📚 ${window.t('Resources & Further Reading')}</h3>`;
    DA.SUPPORT_RESOURCES.items.filter(r => r.type === 'link').forEach(r => {
      html += `<a href="${r.value}" target="_blank">${window.t(r.label)} →</a>`;
    });
    html += `<p style="font-size:11px;color:var(--text-muted);margin-top:14px;">${window.t('Scoring config version:')} ${result.configVersion} · ${window.t('Assessment:')} ${result.timestamp}</p>`;
    html += '</div>';
    
    // AI Integration Section
    html += `
      <div class="ai-coach-section" style="margin-top: 32px; text-align: center;">
        <button id="btnAiCoach" class="btn btn-primary" style="background: linear-gradient(135deg, #7c3aed, #2563eb); border: none; box-shadow: 0 4px 15px rgba(124,58,237,0.4);" onclick="window.DementiaApp.AI.start()">
          ✨ ${window.t('Get Personalised AI Coaching')}
        </button>
        <div id="aiContainer" style="display:none; text-align: left;"></div>
      </div>
    `;

    container.innerHTML = html;
    
    // Save the result globally so the AI module can access it
    window.DementiaApp._lastResult = result;
    showScreen('screen-report');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', init);
})();
