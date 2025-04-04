import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { SMTPClient } from 'npm:emailjs@4.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  name: string;
  surname: string;
  tel: string;
  email: string;
  acceptTerms: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const emailData: EmailData = await req.json();

    // Check if all required environment variables are set
    const requiredEnvVars = ['SMTP_USER', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_FROM', 'SMTP_TO'];
    const missingEnvVars = requiredEnvVars.filter(varName => !Deno.env.get(varName));

    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    const client = new SMTPClient({
      user: Deno.env.get('SMTP_USER')!,
      password: Deno.env.get('SMTP_PASSWORD')!,
      host: Deno.env.get('SMTP_HOST')!,
      ssl: true,
    });

    const message = {
      from: Deno.env.get('SMTP_FROM')!,
      to: emailData.email,
      subject: 'New Contact Form Submission',
      text: `
        New contact form submission:
        
        Name: ${emailData.name}
        Surname: ${emailData.surname}
        Phone: ${emailData.tel}
        Email: ${emailData.email}
        Accepted Terms: ${emailData.acceptTerms}
      `,
    };

    console.log('Attempting to send email...');
    await client.send(message);
    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error sending email:', error);

    // Send a more detailed error message to the client
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});