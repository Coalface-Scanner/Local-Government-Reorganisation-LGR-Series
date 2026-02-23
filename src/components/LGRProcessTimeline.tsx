import { useState } from 'react';
import {
  Lightbulb,
  MessageCircle,
  CheckCheck,
  Wrench,
  Rocket,
  RefreshCw,
} from 'lucide-react';

export interface LGRProcessTimelineProps {
  /** When true, do not show the duration callout (use page-level data block instead). */
  hideDurationCallout?: boolean;
}

export interface ProcessStepData {
  id: number;
  title: string;
  shortLabel: string;
  duration: string | null;
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number; 'aria-hidden'?: boolean }>;
  body: string;
  summary: string;
  keyOutput: string;
  whoDecides: string;
  whatItMeansLocally: string;
  isHighlight?: boolean;
}

const timelineSteps: ProcessStepData[] = [
  {
    id: 1,
    title: '1. The Idea',
    shortLabel: 'Idea',
    duration: '1-3 Months',
    color: 'blue',
    icon: Lightbulb,
    body: 'Local leaders research if joining forces will save money and improve services. They draft a "Business Case" (the \'Why\' document).',
    summary: 'Designing the blueprint and checking if it\'s a good idea with local partners.',
    keyOutput: 'The Proposal Submission',
    whoDecides: 'Local councils and combined authorities, often with government encouragement.',
    whatItMeansLocally: 'Your area may be part of early discussions; no change to services yet.',
  },
  {
    id: 2,
    title: '2. Public Consultation',
    shortLabel: 'Consultation',
    duration: '2-4 Months',
    color: 'emerald',
    icon: MessageCircle,
    body: 'The government asks residents, businesses, and groups for their views on the new council boundaries and names.',
    summary: 'A 6-8 week "live" period where everyone gets to say what they think of the plan.',
    keyOutput: 'Feedback & Analysis Report',
    whoDecides: 'Government runs the consultation; responses inform the Secretary of State\'s decision.',
    whatItMeansLocally: 'Your chance to have a say on boundaries, names, and the overall proposal.',
  },
  {
    id: 3,
    title: '3. The Green Light',
    shortLabel: 'Decision',
    duration: '3-6 Months',
    color: 'purple',
    icon: CheckCheck,
    body: 'The Secretary of State reviews all evidence and the consultation report to make the final "Yes" or "No" decision.',
    summary: 'The government signs off the legal paperwork that makes the change official.',
    keyOutput: 'Legal Order (Act of Parliament)',
    whoDecides: 'Secretary of State for Levelling Up, Housing and Communities.',
    whatItMeansLocally: 'The reorganisation is confirmed; dates for shadow elections and vesting day are set.',
  },
  {
    id: 4,
    title: '4. The Bridge Council',
    shortLabel: 'Shadow',
    duration: '9-15 Months',
    color: 'amber',
    icon: Wrench,
    body: 'A temporary "Shadow" authority is set up to build the new council from scratch while the old ones still run daily services.',
    summary: 'Hiring the new boss, moving staff, and setting the first budget for the future.',
    keyOutput: 'New Constitution & Ready Plan',
    whoDecides: 'Shadow authority (elected at shadow elections) and senior officers preparing for vesting day.',
    whatItMeansLocally: 'You may vote in shadow elections; existing councils still deliver services until vesting day.',
  },
  {
    id: 5,
    title: '5. Launch Day',
    shortLabel: 'Launch',
    duration: null,
    color: 'indigo',
    icon: Rocket,
    body: 'The "Vesting Day." The old councils disappear at midnight, and the new Unitary Authority opens its doors.',
    summary: 'The official birthday of the new council. All services (bins, schools, roads) are now under one roof.',
    keyOutput: 'Live Service Delivery',
    whoDecides: 'Legal transition is fixed by the Order; the new unitary runs everything from this day.',
    whatItMeansLocally: 'One council for your area; all services and contact details move to the new authority.',
    isHighlight: true,
  },
  {
    id: 6,
    title: '6. Better, Together',
    shortLabel: 'Transition',
    duration: 'Year 1 - 3+',
    color: 'rose',
    icon: RefreshCw,
    body: 'The ongoing work to merge different computer systems, cultures, and ways of working to find the best way to serve the public.',
    summary: 'Fixing the pipes and merging teams to make sure the council is as efficient as possible.',
    keyOutput: 'Transformation & Savings',
    whoDecides: 'The new unitary\'s leadership and officers; scrutiny from members and residents.',
    whatItMeansLocally: 'Services may be refined over time; representation and accountability sit with the new council.',
  },
];

const colorClasses: Record<
  string,
  { badge: string; icon: string; border: string; bg: string }
> = {
  blue: { badge: 'bg-blue-600 text-white', icon: 'bg-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
  emerald: { badge: 'bg-emerald-600 text-white', icon: 'bg-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  purple: { badge: 'bg-purple-600 text-white', icon: 'bg-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' },
  amber: { badge: 'bg-amber-600 text-white', icon: 'bg-amber-600', border: 'border-amber-200', bg: 'bg-amber-50' },
  indigo: { badge: 'bg-indigo-500 text-white', icon: 'bg-indigo-500', border: 'border-indigo-200', bg: 'bg-indigo-50' },
  rose: { badge: 'bg-rose-600 text-white', icon: 'bg-rose-600', border: 'border-rose-200', bg: 'bg-rose-50' },
};

export default function LGRProcessTimeline({ hideDurationCallout }: LGRProcessTimelineProps = {}) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const step = timelineSteps.find((s) => s.id === activeStep) ?? timelineSteps[0];
  const colors = colorClasses[step.color];
  const Icon = step.icon;

  return (
    <div className="my-12 hyphens-none">
      {/* Horizontal step bar – LGR page style: inactive #F2F4F4, active accent */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {timelineSteps.map((s) => {
          const isActive = s.id === activeStep;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold transition-all shadow-sm"
              style={
                isActive
                  ? { backgroundColor: 'var(--lgr-accent)', color: 'white' }
                  : { backgroundColor: 'var(--lgr-tab-inactive)', color: 'var(--color-academic-charcoal)' }
              }
              aria-pressed={isActive}
            >
              <s.icon className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">{s.shortLabel}</span>
              <span className="sm:hidden">{s.id}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded panel – LGR page: soft blue tint #EDF4FA */}
      <div
        className="rounded-2xl border-2 border-[var(--lgr-accent)]/20 p-6 md:p-8 transition-colors"
        style={{ backgroundColor: 'var(--lgr-stage-panel)' }}
        aria-live="polite"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center text-white`}>
            <Icon className="w-6 h-6" aria-hidden />
          </div>
          <div>
            <h4 className="text-xl font-display font-bold text-academic-charcoal">
              {step.title}
            </h4>
            {step.duration && (
              <span className={`inline-block mt-1 text-xs font-bold uppercase ${colors.badge} px-2 py-0.5 rounded`}>
                {step.duration}
              </span>
            )}
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-academic-neutral-600 mb-1">
              What happens
            </dt>
            <dd className="text-academic-charcoal font-serif text-base leading-relaxed">
              {step.body}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-academic-neutral-600 mb-1">
              Who decides
            </dt>
            <dd className="text-academic-charcoal font-serif text-base leading-relaxed">
              {step.whoDecides}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-academic-neutral-600 mb-1">
              What it means locally
            </dt>
            <dd className="text-academic-charcoal font-serif text-base leading-relaxed">
              {step.whatItMeansLocally}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-academic-neutral-600 mb-1">
              Key output
            </dt>
            <dd className="text-academic-charcoal font-semibold text-base">
              {step.keyOutput}
            </dd>
          </div>
        </dl>

        <p className="mt-4 pt-4 border-t border-academic-neutral-200 text-base italic text-academic-neutral-700 font-serif">
          <strong>In simple terms:</strong> {step.summary}
        </p>
      </div>
    </div>
  );
}
