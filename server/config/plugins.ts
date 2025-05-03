import { env } from "process";

export default () => ({
    documentation: {
      enabled: true,
      config: {
        // Optional config
        info: {
          title: 'API Docs',
          description: 'Generated API documentation',
          version: '1.0.0',
        },
      },
    },
    email: {
        config: {
          provider: 'strapi-provider-email-resend',
          providerOptions: {
            apiKey: process.env.RESEND_API_KEY, // Required
          },
          settings: {
            defaultFrom: 'onboarding@resend.dev',
            defaultReplyTo: 'onboarding@resend.dev',
          },
        }
    }
  });
  