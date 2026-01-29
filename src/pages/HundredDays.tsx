import { useState } from 'react';
import { Download, CheckCircle2, AlertTriangle, Target, FileText, Loader2, ArrowRight } from 'lucide-react';
import PageNavigation from '../components/PageNavigation';
import SubscriptionForm from '../components/SubscriptionForm';
import FAQSection from '../components/FAQSection';
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
            This is a summary. The full playbook, including complete 100-day framework with detailed implementation guidance, will be released in Spring.
          </div>
          <div class="header-section">
            <h1>The First 100 Days:<br><span class="subtitle">A Playbook for Unitary Transition</span></h1>
            <p>Drawing on evidence from recent reorganisations, this playbook identifies critical actions for new unitary authorities in their first 100 days. It examines the governance, planning, and political challenges that emerge during transition and provides a framework for managing them.</p>
            <p style="margin-top: 1em; font-size: 0.9em; color: #6b7280;">LGR Series | Published ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
          
          <div class="quote-box">
            <blockquote>"The agreement is the easy part. Implementation is the real hurdle."</blockquote>
            <cite>— Rowan Cole, Series Editor</cite>
          </div>
          
          <h2>Using This Playbook</h2>
          <p>This playbook provides:</p>
          <ul>
            <li>A week-by-week framework for the first 100 days</li>
            <li>Critical decision points and governance milestones</li>
            <li>Risk indicators drawn from real reorganisation experiences</li>
            <li>Practical tools for monitoring transition progress</li>
          </ul>
          
          <div class="footer-note">
            <p><strong>LGR Series</strong> | A COALFACE Insight Project</p>
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
    { id: 'using', label: 'Using This Playbook', icon: <FileText size={16} /> }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      <MetaTags
        title="LGR Series: The First 100 Days Playbook"
        description="Strategic framework for managing the critical first 100 days of Local Government Reorganisation (LGR) unitary transition. Evidence-based guidance on LGR governance, priorities, risks, and success factors from the LGR Series."
        keywords="LGR Series, Local Government Reorganisation playbook, unitary transition, first 100 days, LGR implementation, LGR governance, council transition plan, reorganisation playbook"
      />
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">RESEARCH SERIES</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              The First 100 Days:{' '}
              <span className="text-teal-700 font-serif italic">
                A Playbook for Unitary Transition
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Drawing on evidence from recent reorganisations, this playbook identifies critical actions
              for new unitary authorities in their first 100 days. It examines the governance, planning,
              and political challenges that emerge during transition and provides a framework for managing them.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <InBriefSection content="The first 100 days after vesting day are critical for new unitary authorities created through Local Government Reorganisation (LGR). This playbook draws on evidence from recent reorganisations to identify key priorities: establishing governance structures, managing service integration, addressing councillor transitions, and maintaining democratic legitimacy. Effective LGR governance during this period sets the foundation for long-term success." />
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                PREPARING PDF...
              </>
            ) : (
              <>
                <Download size={18} />
                DOWNLOAD PLAYBOOK
              </>
            )}
          </button>
          <button
            onClick={() => onNavigate('materials')}
            className="px-6 py-3 bg-white border-2 border-neutral-900 hover:bg-neutral-50 text-neutral-900 font-bold rounded-full transition-all"
          >
            VIEW ALL MATERIALS
          </button>
        </div>
      </div>

      <article className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 id="why-matters" className="text-3xl font-black text-neutral-900 mb-4 mt-8">
                  Why The First 100 Days Matter
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              The first 100 days of a new unitary authority are critical. This is when governance structures
              are established, planning systems are integrated, and political relationships are formed. Evidence
              from recent reorganisations shows that decisions made during this period have lasting impacts on
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

                <h2 id="priorities" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
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
                      financial control failures can lead to Section 114 notices within the first two years.
                    </p>
                  </div>
                </div>
              </div>
            </div>

                <h2 id="evidence" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
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

            <div className="bg-neutral-900 text-white p-8 my-12">
              <blockquote className="text-2xl font-serif italic mb-4">
                "The agreement is the easy part. Implementation is the real hurdle."
              </blockquote>
              <cite className="text-neutral-400 not-italic">— Rowan Cole, Series Editor</cite>
            </div>

                <h2 id="using" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
                  Using This Playbook
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-4">
              This playbook provides:
            </p>

            <ul className="space-y-3 mb-8 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>A week-by-week framework for the first 100 days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Critical decision points and governance milestones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Risk indicators drawn from real reorganisation experiences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Practical tools for monitoring transition progress</span>
              </li>
            </ul>

                <div className="border-t-2 border-neutral-900 pt-8 mt-12">
                  <h3 className="text-xl font-black text-neutral-900 mb-4">
                    Download the Full Playbook
                  </h3>
                  <p className="text-neutral-700 mb-6">
                    The full playbook, including complete 100-day framework with detailed implementation guidance, will be released in Spring.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <PageNavigation items={navItems} />
                <div className="bg-teal-800 text-white p-5">
                  <h3 className="text-xl font-black text-white mb-3">
                    The Dispatch
                  </h3>
                  <p className="text-sm text-white mb-4">
                    Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                  </p>
                  <SubscriptionForm variant="compact" />
                </div>

                <div className="border-2 border-neutral-900 bg-white p-5">
                  <h4 className="font-black text-neutral-900 mb-3 text-sm tracking-wider border-b-2 border-neutral-200 pb-2">
                    RELATED CONTENT
                  </h4>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => onNavigate('lessons')}
                      className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                    >
                      View the Lessons →
                    </button>
                    <button
                      onClick={() => onNavigate('facts')}
                      className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                    >
                      View the Facts & Data →
                    </button>
                    <button
                      onClick={() => onNavigate('surrey')}
                      className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-black text-neutral-900 mb-6">
            Related Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('lessons')}
              className="bg-white border-2 border-neutral-200 p-6 text-left hover:border-teal-700 transition-all group"
            >
              <h4 className="font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                LESSONS FROM REORGANISATION
              </h4>
              <p className="text-sm text-neutral-600">
                Key insights from recent unitary transitions
              </p>
            </button>
            <button
              onClick={() => onNavigate('facts')}
              className="bg-white border-2 border-neutral-200 p-6 text-left hover:border-teal-700 transition-all group"
            >
              <h4 className="font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                FACTS & DATA
              </h4>
              <p className="text-sm text-neutral-600">
                Performance indicators from reorganised authorities
              </p>
            </button>
          </div>
        </div>
      </aside>

      <FAQSection page="hundred-days" />

      {/* Related Resources - Cross-Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-700">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
            Explore Related Resources
          </h2>
          <div className="flex flex-wrap gap-4">
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
