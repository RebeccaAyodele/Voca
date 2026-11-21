import { useState, useEffect } from 'react'
import { X, Cpu, Cloud, CheckCircle2, AlertTriangle, Send, RefreshCw, Zap } from 'lucide-react'
import {
  checkHybridCapabilities,
  runDiagnosticsInference,
  type DiagnosticsCapability,
  type DiagnosticsRunResult
} from '@/services/ai/diagnostics'

interface DiagnosticsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function HybridDiagnosticsDrawer({ isOpen, onClose }: DiagnosticsDrawerProps) {
  const [caps, setCaps] = useState<DiagnosticsCapability | null>(null)
  const [mode, setMode] = useState<'PREFER_ON_DEVICE' | 'ONLY_IN_CLOUD'>('PREFER_ON_DEVICE')
  const [prompt, setPrompt] = useState('Evaluate a speaking pace of 145 WPM with 2 filler words.')
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<DiagnosticsRunResult[]>([])

  useEffect(() => {
    if (isOpen) {
      checkHybridCapabilities().then(setCaps)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleRun = async () => {
    if (!prompt.trim() || isRunning) return
    setIsRunning(true)
    try {
      const res = await runDiagnosticsInference(prompt, mode)
      setHistory((prev) => [res, ...prev])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-voca-canvas h-full shadow-2xl flex flex-col justify-between border-l border-voca-border overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-voca-border bg-voca-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-voca-tangerine-subtle flex items-center justify-center text-voca-primary">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-voca-ink">
                Hybrid AI Diagnostics
              </h2>
              <p className="text-[11px] text-voca-muted font-body">Devpost Hackathon Inspector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-voca-muted hover:text-voca-ink hover:bg-voca-subtle cursor-pointer"
            aria-label="Close diagnostics"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Capabilities Card */}
          <div className="p-4 rounded-xl bg-voca-surface border border-voca-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block mb-3">
              Device &amp; Model Capabilities
            </span>

            <div className="space-y-2.5 text-xs font-body">
              <div className="flex items-center justify-between">
                <span className="text-voca-muted">Chrome Prompt API (window.ai)</span>
                <span className="font-semibold flex items-center gap-1">
                  {caps?.hasWindowAi ? (
                    <span className="text-voca-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Detected
                    </span>
                  ) : (
                    <span className="text-voca-muted flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-voca-warning" /> Emulated / Not active
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-voca-muted">Gemini Nano Status</span>
                <span className="font-semibold capitalize px-2 py-0.5 rounded-md text-[10px] bg-voca-subtle text-voca-ink">
                  {caps?.nanoAvailability || 'Checking...'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-voca-muted">Firebase AI Logic Backend</span>
                <span className="font-semibold text-voca-primary">
                  {caps?.isFirebaseAiConnected ? 'Configured (Live)' : 'Mock Demo Environment'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Execution Playground */}
          <div className="p-4 rounded-xl bg-voca-surface border border-voca-border shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block">
              Live Hybrid Routing Test
            </span>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-voca-surface-low border border-voca-border text-xs font-display font-bold">
              <button
                type="button"
                onClick={() => setMode('PREFER_ON_DEVICE')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'PREFER_ON_DEVICE'
                    ? 'bg-voca-tangerine text-voca-surface shadow-xs'
                    : 'text-voca-muted hover:text-voca-ink'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Prefer Nano</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('ONLY_IN_CLOUD')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'ONLY_IN_CLOUD'
                    ? 'bg-voca-tangerine text-voca-surface shadow-xs'
                    : 'text-voca-muted hover:text-voca-ink'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Force Cloud</span>
              </button>
            </div>

            {/* Prompt input */}
            <div>
              <label className="text-[11px] font-semibold text-voca-ink block mb-1">
                Test Prompt
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-voca-surface-low border border-voca-border text-xs text-voca-ink font-body outline-none focus:border-voca-tangerine"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              type="button"
              className="w-full h-11 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Inference...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Hybrid Request</span>
                </>
              )}
            </button>
          </div>

          {/* Execution History */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block">
              Recent Inferences &amp; Source Telemetry
            </span>

            {history.length === 0 ? (
              <p className="text-xs text-voca-muted font-body italic text-center py-4">
                Execute a test above to inspect live SDK routing telemetry.
              </p>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-voca-surface border border-voca-border shadow-xs space-y-2 text-xs font-body"
                >
                  <div className="flex items-center justify-between border-b border-voca-surface-low pb-2">
                    <span className="inline-flex items-center gap-1 font-bold font-display text-[11px]">
                      {item.actualSource === 'ON_DEVICE' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-voca-success flex items-center gap-1">
                          <Zap className="w-3 h-3" /> ON_DEVICE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 flex items-center gap-1">
                          <Cloud className="w-3 h-3" /> IN_CLOUD
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-voca-muted tabular-nums">
                      {item.latencyMs}ms • {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-voca-muted line-clamp-1 italic">
                    Prompt: “{item.prompt}”
                  </p>
                  <p className="text-xs text-voca-ink bg-voca-surface-low p-2 rounded-lg font-mono text-[11px] leading-relaxed">
                    {item.response}
                  </p>
                  <div className="text-[10px] text-voca-muted flex items-center justify-between">
                    <span>Model: {item.model}</span>
                    <span>Requested: {item.requestedMode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-voca-border bg-voca-surface text-[11px] text-voca-muted text-center font-body">
          Firebase AI Logic • Real hybrid inference telemetry for Devpost evaluation.
        </div>
      </div>
    </div>
  )
}
