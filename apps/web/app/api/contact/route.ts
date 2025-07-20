import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ContactForm = await request.json();
    const { name, email, subject, message, service } = body;

    // Validierung
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Alle Pflichtfelder müssen ausgefüllt werden.' }, { status: 400 });
    }

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 });
    }

    // Transporter konfigurieren
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // E-Mail-Optionen
    const mailOptions = {
      from: `"IVO-TECH Kontaktformular" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'kontakt@ivo-tech.com',
      subject: `Neue Kontaktanfrage: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Neue Kontaktanfrage - IVO-TECH</h2>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Kontaktdaten:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
            ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
          </div>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Betreff:</h3>
            <p>${subject}</p>
          </div>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Nachricht:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          
          <p style="color: #6B7280; font-size: 12px;">
            Diese E-Mail wurde über das Kontaktformular auf ivo-tech.com gesendet.<br>
            Antworten Sie direkt auf diese E-Mail, um mit dem Anfragenden in Kontakt zu treten.
          </p>
        </div>
      `,
      text: `
Neue Kontaktanfrage - IVO-TECH

Kontaktdaten:
Name: ${name}
E-Mail: ${email}
${service ? `Service: ${service}` : ''}

Betreff: ${subject}

Nachricht:
${message}

---
Diese E-Mail wurde über das Kontaktformular auf ivo-tech.com gesendet.
      `,
      replyTo: email,
    };

    // Bestätigungs-E-Mail an den Absender
    const confirmationMailOptions = {
      from: `"IVO-TECH" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `Bestätigung: Ihre Anfrage wurde erhalten - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Vielen Dank für Ihre Anfrage!</h2>
          
          <p>Hallo ${name},</p>
          
          <p>vielen Dank für Ihre Nachricht. Ich habe Ihre Anfrage erhalten und werde mich innerhalb der nächsten 24 Stunden bei Ihnen melden.</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Ihre Anfrage:</h3>
            <p><strong>Betreff:</strong> ${subject}</p>
            ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
            <p><strong>Nachricht:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>
            <strong>Kontaktmöglichkeiten:</strong><br>
            📧 E-Mail: <a href="mailto:kontakt@ivo-tech.com">kontakt@ivo-tech.com</a><br>
            📱 Telefon: <a href="tel:+4917612345678">+49 176 12345678</a><br>
            💬 WhatsApp: <a href="https://wa.me/4917612345678">Direkt schreiben</a>
          </p>
          
          <p>
            Mit freundlichen Grüßen<br>
            <strong>Ivo Mustermann</strong><br>
            IVO-TECH
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          
          <p style="color: #6B7280; font-size: 12px;">
            IVO-TECH - Ihr Partner für moderne IT-Lösungen<br>
            München, Deutschland<br>
            <a href="https://ivo-tech.com">www.ivo-tech.com</a>
          </p>
        </div>
      `,
      text: `
Vielen Dank für Ihre Anfrage!

Hallo ${name},

vielen Dank für Ihre Nachricht. Ich habe Ihre Anfrage erhalten und werde mich innerhalb der nächsten 24 Stunden bei Ihnen melden.

Ihre Anfrage:
Betreff: ${subject}
${service ? `Service: ${service}` : ''}
Nachricht: ${message}

Kontaktmöglichkeiten:
E-Mail: kontakt@ivo-tech.com
Telefon: +49 176 12345678
WhatsApp: https://wa.me/4917612345678

Mit freundlichen Grüßen
Ivo Mustermann
IVO-TECH

---
IVO-TECH - Ihr Partner für moderne IT-Lösungen
München, Deutschland
www.ivo-tech.com
      `,
    };

    // E-Mails senden
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Nachricht wurde erfolgreich gesendet. Sie erhalten in Kürze eine Bestätigung per E-Mail.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);

    return NextResponse.json(
      {
        error:
          'Es ist ein Fehler beim Senden der Nachricht aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
      },
      { status: 500 }
    );
  }
}
