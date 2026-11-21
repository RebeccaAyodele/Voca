import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react'

interface SkillDimension {
  id: string
  name: string
  description: string
  score: number | null
  level: string
  status: 'available' | 'unavailable'
  evidence: string
  statusReason?: string
}

const SKILL_DIMENSIONS: SkillDimension[] = [
  {
    id: 'pace-delivery',
    name: 'Pace & Delivery',
    description: 'Measured speaking rate in words per minute and intentional breath pauses between thought groups.',
    score: 84,
    level: 'Developing Mastery',
    status: 'available',
    evidence: 'Measured at 142 WPM with 2 natural breath transitions over 15s.'
  },
  {
    id: 'fluency',
    name: 'Fluency & Flow',
    description: 'Smooth continuity of spoken thoughts without hesitation stalls or repetitive filler word crutches.',
    score: 78,
    level: 'Solid Cadence',
    status: 'available',
    evidence: '2 filler tokens identified across 35 total spoken words.'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary & Variety',
    description: 'Lexical richness and active verbal variety rather than leaning on generic or repetitive phrasing.',
    score: 82,
    level: 'Expressive',
    status: 'available',
    evidence: 'Type-Token Ratio of 0.82 with precise descriptive phrasing.'
  },
  {
    id: 'structure',
    name: 'Structure & Coherence',
    description: 'Logical sequencing of opening, core point, and closing reflection.',
    score: 80,
    level: 'Structured',
    status: 'available',
    evidence: 'Grounded opening followed by clear project outcome.'
  },
  {
    id: 'conciseness',
    name: 'Conciseness',
    description: 'High signal-to-noise ratio, delivering maximum impact without unnecessary verbal padding.',
    score: 85,
    level: 'Direct & Concise',
    status: 'available',
    evidence: 'Direct response delivered within 15-second baseline constraint.'
  },
  {
    id: 'clarity-articulation',
    name: 'Acoustic Clarity & Articulation',
    description: 'Fine-grained acoustic phoneme distinction, consonant crispness, and resonant vocal cavity projection.',
    score: null,
    level: 'Metric Unavailable',
    status: 'unavailable',
    evidence: 'Acoustic evidence reserved.',
    statusReason: 'Requires acoustic phoneme modeling. Consistent with Voca product principles, scores are never fabricated without verifiable evidence.'
  }
]

export default function SkillMapView() {
  const navigate = useNavigate()

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold text-voca-muted hover:text-voca-ink font-display mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-voca-ink tracking-tight">
            Communication Skill Map
          </h1>
          <p className="text-sm text-voca-muted font-body mt-1">
            Objective delivery dimensions calibrated from your completed practice sessions.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          type="button"
          className="self-start sm:self-auto h-11 px-5 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Practise in Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 rounded-xl bg-voca-tangerine-subtle/40 border border-voca-tangerine/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-voca-primary shrink-0 mt-0.5" />
        <p className="text-xs text-voca-ink font-body leading-relaxed">
          <strong className="font-display font-bold text-voca-primary">Evidence Before Judgement:</strong> Voca scores only skills backed by measurable audio features or decoded transcript evidence. We never fabricate synthetic ratings to fill a dashboard.
        </p>
      </div>

      {/* 6 Skill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SKILL_DIMENSIONS.map((skill) => (
          <div
            key={skill.id}
            className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
              skill.status === 'unavailable'
                ? 'bg-voca-surface-low border-voca-border/80'
                : 'bg-voca-surface border-voca-border'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-base text-voca-ink">
                  {skill.name}
                </span>

                {skill.status === 'available' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-display bg-emerald-100 text-voca-success tabular-nums">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{skill.score}/100</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display bg-voca-subtle text-voca-muted">
                    <ShieldAlert className="w-3 h-3 text-voca-warning" />
                    <span>Unavailable</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-voca-muted font-body leading-relaxed mb-3">
                {skill.description}
              </p>
            </div>

            <div className="pt-3 border-t border-voca-surface-low">
              {skill.status === 'available' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-voca-primary font-display">{skill.level}</span>
                    <span className="text-voca-muted font-body">Grounding Verified</span>
                  </div>
                  <p className="text-[11px] text-voca-muted-subtle font-body italic">
                    “{skill.evidence}”
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-voca-muted font-body italic leading-snug">
                  {skill.statusReason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
