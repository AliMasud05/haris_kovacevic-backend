export const welcomeHtml = (courseName: string, email: string, name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${courseName}</title>
  <style type="text/css">
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
      background-color: #f7f7f7;
    }
    
    /* Container styles */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Header styles */
    .email-header {
      padding: 20px;
      text-align: center;
      background-color: #4f46e5;
      color: #ffffff;
    }
    
    /* Content styles */
    .email-content {
      padding: 30px 20px;
    }
    
    /* User info styles */
    .user-info {
      margin: 25px 0;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }
    
    .info-item {
      margin: 10px 0;
    }
    
    /* Button styles */
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    
    /* Footer styles */
    .email-footer {
      padding: 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
      background-color: #f7f7f7;
    }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .email-content {
        padding: 20px 15px !important;
      }
      
      .button {
        width: 100% !important;
        text-align: center;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #f7f7f7;">
  <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Email Header -->
    <tr>
      <td class="email-header" style="padding: 20px; text-align: center; background-color: #4f46e5; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to ${courseName}</h1>
      </td>
    </tr>
    
    <!-- Email Content -->
    <tr>
      <td class="email-content" style="padding: 30px 20px;">
        <p>Hello ${name},</p>
        <p>Thank you for choosing ${courseName}! We're excited to have you join our learning community and are confident you'll find great value in the course.</p>
        
        <div class="user-info" style="margin: 25px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
          <div class="info-item" style="margin: 10px 0;"><strong>Course:</strong> ${courseName}</div>
          <div class="info-item" style="margin: 10px 0;"><strong>Registered Email:</strong> ${email}</div>
         
        </div>
        
        <p>To get started, simply log in to your account using the button below:</p>
        
        <a href="https://hk-academy.com/login" class="button" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Access Your Course</a>
        
        <p>If you have any questions or need assistance, don't hesitate to reach out—we're happy to help.</p>
        
        <p>Wishing you an engaging and rewarding learning experience!</p>
        
        <p>Best regards,<br>The ${courseName} Team</p>
      </td>
    </tr>
    
    <!-- Email Footer -->
    <tr>
      <td class="email-footer" style="padding: 20px; text-align: center; color: #666666; font-size: 14px; background-color: #f7f7f7;">
        <p>&copy; 2025 Your Learning Platform. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
