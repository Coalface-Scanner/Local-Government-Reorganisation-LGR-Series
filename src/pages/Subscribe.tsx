import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import { Mail, FileText, Bell, ArrowRight } from 'lucide-react';

interface SubscribeProps {
  onNavigate: (page: string) => void;
}

export default function Subscribe({ onNavigate }: SubscribeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-4">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1">
              STAY INFORMED
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Subscribe{' '}
            <span className="text-teal-700 font-serif italic">
              for Updates
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Receive each article as it's released, plus access to extended notes, case material, and the 100 Day Playbook
          </p>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <SubscriptionForm />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-8 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                <Mail className="text-white" size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">New Articles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get notified when new insights and analysis are published
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-8 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                <FileText className="text-white" size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Exclusive Content</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access extended case studies and the 100 Day Playbook
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-8 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                <Bell className="text-white" size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Latest Updates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Stay current with research findings and governance insights
              </p>
            </div>
          </div>

          <div className="text-center border-t border-slate-200 pt-12">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-teal-700 font-bold hover:gap-3 transition-all group hover:text-teal-800"
            >
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </section>

      <LastUpdated />
    </div>
  );
}
