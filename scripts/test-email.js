#!/usr/bin/env node

// Email Testing Script
// This script tests email delivery configuration

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.production' });

async function testEmail() {
  console.log('📧 Testing Email Configuration...\n');

  // Check environment variables
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  From: ${process.env.SMTP_FROM}`);
  console.log('');

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verify connection
    console.log('1️⃣ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');

    // Send test email
    console.log('2️⃣ Sending test email...');

    const testEmail = process.argv[2] || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: testEmail,
      subject: 'OneTouch BizCard - Test Email',
      text: 'This is a test email from OneTouch BizCard production environment.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OneTouch BizCard Test Email</h2>
          <p>This is a test email from the OneTouch BizCard production environment.</p>
          <p>If you received this email, your email configuration is working correctly!</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toISOString()}<br>
            Environment: ${process.env.NODE_ENV || 'development'}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Recipient: ${testEmail}`);
    console.log('');
    console.log('✅ Email configuration is working correctly!');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    process.exit(1);
  }
}

// Run test
testEmail();
