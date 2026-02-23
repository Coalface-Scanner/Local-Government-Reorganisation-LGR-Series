import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import FAQSection from '../../components/FAQSection';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import RelatedContent from '../../components/RelatedContent';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, BookOpen, Lightbulb, Target, Users, TrendingUp, Building2, FileText, DollarSign, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { enhanceContentWithGlossaryLinks } from '../../lib/glossaryLinks';
import { useScrollDepthTracking } from '../../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../../hooks/useTimeOnPageTracking';

interface Lesson {
  id: string;
  title: string;
  content: string;
  icon: string | null;
  order_index: number;
}

interface ComingSoonTopic {
  title: string;
  description: string;
  icon: LucideIcon;
  theme: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  theme: string | null;
  category: string | null;
}

export default function LessonsInsights() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);

  useScrollDepthTracking();
  useTimeOnPageTracking();

  const enhancedLessons = useMemo(() => {
    return lessons.map(lesson => ({
      ...lesson,
      enhancedContent: enhanceContentWithGlossaryLinks(lesson.content, {
        onlyFirstOccurrence: true,
        excludeSlugs: [],
        linkClass: 'glossary-link text-teal-700 hover:text-teal-800 underline font-medium'
      })
    }));
  }, [lessons]);

  const comingSoonTopics: ComingSoonTopic[] = [
    { title: 'Governance Models', description: 'Comparative analysis of governance models across reorganised authorities', icon: Building2, theme: 'Governance' },
    { title: 'Planning Systems', description: 'Planning system integration challenges and solutions', icon: FileText, theme: 'Planning' },
    { title: 'Political Dynamics', description: 'Political dynamics and cross-party collaboration case studies', icon: Users, theme: 'Democracy' },
    { title: 'Financial Resilience', description: 'Financial resilience strategies and budget management', icon: DollarSign, theme: 'Finance' },
  ];

  const getIconComponent = (iconName: string | null): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      BookOpen, Lightbulb, Target, Users, TrendingUp, Building2, FileText, DollarSign,
    };
    return iconMap[iconName || ''] || BookOpen;
  };

  const findArticleForTopic = (theme: string) => {
    return relatedArticles.find(article =>
      article.theme?.toLowerCase().includes(theme.toLowerCase()) ||
      article.category?.toLowerCase().includes(theme.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase.from('lessons').select('*').order('order_index');
      if (!error && data) setLessons(data);
    };
    const fetchRelated = async () => {
      const { data } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, theme, category')
        .eq('status', 'published')
        .or('theme.ilike.%Governance%,theme.ilike.%Planning%,theme.ilike.%Democracy%,category.ilike.%Governance%,category.ilike.%Planning%')
        .order('published_date', { ascending: false })
        .limit(8);
      if (data) setRelatedArticles(data);
    };
    fetchLessons();
    fetchRelated();
  }, []);

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Key Insights - Lessons from Reorganisation"
        description="Evidence-based key insights from recent local government reorganisations. Governance, systems integration, workforce capacity, and financial planning."
        keywords="LGR lessons, reorganisation insights, governance, planning systems, local government reform"
      />
      <PageBanner
        heroLabel="LEARNING FROM EXPERIENCE"
        heroTitle="Lessons from Reorganisation"
        heroSubtitle="Key insights from recent reorganisations across England"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <div className="academic-card p-12">
              <div className="flex items-start gap-8 mb-10">
                <div className="w-16 h-16 bg-teal-700 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal">Key Insights</h2>
                  <p className="text-academic-base text-academic-neutral-600 mt-3 font-serif">Evidence-based lessons from reorganisations</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">What Lessons Can We Learn from Recent Reorganisations?</h2>
                  <p className="text-academic-lg text-academic-neutral-700 leading-relaxed font-serif mb-6">
                    Recent local government reorganisations across England reveal four critical success factors:
                    strong governance structures, effective systems integration, workforce capacity retention,
                    and proper financial planning. Authorities that prioritise these areas achieve smoother
                    transitions and better outcomes, while those that deprioritise them face delays,
                    disruption, and reduced performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-6">Key Success Factors</h3>
                  <ul className="space-y-4 mb-8">
                    {[
                      { Icon: Lightbulb, title: 'Governance Matters', text: 'Clear decision-making structures and political stewardship are critical success factors. Authorities with well-defined governance frameworks and strong political leadership navigate transition more effectively than those with fragmented decision-making.' },
                      { Icon: Target, title: 'Systems Integration', text: 'Technical convergence and data integration cannot be delayed or deprioritised. Early investment in merging IT systems, data platforms, and operational processes prevents bottlenecks and service disruption during transition.' },
                      { Icon: Users, title: 'Workforce Capacity', text: 'Staff retention and organisational culture determine whether change succeeds or stalls. Authorities that invest in change management, clear communication, and staff support maintain service quality throughout transition.' },
                      { Icon: TrendingUp, title: 'Financial Reality', text: 'Early transition costs must be properly funded, not absorbed from existing budgets. Realistic financial planning that accounts for one-off transition expenses, system integration costs, and temporary capacity gaps prevents budget overruns and service cuts.' },
                    ].map(({ Icon, title, text }) => (
                      <li key={title} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <Icon className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-academic-charcoal mb-2 text-academic-lg">{title}</h4>
                          <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-4">Ongoing Research</h3>
                  <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                    Detailed analysis and case studies from recent reorganisations will be published here as part of
                    the ongoing research series. This content will examine specific governance models, planning system
                    transitions, and the political dynamics that shape outcomes.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-academic-neutral-900 pt-12">
              <div className="academic-section-header mb-10">
                <div className="academic-section-label">EXPLORE TOPICS</div>
                <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">Related Research Topics</h3>
                <p className="text-academic-base text-academic-neutral-700 mt-4 font-serif leading-relaxed">
                  Deep dive into specific aspects of reorganisation through our research articles and analysis
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {comingSoonTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  const relatedArticle = findArticleForTopic(topic.theme);
                  return (
                    <div
                      key={index}
                      className={`academic-card p-8 hover:border-teal-700 transition-all cursor-pointer group ${relatedArticle ? 'hover:shadow-lg' : ''}`}
                      onClick={() => relatedArticle && (window.location.href = `/insights/${relatedArticle.slug}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center rounded-lg transition-colors flex-shrink-0">
                          <Icon className="text-teal-700" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-academic-charcoal mb-3 text-academic-lg group-hover:text-teal-700 transition-colors">{topic.title}</h4>
                          <p className="text-academic-sm text-academic-neutral-600 font-serif leading-relaxed mb-4">{topic.description}</p>
                          {relatedArticle ? (
                            <div className="flex items-center gap-2 text-teal-700 font-display font-semibold text-academic-sm">
                              <span>Read related article</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          ) : (
                            <p className="text-academic-xs text-academic-neutral-500 font-serif italic">Content coming soon</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {lessons.length > 0 && (
                <div className="mt-12 pt-12 border-t border-academic-neutral-300">
                  <div className="academic-section-header mb-8">
                    <div className="academic-section-label">PUBLISHED LESSONS</div>
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">Lessons from Experience</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {enhancedLessons.map((lesson) => {
                      const Icon = getIconComponent(lesson.icon);
                      return (
                        <div key={lesson.id} className="academic-card p-8">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-teal-700 flex items-center justify-center rounded-lg flex-shrink-0">
                              <Icon className="text-white" size={24} />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-academic-charcoal mb-3 text-academic-lg">{lesson.title}</h4>
                              <div
                                className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: lesson.enhancedContent }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="lgr-insights-cta">
                <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
                <p className="lgr-insights-cta__body">Receive our regular update direct to your inbox. Subscribe here.</p>
                <Link to="/subscribe" className="lgr-insights-cta__btn">Subscribe</Link>
              </div>
              <div className="academic-card p-8">
                <h4 className="font-display font-bold text-academic-charcoal mb-6 text-academic-sm tracking-wider border-b-2 border-academic-neutral-300 pb-4">RELATED</h4>
                <div className="space-y-3">
                  <button onClick={() => navigate('/lessons')} className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700">Lessons hub →</button>
                  <button onClick={() => navigate('/lessons/case-studies')} className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700">Case Grounded Lessons →</button>
                  <button onClick={() => navigate('/facts')} className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700">Facts & Data →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-container">
        <RelatedContent currentSlug="lessons" contentType="fact" maxItems={6} />
      </div>

      <FAQSection page="lessons" />
    </div>
  );
}
