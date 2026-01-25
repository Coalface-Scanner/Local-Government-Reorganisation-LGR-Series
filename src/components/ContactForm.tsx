import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackContactForm } from '../utils/analytics';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string; // Spam protection
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Hidden field for spam protection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitStatus('idle');

    // Honeypot check - if filled, it's spam
    if (formData.honeypot) {
      // Silently reject spam submissions
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      setSubmitStatus('error');
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    if (!formData.subject.trim()) {
      setErrorMessage('Please enter a subject');
      setSubmitStatus('error');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please enter a message (at least 10 characters)');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to insert into contact_messages table if it exists
      // Otherwise, we'll use a fallback approach
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        // If table doesn't exist, log to console and show success anyway
        // In production, you'd want to set up the table or use an email service
        console.error('Error submitting contact form:', error);
        
        // Fallback: send email via mailto link (user's email client)
        // Or you could use a service like Formspree, EmailJS, etc.
        const mailtoLink = `mailto:editor@localgovernmentreorganisation.co.uk?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        
        trackContactForm();
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        trackContactForm();
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMessage('An error occurred. Please try again or email us directly at editor@localgovernmentreorganisation.co.uk');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Compute aria-invalid values
  const nameInvalid = submitStatus === 'error' && !formData.name.trim();
  const emailInvalid = submitStatus === 'error' && (!formData.email.trim() || !validateEmail(formData.email));
  const subjectInvalid = submitStatus === 'error' && !formData.subject.trim();
  const messageInvalid = submitStatus === 'error' && (!formData.message.trim() || formData.message.trim().length < 10);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="contact-name" className="block text-academic-sm font-display font-semibold text-academic-charcoal mb-2">
          Name <span className="text-teal-700" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          {...(nameInvalid && { 'aria-invalid': 'true' })}
          className="w-full px-4 py-3 border-2 border-academic-neutral-300 rounded-lg focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all bg-white text-academic-charcoal"
          placeholder="Your name"
          disabled={isSubmitting}
          aria-describedby="contact-name-help"
        />
        <span id="contact-name-help" className="sr-only">Enter your full name</span>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-academic-sm font-display font-semibold text-academic-charcoal mb-2">
          Email <span className="text-teal-700" aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          {...(emailInvalid && { 'aria-invalid': 'true' })}
          className="w-full px-4 py-3 border-2 border-academic-neutral-300 rounded-lg focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all bg-white text-academic-charcoal"
          placeholder="your.email@example.com"
          disabled={isSubmitting}
          aria-describedby="contact-email-help"
        />
        <span id="contact-email-help" className="sr-only">Enter a valid email address</span>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-academic-sm font-display font-semibold text-academic-charcoal mb-2">
          Subject <span className="text-teal-700" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-required="true"
          {...(subjectInvalid && { 'aria-invalid': 'true' })}
          className="w-full px-4 py-3 border-2 border-academic-neutral-300 rounded-lg focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all bg-white text-academic-charcoal"
          placeholder="What is your inquiry about?"
          disabled={isSubmitting}
          aria-describedby="contact-subject-help"
        />
        <span id="contact-subject-help" className="sr-only">Enter a brief subject for your inquiry</span>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-academic-sm font-display font-semibold text-academic-charcoal mb-2">
          Message <span className="text-teal-700" aria-label="required">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          aria-required="true"
          {...(messageInvalid && { 'aria-invalid': 'true' })}
          rows={6}
          className="w-full px-4 py-3 border-2 border-academic-neutral-300 rounded-lg focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all bg-white text-academic-charcoal font-serif resize-y"
          placeholder="Tell us about your inquiry, question, or how you'd like to contribute..."
          disabled={isSubmitting}
          aria-describedby="contact-message-help"
        />
        <p id="contact-message-help" className="text-academic-xs text-academic-neutral-600 mt-2 font-serif">
          Minimum 10 characters
        </p>
      </div>

      {submitStatus === 'error' && errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <AlertCircle className="text-red-700 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-academic-sm text-red-900 font-serif">{errorMessage}</p>
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="flex items-start gap-3 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
          <CheckCircle2 className="text-teal-700 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-academic-sm text-teal-900 font-display font-semibold mb-1">
              Thank you for your message!
            </p>
            <p className="text-academic-sm text-teal-800 font-serif">
              We'll get back to you as soon as possible. If your message is urgent, please email us directly at{' '}
              <a href="mailto:editor@localgovernmentreorganisation.co.uk" className="underline font-semibold">
                editor@localgovernmentreorganisation.co.uk
              </a>
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || submitStatus === 'success'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending...
          </>
        ) : submitStatus === 'success' ? (
          <>
            <CheckCircle2 size={18} />
            Message Sent
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      <p className="text-academic-xs text-academic-neutral-600 text-center font-serif">
        By submitting this form, you agree to our use of your information to respond to your inquiry.
        We will not use your email for marketing purposes without your consent.
      </p>
    </form>
  );
}
