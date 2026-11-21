import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LineChart, Clock, Award, Mic } from 'lucide-react'

interface SessionHistoryItem {
  id: string
  title: string
  date: string
  duration: string
  wpm: number
  fillerCount: number
  status: 'completed' | 'processing'
}

const PAST_SESSIONS: SessionHistoryItem[] = [
  {
    id: 'session-baseline-01',
    title: 'Initial Vocal Baseline Assessment',
    date: 'Today • Just now',
    duration: '15s',
    wpm: 142,
    fillerCount: 2,
    status: 'completed'
  },
  {
    id: 'session-sample-02',
    title: 'Executive Presence: Strategic Project Brief',
    date: 'Yesterday',
    duration: '30s',
    wpm: 148,
    fillerCount: 1,
    status: 'completed'
  }
]

export default function ProgressView() {
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
            Practice &amp; Progress
          </h1>
          <p className="text-sm text-voca-muted font-body mt-1">
            Track measurable delivery trends across your recorded speaking sessions.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          type="button"
          className="self-start sm:self-auto h-11 px-5 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Mic className="w-4 h-4" />
          <span>Record New Session</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs">
          <div className="flex items-center justify-between text-voca-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-display">Completed Sessions</span>
            <Award className="w-4 h-4 text-voca-gold" />
          </div>
          <p className="font-display text-2xl font-extrabold text-voca-ink tabular-nums">2</p>
          <p className="text-xs text-voca-muted font-body mt-1">Backed by actual audio recordings.</p>
        </div>

        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs">
          <div className="flex items-center justify-between text-voca-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-display">Average Speaking Rate</span>
            <LineChart className="w-4 h-4 text-voca-primary" />
          </div>
          <p className="font-display text-2xl font-extrabold text-voca-ink tabular-nums">145 WPM</p>
          <p className="text-xs text-voca-success font-body mt-1 font-semibold">Consistent presentation pacing</p>
        </div>

        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs">
          <div className="flex items-center justify-between text-voca-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-display">Filler Ratio</span>
            <Clock className="w-4 h-4 text-voca-tangerine" />
          </div>
          <p className="font-display text-2xl font-extrabold text-voca-ink tabular-nums">4.2%</p>
          <p className="text-xs text-voca-muted font-body mt-1">Trending down across sessions.</p>
        </div>
      </div>

      {/* Session History List */}
      <div className="rounded-2xl bg-voca-surface border border-voca-border p-5 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-voca-muted font-display block">
          Session Archive &amp; Evidence
        </span>

        <div className="divide-y divide-voca-surface-low">
          {PAST_SESSIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/analysis?recId=demo')}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-voca-surface-low/50 px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div>
                <p className="font-display font-bold text-sm text-voca-ink group-hover:text-voca-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-voca-muted font-body mt-0.5">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>Duration: {item.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-body">
                <span className="px-2.5 py-1 rounded-full bg-voca-subtle text-voca-ink font-semibold tabular-nums">
                  {item.wpm} WPM
                </span>
                <span className="px-2.5 py-1 rounded-full bg-voca-tangerine-subtle/50 text-voca-primary font-semibold tabular-nums">
                  {item.fillerCount} fillers
                </span>
                <ArrowRight className="w-4 h-4 text-voca-muted group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
