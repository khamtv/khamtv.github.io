window.DementiaApp = window.DementiaApp || {};

window.DementiaApp.AI = {
  // Configuration
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  
  // List of active free models on OpenRouter with fallbacks
  FREE_MODELS: [
    { id: 'openrouter/auto', name: 'OpenRouter Auto (Best Available Free Agent)' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)' },
    { id: 'google/gemini-2.0-flash-lite-001:free', name: 'Gemini 2.0 Flash Lite (Free)' },
    { id: 'qwen/qwen-2.5-7b-instruct:free', name: 'Qwen 2.5 7B (Free)' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)' },
    { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B (Free)' }
  ],
  
  HARDCODED_KEY: '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',

  start: function() {
    const container = document.getElementById('aiContainer');
    const btn = document.getElementById('btnAiCoach');
    
    if (btn) btn.style.display = 'none';
    if (container) container.style.display = 'block';

    // Reset saved key if empty or invalid to ensure hardcoded key works
    let apiKey = localStorage.getItem('cognirisk_openrouter_key') || this.HARDCODED_KEY;
    
    if (!apiKey) {
      this.renderKeyPrompt();
    } else {
      const selectedModel = localStorage.getItem('cognirisk_selected_model') || 0;
      this.generateInsights(apiKey, parseInt(selectedModel, 10), 0);
    }
  },

  renderKeyPrompt: function() {
    const container = document.getElementById('aiContainer');
    const optionsHtml = this.FREE_MODELS.map((m, idx) => 
      `<option value="${idx}">${m.name}</option>`
    ).join('');

    container.innerHTML = `
      <div class="ai-key-prompt" style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 12px; margin-top: 20px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">
        <h4 style="margin-top:0; color: var(--accent-blue);">🤖 ${window.t('AI Coach & Individualised Outcomes Setup')}</h4>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">
          ${window.t('Enter your OpenRouter API key to generate custom individualised outcomes and action plans. Your key is stored locally in your browser.')}
        </p>
        <div style="margin-bottom: 15px;">
          <label style="display:block; font-size:12px; margin-bottom:5px; color:var(--text-muted);">${window.t('Select Preferred Free AI Model:')}</label>
          <select id="aiModelSelect" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 6px;">
            ${optionsHtml}
          </select>
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display:block; font-size:12px; margin-bottom:5px; color:var(--text-muted);">${window.t('OpenRouter API Key:')}</label>
          <input type="password" id="aiApiKeyInput" placeholder="sk-or-v1-..." style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 6px;">
        </div>
        <div class="btn-row" style="display: flex; gap: 10px; align-items: center; justify-content: flex-start;">
          <button class="btn btn-primary" onclick="window.DementiaApp.AI.saveKeyAndRun()">
            ${window.t('Save & Generate Outcomes')}
          </button>
          <a href="https://openrouter.ai/keys" target="_blank" style="font-size: 12px; color: var(--accent-blue); text-decoration: underline;">${window.t('Get Free Key on OpenRouter')}</a>
        </div>
      </div>
    `;
  },

  saveKeyAndRun: function() {
    const input = document.getElementById('aiApiKeyInput');
    const modelSelect = document.getElementById('aiModelSelect');
    const key = input ? input.value.trim() : null;
    const modelIdx = modelSelect ? parseInt(modelSelect.value, 10) : 0;
    
    localStorage.setItem('cognirisk_selected_model', modelIdx);
    
    if (key) {
      localStorage.setItem('cognirisk_openrouter_key', key);
      this.generateInsights(key, modelIdx, 0);
    } else if (this.HARDCODED_KEY) {
      this.generateInsights(this.HARDCODED_KEY, modelIdx, 0);
    } else {
      this.renderKeyPrompt();
    }
  },

  generateInsights: function(apiKey, modelIndex = 0, attemptCount = 0) {
    const container = document.getElementById('aiContainer');
    
    // Ensure index is within range
    const validModelIndex = modelIndex % this.FREE_MODELS.length;
    const currentModelObj = this.FREE_MODELS[validModelIndex];
    const currentModelId = currentModelObj.id;

    container.innerHTML = `
      <div class="ai-loading" style="padding: 24px; text-align: center; color: var(--accent-blue); background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <div class="spinner" style="display:inline-block; margin-bottom: 12px; font-size: 32px;">🧠</div>
        <p style="font-weight: 500; font-size: 15px; margin-bottom: 6px;">${window.t('AI is formulating your individualised outcomes...')}</p>
        <p style="font-size: 12px; color: var(--text-muted);">${attemptCount > 0 ? '🔄 Model failover in progress...' : ''} ${window.t('Connecting to:')} <strong>${currentModelObj.name}</strong></p>
      </div>
    `;

    // Spin/pulse animation
    if (!document.getElementById('ai-spinner-style')) {
      const style = document.createElement('style');
      style.id = 'ai-spinner-style';
      style.innerHTML = `@keyframes pulse { 0% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.08); } 100% { opacity: 0.5; transform: scale(0.95); } } .spinner { animation: pulse 1.5s infinite; }`;
      document.head.appendChild(style);
    }

    // Build prompt using assessment data
    const result = window.DementiaApp._lastResult;
    if (!result) {
      container.innerHTML = `<p style="color:#ef4444; padding:15px; background:rgba(239,68,68,0.1); border-radius:8px;">Error: No assessment data found. Please complete the assessment first.</p>`;
      return;
    }

    const language = window.DementiaApp.i18n.locale === 'en' ? 'English' : 
                     window.DementiaApp.i18n.locale === 'vi' ? 'Vietnamese' : 
                     window.DementiaApp.i18n.locale === 'es' ? 'Spanish' : 
                     window.DementiaApp.i18n.locale === 'zh' ? 'Chinese' : 
                     window.DementiaApp.i18n.locale === 'fr' ? 'French' : 'English';

    const riskFactors = result.riskFactors.map(f => f.label).join(', ') || 'None identified';
    const protectiveFactors = result.protectiveFactors.map(f => f.label).join(', ') || 'None reported';
    const background = result.backgroundRisks.map(f => f.label).join(', ') || 'None';
    
    const recsList = window.DementiaApp.Recommendations ? window.DementiaApp.Recommendations.getForProfile(result) : [];
    const recommendations = recsList.map(r => r.title + ': ' + r.action).join('; ') || 'General lifestyle enhancement';

    const systemPrompt = `You are an empathetic, expert dementia prevention specialist and health coach.
Your task is to build a highly tailored, encouraging, and individualised health outcome and action plan based on the user's assessment data.

CRITICAL GUIDELINES:
1. DO NOT diagnose or declare that the user will develop dementia. Frame everything around modifiable risk factors and building cognitive reserve.
2. Structure your response into 3 clear headings:
   - 🌟 **Individualised Profile Summary**: Highlight their strengths and specific risk areas.
   - 🎯 **Tailored Action Steps**: Provide 2-3 realistic, practical steps for daily/weekly implementation.
   - 📈 **Expected Individualised Health Outcomes**: Describe measurable physical, mental, and lifestyle benefits they can achieve by following these steps.
3. Maintain an encouraging, evidence-based, and compassionate tone.
4. Keep the total length concise (250-350 words).
5. MUST write the entire response in ${language}.`;

    const userPrompt = `Here is my assessment summary:
- Risk Category: ${result.band.label}
- Current Protective Habits: ${protectiveFactors}
- Modifiable Risk Factors to Target: ${riskFactors}
- Unchangeable Context/Background Factors: ${background}
- Recommended Clinical Interventions: ${recommendations}

Please generate my individualised outcomes and action plan in ${language}.`;

    const referer = window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'http://localhost:8080';

    return fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': referer,
        'X-Title': 'CogniRisk Dementia Prevention Hub',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: currentModelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          localStorage.removeItem('cognirisk_openrouter_key');
          throw new Error('AUTH_ERROR');
        }
        
        // Auto-fallback if endpoint missing (404), rate-limited (429), or server error (500+)
        if (attemptCount < this.FREE_MODELS.length - 1) {
          console.warn(`Model ${currentModelId} failed (${response.status}). Automatically trying next free model...`);
          const nextIndex = (validModelIndex + 1) % this.FREE_MODELS.length;
          return this.generateInsights(apiKey, nextIndex, attemptCount + 1);
        }
        
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data) return; // Handled by fallback recursion
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const reply = data.choices[0].message.content;
        this.renderResponse(reply, currentModelObj);
      } else {
        throw new Error('Unexpected API response structure');
      }
    })
    .catch(error => {
      if (error.message === 'AUTH_ERROR') {
        container.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 12px;">
            <h4 style="color: #ef4444; margin-top: 0;">🔑 Invalid or Missing API Key</h4>
            <p style="font-size: 14px; color: var(--text-secondary);">The provided OpenRouter key is invalid or has expired. Please enter your OpenRouter API key.</p>
            <button class="btn btn-primary" onclick="window.DementiaApp.AI.renderKeyPrompt()" style="margin-top: 10px;">Enter API Key</button>
          </div>
        `;
      } else {
        const nextIdx = (validModelIndex + 1) % this.FREE_MODELS.length;
        container.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 12px;">
            <h4 style="color: #ef4444; margin-top: 0;">⚠️ ${window.t('Unable to connect to AI model')} (${currentModelObj.name})</h4>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom:12px;">${error.message}</p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="window.DementiaApp.AI.generateInsights('${apiKey}', ${nextIdx}, 0)">
                🔄 ${window.t('Try Next Free Model')} (${this.FREE_MODELS[nextIdx].name})
              </button>
              <button class="btn btn-secondary" onclick="window.DementiaApp.AI.renderKeyPrompt()">
                ⚙️ ${window.t('Settings / Reset Key')}
              </button>
            </div>
          </div>
        `;
      }
    });
  },

  renderResponse: function(markdownText, modelObj) {
    const container = document.getElementById('aiContainer');
    
    // Enhanced Markdown Parser for rendering structure
    let formatted = markdownText
      .replace(/### (.*?)\n/g, '<h4 style="color:var(--accent-blue); margin-top:16px; margin-bottom:8px; font-size:16px;">$1</h4>')
      .replace(/## (.*?)\n/g, '<h3 style="color:var(--accent-purple,#a78bfa); margin-top:20px; margin-bottom:10px; font-size:18px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- (.*?)/g, '<li style="margin-bottom:6px;">$1</li>')
      .replace(/\n\* (.*?)/g, '<li style="margin-bottom:6px;">$1</li>')
      .replace(/\n([0-9]+)\. (.*?)/g, '<li style="margin-bottom:6px;"><strong>$1.</strong> $2</li>');

    // Wrap list elements
    formatted = formatted.replace(/(<li.*<\/li>)/gs, '<ul style="padding-left:20px; margin: 10px 0;">$1</ul>');
    
    // Handle double line breaks as paragraphs
    const paragraphs = formatted.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<ul')) return p;
      return `<p style="margin-bottom: 12px; line-height: 1.6;">${p.trim()}</p>`;
    }).join('');

    container.innerHTML = `
      <div class="ai-response-card" style="background: linear-gradient(145deg, rgba(37,99,235,0.08), rgba(124,58,237,0.12)); border: 1px solid rgba(124,58,237,0.3); border-radius: 16px; padding: 28px; margin-top: 24px; box-shadow: 0 12px 36px rgba(0,0,0,0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <h3 style="color: var(--accent-blue); display: flex; align-items: center; gap: 10px; margin: 0; font-size: 20px;">
            <span>🤖</span> ${window.t('Your Individualised Outcomes & Coaching Plan')}
          </h3>
          <span style="font-size: 11px; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; color: var(--text-muted);">
            ${modelObj.name}
          </span>
        </div>
        
        <div style="font-size: 15px; color: rgba(255,255,255,0.92);">
          ${paragraphs}
        </div>

        <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <span>Powered by OpenRouter API</span>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-ghost" style="padding: 4px 10px; font-size: 12px;" onclick="window.DementiaApp.AI.renderKeyPrompt()">
              ⚙️ Change Model / Key
            </button>
            <button class="btn btn-ghost" style="padding: 4px 10px; font-size: 12px;" onclick="localStorage.removeItem('cognirisk_openrouter_key'); window.DementiaApp.AI.start();">
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    `;
  }
};


