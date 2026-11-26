import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mic, Volume2, Sparkles, CheckCircle2 } from 'lucide-react'

interface PracticeRecord {
  id: string
  title: string
  day: string
  duration: string
  milestone: string
}

const RECENT_RECORDS: PracticeRecord[] = [
  {
    id: 'rec-01',
    title: 'The 60-Second Challenge',
    day: 'Today',
    duration: '1 min',
    milestone: 'Grounded & Composed'
  },
  {
    id: 'rec-02',
    title: 'Make Your Point',
    day: 'Yesterday',
    duration: '2 min',
    milestone: 'Clear Structure'
  },
  {
    id: 'rec-03',
    title: 'Initial Vocal Baseline Assessment',
    day: '3 days ago',
    duration: '15 sec',
    milestone: 'Baseline Set'
  }
]

export default function ProgressView() {
  const navigate = useNavigate()

  return (
    <div className="px-4 sm:px-6 py-6 max-w-xl mx-auto space-y-6">
      {/* Top Header / Back */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-voca-muted hover:text-voca-ink font-display mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle text-voca-primary text-xs font-semibold tracking-wide mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine" />
          <span>VOICE EVOLUTION</span>
          <span className="text-voca-muted font-normal ml-1">• Week 1</span>
        </div>

        <h1 className="font-display text-3xl font-extrabold text-voca-ink tracking-tight">
          Your Voice in Motion
        </h1>
        <p className="text-xs sm:text-sm text-voca-muted font-body mt-1 leading-relaxed">
          Clear, steady cadence and warmer resonance tracked across your completed speaking sessions.
        </p>
      </div>

      {/* Voice Resonance Index Card from Stitch */}
      <section className="bg-voca-surface rounded-2xl p-5 border border-voca-border shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-voca-muted font-display">
              Voice Resonance Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-4xl font-extrabold text-voca-ink">82</span>
              <span className="text-xs font-semibold text-voca-muted">/100</span>
              <span className="inline-flex items-center text-xs font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full ml-1">
                +8 pts growth
              </span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-voca-surface-low text-xs font-semibold text-voca-ink border border-voca-border">
            Steady Pace
          </div>
        </div>

        {/* 7-Day Resonance Waveform Bars */}
        <div className="mt-5 pt-4 border-t border-voca-surface-low">
          <div className="flex items-center justify-between text-xs font-medium text-voca-muted mb-2.5">
            <span>Daily Practice Consistency</span>
            <span className="text-voca-primary font-bold">4-day streak</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-20 pt-2 px-1">
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-voca-tangerine-subtle rounded-t-lg h-[55%]" />
              <span className="text-[10px] text-voca-muted font-display">M</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-voca-tangerine-subtle rounded-t-lg h-[68%]" />
              <span className="text-[10px] text-voca-muted font-display">T</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-voca-tangerine-subtle rounded-t-lg h-[75%]" />
              <span className="text-[10px] text-voca-muted font-display">W</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-voca-tangerine/70 rounded-t-lg h-[82%]" />
              <span className="text-[10px] text-voca-muted font-display">Th</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-voca-tangerine rounded-t-lg h-[92%] shadow-xs" />
              <span className="text-[10px] font-bold text-voca-primary font-display">F</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end opacity-40">
              <div className="w-full bg-voca-surface-low rounded-t-lg h-[30%] border border-dashed border-voca-border" />
              <span className="text-[10px] text-voca-muted font-display">S</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end opacity-40">
              <div className="w-full bg-voca-surface-low rounded-t-lg h-[25%] border border-dashed border-voca-border" />
              <span className="text-[10px] text-voca-muted font-display">Su</span>
            </div>
          </div>
        </div>
      </section>

      {/* Human Speech Milestones (Replaces generic WPM metric cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-base font-bold text-voca-ink">Speech Milestones</h2>
          <span className="text-xs text-voca-muted">Delivery Balance</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Milestone 1: Pacing */}
          <div className="bg-voca-surface rounded-2xl p-4 border border-voca-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-voca-muted">Pacing</span>
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  Steady
                </span>
              </div>
              <p className="font-display text-base font-bold text-voca-ink mt-2">
                Natural &amp; Measured
              </p>
              <p className="text-[11px] text-voca-muted font-body mt-0.5 leading-snug">
                Calm conversational flow without rushing
              </p>
            </div>
            <div className="w-full bg-voca-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-voca-tangerine h-full rounded-full w-[88%]" />
            </div>
          </div>

          {/* Milestone 2: Speech Flow */}
          <div className="bg-voca-surface rounded-2xl p-4 border border-voca-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-voca-muted">Delivery Flow</span>
                <span className="text-[10px] font-bold text-voca-success bg-emerald-50 px-2 py-0.5 rounded-full">
                  Smooth
                </span>
              </div>
              <p className="font-display text-base font-bold text-voca-ink mt-2">
                Composed Flow
              </p>
              <p className="text-[11px] text-voca-muted font-body mt-0.5 leading-snug">
                Transitions feel intentional and effortless
              </p>
            </div>
            <div className="w-full bg-voca-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-voca-success h-full rounded-full w-[92%]" />
            </div>
          </div>

          {/* Milestone 3: Intentional Pauses */}
          <div className="bg-voca-surface rounded-2xl p-4 border border-voca-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-voca-muted">Breath Pauses</span>
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  Natural
                </span>
              </div>
              <p className="font-display text-base font-bold text-voca-ink mt-2">
                Thoughtful Pauses
              </p>
              <p className="text-[11px] text-voca-muted font-body mt-0.5 leading-snug">
                Giving each key point room to breathe
              </p>
            </div>
            <div className="w-full bg-voca-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-voca-tangerine h-full rounded-full w-[84%]" />
            </div>
          </div>

          {/* Milestone 4: Articulation */}
          <div className="bg-voca-surface rounded-2xl p-4 border border-voca-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-voca-muted">Articulation</span>
                <span className="text-[10px] font-bold text-voca-success bg-emerald-50 px-2 py-0.5 rounded-full">
                  Crisp
                </span>
              </div>
              <p className="font-display text-base font-bold text-voca-ink mt-2">
                Clear &amp; Distinct
              </p>
              <p className="text-[11px] text-voca-muted font-body mt-0.5 leading-snug">
                Confident word endings and clarity
              </p>
            </div>
            <div className="w-full bg-voca-surface-low h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-voca-success h-full rounded-full w-[90%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Auditory Transformation Comparison (Baseline vs Current Best) */}
      <section className="bg-voca-surface-low rounded-2xl p-5 border border-voca-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-voca-ink">Vocal Transformation</h2>
            <p className="text-xs text-voca-muted mt-0.5">Auditory growth from Day 1 to current practice</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-voca-surface flex items-center justify-center text-voca-primary shadow-xs">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Day 1 Take */}
        <div className="bg-voca-surface rounded-xl p-3.5 border border-voca-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-voca-surface-low flex items-center justify-center text-voca-muted">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-voca-ink">Baseline Assessment</span>
                <span className="text-[10px] text-voca-muted bg-voca-surface-low px-1.5 py-0.5 rounded">
                  Day 1
                </span>
              </div>
              <p className="text-[11px] text-voca-muted mt-0.5">
                Slightly rushed pacing • Rapid breath transitions
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-voca-muted tabular-nums">0:15</span>
        </div>

        {/* Current Best Take */}
        <div className="bg-voca-surface rounded-xl p-3.5 border border-voca-tangerine/30 bg-gradient-to-r from-voca-surface to-voca-tangerine-subtle/30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-voca-tangerine text-voca-surface flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-voca-ink">Today's Practice Session</span>
                <span className="text-[10px] text-voca-primary font-bold bg-voca-tangerine-subtle px-1.5 py-0.5 rounded">
                  Latest
                </span>
              </div>
              <p className="text-[11px] text-voca-primary font-medium mt-0.5">
                Grounded cadence • Calm intentional pauses • Warm resonance
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-voca-primary tabular-nums">1:00</span>
        </div>
      </section>

      {/* Recent Practice Records */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-base font-bold text-voca-ink">Recent Practice Records</h2>
          <span className="text-xs text-voca-muted">Archive</span>
        </div>

        <div className="space-y-2">
          {RECENT_RECORDS.map((record) => (
            <div
              key={record.id}
              onClick={() => navigate('/challenges')}
              className="bg-voca-surface rounded-xl p-3.5 border border-voca-border flex items-center justify-between hover:border-voca-primary/40 transition-colors cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-voca-ink group-hover:text-voca-primary transition-colors">
                    {record.title}
                  </h3>
                  <p className="text-[11px] text-voca-muted mt-0.5">
                    {record.day} • {record.duration} • {record.milestone}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-voca-muted group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA to Practice */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/challenges')}
          type="button"
          className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <Mic className="w-5 h-5" />
          <span>Start Next Practice Session</span>
        </button>
      </div>
    </div>
  )
}
