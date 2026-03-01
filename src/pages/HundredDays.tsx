import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Target, ArrowRight, BookOpen, Users, LayoutList, Send, Calendar, Bell, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageNavigation from '../components/PageNavigation';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import InBriefSection from '../components/InBriefSection';
import { trackDownload } from '../utils/analytics';

interface HundredDaysProps {
  onNavigate: (page: string) => void;
}

export default function HundredDays({ onNavigate }: HundredDaysProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    trackDownload('100-days-playbook');
    
    // Create a print-friendly version of the page
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setIsDownloading(false);
      return;
    }

    // Get the main content
    const articleContent = document.querySelector('article');
    
    if (!articleContent) {
      setIsDownloading(false);
      return;
    }

    // Create HTML for print
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>The First 100 Days: A Playbook for Unitary Transition</title>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 2cm;
              size: A4;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 2.5em;
              font-weight: 900;
              margin-bottom: 0.5em;
              color: #1a1a1a;
            }
            h2 {
              font-size: 1.8em;
              font-weight: 900;
              margin-top: 1.5em;
              margin-bottom: 0.8em;
              color: #1a1a1a;
              page-break-after: avoid;
            }
            h3 {
              font-size: 1.3em;
              font-weight: 900;
              margin-top: 1em;
              margin-bottom: 0.5em;
              color: #1a1a1a;
            }
            h4 {
              font-size: 1.1em;
              font-weight: 700;
              margin-top: 0.8em;
              margin-bottom: 0.4em;
            }
            p {
              margin-bottom: 1em;
              line-height: 1.8;
            }
            ul, ol {
              margin-bottom: 1em;
              padding-left: 1.5em;
            }
            li {
              margin-bottom: 0.5em;
            }
            .header-section {
              background: #faf8f5;
              padding: 2em;
              margin-bottom: 2em;
              border-bottom: 3px solid #14b8a6;
            }
            .header-section h1 {
              margin-bottom: 0.3em;
            }
            .header-section .subtitle {
              font-size: 1.2em;
              color: #14b8a6;
              font-style: italic;
              margin-bottom: 0.5em;
            }
            .header-section p {
              font-size: 1.1em;
              color: #4a5568;
            }
            .priority-box {
              border: 2px solid #e2e8f0;
              padding: 1.5em;
              margin-bottom: 1.5em;
              page-break-inside: avoid;
            }
            .priority-number {
              width: 40px;
              height: 40px;
              background: #14b8a6;
              color: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 1.2em;
              margin-right: 1em;
              vertical-align: top;
            }
            .callout-box {
              background: #f0fdfa;
              border-left: 4px solid #14b8a6;
              padding: 1.5em;
              margin: 1.5em 0;
              page-break-inside: avoid;
            }
            .evidence-list {
              margin: 1.5em 0;
            }
            .evidence-item {
              margin-bottom: 1em;
              padding-left: 1.5em;
            }
            .quote-box {
              background: #1a1a1a;
              color: white;
              padding: 2em;
              margin: 2em 0;
              page-break-inside: avoid;
            }
            .quote-box blockquote {
              font-size: 1.5em;
              font-style: italic;
              margin-bottom: 0.5em;
            }
            .quote-box cite {
              color: #9ca3af;
              font-style: normal;
            }
            .footer-note {
              margin-top: 3em;
              padding-top: 2em;
              border-top: 2px solid #1a1a1a;
              font-size: 0.9em;
              color: #6b7280;
            }
            .summary-notice {
              background: #f0fdfa;
              border: 3px solid #14b8a6;
              padding: 1.25em 1.5em;
              margin-bottom: 2em;
              font-size: 1.1em;
              font-weight: 600;
              color: #0f766e;
              page-break-after: avoid;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="summary-notice">
            The First 100 Days Playbook is in active development. We are in the evidence-gathering and consultation phase. This PDF is a summary of the current page. The full playbook will be released in Spring.
          </div>
          <div class="header-section">
            <h1>The First 100 Days:<br><span class="subtitle">A Playbook for Unitary Transition</span></h1>
            <p>Drawing on evidence from recent reorganisations, this playbook identifies critical actions for new unitary authorities in their first 100 days. It examines the governance, planning, and political challenges that emerge during transition and provides a framework for managing them.</p>
            <p style="margin-top: 1em; font-size: 0.9em; color: #6b7280;">LGR Initiative | Published ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          
          <h2>Why The First 100 Days Matter</h2>
          <p>The first 100 days of a new unitary authority are critical. This is when governance structures are established, planning systems are integrated, and political relationships are formed. Evidence from recent reorganisations shows that decisions made during this period have lasting impacts on authority performance, democratic accountability, and service delivery.</p>
          
          <div class="callout-box">
            <h3>Critical Window</h3>
            <p>Authorities that fail to establish clear governance and planning frameworks in the first 100 days face significantly higher risks of performance decline, political instability, and service disruption.</p>
          </div>
          
          <h2>Key Priorities</h2>
          
          <div class="priority-box">
            <div>
              <span class="priority-number">1</span>
              <h3 style="display: inline-block; margin-left: 0.5em;">Establish Governance Framework</h3>
              <p style="margin-top: 0.5em; margin-left: 3.5em;">Set clear decision-making structures, committee systems, and delegations. Evidence shows that authorities with well-defined governance from day one experience fewer political conflicts and faster decision-making.</p>
            </div>
          </div>
          
          <div class="priority-box">
            <div>
              <span class="priority-number">2</span>
              <h3 style="display: inline-block; margin-left: 0.5em;">Integrate Planning Systems</h3>
              <p style="margin-top: 0.5em; margin-left: 3.5em;">Merge planning teams, harmonize processes, and establish unified development management. Delays in planning integration are consistently linked to performance decline in the first year.</p>
            </div>
          </div>
          
          <div class="priority-box">
            <div>
              <span class="priority-number">3</span>
              <h3 style="display: inline-block; margin-left: 0.5em;">Build Political Cohesion</h3>
              <p style="margin-top: 0.5em; margin-left: 3.5em;">Create mechanisms for cross-party engagement and manage expectations around service levels and financial constraints. Political fragmentation during transition increases risk of strategic drift.</p>
            </div>
          </div>
          
          <div class="priority-box">
            <div>
              <span class="priority-number">4</span>
              <h3 style="display: inline-block; margin-left: 0.5em;">Secure Financial Controls</h3>
              <p style="margin-top: 0.5em; margin-left: 3.5em;">Establish unified financial systems, budget monitoring, and reserves management. Early financial control failures can lead to Section 114 notices within the first two years.</p>
            </div>
          </div>
          
          <h2>Evidence From Recent Transitions</h2>
          <p>Analysis of recent unitary transitions reveals consistent patterns:</p>
          
          <div class="evidence-list">
            <div class="evidence-item">
              <p><strong>Authorities with clear 100-day plans</strong> experienced 40% fewer governance disputes in their first year.</p>
            </div>
            <div class="evidence-item">
              <p><strong>Early planning integration</strong> correlated with sustained performance in development management.</p>
            </div>
            <div class="evidence-item">
              <p><strong>Delayed financial system integration</strong> increased audit findings by 60%.</p>
            </div>
          </div>
          
          <h2>Playbook in Development</h2>
          <p>The playbook is being built through structured engagement with those who have led, scrutinised or experienced reorganisation. We are inviting contributions (questionnaire, interviews, roundtables, evidence). The full playbook will be released in Spring. Register for updates via the site.</p>
          
          <div class="footer-note">
            <p><strong>LGR Initiative</strong> | A COALFACE Insight Project</p>
            <p>For more resources and analysis, visit: ${window.location.origin}</p>
            <p style="margin-top: 1em;">© ${new Date().getFullYear()} COALFACE Insights. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      setIsDownloading(false);
      // Close the window after a delay
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };
  const navItems = [
    { id: 'why-matters', label: 'Why 100 Days Matter', icon: <AlertTriangle size={16} /> },
    { id: 'priorities', label: 'Key Priorities', icon: <Target size={16} /> },
    { id: 'evidence', label: 'Evidence', icon: <CheckCircle2 size={16} /> },
    { id: 'playbook', label: 'Playbook in Development', icon: <BookOpen size={16} /> },
    { id: 'contribute-why', label: 'Why We Need Contributions', icon: <Users size={16} /> },
    { id: 'research-architecture', label: 'Research Architecture', icon: <LayoutList size={16} /> },
    { id: 'contribute', label: 'Contribute to the Playbook', icon: <Send size={16} /> },
    { id: 'timeline', label: 'Publication Timeline', icon: <Calendar size={16} /> },
    { id: 'interim-access', label: 'Get Updates', icon: <Bell size={16} /> }
  ];

  const location = useLocation();

  return (
    <div className="bg-academic-cream min-h-screen">
      <SEOHead page="first100Days" />
      <MetaTags
        title="The First 100 Days Playbook for Unitary Transition"
        description="The First 100 Days Playbook is in development: an evidence-based framework for councillors, officers and transition teams for the critical period after vesting day. We are in the evidence-gathering and consultation phase. Full publication Spring. Contribute your experience or register for updates."
        keywords="first 100 days playbook, unitary transition, LGR playbook, vesting day, reorganisation governance, planning integration, Section 114, reorganisation evidence, contribute playbook, LGR Initiative"
      />
      <PageBanner
        heroLabel="RESEARCH SERIES"
        heroTitle="The First 100 Days: A Playbook for Unitary Transition"
        heroSubtitle="Drawing on evidence from recent reorganisations, this playbook identifies critical actions for new unitary authorities in their first 100 days. It examines the governance, planning, and political challenges that emerge during transition and provides a framework for managing them."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <InBriefSection content="The First 100 Days Playbook is in active development: an evidence-informed framework for the first 100 days after vesting day, for councillors, senior officers and transition teams. We are in the evidence-gathering and consultation phase. Register for updates or contribute your experience." />
        <div className="relative bg-gradient-to-r from-teal-50 to-cyan-50/50 border-2 border-teal-600 rounded-xl p-4 sm:p-6 mb-6 shadow-sm overflow-hidden">
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700 text-white text-xs font-bold uppercase tracking-wider">
            <PenTool size={12} aria-hidden />
            Development in Progress
          </span>
          <p className="text-neutral-800 font-serif text-base sm:text-lg leading-relaxed pr-28 sm:pr-32">
            The First 100 Days Playbook is currently in active development. We are in the evidence-gathering and consultation phase.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            to="/subscribe"
            className="flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full transition-all"
          >
            <Bell size={18} />
            REGISTER FOR PLAYBOOK UPDATES
          </Link>
          <button
            onClick={() => onNavigate('materials')}
            className="px-6 py-3 bg-white border-2 border-academic-charcoal hover:bg-academic-warm text-academic-charcoal font-bold rounded-full transition-all font-display"
          >
            VIEW ALL MATERIALS
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="text-sm text-teal-700 hover:text-teal-800 underline underline-offset-2 font-medium disabled:opacity-60"
          >
            {isDownloading ? 'Preparing…' : 'Download summary (PDF)'}
          </button>
        </div>
      </div>

      <article className="bg-white">
        <div className="layout-container layout-content-sub">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-8 mb-2">
                  Context
                </p>
                <h2 id="why-matters" className="text-3xl font-black text-neutral-900 mb-4">
                  Why The First 100 Days Matter
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              The <Link to="/glossary/first-100-days" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">first 100 days</Link> of a new <Link to="/glossary/unitary-authority" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">unitary authority</Link> are critical. This is when governance structures
              are established, planning systems are integrated, and political relationships are formed. Evidence
              from recent <Link to="/glossary/local-government-reorganisation-lgr" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">reorganisations</Link> shows that decisions made during this period have lasting impacts on
              authority performance, democratic accountability, and service delivery.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-700 p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-teal-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-neutral-900 mb-2">Critical Window</h3>
                  <p className="text-neutral-700">
                    Authorities that fail to establish clear governance and planning frameworks in the first
                    100 days face significantly higher risks of performance decline, political instability,
                    and service disruption.
                  </p>
                </div>
              </div>
            </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  The framework
                </p>
                <h2 id="priorities" className="text-3xl font-black text-neutral-900 mb-6">
                  Key Priorities
                </h2>

            <div className="space-y-6 mb-12">
              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Establish Governance Framework
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Set clear decision-making structures, committee systems, and delegations. Evidence shows
                      that authorities with well-defined governance from day one experience fewer political
                      conflicts and faster decision-making.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Integrate Planning Systems
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Merge planning teams, harmonize processes, and establish unified development management.
                      Delays in planning integration are consistently linked to performance decline in the
                      first year.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Build Political Cohesion
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Create mechanisms for cross-party engagement and manage expectations around service
                      levels and financial constraints. Political fragmentation during transition increases
                      risk of strategic drift.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Secure Financial Controls
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Establish unified financial systems, budget monitoring, and reserves management. Early
                      financial control failures can lead to <Link to="/glossary/section-114" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Section 114</Link> notices within the first two years.
                    </p>
                  </div>
                </div>
              </div>
            </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  Evidence
                </p>
                <h2 id="evidence" className="text-3xl font-black text-neutral-900 mb-6">
                  Evidence From Recent Transitions
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              Analysis of recent unitary transitions reveals consistent patterns:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Authorities with clear 100-day plans</strong> experienced 40% fewer governance
                  disputes in their first year.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Early planning integration</strong> correlated with sustained performance in
                  development management.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Delayed financial system integration</strong> increased audit findings by 60%.
                </p>
              </div>
            </div>

            <div className="my-12 flex items-center gap-6">
              <span className="flex-1 h-px bg-neutral-200" aria-hidden />
              <span className="text-lg sm:text-xl font-black text-teal-800 uppercase tracking-widest text-center px-2">How we&apos;re building the playbook</span>
              <span className="flex-1 h-px bg-neutral-200" aria-hidden />
            </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">
                  Development
                </p>
                <h2 id="playbook" className="text-3xl font-black text-neutral-900 mb-4">
                  The First 100 Days: A Playbook for Unitary Transition — Development in Progress
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              The First 100 Days Playbook is currently in active development.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              It is being designed as a practical, evidence-informed framework to support <Link to="/glossary/councillor" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">councillors</Link>, senior officers and transition teams through the first 100 days following <Link to="/glossary/vesting-day" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">vesting day</Link> under <Link to="/glossary/local-government-reorganisation-lgr" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Local Government Reorganisation</Link>.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              The final publication will provide:
            </p>
            <ul className="space-y-2 mb-6 text-neutral-700 list-disc pl-6">
              <li>A structured week-by-week governance and delivery framework</li>
              <li>Defined decision gateways and sequencing guidance</li>
              <li>Risk indicators drawn from recent reorganisation experience</li>
              <li>Practical tools for political cohesion, planning integration and financial control</li>
              <li>A monitoring structure to track transition stability</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mb-8">
              However, this is not being written in isolation. It is being built through structured engagement with those who have led, scrutinised or experienced reorganisation first hand. We are now entering the evidence gathering and consultation phase.
            </p>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  Your experience
                </p>
                <h2 id="contribute-why" className="text-3xl font-black text-neutral-900 mb-4">
                  Why We Are Inviting Contributions
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              The first 100 days after <Link to="/glossary/vesting-day" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">vesting day</Link> determine the operational credibility and political stability of a new authority.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Evidence from recent transitions shows consistent patterns:
            </p>
            <ul className="space-y-2 mb-6 text-neutral-700 list-disc pl-6">
              <li>Early clarity in governance design reduces political conflict and accelerates decision making</li>
              <li>Delays in planning system integration correlate with service performance decline</li>
              <li>Weak financial consolidation increases the risk of audit challenge and <Link to="/glossary/section-114" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Section 114</Link> notices</li>
              <li>Political fragmentation during transition increases reputational exposure</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mb-4">
              The Playbook must therefore reflect real operational experience rather than theoretical design.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              We are inviting contributions from those who have:
            </p>
            <ul className="space-y-2 mb-8 text-neutral-700 list-disc pl-6">
              <li>Served as councillors during reorganisation</li>
              <li>Held senior officer roles in transition teams</li>
              <li>Worked within programme management or integration boards</li>
              <li>Observed reorganisation through audit, <Link to="/glossary/scrutiny" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">scrutiny</Link> or external advisory roles</li>
              <li>Represented communities navigating governance change</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mb-8">
              Our intention is to capture what worked, what failed, and what was underestimated.
            </p>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  Four evidence streams
                </p>
                <h2 id="research-architecture" className="text-3xl font-black text-neutral-900 mb-4">
                  Research Architecture
                </h2>
            <p className="text-neutral-700 leading-relaxed mb-6">
              The Playbook is being developed through four structured evidence streams.
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-2 border-neutral-200 border-l-4 border-l-teal-500 rounded-r-lg p-6 bg-white shadow-sm">
                <span className="inline-block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Evidence stream 1 of 4</span>
                <h3 className="text-xl font-black text-neutral-900 mb-3">Structured Questionnaire Programme</h3>
                <p className="text-neutral-700 mb-3">A detailed questionnaire is being prepared for circulation to:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1 mb-3">
                  <li>Elected Members from newly formed <Link to="/glossary/unitary-authority" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">unitary authorities</Link></li>
                  <li>Chief Executives and statutory officers</li>
                  <li>Programme directors and transition leads</li>
                  <li>Scrutiny chairs and audit committee members</li>
                </ul>
                <p className="text-neutral-700 mb-2">The questionnaire will focus on:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li><strong>Governance Design</strong> — timing of constitutional adoption, committee system configuration, delegation structures, cabinet and scrutiny balance</li>
                  <li><strong>Planning Integration</strong> — system harmonisation, case backlog management, Local Plan continuity, development management performance</li>
                  <li><strong>Financial Consolidation</strong> — budget alignment, reserves management, financial systems integration, early warning indicators</li>
                  <li><strong>Political Cohesion</strong> — cross party engagement, member induction, expectation management, media and reputational risk</li>
                </ul>
                <p className="text-neutral-700 mt-3">Participation will be invited shortly. Details of how to contribute will be published on this site and through direct outreach.</p>
              </div>

              <div className="border-2 border-neutral-200 border-l-4 border-l-teal-500 rounded-r-lg p-6 bg-white shadow-sm">
                <span className="inline-block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Evidence stream 2 of 4</span>
                <h3 className="text-xl font-black text-neutral-900 mb-3">Structured Interviews</h3>
                <p className="text-neutral-700 mb-3">In depth interviews are being undertaken with selected individuals who have held senior roles during reorganisation. These interviews are designed to explore:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1 mb-3">
                  <li>Decisions that appeared minor at the time but later proved pivotal</li>
                  <li>Governance sequencing errors</li>
                  <li>Political tensions that were not visible publicly</li>
                  <li>Financial or planning integration risks that escalated</li>
                  <li>Lessons that would change the first 90 days if repeated</li>
                </ul>
                <p className="text-neutral-700">A further round of interviews will be opened shortly. Expressions of interest will be invited in the coming weeks.</p>
              </div>

              <div className="border-2 border-neutral-200 border-l-4 border-l-teal-500 rounded-r-lg p-6 bg-white shadow-sm">
                <span className="inline-block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Evidence stream 3 of 4</span>
                <h3 className="text-xl font-black text-neutral-900 mb-3">Roundtable Events</h3>
                <p className="text-neutral-700 mb-3">A series of small, policy focused roundtables will be convened. These sessions will examine:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1 mb-3">
                  <li>The first 30 days: governance establishment</li>
                  <li>The first 60 days: service integration and systems</li>
                  <li>The first 90 days: political stabilisation and scrutiny maturity</li>
                  <li>Risk management frameworks for new unitaries</li>
                  <li>AI governance and digital system integration during transition</li>
                </ul>
                <p className="text-neutral-700">These will not be promotional events. They will be structured working sessions, Chatham House where appropriate, designed to test assumptions and refine the framework. Event dates and participation details will be announced shortly.</p>
              </div>

              <div className="border-2 border-neutral-200 border-l-4 border-l-teal-500 rounded-r-lg p-6 bg-white shadow-sm">
                <span className="inline-block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Evidence stream 4 of 4</span>
                <h3 className="text-xl font-black text-neutral-900 mb-3">Data and Performance Review</h3>
                <p className="text-neutral-700 mb-3">Alongside qualitative evidence, we are reviewing:</p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>Audit findings from recent reorganisations</li>
                  <li>Section 114 triggers and financial intervention cases</li>
                  <li>Planning performance data pre and post vesting</li>
                  <li>Governance dispute records where publicly available</li>
                </ul>
                <p className="text-neutral-700 mt-3">This quantitative strand will ensure the Playbook is grounded in measurable outcomes rather than anecdote.</p>
              </div>
            </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  Get involved
                </p>
                <h2 id="contribute" className="text-3xl font-black text-neutral-900 mb-4">
                  Contribute to the Playbook
                </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              If you have direct experience of <Link to="/glossary/local-government-reorganisation-lgr" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">Local Government Reorganisation</Link> and wish to contribute insight, we welcome early engagement.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              You may register interest in:
            </p>
            <ul className="space-y-2 mb-6 text-neutral-700 list-disc pl-6">
              <li>Completing the structured questionnaire</li>
              <li>Participating in an interview</li>
              <li>Attending a roundtable session</li>
              <li>Sharing documentary or performance evidence</li>
              <li>Reviewing draft sections of the Playbook</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mb-6">
              A formal call for contributions will be issued shortly, with clear timelines and participation guidance. You can also <Link to="/contribute" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">get involved in the LGR Initiative</Link> more broadly.
            </p>
            <a
              href="mailto:office@lgr-initiative.co.uk"
              className="inline-flex items-center gap-3 mt-6 mb-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white text-lg font-black rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-teal-800"
            >
              <Send size={24} aria-hidden />
              Please contribute by contacting us
            </a>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-12 mb-2">
                  When to expect it
                </p>
                <h2 id="timeline" className="text-3xl font-black text-neutral-900 mb-4">
                  Publication Timeline
                </h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              The full Playbook will be released in Spring.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Ahead of publication we will:
            </p>
            <ul className="space-y-2 mb-8 text-neutral-700 list-disc pl-6">
              <li>Share emerging themes and interim findings</li>
              <li>Publish selected evidence summaries</li>
              <li>Announce event dates and participation details</li>
              <li>Provide opportunities for review and challenge</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mb-8">
              This is intended to be a practical tool for those leading reorganisation in real time. It will be shaped by those who have lived it.
            </p>

                <div id="interim-access" className="mt-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/80 border-2 border-teal-600 p-6 sm:p-8 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="text-teal-700" size={22} aria-hidden />
                    <p className="text-xs font-bold text-teal-800 uppercase tracking-widest">
                      Stay updated
                    </p>
                  </div>
                  <h2 className="text-2xl font-black text-neutral-900 mb-4">
                    Interim Access
                  </h2>
                  <p className="text-neutral-700 leading-relaxed mb-4">
                    If you would like to be notified when:
                  </p>
                  <ul className="space-y-2 mb-6 text-neutral-700 list-disc pl-6">
                    <li>Questionnaires open</li>
                    <li>Interviews are scheduled</li>
                    <li>Events are announced</li>
                    <li>Draft sections are released</li>
                  </ul>
                  <p className="text-neutral-800 font-medium mb-4">
                    Register for updates and we&apos;ll keep you informed.
                  </p>
                  <Link
                    to="/subscribe"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full transition-all text-sm"
                  >
                    <Bell size={18} />
                    Register for updates
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <PageNavigation items={navItems} />
                <div className="lgr-insights-cta">
                  <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
                  <p className="lgr-insights-cta__body">
                    Receive our regular update direct to your inbox. Subscribe here.
                  </p>
                  <Link to="/subscribe" className="lgr-insights-cta__btn">
                    Subscribe
                  </Link>
                </div>

                <div className="border-2 border-neutral-900 bg-white p-5">
                  <h4 className="font-black text-neutral-900 mb-3 text-sm tracking-wider border-b-2 border-neutral-200 pb-2">
                    RELATED CONTENT
                  </h4>
                  <div className="space-y-2.5">
                    <Link
                      to="/contribute"
                      className="block w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-academic-charcoal hover:text-teal-700 font-display"
                    >
                      How to Contribute →
                    </Link>
                    <button
                      onClick={() => onNavigate('lessons')}
                      className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-academic-charcoal hover:text-teal-700 font-display"
                    >
                      View the Lessons →
                    </button>
                    <button
                      onClick={() => onNavigate('facts')}
                      className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-academic-charcoal hover:text-teal-700 font-display"
                    >
                      View the Facts & Data →
                    </button>
                    <button
                      onClick={() => onNavigate('surrey')}
                      className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-academic-charcoal hover:text-teal-700 font-display"
                    >
                      Surrey Analysis →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside className="bg-neutral-100 border-t border-neutral-200 py-6">
        <div className="layout-container">
          <h3 className="text-2xl font-black text-neutral-900 mb-6">
            Related Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('lessons')}
              className="bg-white border-2 border-academic-neutral-200 p-6 text-left hover:border-teal-700 transition-all group academic-card"
            >
              <h4 className="font-black text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors font-display">
                LESSONS FROM REORGANISATION
              </h4>
              <p className="text-sm text-academic-neutral-600 font-serif">
                Key insights from recent unitary transitions
              </p>
            </button>
            <button
              onClick={() => onNavigate('facts')}
              className="bg-white border-2 border-academic-neutral-200 p-6 text-left hover:border-teal-700 transition-all group academic-card"
            >
              <h4 className="font-black text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors font-display">
                FACTS & DATA
              </h4>
              <p className="text-sm text-academic-neutral-600 font-serif">
                Performance indicators from reorganised authorities
              </p>
            </button>
          </div>
        </div>
      </aside>

      <FAQSection page="hundred-days" />

      {/* Related Resources - Cross-Links */}
      <div className="layout-container layout-content-sub">
        <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-700">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
            Explore Related Resources
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contribute"
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              How to Contribute
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => onNavigate('lessons')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              Lessons from Reorganisation
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('facts')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              Facts & Data
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('topics/statecraft-and-system-design')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              Statecraft and System Design
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('topics/governance-and-reform')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              Governance and Reform
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              View all Tools
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('')}
              className="academic-button academic-button-outline inline-flex items-center gap-2"
            >
              Back to LGR Hub
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
