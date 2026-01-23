import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force dynamic rendering - prevent static analysis during build
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Check for API key first with better error handling
  const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'Email service not configured',
      },
      { status: 500 }
    );
  }

  // Validate API key format (Resend keys start with 're_')
  if (!apiKey.startsWith('re_')) {
    return NextResponse.json(
      {
        error: 'Invalid API key format',
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      company,
      subject,
      message,
      partnerFile,
      isPartnerApplication,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content based on subject type
    let emailSubject = '';
    let emailContent = '';

    if (isPartnerApplication) {
      emailSubject = `New Partner Application: ${firstName} ${lastName} from ${company}`;
      emailContent = `
        <h2>New Partner Application</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        ${partnerFile ? `<p><strong>File Uploaded:</strong> Yes</p>` : ''}
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      `;
    } else {
      emailSubject = `New Contact Form Submission: ${subject}`;
      emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      `;
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Netpoleon Contact Form <noreply@netpoleons.com.au>', // Change this to your verified domain
      to: ['margareth.chia@netpoleons.com'], // Change this to your email
      subject: emailSubject,
      html: emailContent,
      replyTo: email, // Allow replies to go to the sender
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    const confirmationContent = `
      <h2>Thank you for contacting Netpoleon!</h2>
      <p>Dear ${firstName},</p>
      <p>We have received your ${isPartnerApplication ? 'partner application' : 'message'} and will get back to you within 24-48 hours.</p>
      <p><strong>Your submission details:</strong></p>
      <p><strong>Subject:</strong> ${subject}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p>If you have any urgent questions, please call us at 1300 193 170.</p>
      <p>Best regards,<br>The Netpoleon Team</p>
    `;

    try {
      await resend.emails.send({
        from: 'Netpoleon Contact Form <noreply@netpoleons.com.au>', // Change this to your verified domain
        to: [email],
        subject: 'Thank you for contacting Netpoleon',
        html: confirmationContent,
      });
    } catch {
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        data,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
