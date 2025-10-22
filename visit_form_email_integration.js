/**
 * Visit Form Email Integration
 * Allows Oscar to send emails directly to customers from visit forms
 */

class VisitFormEmailManager {
    constructor() {
        this.emailTemplates = {
            followUp: {
                subject: 'Thank you for meeting with Viva Therapies - {{HOTEL_NAME}}',
                body: `Dear {{CONTACT_NAME}},

Thank you for taking the time to meet with me today at {{HOTEL_NAME}}. It was a pleasure discussing how Viva Therapies can support your wellness and spa services.

As discussed, Viva Therapies offers:
• Professional massage therapy services
• Qualified and experienced therapists
• Flexible scheduling to meet your hotel's needs
• Competitive rates and reliable service

{{CUSTOM_MESSAGE}}

I will follow up with you within the next few days with a detailed proposal tailored to {{HOTEL_NAME}}'s specific requirements.

Please don't hesitate to contact me if you have any questions in the meantime.

Best regards,
Oscar
Viva Therapies
Phone: +44 20 1234 5678
Email: oscar@vivatherapies.com`
            },
            
            proposal: {
                subject: 'Service Proposal for {{HOTEL_NAME}} - Viva Therapies',
                body: `Dear {{CONTACT_NAME}},

Following our productive meeting at {{HOTEL_NAME}}, I am pleased to provide you with our service proposal.

Our Proposal Includes:
• Comprehensive massage therapy services
• Qualified therapist placement
• Flexible service packages
• Competitive pricing structure

{{CUSTOM_MESSAGE}}

I have attached our detailed service brochure and rate card for your review.

I would be happy to schedule a follow-up meeting to discuss this proposal in detail and answer any questions you may have.

Thank you for considering Viva Therapies as your wellness partner.

Best regards,
Oscar
Viva Therapies
Phone: +44 20 1234 5678
Email: oscar@vivatherapies.com`
            },
            
            thankYou: {
                subject: 'Thank you for choosing Viva Therapies - {{HOTEL_NAME}}',
                body: `Dear {{CONTACT_NAME}},

Thank you for choosing Viva Therapies for your hotel's wellness services. We are delighted to partner with {{HOTEL_NAME}}.

Next Steps:
• Service agreement finalization
• Therapist scheduling coordination
• Quality assurance protocols
• Regular service reviews

{{CUSTOM_MESSAGE}}

We look forward to providing exceptional service to your guests and maintaining our successful partnership.

Best regards,
Oscar
Viva Therapies
Phone: +44 20 1234 5678
Email: oscar@vivatherapies.com`
            },
            
            custom: {
                subject: 'Follow-up from Viva Therapies - {{HOTEL_NAME}}',
                body: `Dear {{CONTACT_NAME}},

{{CUSTOM_MESSAGE}}

Best regards,
Oscar
Viva Therapies
Phone: +44 20 1234 5678
Email: oscar@vivatherapies.com`
            }
        };
        
        this.initializeEmailJS();
    }
    
    // Initialize EmailJS
    initializeEmailJS() {
        // EmailJS configuration would go here
        // For now, we'll simulate the functionality
        console.log('Email system initialized for visit forms');
    }
    
    // Open email composer from visit form
    openEmailComposer(visitData) {
        const modal = this.createEmailModal(visitData);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Create email modal
    createEmailModal(visitData) {
        const modal = document.createElement('div');
        modal.className = 'email-modal';
        modal.innerHTML = `
            <div class="email-modal-content">
                <div class="email-modal-header">
                    <h3>📧 Send Email to ${visitData.contactPerson || 'Customer'}</h3>
                    <button class="close-btn" onclick="this.closest('.email-modal').remove()">×</button>
                </div>
                
                <div class="email-modal-body">
                    <div class="email-form">
                        <div class="form-group">
                            <label for="emailTemplate">Email Template</label>
                            <select id="emailTemplate" onchange="updateEmailTemplate(this.value)">
                                <option value="">Select Template</option>
                                <option value="followUp">Follow-up Email</option>
                                <option value="proposal">Service Proposal</option>
                                <option value="thankYou">Thank You Email</option>
                                <option value="custom">Custom Email</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="emailTo">To</label>
                            <input type="email" id="emailTo" value="${visitData.contactEmail || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="emailSubject">Subject</label>
                            <input type="text" id="emailSubject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="customMessage">Custom Message (Optional)</label>
                            <textarea id="customMessage" rows="3" placeholder="Add any specific details or custom message..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="emailBody">Email Body</label>
                            <textarea id="emailBody" rows="12" required></textarea>
                        </div>
                        
                        <div class="email-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.email-modal').remove()">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-primary" onclick="previewEmail()">
                                📋 Preview
                            </button>
                            <button type="button" class="btn btn-success" onclick="sendEmail()">
                                📧 Send Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .email-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .email-modal.show {
                opacity: 1;
            }
            
            .email-modal-content {
                background: white;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .email-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .email-modal-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .email-modal-body {
                padding: 25px;
            }
            
            .email-form .form-group {
                margin-bottom: 20px;
            }
            
            .email-form label {
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
                color: #495057;
            }
            
            .email-form input,
            .email-form select,
            .email-form textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .email-form input:focus,
            .email-form select:focus,
            .email-form textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .email-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 25px;
                flex-wrap: wrap;
            }
            
            .email-actions .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .btn-primary {
                background: #667eea;
                color: white;
            }
            
            .btn-success {
                background: #28a745;
                color: white;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
                .email-modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .email-modal-body {
                    padding: 20px;
                }
                
                .email-actions {
                    flex-direction: column;
                }
            }
        `;
        
        if (!document.querySelector('#email-modal-styles')) {
            style.id = 'email-modal-styles';
            document.head.appendChild(style);
        }
        
        // Store visit data for use in email functions
        modal.visitData = visitData;
        
        return modal;
    }
    
    // Update email template
    updateEmailTemplate(templateType, modal) {
        if (!modal) {
            modal = document.querySelector('.email-modal');
        }
        
        if (!templateType || !modal) return;
        
        const visitData = modal.visitData;
        const template = this.emailTemplates[templateType];
        
        if (template) {
            // Update subject
            let subject = template.subject
                .replace('{{HOTEL_NAME}}', visitData.hotelName || 'Your Hotel')
                .replace('{{CONTACT_NAME}}', visitData.contactPerson || 'Valued Partner');
            
            document.getElementById('emailSubject').value = subject;
            
            // Update body
            let body = template.body
                .replace(/{{HOTEL_NAME}}/g, visitData.hotelName || 'Your Hotel')
                .replace(/{{CONTACT_NAME}}/g, visitData.contactPerson || 'Valued Partner')
                .replace('{{CUSTOM_MESSAGE}}', ''); // Will be replaced when sending
            
            document.getElementById('emailBody').value = body;
        }
    }
    
    // Preview email
    previewEmail() {
        const emailData = this.collectEmailData();
        
        const previewWindow = window.open('', '_blank', 'width=600,height=700');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>Email Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                        .email-preview { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
                        .email-header { background: #f8f9fa; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0; }
                        .email-body { white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    <div class="email-preview">
                        <div class="email-header">
                            <strong>To:</strong> ${emailData.to}<br>
                            <strong>Subject:</strong> ${emailData.subject}
                        </div>
                        <div class="email-body">${emailData.body}</div>
                    </div>
                </body>
            </html>
        `);
    }
    
    // Send email
    async sendEmail() {
        const emailData = this.collectEmailData();
        
        if (!emailData.to || !emailData.subject || !emailData.body) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            // Show sending status
            const sendBtn = document.querySelector('.btn-success');
            const originalText = sendBtn.textContent;
            sendBtn.textContent = '📤 Sending...';
            sendBtn.disabled = true;
            
            // Simulate email sending (replace with actual EmailJS integration)
            await this.simulateEmailSend(emailData);
            
            // Save email to history
            this.saveEmailToHistory(emailData);
            
            // Show success message
            alert('Email sent successfully!');
            
            // Close modal
            document.querySelector('.email-modal').remove();
            
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
            
            // Reset button
            const sendBtn = document.querySelector('.btn-success');
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    }
    
    // Collect email data from form
    collectEmailData() {
        const customMessage = document.getElementById('customMessage').value;
        let body = document.getElementById('emailBody').value;
        
        // Replace custom message placeholder
        if (customMessage) {
            body = body.replace('{{CUSTOM_MESSAGE}}', customMessage);
        } else {
            body = body.replace('{{CUSTOM_MESSAGE}}', '');
        }
        
        return {
            to: document.getElementById('emailTo').value,
            subject: document.getElementById('emailSubject').value,
            body: body,
            customMessage: customMessage,
            timestamp: new Date().toISOString()
        };
    }
    
    // Simulate email sending (replace with actual EmailJS)
    simulateEmailSend(emailData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve(emailData);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    // Save email to history
    saveEmailToHistory(emailData) {
        const emailHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        
        const emailRecord = {
            id: 'email_' + Date.now(),
            ...emailData,
            sentAt: new Date().toISOString(),
            status: 'sent'
        };
        
        emailHistory.push(emailRecord);
        localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
        
        console.log('Email saved to history:', emailRecord);
    }
}

// Global functions for use in modal
function updateEmailTemplate(templateType) {
    const modal = document.querySelector('.email-modal');
    if (modal && window.visitEmailManager) {
        window.visitEmailManager.updateEmailTemplate(templateType, modal);
    }
}

function previewEmail() {
    if (window.visitEmailManager) {
        window.visitEmailManager.previewEmail();
    }
}

function sendEmail() {
    if (window.visitEmailManager) {
        window.visitEmailManager.sendEmail();
    }
}

// Initialize email manager
window.visitEmailManager = new VisitFormEmailManager();

// Export for use in visit forms
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitFormEmailManager;
}
