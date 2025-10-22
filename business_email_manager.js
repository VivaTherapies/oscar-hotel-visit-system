
// Business Email Configuration Manager
// Professional email integration for Oscar's Hotel Visit Management System

class BusinessEmailManager {
    constructor() {
        this.emailConfig = {
            service: 'custom_smtp',
            host: 'mail.vivatherapies.com', // Custom business domain
            port: 587,
            secure: false,
            auth: {
                user: 'oscar@vivatherapies.com', // Business email
                pass: '' // Will be configured securely
            },
            templates: this.loadEmailTemplates()
        };
        this.initializeEmailJS();
    }

    // Initialize EmailJS for client-side email sending
    initializeEmailJS() {
        // EmailJS configuration for business email
        emailjs.init("user_businessEmailKey123"); // Replace with actual key
        
        // Configure service
        this.emailjsConfig = {
            serviceID: 'service_business_oscar',
            templateID: 'template_hotel_visit',
            userID: 'user_businessEmailKey123'
        };
    }

    // Professional email templates for hotel visits
    loadEmailTemplates() {
        return {
            followUp: {
                subject: "Follow-up: Hotel Visit - {hotel}",
                body: `Dear {contact},

Thank you for taking the time to meet with me today at {hotel}. I enjoyed our discussion about {purpose} and the opportunities for collaboration.

Key points from our meeting:
{notes}

Next Steps:
- {followUpAction}
- Follow-up meeting scheduled for: {followDate}

I look forward to continuing our partnership and exploring how we can work together to enhance your guests' experience.

Best regards,
Oscar
Viva Therapies
oscar@vivatherapies.com
+44 20 XXXX XXXX`
            },
            
            thankYou: {
                subject: "Thank You - {hotel} Partnership Discussion",
                body: `Dear {contact},

Thank you for the warm welcome at {hotel} today. It was a pleasure meeting with you and learning more about your establishment's commitment to guest excellence.

I'm excited about the potential partnership opportunities we discussed, particularly:
- {serviceProposal}
- Implementation timeline: {timeline}
- Expected outcomes: {expectedResults}

I'll follow up with a detailed proposal by {proposalDate} as discussed.

Thank you again for your time and consideration.

Warm regards,
Oscar
Business Development Manager
Viva Therapies
oscar@vivatherapies.com`
            },
            
            serviceProposal: {
                subject: "Service Proposal - {hotel} Partnership Opportunity",
                body: `Dear {contact},

Following our productive meeting at {hotel}, I'm pleased to present our service proposal for enhancing your guests' wellness experience.

Proposed Services:
{serviceDetails}

Investment: {proposedValue}
Implementation: {timeline}
Expected ROI: {expectedROI}

Benefits for {hotel}:
- Enhanced guest satisfaction scores
- Additional revenue stream
- Competitive differentiation
- Premium service offering

I would welcome the opportunity to discuss this proposal in detail. Please let me know your availability for a follow-up meeting.

Best regards,
Oscar
oscar@vivatherapies.com
Viva Therapies - Luxury Wellness Solutions`
            },
            
            meetingRequest: {
                subject: "Meeting Request - {hotel} Partnership Discussion",
                body: `Dear {contact},

I hope this message finds you well. I'm reaching out to explore potential partnership opportunities between Viva Therapies and {hotel}.

We specialize in luxury wellness solutions for premium hotels and have successfully partnered with leading establishments across London to enhance their guest experience offerings.

I would appreciate the opportunity to meet with you to discuss:
- Customized wellness programs for your guests
- Revenue-sharing partnership models
- Implementation strategies that align with your brand

Would you be available for a brief meeting next week? I'm flexible with timing and can accommodate your schedule.

Thank you for your consideration.

Best regards,
Oscar
Business Development Manager
Viva Therapies
oscar@vivatherapies.com
+44 20 XXXX XXXX`
            },
            
            contractRenewal: {
                subject: "Partnership Renewal - {hotel} Contract Discussion",
                body: `Dear {contact},

I hope you're well. As we approach the renewal period for our partnership agreement with {hotel}, I wanted to reach out to discuss the continued success of our collaboration.

Current Partnership Highlights:
- Guest satisfaction improvement: {satisfactionIncrease}%
- Additional revenue generated: £{revenueGenerated}
- Services delivered: {servicesCount} sessions

For the upcoming term, I'd like to propose:
{renewalProposal}

I believe there are exciting opportunities to expand our partnership and deliver even greater value to your guests.

Could we schedule a meeting to discuss the renewal terms and explore new opportunities?

Looking forward to continuing our successful partnership.

Best regards,
Oscar
oscar@vivatherapies.com`
            },
            
            custom: {
                subject: "Custom Email - {hotel}",
                body: `Dear {contact},

{customMessage}

Best regards,
Oscar
Viva Therapies
oscar@vivatherapies.com`
            }
        };
    }

    // Send email using business configuration
    async sendBusinessEmail(templateType, visitData, customData = {}) {
        try {
            const template = this.emailConfig.templates[templateType];
            if (!template) {
                throw new Error(`Template ${templateType} not found`);
            }

            // Merge visit data with template
            const emailData = {
                to_email: visitData.contactEmail || customData.recipientEmail,
                to_name: visitData.contactPerson || customData.recipientName,
                from_name: "Oscar - Viva Therapies",
                from_email: "oscar@vivatherapies.com",
                subject: this.replacePlaceholders(template.subject, visitData, customData),
                message: this.replacePlaceholders(template.body, visitData, customData),
                hotel: visitData.hotel || '',
                contact: visitData.contactPerson || '',
                purpose: visitData.purpose || '',
                notes: visitData.notes || '',
                followDate: visitData.followUpDate || '',
                ...customData
            };

            // Send via EmailJS
            const response = await emailjs.send(
                this.emailjsConfig.serviceID,
                this.emailjsConfig.templateID,
                emailData,
                this.emailjsConfig.userID
            );

            // Log email sent
            this.logEmailSent(emailData, response);
            
            return {
                success: true,
                messageId: response.text,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Email sending failed:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Replace placeholders in email templates
    replacePlaceholders(text, visitData, customData) {
        let result = text;
        const allData = { ...visitData, ...customData };
        
        // Replace all placeholders
        Object.keys(allData).forEach(key => {
            const placeholder = `{${key}}`;
            result = result.replace(new RegExp(placeholder, 'g'), allData[key] || '');
        });
        
        // Replace common placeholders
        result = result.replace(/{hotel}/g, visitData.hotel || '');
        result = result.replace(/{contact}/g, visitData.contactPerson || '');
        result = result.replace(/{purpose}/g, visitData.purpose || '');
        result = result.replace(/{notes}/g, visitData.notes || '');
        result = result.replace(/{followDate}/g, visitData.followUpDate || '');
        
        return result;
    }

    // Log sent emails for tracking
    logEmailSent(emailData, response) {
        const emailLog = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        emailLog.push({
            timestamp: new Date().toISOString(),
            to: emailData.to_email,
            subject: emailData.subject,
            hotel: emailData.hotel,
            status: 'sent',
            messageId: response.text
        });
        
        // Keep last 100 emails
        if (emailLog.length > 100) {
            emailLog.splice(0, emailLog.length - 100);
        }
        
        localStorage.setItem('emailHistory', JSON.stringify(emailLog));
    }

    // Get email history
    getEmailHistory() {
        return JSON.parse(localStorage.getItem('emailHistory') || '[]');
    }

    // Email template editor
    editTemplate(templateType, newTemplate) {
        this.emailConfig.templates[templateType] = newTemplate;
        localStorage.setItem('customEmailTemplates', JSON.stringify(this.emailConfig.templates));
    }

    // Load custom templates
    loadCustomTemplates() {
        const customTemplates = localStorage.getItem('customEmailTemplates');
        if (customTemplates) {
            this.emailConfig.templates = { ...this.emailConfig.templates, ...JSON.parse(customTemplates) };
        }
    }
}

// Initialize global email manager
window.businessEmailManager = new BusinessEmailManager();

// Utility functions for forms
function sendFollowUpEmail(visitData) {
    return window.businessEmailManager.sendBusinessEmail('followUp', visitData);
}

function sendThankYouEmail(visitData) {
    return window.businessEmailManager.sendBusinessEmail('thankYou', visitData);
}

function sendServiceProposal(visitData, proposalData) {
    return window.businessEmailManager.sendBusinessEmail('serviceProposal', visitData, proposalData);
}

function sendMeetingRequest(hotelData, meetingData) {
    return window.businessEmailManager.sendBusinessEmail('meetingRequest', hotelData, meetingData);
}

function sendContractRenewal(visitData, renewalData) {
    return window.businessEmailManager.sendBusinessEmail('contractRenewal', visitData, renewalData);
}

function sendCustomEmail(visitData, customData) {
    return window.businessEmailManager.sendBusinessEmail('custom', visitData, customData);
}

// Email template selector component
function createEmailTemplateSelector(onTemplateSelect) {
    const templates = window.businessEmailManager.emailConfig.templates;
    const selector = document.createElement('select');
    selector.className = 'email-template-selector';
    selector.innerHTML = `
        <option value="">Select Email Template</option>
        <option value="followUp">Follow-up Email</option>
        <option value="thankYou">Thank You Email</option>
        <option value="serviceProposal">Service Proposal</option>
        <option value="meetingRequest">Meeting Request</option>
        <option value="contractRenewal">Contract Renewal</option>
        <option value="custom">Custom Email</option>
    `;
    
    selector.addEventListener('change', (e) => {
        if (e.target.value && onTemplateSelect) {
            onTemplateSelect(e.target.value, templates[e.target.value]);
        }
    });
    
    return selector;
}

// Email composer modal
function openEmailComposer(visitData = {}, templateType = '') {
    const modal = document.createElement('div');
    modal.className = 'email-composer-modal';
    modal.innerHTML = `
        <div class="email-composer-content">
            <div class="email-composer-header">
                <h3>📧 Compose Business Email</h3>
                <button class="close-composer" onclick="this.closest('.email-composer-modal').remove()">✕</button>
            </div>
            
            <div class="email-composer-body">
                <div class="email-field">
                    <label>Template:</label>
                    <select id="templateSelector" class="email-template-selector">
                        <option value="">Select Template</option>
                        <option value="followUp">Follow-up Email</option>
                        <option value="thankYou">Thank You Email</option>
                        <option value="serviceProposal">Service Proposal</option>
                        <option value="meetingRequest">Meeting Request</option>
                        <option value="contractRenewal">Contract Renewal</option>
                        <option value="custom">Custom Email</option>
                    </select>
                </div>
                
                <div class="email-field">
                    <label>To:</label>
                    <input type="email" id="recipientEmail" placeholder="recipient@hotel.com" value="${visitData.contactEmail || ''}">
                </div>
                
                <div class="email-field">
                    <label>Subject:</label>
                    <input type="text" id="emailSubject" placeholder="Email subject">
                </div>
                
                <div class="email-field">
                    <label>Message:</label>
                    <textarea id="emailBody" rows="12" placeholder="Email content"></textarea>
                </div>
                
                <div class="email-actions">
                    <button class="btn-send-email" onclick="sendComposedEmail()">📧 Send Email</button>
                    <button class="btn-preview-email" onclick="previewEmail()">👁️ Preview</button>
                    <button class="btn-save-template" onclick="saveAsTemplate()">💾 Save Template</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set initial template if provided
    if (templateType) {
        document.getElementById('templateSelector').value = templateType;
        loadEmailTemplate(templateType, visitData);
    }
    
    // Template selector event
    document.getElementById('templateSelector').addEventListener('change', (e) => {
        if (e.target.value) {
            loadEmailTemplate(e.target.value, visitData);
        }
    });
}

function loadEmailTemplate(templateType, visitData) {
    const template = window.businessEmailManager.emailConfig.templates[templateType];
    if (template) {
        document.getElementById('emailSubject').value = window.businessEmailManager.replacePlaceholders(template.subject, visitData);
        document.getElementById('emailBody').value = window.businessEmailManager.replacePlaceholders(template.body, visitData);
    }
}

async function sendComposedEmail() {
    const emailData = {
        recipientEmail: document.getElementById('recipientEmail').value,
        subject: document.getElementById('emailSubject').value,
        message: document.getElementById('emailBody').value
    };
    
    if (!emailData.recipientEmail || !emailData.subject || !emailData.message) {
        showNotification('Please fill in all email fields', 'error');
        return;
    }
    
    try {
        const result = await window.businessEmailManager.sendBusinessEmail('custom', {}, emailData);
        if (result.success) {
            showNotification('Email sent successfully!', 'success');
            document.querySelector('.email-composer-modal').remove();
        } else {
            showNotification('Failed to send email: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('Email sending failed: ' + error.message, 'error');
    }
}

// Email history viewer
function openEmailHistory() {
    const history = window.businessEmailManager.getEmailHistory();
    const modal = document.createElement('div');
    modal.className = 'email-history-modal';
    modal.innerHTML = `
        <div class="email-history-content">
            <div class="email-history-header">
                <h3>📧 Email History</h3>
                <button class="close-history" onclick="this.closest('.email-history-modal').remove()">✕</button>
            </div>
            
            <div class="email-history-body">
                ${history.length === 0 ? '<p>No emails sent yet.</p>' : 
                  history.reverse().map(email => `
                    <div class="email-history-item">
                        <div class="email-meta">
                            <strong>${email.subject}</strong>
                            <span class="email-date">${new Date(email.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="email-details">
                            To: ${email.to} | Hotel: ${email.hotel || 'N/A'} | Status: ${email.status}
                        </div>
                    </div>
                  `).join('')
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

console.log('Business Email Manager initialized successfully');
