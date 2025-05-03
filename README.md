# Strapi with Resend Email Integration

This project is a Strapi backend with Resend email integration for a modern email confirmation system.

## Features

- Strapi backend with custom email confirmation
- Resend email provider integration
- Beautiful, responsive email templates
- Secure user authentication
- Email confirmation flow

## System Architecture

This project uses Strapi's default email confirmation system with Resend as the email provider. Here's how it works:

1. **Strapi's Default Email Confirmation System**:
   - When a user registers, Strapi generates a confirmation token
   - Strapi handles the email confirmation logic and user state management
   - The confirmation flow is managed by Strapi's Users & Permissions plugin

2. **Resend as Email Provider**:
   - Instead of using Strapi's default email provider, we're using Resend
   - This is configured in `plugins.ts` with the `strapi-provider-email-resend` provider
   - Resend handles the actual sending of emails

3. **Custom Email Template**:
   - We're using Strapi's email template system
   - The template is configured in the Strapi admin panel
   - The template uses Strapi's template variables (`<%= USER.username %>`, `<%= CODE %>`)

4. **Confirmation Flow**:
   - User registers → Strapi generates token
   - Strapi uses Resend to send the confirmation email
   - User clicks link → Strapi verifies the token
   - Strapi updates the user's confirmed status

While we're using Resend for sending emails, the actual email confirmation logic, token generation, and user state management are all handled by Strapi's default system. We've just swapped out the email provider and customized the email template.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Resend API key

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd strapi-resend
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Create a `.env` file in the `server` directory with the following variables:
```env
RESEND_API_KEY=your_resend_api_key
```

4. Start the development server:
```bash
npm run develop
```

5. Configure Email Templates in Strapi Admin:
   - Log in to your Strapi admin panel
   - Go to Settings > Users & Permissions Plugin > Email Templates
   - Select "Email confirmation" template
   - Enable the template by checking "Enable email confirmation"
   - Update the template with the following HTML:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #4F46E5;">Welcome to our platform, <%= USER.username %>!</h1>
  <p>Please confirm your email address by clicking the button below:</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="http://localhost:3000/confirm-email?confirmation=<%= CODE %>" 
       style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Confirm Email Address
    </a>
  </div>
  <p>If you didn't create an account, you can safely ignore this email.</p>
  <p style="color: #666; font-size: 12px; margin-top: 20px;">
    This is an automated message, please do not reply to this email.
  </p>
</div>
```

6. Enable Email Settings:
   - In the Strapi admin panel, go to Settings > Users & Permissions Plugin > Advanced Settings
   - Enable "Email confirmation"
   - Set the "Redirection URL" to your frontend confirmation page (e.g., `http://localhost:3000/confirm-email`)
   - Save the settings

## Email Configuration

The project uses Resend as the email provider with a custom email template for user confirmation. The configuration is set in `server/config/plugins.ts`:

```typescript
email: {
  config: {
    provider: 'strapi-provider-email-resend',
    providerOptions: {
      apiKey: process.env.RESEND_API_KEY,
    },
    settings: {
      defaultFrom: 'onboarding@resend.dev',
      defaultReplyTo: 'onboarding@resend.dev',
    },
  }
}
```

## Email Confirmation Flow

1. User registers with email and password
2. System sends a confirmation email using Resend
3. User clicks the confirmation link in the email
4. User is redirected to the frontend confirmation page
5. Account is confirmed and user can log in

## Custom Email Template

The project uses a custom HTML email template with the following features:
- Responsive design
- Branded styling
- Clear call-to-action button
- User personalization

## STRAPI API Endpoints

- `POST /api/auth/local/register` - Register a new user
- `POST /api/auth/local` - Login
- `GET /api/auth/email-confirmation` - Confirm email
- `POST /api/auth/send-email-confirmation` - Resend confirmation email

## Development

To start the development server:
```bash
npm run develop
```

To build for production:
```bash
npm run build
```

## License

[MIT License](LICENSE) 