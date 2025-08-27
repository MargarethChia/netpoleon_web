import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
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
      isVendorPartnership 
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
    } else if (isVendorPartnership) {
      emailSubject = `New Vendor Partnership Inquiry: ${firstName} ${lastName} from ${company}`;
      emailContent = `
        <h2>New Vendor Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
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
      from: 'Netpoleon Contact Form <netpoleon_admin@resend.dev>', // Change this to your verified domain
      to: ['owen.nicholas.yap@gmail.com'], // Change this to your email
      subject: emailSubject,
      html: emailContent,
      reply_to: email, // Allow replies to go to the sender
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    const confirmationContent = `
      <h2>Thank you for contacting Netpoleon!</h2>
      <p>Dear ${firstName},</p>
      <p>We have received your ${isPartnerApplication ? 'partner application' : isVendorPartnership ? 'vendor partnership inquiry' : 'message'} and will get back to you within 24-48 hours.</p>
      <p><strong>Your submission details:</strong></p>
      <p><strong>Subject:</strong> ${subject}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p>If you have any urgent questions, please call us at +1 (555) 123-4567.</p>
      <p>Best regards,<br>The Netpoleon Team</p>
    `;

    await resend.emails.send({
      from: 'Netpoleon <noreply@yourdomain.com>', // Change this to your verified domain
      to: [email],
      subject: 'Thank you for contacting Netpoleon',
      html: confirmationContent,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        data 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
