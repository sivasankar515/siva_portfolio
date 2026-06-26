// email-config.js
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_kzs4h59',
  TEMPLATE_ID: 'template_lnhv2lz',
  PUBLIC_KEY: 'i_9nIN_tq5clIQMiK',
  enabled: true
};

// ─── Initialize EmailJS (single place, no duplicates) ───────────────────────
(function initEmailJS() {
  if (typeof emailjs === 'undefined') {
    console.error('❌ EmailJS SDK not found. Check the CDN script tag in index.html.');
    return;
  }
  try {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialized with key:', EMAIL_CONFIG.PUBLIC_KEY.slice(0, 6) + '…');
  } catch (e) {
    console.error('❌ emailjs.init() failed:', e);
  }
})();

// ─── Send email ──────────────────────────────────────────────────────────────
async function sendPortfolioEmail(formData) {
  if (!EMAIL_CONFIG.enabled) {
    console.log('📧 Demo mode – email not sent. Data:', formData);
    return { success: true, message: 'Message sent successfully!' };
  }

  if (typeof emailjs === 'undefined') {
    return {
      success: false,
      message: 'Email service unavailable. Please email me directly at sivasankarvenkatesan5@gmail.com'
    };
  }

  // ── Template params must EXACTLY match the variable names in your
  //    EmailJS template (Dashboard → Email Templates → template_o0gneac).
  //    Default names used here: {{user_name}}, {{user_email}},
  //    {{user_subject}}, {{message}}.
  //    Change them here if your template uses different names.
  const templateParams = {
    user_name:    formData.user_name,
    user_email:   formData.user_email,
    user_subject: formData.user_subject,
    message:      formData.message,
    // extra context (add {{fresher_acknowledge}} etc. to the template if you want them)
    fresher_acknowledge: formData.fresher_acknowledge,
    sent_at:  formData.timestamp,
    page_url: formData.page_url
  };

  console.log('📤 Sending via EmailJS…', {
    service:  EMAIL_CONFIG.SERVICE_ID,
    template: EMAIL_CONFIG.TEMPLATE_ID,
    params:   templateParams
  });

  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAIL_CONFIG.PUBLIC_KEY
    );

    console.log('✅ EmailJS success – status:', response.status, response.text);
    return { success: true, message: '✅ Message sent! I\'ll reply soon.' };

  } catch (error) {
    // EmailJS throws an object with .status and .text  ← most useful info
    console.error('❌ EmailJS send failed:', error);
    console.error('   Status :', error.status);
    console.error('   Message:', error.text);

    let hint = '';
    if (error.status === 400) hint = ' (Check your template variable names match exactly.)';
    if (error.status === 401) hint = ' (Invalid Public Key – check EMAIL_CONFIG.PUBLIC_KEY.)';
    if (error.status === 404) hint = ' (Service or Template ID not found – check EMAIL_CONFIG.)';
    if (error.status === 422) hint = ' (Template variable mismatch or missing required field.)';

    return {
      success: false,
      message: `Failed to send (${error.status}${hint}). Email me directly: sivasankarvenkatesan5@gmail.com`
    };
  }
}