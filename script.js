/**
 * Saurish Perumalla Resume Website
 * Client-side Interactivity, Theming, and Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCopyButtons();
  initContactForm();
  initResumeModal();
  initScrollAnimations();
  initChatbot();
});

/* ==========================================================================
   Theme Toggle (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('sp-theme', 'light');
        showToast('Switched to light mode');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('sp-theme', 'dark');
        showToast('Switched to dark mode');
      }
    });
  }
}

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section indicator via Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
}

/* ==========================================================================
   Click to Copy Helper
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        showToast(`Selected text: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Website Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Set UI to loading state
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    if (btnText) btnText.textContent = 'Sending message...';
    if (btnIcon) btnIcon.style.display = 'none';
    if (spinner) spinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;

    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'form-status';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/saurish.perumalla@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _replyto: email,
          _subject: `New Resume Inquiry: ${subject} (from ${name})`,
          message: message,
          _autoresponse: `Hi ${name},\n\nThank you for reaching out through my resume website! This email confirms that your message has been successfully received.\n\nSummary of your message:\n• Subject: ${subject}\n• Message:\n"${message}"\n\nI will review it and get back to you shortly.\n\nBest regards,\nSaurish Perumalla\nRocky Hill, CT\nsaurish.perumalla@gmail.com`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success === 'true' || result.success === true) {
        // Message sent successfully
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.className = 'form-status success';
          statusBox.innerHTML = `<strong>✓ Message sent to Saurish!</strong> A confirmation copy has also been sent to your email (<code>${email}</code>).`;
        }
        showToast(`Message sent & confirmation delivered to ${email}!`, 4500);
        form.reset();

        if (btnText) btnText.textContent = 'Message Sent!';
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Send Message';
          if (btnIcon) btnIcon.style.display = 'inline-block';
          if (spinner) spinner.style.display = 'none';
          if (submitBtn) submitBtn.disabled = false;
        }, 3500);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback triggered:', err);
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'form-status error';
        statusBox.innerHTML = `⚠️ Direct delivery encountered an issue. <a href="mailto:saurish.perumalla@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}" style="text-decoration: underline; font-weight: 700;">Click here to send directly via email client</a>.`;
      }
      showToast('Opening email client fallback...', 4000);

      const mailtoLink = `mailto:saurish.perumalla@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoLink;

      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.style.display = 'inline-block';
      if (spinner) spinner.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   Resume Preview Modal & Print
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('view-resume-modal-btn');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      // Open modal first so print styles capture the clean document
      openModal();
      setTimeout(() => {
        window.print();
      }, 200);
    });
  }
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const progressBars = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window && progressBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          requestAnimationFrame(() => {
            setTimeout(() => {
              entry.target.style.width = width;
            }, 50);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => observer.observe(bar));
  }
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="#4c7ce5" stroke-width="2.5" fill="none">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/* ==========================================================================
   AI Chatbot & API Key Integration
   ========================================================================== */
const SAURISH_SYSTEM_PROMPT = `You are the personal AI Assistant for Saurish Perumalla, representing him to recruiters, hiring managers, and visitors on his resume website.
Answer questions accurately, professionally, and enthusiastically using the following resume information:

NAME: Saurish Perumalla
LOCATION: Rocky Hill, CT 06067
PHONE: 860-897-6982
EMAIL: saurish.perumalla@gmail.com

SUMMARY:
First-year undergraduate student with strong problem-solving, multitasking, and adaptability skills. Rapid learner who applies new concepts quickly. Provides reliable support in fast-paced environments while maintaining effective time management.

WORK EXPERIENCE:
• SEO Internship | Bullion Fortune (Edison, New Jersey) | 06/2024 - 08/2026
- Applied SEO strategies at Bullion Fortune to enhance customer visibility and expand digital marketing efforts.
- Contributed innovative ideas and solutions to enhance team performance and outcomes.
- Researched search trends, on-page content optimization, and targeted customer acquisition channels.
- Collaborated with cross-functional team members in a fast-paced business environment.

SKILLS:
• Data analysis (Advanced quantitative evaluation and metric tracking)
• Problem-solving skills (Structured analytical thinking)
• Adaptability (Rapidly recalibrating priorities in high-velocity workflows)
• Multitasking proficiency (Balancing academic excellence with professional commitments)
• Self-motivated (Independent initiative and dependable work ethic)
• Digital marketing & SEO strategy

EDUCATION:
• Rocky Hill High School - Rocky Hill, CT | High School Diploma (06/2026)
• 4-Year Honor Roll (Grades 9, 10, 11, 12 - consistent academic excellence)
• Math Team Member (Grades 9, 10, 11, 12)
• Science Team Member (Grades 9, 10, 11, 12)
• Model UN Member (Grades 9, 10)
• Chess Club (Grades 9, 10)
• JV Tennis (Grade 10)

LANGUAGES:
• Telugu: Native / Bilingual (5/5 proficiency)
• French: Professional working proficiency (3/5 proficiency)

GUIDELINES:
1. Always be polite, professional, concise, and helpful.
2. If asked about something not in Saurish's resume, politely state that it's not listed on his resume and invite the user to contact Saurish directly at saurish.perumalla@gmail.com.
3. Keep responses clear and well-formatted with markdown when helpful (bullet points, bold highlights).`;

function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const settingsBtn = document.getElementById('chatbot-settings-btn');
  const settingsPanel = document.getElementById('chatbot-settings-panel');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  const providerSelect = document.getElementById('ai-provider-select');
  const openrouterModelGroup = document.getElementById('openrouter-model-group');
  const openrouterModelSelect = document.getElementById('openrouter-model-select');
  const apiKeyInput = document.getElementById('api-key-input');
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');
  const saveKeyBtn = document.getElementById('save-api-key-btn');
  const clearKeyBtn = document.getElementById('clear-api-key-btn');
  const keyStatusMsg = document.getElementById('key-status-msg');

  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const chatMessages = document.getElementById('chatbot-messages');
  const typingIndicator = document.getElementById('chatbot-typing');
  const suggestions = document.querySelectorAll('.suggestion-chip');

  if (!toggleBtn || !chatWindow) return;

  // Load saved API settings
  let savedProvider = localStorage.getItem('sp-ai-provider') || 'openrouter';
  const savedKey = (localStorage.getItem('sp-ai-key') || '').trim();
  const savedModel = localStorage.getItem('sp-openrouter-model') || 'openai/gpt-4o-mini';

  // Auto-detect OpenRouter key format
  if (savedKey.startsWith('sk-or-')) {
    savedProvider = 'openrouter';
  }

  if (providerSelect) providerSelect.value = savedProvider;
  if (openrouterModelSelect) openrouterModelSelect.value = savedModel;
  if (apiKeyInput) apiKeyInput.value = savedKey;

  function updateProviderUI() {
    const prov = providerSelect ? providerSelect.value : 'openrouter';
    if (openrouterModelGroup) {
      openrouterModelGroup.style.display = prov === 'openrouter' ? 'block' : 'none';
    }
    if (apiKeyInput) {
      if (prov === 'openrouter') {
        apiKeyInput.placeholder = 'sk-or-v1-... (OpenRouter API key)';
      } else if (prov === 'gemini') {
        apiKeyInput.placeholder = 'AIzaSy... (Gemini API key)';
      } else {
        apiKeyInput.placeholder = 'sk-... (OpenAI API key)';
      }
    }
  }

  if (providerSelect) {
    providerSelect.addEventListener('change', updateProviderUI);
  }
  updateProviderUI();

  // Key input listener to auto-detect OpenRouter keys
  if (apiKeyInput) {
    apiKeyInput.addEventListener('input', () => {
      const val = apiKeyInput.value.trim();
      if (val.startsWith('sk-or-') && providerSelect && providerSelect.value !== 'openrouter') {
        providerSelect.value = 'openrouter';
        updateProviderUI();
        showToast('Detected OpenRouter API key format');
      }
    });
  }

  updateKeyStatusDisplay(savedKey);

  // Toggle Chat Window
  function openChat() {
    chatWindow.style.display = 'flex';
    const bubbleIcon = toggleBtn.querySelector('.chat-bubble-icon');
    const closeIcon = toggleBtn.querySelector('.chat-close-icon');
    if (bubbleIcon) bubbleIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = 'block';
    const pingDot = toggleBtn.querySelector('.chatbot-ping-dot');
    if (pingDot) pingDot.style.display = 'none';
    if (chatInput) chatInput.focus();
    scrollChatBottom();
  }

  function closeChat() {
    chatWindow.style.display = 'none';
    const bubbleIcon = toggleBtn.querySelector('.chat-bubble-icon');
    const closeIcon = toggleBtn.querySelector('.chat-close-icon');
    if (bubbleIcon) bubbleIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () => {
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
      openChat();
    } else {
      closeChat();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  // Toggle Settings Panel
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display !== 'none';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (settingsCloseBtn && settingsPanel) {
    settingsCloseBtn.addEventListener('click', () => {
      settingsPanel.style.display = 'none';
    });
  }

  // Toggle Key Visibility
  if (toggleKeyBtn && apiKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
      toggleKeyBtn.textContent = apiKeyInput.type === 'password' ? '👁️' : '🔒';
    });
  }

  // Save Key
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const keyVal = (apiKeyInput ? apiKeyInput.value.trim() : '');
      let provVal = (providerSelect ? providerSelect.value : 'openrouter');
      if (keyVal.startsWith('sk-or-')) {
        provVal = 'openrouter';
        if (providerSelect) providerSelect.value = 'openrouter';
        updateProviderUI();
      }
      const modelVal = (openrouterModelSelect ? openrouterModelSelect.value : 'openai/gpt-4o-mini');

      if (!keyVal) {
        showToast('Please enter an API key first.');
        return;
      }

      localStorage.setItem('sp-ai-key', keyVal);
      localStorage.setItem('sp-ai-provider', provVal);
      localStorage.setItem('sp-openrouter-model', modelVal);
      updateKeyStatusDisplay(keyVal);
      showToast(`API Key saved! Provider: ${provVal}`);
      if (settingsPanel) settingsPanel.style.display = 'none';
    });
  }

  // Clear Key
  if (clearKeyBtn) {
    clearKeyBtn.addEventListener('click', () => {
      localStorage.removeItem('sp-ai-key');
      if (apiKeyInput) apiKeyInput.value = '';
      updateKeyStatusDisplay('');
      showToast('API Key removed. Using built-in knowledge base.');
    });
  }

  function updateKeyStatusDisplay(key) {
    if (!keyStatusMsg) return;
    if (key) {
      keyStatusMsg.className = 'key-status-msg active';
      keyStatusMsg.textContent = '✓ Active API Key configured';
    } else {
      keyStatusMsg.className = 'key-status-msg';
      keyStatusMsg.textContent = '⚡ No key set (using built-in knowledge base)';
    }
  }

  // Suggestion chips
  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && chatInput) {
        chatInput.value = query;
        handleUserMessage(query);
      }
    });
  });

  // Submit Form
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;
      handleUserMessage(query);
    });
  }

  async function handleUserMessage(query) {
    if (chatInput) chatInput.value = '';

    // Append user message
    appendMessage(query, 'user');
    scrollChatBottom();

    // Show typing
    if (typingIndicator) typingIndicator.style.display = 'flex';
    scrollChatBottom();

    try {
      const answer = await getAIResponse(query);
      if (typingIndicator) typingIndicator.style.display = 'none';
      appendMessage(answer, 'bot');
    } catch (err) {
      console.error('AI Chatbot error:', err);
      if (typingIndicator) typingIndicator.style.display = 'none';
      const fallback = getKnowledgeBaseResponse(query);
      appendMessage(
        `<p style="color: #ef4444; font-size: 0.8rem; margin-bottom: 6px;">⚠️ <em>Could not connect to LLM API (${err.message}). Showing answer from built-in knowledge base:</em></p>${fallback}`,
        'bot'
      );
    }

    scrollChatBottom();
  }

  function appendMessage(content, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}-msg`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = sender === 'bot' ? 'SP' : 'You';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (sender === 'user') {
      bubble.textContent = content;
    } else {
      bubble.innerHTML = formatChatContent(content);
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
  }

  function scrollChatBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

/* ==========================================================================
   AI Response Generator (Live API or Knowledge Base)
   ========================================================================== */
async function getAIResponse(userQuery) {
  const apiKey = (localStorage.getItem('sp-ai-key') || '').trim();
  let provider = localStorage.getItem('sp-ai-provider') || 'openrouter';

  // Automatically treat sk-or- keys as OpenRouter
  if (apiKey.startsWith('sk-or-')) {
    provider = 'openrouter';
  }

  if (!apiKey) {
    // Artificial small delay for natural conversational feel
    await new Promise(r => setTimeout(r, 650));
    return getKnowledgeBaseResponse(userQuery);
  }

  if (provider === 'openrouter' || apiKey.startsWith('sk-or-')) {
    const model = localStorage.getItem('sp-openrouter-model') || 'openai/gpt-4o-mini';
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Saurish Perumalla Resume AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SAURISH_SYSTEM_PROMPT },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `OpenRouter HTTP ${res.status}`);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response text returned from OpenRouter');
    return text;
  } else if (provider === 'gemini') {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SAURISH_SYSTEM_PROMPT}\n\nVisitor Question: ${userQuery}\n\nAssistant Response:` }]
          }
        ]
      })
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response text returned');
    return text;
  } else if (provider === 'openai') {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SAURISH_SYSTEM_PROMPT },
          { role: 'user', content: userQuery }
        ],
        max_tokens: 450
      })
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `OpenAI HTTP ${res.status}`);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response text returned');
    return text;
  }

  return getKnowledgeBaseResponse(userQuery);
}

/* ==========================================================================
   Built-In Knowledge Base (Works Out of the Box Without API Key)
   ========================================================================== */
function getKnowledgeBaseResponse(query) {
  const q = query.toLowerCase();

  const footnote = `<p style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted); border-top: 1px dashed var(--card-border); padding-top: 6px;">💡 <em>Powered by built-in resume knowledge base. Click ⚙️ above to connect a Gemini or OpenAI API key!</em></p>`;

  if (q.includes('bullion') || q.includes('intern') || q.includes('seo') || q.includes('experience') || q.includes('work') || q.includes('job')) {
    return `<strong>SEO Internship @ Bullion Fortune</strong> (Edison, New Jersey | 06/2024 &ndash; 08/2026):
<ul>
  <li>Applied SEO strategies at Bullion Fortune to enhance customer visibility and expand digital marketing efforts.</li>
  <li>Contributed innovative ideas and solutions to boost team performance and search outcomes.</li>
  <li>Researched keyword discovery, trend tracking, and conversion pathways in a fast-paced environment.</li>
</ul>${footnote}`;
  }

  if (q.includes('skill') || q.includes('strength') || q.includes('abilit') || q.includes('data analys') || q.includes('problem')) {
    return `Saurish's core competencies highlighted on his resume include:
<ul>
  <li><strong>Data Analysis</strong>: Advanced quantitative evaluation, metric tracking, and digital insights.</li>
  <li><strong>Problem-Solving Skills</strong>: Structured analytical logic built through competitive STEM teams.</li>
  <li><strong>Adaptability</strong>: Rapidly absorbing emerging workflows in fast-moving environments.</li>
  <li><strong>Multitasking Proficiency</strong>: Balancing academic rigor, extracurricular leadership, and internship deliverables.</li>
  <li><strong>Self-Motivated</strong>: Independent initiative and reliable follow-through.</li>
</ul>${footnote}`;
  }

  if (q.includes('school') || q.includes('education') || q.includes('high school') || q.includes('rocky hill') || q.includes('honor') || q.includes('math') || q.includes('science') || q.includes('club') || q.includes('tennis') || q.includes('chess') || q.includes('mun') || q.includes('model un')) {
    return `<strong>Education & Honors:</strong>
<ul>
  <li><strong>Rocky Hill High School</strong> (Rocky Hill, CT) &mdash; High School Diploma (06/2026).</li>
  <li><strong>4-Year Honor Roll</strong> (Grades 9, 10, 11, 12) &mdash; Consistent academic distinction.</li>
  <li><strong>Extracurricular Leadership</strong>:
    <ul>
      <li>Math Team Member (Grades 9, 10, 11, 12)</li>
      <li>Science Team Member (Grades 9, 10, 11, 12)</li>
      <li>Model UN Member (Grades 9, 10)</li>
      <li>Chess Club (Grades 9, 10)</li>
      <li>JV Tennis Athlete (Grade 10)</li>
    </ul>
  </li>
</ul>${footnote}`;
  }

  if (q.includes('language') || q.includes('speak') || q.includes('french') || q.includes('telugu')) {
    return `Saurish speaks two languages:
<ul>
  <li><strong>Telugu</strong>: Native / Bilingual fluency (5 out of 5 proficiency bars).</li>
  <li><strong>French</strong>: Professional working proficiency (3 out of 5 proficiency bars).</li>
</ul>${footnote}`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('hire') || q.includes('message') || q.includes('location')) {
    return `You can get in touch with Saurish directly:
<ul>
  <li><strong>Email</strong>: <a href="mailto:saurish.perumalla@gmail.com" style="color: var(--primary-blue); font-weight: 600;">saurish.perumalla@gmail.com</a></li>
  <li><strong>Phone</strong>: <a href="tel:860-897-6982" style="color: var(--primary-blue); font-weight: 600;">860-897-6982</a></li>
  <li><strong>Location</strong>: Rocky Hill, CT 06067</li>
  <li>Or use the <strong>"Send a Quick Message"</strong> form on this page!</li>
</ul>${footnote}`;
  }

  if (q.includes('background') || q.includes('who') || q.includes('about') || q.includes('summary') || q.includes('profile')) {
    return `Saurish Perumalla is a <strong>first-year undergraduate student</strong> based in Rocky Hill, CT with strong problem-solving, multitasking, and adaptability skills.
<p>He is a rapid learner who applies new concepts quickly and provides reliable support in fast-paced environments while maintaining effective time management. He has hands-on professional experience in SEO and digital marketing from his internship at Bullion Fortune.</p>${footnote}`;
  }

  return `Saurish Perumalla is a first-year undergraduate student and SEO intern (Bullion Fortune) with a background in competitive STEM (4-year Honor Roll, Math & Science teams) and bilingual fluency in Telugu and French.
<p>Would you like to know more about his <strong>work experience</strong>, <strong>core skills</strong>, <strong>education</strong>, or <strong>how to get in touch</strong>?</p>${footnote}`;
}

/* Format basic markdown for chat display */
function formatChatContent(rawText) {
  if (rawText.startsWith('<') && rawText.includes('</')) {
    return rawText; // Already HTML
  }

  let formatted = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Bullet lists
  formatted = formatted.replace(/(?:^|\n)[•\-]\s+(.+)/g, '<li>$1</li>');
  if (formatted.includes('<li>')) {
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }
  // Line breaks to paragraphs
  formatted = formatted.split('\n\n').map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '').join('');

  return formatted;
}
