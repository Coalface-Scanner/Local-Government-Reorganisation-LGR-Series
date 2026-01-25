import { useEffect, useState } from 'react';
import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import PageNavigation from '../components/PageNavigation';
import RelatedContent from '../components/RelatedContent';
import { supabase } from '../lib/supabase';
import { BookOpen, Lightbulb, Target, Users, TrendingUp, Building2, FileText, Scale, DollarSign, ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface LessonsProps {
  onNavigate: (page: string) => void;
}

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

export default function Lessons({ onNavigate }: LessonsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  const navItems = [
    { id: 'insights', label: 'Key Insights', icon: <BookOpen size={16} /> },
    { id: 'coming-soon', label: 'Coming Soon', icon: <FileText size={16} /> }
  ];

  const comingSoonTopics: ComingSoonTopic[] = [
    {
      title: 'Governance Models',
      description: 'Comparative analysis of governance models across reorganised authorities',
      icon: Building2,
      theme: 'Governance'
    },
    {
      title: 'Planning Systems',
      description: 'Planning system integration challenges and solutions',
      icon: FileText,
      theme: 'Planning'
    },
    {
      title: 'Political Dynamics',
      description: 'Political dynamics and cross-party collaboration case studies',
      icon: Users,
      theme: 'Democracy'
    },
    {
      title: 'Financial Resilience',
      description: 'Financial resilience strategies and budget management',
      icon: DollarSign,
      theme: 'Finance'
    }
  ];

  useEffect(() => {
    fetchLessons();
    fetchRelatedArticles();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setLessons(data);
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const { data } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, theme, category')
        .eq('status', 'published')
        .or('theme.ilike.%Governance%,theme.ilike.%Planning%,theme.ilike.%Democracy%,category.ilike.%Governance%,category.ilike.%Planning%')
        .order('published_date', { ascending: false })
        .limit(8);

      if (data) {
        setRelatedArticles(data);
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
    }
  };

  const getIconComponent = (iconName: string | null): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'BookOpen': BookOpen,
      'Lightbulb': Lightbulb,
      'Target': Target,
      'Users': Users,
      'TrendingUp': TrendingUp,
      'Building2': Building2,
      'FileText': FileText,
      'Scale': Scale,
      'DollarSign': DollarSign,
    };
    return iconMap[iconName || ''] || BookOpen;
  };

  const findArticleForTopic = (theme: string) => {
    return relatedArticles.find(article => 
      article.theme?.toLowerCase().includes(theme.toLowerCase()) ||
      article.category?.toLowerCase().includes(theme.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Lessons from Recent Reorganisations"
        description="Critical lessons from recent local government reorganisations across England. Evidence-based insights on what works, what fails, and how to navigate reform."
        keywords="LGR lessons, council reform insights, reorganisation best practices, local government change management, unitary transition guidance"
      />
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        {/* Colored gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">LEARNING FROM EXPERIENCE</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Lessons from{' '}
              <span className="text-teal-700 font-serif italic">
                Reorganisation
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              What recent reorganisations have taught us about governance, planning, and delivery across England
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <div id="insights" className="academic-card p-12">
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
                <p className="text-academic-lg text-academic-neutral-700 leading-relaxed font-serif">
                  The recent wave of local government reorganisation across England provides valuable evidence about
                  what works, what doesn't, and why outcomes vary so significantly between authorities.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-12">
                  <div className="bg-teal-50 border border-teal-300 p-8">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-5">
                      <Lightbulb className="text-white" size={24} />
                    </div>
                    <h3 className="font-display font-bold text-academic-charcoal mb-4 text-academic-xl">Governance Matters</h3>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                      Clear decision-making structures and political stewardship are critical success factors
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-300 p-8">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-5">
                      <Target className="text-white" size={24} />
                    </div>
                    <h3 className="font-display font-bold text-academic-charcoal mb-4 text-academic-xl">Systems Integration</h3>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                      Technical convergence and data integration cannot be delayed or deprioritised
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-300 p-8">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-5">
                      <Users className="text-white" size={24} />
                    </div>
                    <h3 className="font-display font-bold text-academic-charcoal mb-4 text-academic-xl">Workforce Capacity</h3>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                      Staff retention and organisational culture determine whether change succeeds or stalls
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-300 p-8">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-5">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="font-display font-bold text-academic-charcoal mb-4 text-academic-xl">Financial Reality</h3>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                      Early transition costs must be properly funded, not absorbed from existing budgets
                    </p>
                  </div>
                </div>

                <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                  Detailed analysis and case studies from recent reorganisations will be published here as part of
                  the ongoing research series. This content will examine specific governance models, planning system
                  transitions, and the political dynamics that shape outcomes.
                </p>
              </div>
            </div>

            <div id="coming-soon" className="border-t-2 border-academic-neutral-900 pt-12">
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
                      onClick={() => {
                        if (relatedArticle) {
                          window.location.href = `/insights/${relatedArticle.slug}`;
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center rounded-lg transition-colors flex-shrink-0">
                          <Icon className="text-teal-700" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-academic-charcoal mb-3 text-academic-lg group-hover:text-teal-700 transition-colors">
                            {topic.title}
                          </h4>
                          <p className="text-academic-sm text-academic-neutral-600 font-serif leading-relaxed mb-4">
                            {topic.description}
                          </p>
                          {relatedArticle ? (
                            <div className="flex items-center gap-2 text-teal-700 font-display font-semibold text-academic-sm">
                              <span>Read related article</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          ) : (
                            <p className="text-academic-xs text-academic-neutral-500 font-serif italic">
                              Content coming soon
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Display lessons from database if any exist */}
              {lessons.length > 0 && (
                <div className="mt-12 pt-12 border-t border-academic-neutral-300">
                  <div className="academic-section-header mb-8">
                    <div className="academic-section-label">PUBLISHED LESSONS</div>
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">Lessons from Experience</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {lessons.map((lesson) => {
                      const Icon = getIconComponent(lesson.icon);
                      return (
                        <div key={lesson.id} className="academic-card p-8">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-teal-700 flex items-center justify-center rounded-lg flex-shrink-0">
                              <Icon className="text-white" size={24} />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-academic-charcoal mb-3 text-academic-lg">
                                {lesson.title}
                              </h4>
                              <div 
                                className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
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
              <PageNavigation items={navItems} />
              <div className="bg-teal-800 text-white p-8">
                <h3 className="text-academic-xl font-display font-bold text-white mb-4">
                  The Dispatch
                </h3>
                <p className="text-academic-sm text-white mb-5 font-serif">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="academic-card p-8">
                <h4 className="font-display font-bold text-academic-charcoal mb-6 text-academic-sm tracking-wider border-b-2 border-academic-neutral-300 pb-4">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => onNavigate('surrey')}
                    className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700"
                  >
                    Surrey Analysis →
                  </button>
                  <button
                    onClick={() => onNavigate('100days')}
                    className="w-full text-left px-4 py-3 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700"
                  >
                    100 Days Playbook →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedContent
          currentSlug="lessons"
          contentType="fact"
          maxItems={6}
        />
      </div>

      <FAQSection page="lessons" />

      <LastUpdated />
    </div>
  );
}
