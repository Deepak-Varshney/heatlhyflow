// Email templates in HTML format

export const sendOnboardingRequestConfirmationEmail = (
  firstName: string,
  organizationName: string,
  email: string
): string => {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Onboarding Request Received</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        padding: 40px 30px;
      }
      .greeting {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .message-box {
        background-color: #f0f7ff;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .status-badge {
        display: inline-block;
        background-color: #ffc107;
        color: #000;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        margin: 10px 0;
      }
      .details {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .details-row {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }
      .details-row:last-child {
        border-bottom: none;
      }
      .label {
        font-weight: bold;
        width: 150px;
        color: #667eea;
      }
      .value {
        flex: 1;
        color: #333;
      }
      .next-steps {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .next-steps h3 {
        margin-top: 0;
        color: #4caf50;
      }
      .next-steps ol {
        margin: 10px 0;
        padding-left: 20px;
      }
      .next-steps li {
        margin: 8px 0;
      }
      .button {
        display: inline-block;
        background-color: #667eea;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .button:hover {
        background-color: #764ba2;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      .footer-links {
        margin: 20px 0;
      }
      .footer-links a {
        color: #667eea;
        text-decoration: none;
        margin: 0 10px;
      }
      .divider {
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <p class="logo">HealthyFlow</p>
        <h1>Onboarding Request Received</h1>
        <p>We're excited to have you join our platform!</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">
          Hello <strong>${firstName}</strong>,
        </div>

        <div class="message-box">
          <p>
            Thank you for submitting your onboarding request to HealthyFlow! 
            We've received your application and our team is reviewing the details.
          </p>
        </div>

        <div style="text-align: center;">
          <div class="status-badge">Status: Pending Review</div>
        </div>

        <h2>Request Details</h2>
        <div class="details">
          <div class="details-row">
            <span class="label">Organization:</span>
            <span class="value">${organizationName}</span>
          </div>
          <div class="details-row">
            <span class="label">Email:</span>
            <span class="value">${email}</span>
          </div>
          <div class="details-row">
            <span class="label">Submitted:</span>
            <span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div class="next-steps">
          <h3>What Happens Next?</h3>
          <ol>
            <li>Our team will review your application thoroughly</li>
            <li>We'll verify your credentials and organization details</li>
            <li>Upon approval, you'll receive a login link via email</li>
            <li>You can then set up your team and start using HealthyFlow</li>
          </ol>
        </div>

        <p>
          <strong>Estimated Timeline:</strong> We typically review applications within 24-48 business hours. 
          You'll receive an email notification as soon as your request is approved or if we need additional information.
        </p>

        <p>
          If you have any questions in the meantime, feel free to reach out to our support team at 
          <a href="mailto:support@healthyflow.com">support@healthyflow.com</a>
        </p>

        <p style="color: #666; font-size: 14px;">
          <strong>Note:</strong> Please keep this email for your records. You'll need it for reference when we contact you.
        </p>
      </div>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0; margin-bottom: 20px;">
          © ${currentYear} HealthyFlow. All rights reserved.
        </p>
        
        <div class="footer-links">
          <a href="https://healthyflow.com">Website</a>
          <a href="https://healthyflow.com/contact">Contact Us</a>
          <a href="https://healthyflow.com/privacy">Privacy Policy</a>
          <a href="https://healthyflow.com/terms">Terms of Service</a>
        </div>

        <p style="margin: 20px 0 0 0; color: #999; font-size: 11px;">
          This is an automated email. Please do not reply directly to this message.
          <br>
          If you did not submit this request, please contact us immediately.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};

export const sendApprovalEmail = (
  firstName: string,
  email: string,
  tempPassword: string
): string => {
  const currentYear = new Date().getFullYear();
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in`;
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your HealthyFlow Account is Ready!</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        padding: 40px 30px;
      }
      .success-badge {
        display: inline-block;
        background-color: #4caf50;
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-weight: bold;
        margin: 20px auto;
        text-align: center;
        width: fit-content;
      }
      .message-box {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .credentials {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .credentials h3 {
        margin-top: 0;
        color: #997404;
      }
      .credential-item {
        background-color: #f8f9fa;
        padding: 12px;
        margin: 10px 0;
        border-radius: 4px;
        font-family: monospace;
        word-break: break-all;
      }
      .button {
        display: block;
        background-color: #4caf50;
        color: white;
        padding: 14px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px auto;
        font-weight: bold;
        text-align: center;
        width: fit-content;
      }
      .button:hover {
        background-color: #45a049;
      }
      .steps {
        counter-reset: step-counter;
        margin: 20px 0;
      }
      .step {
        counter-increment: step-counter;
        margin: 15px 0;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
      .step::before {
        content: counter(step-counter);
        display: inline-block;
        margin-right: 10px;
        background-color: #4caf50;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        font-weight: bold;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      .footer-links {
        margin: 20px 0;
      }
      .footer-links a {
        color: #4caf50;
        text-decoration: none;
        margin: 0 10px;
      }
      .divider {
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin: 0;
      }
      .important {
        background-color: #ffebee;
        border-left: 4px solid #f44336;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
        color: #c62828;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <p class="logo">HealthyFlow</p>
        <h1>Congratulations! 🎉</h1>
        <p>Your account is ready to go!</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div style="text-align: center;">
          <div class="success-badge">✓ Approved</div>
        </div>

        <div class="greeting">
          Hello <strong>${firstName}</strong>,
        </div>

        <div class="message-box">
          <p>
            Your onboarding request has been <strong>approved</strong>! 
            We're thrilled to have you join the HealthyFlow community. 
            Your account is now active and ready to use.
          </p>
        </div>

        <h2>Your Login Details</h2>
        <div class="credentials">
          <h3>Email Address</h3>
          <div class="credential-item">${email}</div>
          
          <h3>First Login</h3>
          <p>
            For your first login, you can use Google Authentication or create a password 
            by clicking "Forgot Password" on the login page. We recommend using Google 
            Sign-In for the smoothest experience.
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${loginUrl}" class="button">Login to HealthyFlow</a>
        </div>

        <h2>Getting Started</h2>
        <div class="steps">
          <div class="step">
            <strong>Log In</strong> - Use your email and choose your preferred authentication method
          </div>
          <div class="step">
            <strong>Complete Your Profile</strong> - Add your clinic details and team information
          </div>
          <div class="step">
            <strong>Invite Your Team</strong> - Add doctors and staff members to your organization
          </div>
          <div class="step">
            <strong>Start Using HealthyFlow</strong> - Begin managing patients and appointments
          </div>
        </div>

        <div class="important">
          <strong>⚠️ Important:</strong> Keep your login credentials secure. Never share your email or password with anyone. 
          Our team will never ask you for your password via email.
        </div>

        <h2>Need Help?</h2>
        <p>
          If you need any assistance getting started, our support team is here to help:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@healthyflow.com">support@healthyflow.com</a></li>
          <li><strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM IST</li>
          <li><strong>Live Chat:</strong> Available on our website</li>
        </ul>

        <p>
          Welcome aboard! We're excited to help you transform your healthcare management.
        </p>
      </div>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0; margin-bottom: 20px;">
          © ${currentYear} HealthyFlow. All rights reserved.
        </p>
        
        <div class="footer-links">
          <a href="https://healthyflow.com">Website</a>
          <a href="https://healthyflow.com/docs">Documentation</a>
          <a href="https://healthyflow.com/support">Support</a>
          <a href="https://healthyflow.com/privacy">Privacy Policy</a>
        </div>

        <p style="margin: 20px 0 0 0; color: #999; font-size: 11px;">
          This is an automated email. Please do not reply directly to this message.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};

export const sendRejectionEmail = (
  firstName: string,
  organizationName: string,
  rejectionReason: string
): string => {
  const currentYear = new Date().getFullYear();
  const supportEmail = "support@healthyflow.com";
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Onboarding Request Status Update</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        padding: 40px 30px;
      }
      .message-box {
        background-color: #ffebee;
        border-left: 4px solid #f44336;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .details {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .reason-box {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .button {
        display: inline-block;
        background-color: #f44336;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .button:hover {
        background-color: #e53935;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      .footer-links {
        margin: 20px 0;
      }
      .footer-links a {
        color: #f44336;
        text-decoration: none;
        margin: 0 10px;
      }
      .divider {
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <p class="logo">HealthyFlow</p>
        <h1>Request Status Update</h1>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">
          Hello <strong>${firstName}</strong>,
        </div>

        <div class="message-box">
          <p>
            Thank you for your interest in HealthyFlow. We appreciate the time you took 
            to submit your onboarding request. After careful review, we're unable to 
            approve your application at this time.
          </p>
        </div>

        <div class="details">
          <h3>Request Details</h3>
          <p><strong>Organization:</strong> ${organizationName}</p>
          <p><strong>Status:</strong> Not Approved</p>
        </div>

        <div class="reason-box">
          <h3>Reason for Decision</h3>
          <p>${rejectionReason}</p>
        </div>

        <h3>Next Steps</h3>
        <p>
          If you have questions about this decision or would like to appeal, 
          please don't hesitate to reach out to our team:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:${supportEmail}">${supportEmail}</a>
        </p>

        <p>
          We encourage you to address the concerns mentioned above and feel free to 
          reapply in the future. We're here to support you in meeting our platform requirements.
        </p>

        <p style="color: #666;">
          Thank you for considering HealthyFlow for your healthcare management needs.
        </p>
      </div>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0; margin-bottom: 20px;">
          © ${currentYear} HealthyFlow. All rights reserved.
        </p>
        
        <div class="footer-links">
          <a href="https://healthyflow.com">Website</a>
          <a href="https://healthyflow.com/contact">Contact Us</a>
          <a href="https://healthyflow.com/privacy">Privacy Policy</a>
        </div>

        <p style="margin: 20px 0 0 0; color: #999; font-size: 11px;">
          This is an automated email. Please do not reply directly to this message.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};

export const sendMemberInvitationEmail = (
  firstName: string,
  organizationName: string,
  role: string
): string => {
  const currentYear = new Date().getFullYear();
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/sign-in`;
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to HealthyFlow</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        padding: 40px 30px;
      }
      .message-box {
        background-color: #f0f7ff;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .role-badge {
        display: inline-block;
        background-color: #667eea;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        margin: 10px 0;
      }
      .button {
        display: block;
        background-color: #667eea;
        color: white;
        padding: 14px 30px;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px auto;
        font-weight: bold;
        text-align: center;
        width: fit-content;
      }
      .button:hover {
        background-color: #764ba2;
      }
      .details {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .details-row {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }
      .details-row:last-child {
        border-bottom: none;
      }
      .label {
        font-weight: bold;
        width: 150px;
        color: #667eea;
      }
      .value {
        flex: 1;
        color: #333;
      }
      .next-steps {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .next-steps h3 {
        margin-top: 0;
        color: #4caf50;
      }
      .next-steps ol {
        margin: 10px 0;
        padding-left: 20px;
      }
      .next-steps li {
        margin: 8px 0;
      }
      .important {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
        color: #856404;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      .footer-links {
        margin: 20px 0;
      }
      .footer-links a {
        color: #667eea;
        text-decoration: none;
        margin: 0 10px;
      }
      .divider {
        border-top: 1px solid #ddd;
        margin: 20px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <p class="logo">HealthyFlow</p>
        <h1>You're Invited! 🎉</h1>
        <p>Join us on HealthyFlow</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">
          Hello <strong>${firstName}</strong>,
        </div>

        <div class="message-box">
          <p>
            You have been invited to join <strong>${organizationName}</strong> on HealthyFlow 
            as a <span class="role-badge">${role.toLowerCase()}</span>.
          </p>
          <p>
            HealthyFlow is a comprehensive healthcare management platform designed to streamline 
            appointments, patient management, prescriptions, and more. We're excited to have you on the team!
          </p>
        </div>

        <h2>Your Invitation Details</h2>
        <div class="details">
          <div class="details-row">
            <span class="label">Organization:</span>
            <span class="value">${organizationName}</span>
          </div>
          <div class="details-row">
            <span class="label">Role:</span>
            <span class="value">${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</span>
          </div>
          <div class="details-row">
            <span class="label">Invited:</span>
            <span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${loginUrl}" class="button">Sign In to HealthyFlow</a>
        </div>

        <h2>Getting Started</h2>
        <div class="next-steps">
          <h3>How to Get Started</h3>
          <ol>
            <li>Click the sign-in button above to go to the login page</li>
            <li>Use your email address to sign in</li>
            <li>If you don't have a password yet, click "Forgot Password" to set one</li>
            <li>Complete your profile and start managing HealthyFlow</li>
          </ol>
        </div>

        <div class="important">
          <strong>ℹ️ Note:</strong> If this is your first time signing in, you can use Google Authentication 
          or set up a password through the "Forgot Password" link for a smooth experience.
        </div>

        <h2>Need Help?</h2>
        <p>
          If you have any questions or need assistance, our support team is ready to help:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@healthyflow.com">support@healthyflow.com</a></li>
          <li><strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM IST</li>
        </ul>

        <p style="color: #666; font-size: 14px;">
          <strong>Note:</strong> This invitation is valid for 30 days. If the link expires, 
          please contact your organization administrator.
        </p>
      </div>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0; margin-bottom: 20px;">
          © ${currentYear} HealthyFlow. All rights reserved.
        </p>
        
        <div class="footer-links">
          <a href="https://healthyflow.com">Website</a>
          <a href="https://healthyflow.com/docs">Documentation</a>
          <a href="https://healthyflow.com/support">Support</a>
          <a href="https://healthyflow.com/privacy">Privacy Policy</a>
        </div>

        <p style="margin: 20px 0 0 0; color: #999; font-size: 11px;">
          This is an automated email. Please do not reply directly to this message.
          <br>
          If you did not expect this invitation, please contact your organization administrator.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};
