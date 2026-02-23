import { useState } from 'react';
import {
  Building2,
  Map,
  Trash2,
  Car,
  Home,
  School,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
  Layers,
  RotateCcw,
  Info
} from 'lucide-react';

const LGR_SCENARIOS = [
  {
    id: 1,
    title: 'The Overflowing Public Bin',
    description: "The litter bin in your local high street hasn't been emptied for days.",
    current: 'District' as const,
    icon: <Trash2 className="w-8 h-8" />,
    explanation:
      'Waste collection is currently a District/Borough responsibility. They handle your weekly bins and street cleaning.',
  },
  {
    id: 2,
    title: 'The Hazardous Pothole',
    description: 'A deep pothole has opened up on a busy main road outside the local school.',
    current: 'County' as const,
    icon: <Car className="w-8 h-8" />,
    explanation:
      'Highways and road maintenance are County responsibilities. They manage thousands of miles of roads across the whole region.',
  },
  {
    id: 3,
    title: 'A New House Extension',
    description: "You're planning to build an extra bedroom and need to submit plans.",
    current: 'District' as const,
    icon: <Home className="w-8 h-8" />,
    explanation:
      "Local planning applications are decided by your District or Borough council's planning committee.",
  },
  {
    id: 4,
    title: 'Blue Badge Application',
    description: 'You need a disabled parking permit for an elderly relative.',
    current: 'County' as const,
    icon: <Users className="w-8 h-8" />,
    explanation:
      'Social care and specialized transport services are strategic functions managed by the County Council.',
  },
  {
    id: 5,
    title: 'School Place Allocation',
    description: 'Your child is starting primary school and you need to apply for a place.',
    current: 'County' as const,
    icon: <School className="w-8 h-8" />,
    explanation:
      'Education is a top-tier strategic service. The County coordinates admissions for all state schools in the area.',
  },
];

export default function WhoseJobQuiz() {
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleGuess = (guess: 'District' | 'County') => {
    const isCorrect = guess === LGR_SCENARIOS[currentScenario].current;
    if (isCorrect) setScore((s) => s + 1);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const nextScenario = () => {
    if (currentScenario < LGR_SCENARIOS.length - 1) {
      setCurrentScenario((s) => s + 1);
      setFeedback(null);
    } else {
      setStage('results');
    }
  };

  const restart = () => {
    setStage('welcome');
    setCurrentScenario(0);
    setScore(0);
    setFeedback(null);
  };

  const renderWelcome = () => (
    <div className="w-full text-center space-y-8 py-8 px-6">
      <div className="inline-block p-4 bg-teal-50 rounded-3xl mb-4">
        <Layers className="w-12 h-12 text-teal-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-academic-charcoal tracking-tight">
        Whose job is it?
      </h2>
      <p className="text-lg text-academic-neutral-700 leading-relaxed">
        Most people cannot correctly identify which council delivers which service.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="bg-white p-5 rounded-2xl border border-academic-neutral-200 shadow-sm">
          <Building2 className="w-6 h-6 text-teal-600 mb-2" />
          <h3 className="font-bold text-academic-charcoal">District Councils</h3>
          <p className="text-base text-academic-neutral-700">
            Local services like bins, housing, and local planning.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-academic-neutral-200 shadow-sm">
          <Map className="w-6 h-6 text-teal-700 mb-2" />
          <h3 className="font-bold text-academic-charcoal">County Councils</h3>
          <p className="text-base text-academic-neutral-700">
            Strategic services like schools, social care, and roads.
          </p>
        </div>
      </div>

      <button
        onClick={() => setStage('quiz')}
        className="w-full sm:w-auto px-10 py-4 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 mx-auto hover:opacity-95"
        style={{ backgroundColor: 'var(--lgr-hero-start)' }}
      >
        Start the Challenge <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderQuiz = () => {
    const scenario = LGR_SCENARIOS[currentScenario];
    return (
      <div className="w-full py-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-academic-neutral-500 uppercase tracking-widest">
              Question
            </span>
            <div className="w-10 h-10 rounded-full bg-academic-charcoal flex items-center justify-center text-white font-bold">
              {currentScenario + 1}
            </div>
            <span className="text-academic-neutral-500 font-medium">/ {LGR_SCENARIOS.length}</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-academic-neutral-500 uppercase tracking-wider">
              Score
            </div>
            <div className="text-2xl font-black text-teal-600">{score}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-academic-neutral-100">
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
              {scenario.icon}
            </div>
            <h3 className="text-2xl font-bold text-academic-charcoal">{scenario.title}</h3>
            <p className="text-lg text-academic-neutral-600 italic">&quot;{scenario.description}&quot;</p>

            {!feedback ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-academic-neutral-100">
                <button
                  onClick={() => handleGuess('District')}
                  className="p-8 border-2 border-academic-neutral-100 rounded-3xl hover:border-teal-500 hover:bg-teal-50 transition group text-left"
                >
                  <Building2 className="w-8 h-8 mb-3 text-academic-neutral-300 group-hover:text-teal-500 transition-colors" />
                  <span className="block font-bold text-academic-charcoal text-lg">
                    District Council
                  </span>
                  <span className="text-base text-academic-neutral-600">Borough or City level</span>
                </button>
                <button
                  onClick={() => handleGuess('County')}
                  className="p-8 border-2 border-academic-neutral-100 rounded-3xl hover:border-teal-500 hover:bg-teal-50 transition group text-left"
                >
                  <Map className="w-8 h-8 mb-3 text-academic-neutral-300 group-hover:text-teal-500 transition-colors" />
                  <span className="block font-bold text-academic-charcoal text-lg">County Council</span>
                  <span className="text-base text-academic-neutral-600">Strategic or Region level</span>
                </button>
              </div>
            ) : (
              <div
                className={`mt-8 p-8 rounded-3xl text-left ${
                  feedback === 'correct'
                    ? 'bg-green-50 border-2 border-green-100'
                    : 'bg-amber-50 border-2 border-amber-100'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  {feedback === 'correct' ? (
                    <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-amber-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4
                      className={`text-xl font-bold ${
                        feedback === 'correct' ? 'text-green-800' : 'text-amber-800'
                      }`}
                    >
                      {feedback === 'correct' ? 'Correct!' : 'Actually, no...'}
                    </h4>
                    <p className="font-bold text-academic-neutral-500 uppercase text-xs tracking-widest">
                      Responsibility: {scenario.current} Council
                    </p>
                  </div>
                </div>
                <p className="text-academic-neutral-700 leading-relaxed mb-8 text-lg">
                  {scenario.explanation}
                </p>
                <button
                  onClick={nextScenario}
                  className="w-full py-4 bg-academic-charcoal text-white font-bold rounded-2xl hover:bg-academic-charcoal/90 transition flex items-center justify-center gap-2"
                >
                  {currentScenario === LGR_SCENARIOS.length - 1 ? 'Finish Quiz' : 'Next Scenario'}{' '}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="w-full max-w-2xl mx-auto py-8 px-6 text-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-teal-700 flex items-center justify-center text-white text-4xl font-black mx-auto">
            {score}/{LGR_SCENARIOS.length}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-academic-charcoal">
            {score === LGR_SCENARIOS.length ? 'Service Superstar!' : 'Confusion Confirmed!'}
          </h2>
          <p className="text-academic-neutral-600 text-lg leading-relaxed">
            {score === LGR_SCENARIOS.length
              ? "You've got a perfect handle on the current system. You're ready for the simplified future!"
              : "Don't worry—most people find the current system confusing. That's exactly why Local Government Reorganisation (LGR) is happening."}
          </p>
        </div>

        <div className="bg-academic-warm p-6 rounded-2xl text-left border border-academic-neutral-200">
          <h4 className="font-bold text-academic-charcoal flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-teal-600" />
            The Unitary Solution
          </h4>
          <p className="text-base text-academic-neutral-700">
            By 2027, this quiz will be obsolete. All services—from bins to school places—will move
            under <strong>one single council</strong>. No more guessing which tier handles your
            request.
          </p>
        </div>

        <button
          onClick={restart}
          className="w-full py-4 border-2 border-academic-neutral-200 text-academic-neutral-600 font-bold rounded-2xl hover:bg-academic-warm transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="w-full rounded-2xl border border-teal-200 overflow-hidden hyphens-none"
      style={{ backgroundColor: 'var(--lgr-quiz-bg)' }}
    >
      <div className="px-6 py-3 flex justify-between items-center text-white" style={{ backgroundColor: 'var(--lgr-hero-start)' }}>
        <div className="flex items-center gap-2 font-black text-lg text-white">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          Test your knowledge
        </div>
        <span className="text-xs font-bold text-teal-200 uppercase tracking-widest hidden sm:block">
          Interactive Quiz
        </span>
      </div>

      <div className="py-4">
        {stage === 'welcome' && renderWelcome()}
        {stage === 'quiz' && renderQuiz()}
        {stage === 'results' && renderResults()}
      </div>
    </div>
  );
}
