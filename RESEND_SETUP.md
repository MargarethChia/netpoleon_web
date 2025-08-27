# Resend Email Bot Setup Guide

## 🚀 **Quick Setup for Development**

### **1. Environment Variables**
Create a `.env.local` file in your project root:
```bash
# .env.local
RESEND_API_KEY=your_actual_resend_api_key_here
```

### **2. Resend Account Setup**
1. **Sign up** at [resend.com](https://resend.com)
2. **Get your API key** from the dashboard
3. **Verify your domain** (or use test mode for development)

### **3. Development Configuration**

#### **Option A: Test Mode (Recommended for Dev)**
For development, you can use Resend's test mode:
- No domain verification required
- Emails sent to verified test addresses
- Perfect for testing contact forms

#### **Option B: Domain Verification**
For production:
1. Add your domain in Resend dashboard
2. Update DNS records as instructed
3. Wait for verification (usually 24-48 hours)

### **4. Update Email Addresses**
In `src/app/api/contact/route.ts`, update these lines:

```typescript
// Change these to your actual email addresses
from: 'Netpoleon Contact Form <noreply@yourdomain.com>',
to: ['info@netpoleon.com'],
```

For development, you can use:
```typescript
from: 'Netpoleon Contact Form <onboarding@resend.dev>',
to: ['your-email@example.com'], // Your email for testing
```

### **5. Test the Integration**
1. **Start your dev server**: `npm run dev`
2. **Fill out the contact form**
3. **Submit and check your email**
4. **Check browser console for any errors**

### **6. Email Templates**
The system automatically creates different email templates:
- **General inquiries**: Standard contact form
- **Partner applications**: Partnership-specific format
- **Vendor partnerships**: Vendor inquiry format

### **7. Features Included**
✅ **Form validation** and error handling  
✅ **Loading states** and success messages  
✅ **Automatic confirmation emails** to users  
✅ **Different email formats** based on subject  
✅ **File upload support** for partnerships  
✅ **Responsive design** and accessibility  

### **8. Troubleshooting**
- **Check browser console** for API errors
- **Verify API key** is correct in `.env.local`
- **Check Resend dashboard** for email delivery status
- **Ensure domain verification** if using custom domain

### **9. Production Considerations**
- **Rate limiting**: Resend has daily/monthly limits
- **Domain reputation**: Use verified domains for better delivery
- **Email templates**: Customize HTML templates for branding
- **Monitoring**: Set up webhooks for delivery tracking

## 🎯 **Ready to Test!**
Your contact form is now fully integrated with Resend. Users can submit forms and receive automatic confirmation emails while you get notified of all inquiries!
