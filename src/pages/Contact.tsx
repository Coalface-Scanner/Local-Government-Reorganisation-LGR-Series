import { Mail, Send } from 'lucide-react';
import SubscriptionForm from '../components/SubscriptionForm';
import MetaTags from '../components/MetaTags';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <MetaTags
        title="Contact - Editorial Team & Inquiries"
        description="Get in touch with the LGR Series editorial team. For editorial inquiries, research questions, contributions, or to subscribe to The Dispatch newsletter for weekly insights."
        keywords="LGR contact, editorial inquiries, research questions, contribute to LGR series, newsletter subscription"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-4">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1">
              GET IN TOUCH
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Contact{' '}
            <span className="text-teal-700 font-serif italic">
              the Series
            </span>
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Have questions about the research, want to contribute insights, or need to discuss
            specific reorganisation challenges? We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-neutral-900">
                Editorial Team
              </h2>
            </div>
            <p className="text-neutral-700 mb-4">
              For editorial inquiries, research questions, or to contribute case studies:
            </p>
            <a
              href="mailto:insights@coalface.co.uk"
              className="text-teal-700 font-bold hover:text-teal-900 transition-colors"
            >
              insights@coalface.co.uk
            </a>
          </div>

          <div className="bg-white border-2 border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
                <Send size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-neutral-900">
                Subscribe
              </h2>
            </div>
            <p className="text-neutral-700 mb-4">
              Receive new insights as they're published, plus access to case material and the 100 Day Playbook:
            </p>
            <button
              onClick={() => onNavigate('subscribe')}
              className="text-teal-700 font-bold hover:text-teal-900 transition-colors"
            >
              Subscribe to The Dispatch →
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 text-white p-8 mb-12">
          <h2 className="text-2xl font-black mb-4">About COALFACE Insights</h2>
          <p className="text-neutral-300 leading-relaxed mb-4">
            COALFACE Insights produces research-driven analysis on local government, planning, and
            place-making. Our work combines data from the COALFACE Council Scanner™ with evidence
            from real reorganisations to support better decision-making.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="text-teal-400 font-bold hover:text-teal-300 transition-colors"
          >
            Learn more about our methodology →
          </button>
        </div>

        <div className="bg-white border-2 border-neutral-200 p-8">
          <h2 className="text-2xl font-black text-neutral-900 mb-6">
            Subscribe to The Dispatch
          </h2>
          <p className="text-neutral-700 mb-6">
            Get the LGR Series directly in your inbox. No fluff, just deep analysis.
          </p>
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
}
