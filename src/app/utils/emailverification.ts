export const html = (otp: number) => `
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
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
    
    /* OTP code styles */
    .otp-container {
      margin: 25px 0;
      text-align: center;
    }
    
    .otp-code {
      display: inline-block;
      padding: 15px 30px;
      background-color: #f0f0f0;
      border: 1px dashed #cccccc;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
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
      
      .otp-code {
        font-size: 24px !important;
        padding: 12px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #f7f7f7;">
  <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Email Header -->
    <tr>
      <td class="email-header" style="padding: 20px; text-align: center; background-color: #4f46e5; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Your Verification Code</h1>
      </td>
    </tr>
    
    <!-- Email Content -->
    <tr>
      <td class="email-content" style="padding: 30px 20px;">
        <p>Hello,</p>
        <p>Use the verification code below to complete your action:</p>
        
        <div class="otp-container" style="margin: 25px 0; text-align: center;">
          <div class="otp-code" style="display: inline-block; padding: 15px 30px; background-color: #f0f0f0; border: 1px dashed #cccccc; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</div>
        </div>
        
        <p>This code will expire in 10 minutes.</p>
        
        <p><strong>Important:</strong> If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
        
        <p>Best regards,<br>Your Company Team</p>
      </td>
    </tr>
    
    <!-- Email Footer -->
    <tr>
      <td class="email-footer" style="padding: 20px; text-align: center; color: #666666; font-size: 14px; background-color: #f7f7f7;">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
