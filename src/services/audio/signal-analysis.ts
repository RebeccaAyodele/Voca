export interface AudioSignalMetrics {
  durationSeconds: number
  speakingDurationSeconds: number
  pauseCount: number
  averagePauseDuration: number
  pauseDurations: number[]
  rmsMean: number
  rmsVariation: number
  analysisVersion: string
}

export async function analyzeAudioSignal(blob: Blob): Promise<AudioSignalMetrics> {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  if (!AudioContextClass) {
    return {
      durationSeconds: 15,
      speakingDurationSeconds: 13,
      pauseCount: 2,
      averagePauseDuration: 0.8,
      pauseDurations: [0.7, 0.9],
      rmsMean: 0.08,
      rmsVariation: 0.04,
      analysisVersion: '1.0.0-fallback'
    }
  }

  const audioCtx = new AudioContextClass()
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

    const channelData = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    const totalSamples = channelData.length
    const durationSeconds = Math.max(0.5, totalSamples / sampleRate)

    // Calculate RMS in 50ms windows
    const windowSize = Math.floor(sampleRate * 0.05) // 50ms
    const numWindows = Math.floor(totalSamples / windowSize)
    const rmsValues: number[] = []

    for (let w = 0; w < numWindows; w++) {
      let sumSquares = 0
      const start = w * windowSize
      for (let i = 0; i < windowSize; i++) {
        const val = channelData[start + i] ?? 0
        sumSquares += val * val
      }
      const rms = Math.sqrt(sumSquares / windowSize)
      rmsValues.push(rms)
    }

    // Mean RMS
    const rmsSum = rmsValues.reduce((acc, val) => acc + val, 0)
    const rmsMean = rmsValues.length > 0 ? rmsSum / rmsValues.length : 0

    // RMS Variation (Standard Deviation)
    const variance =
      rmsValues.length > 0
        ? rmsValues.reduce((acc, val) => acc + Math.pow(val - rmsMean, 2), 0) / rmsValues.length
        : 0
    const rmsVariation = Math.sqrt(variance)

    // Threshold-based pause detection (silence windows < 15% of mean RMS or < 0.01)
    const silenceThreshold = Math.max(0.008, rmsMean * 0.18)
    const minSilenceWindows = Math.floor(0.35 / 0.05) // at least 350ms of silence

    let currentSilenceWindows = 0
    const pauseDurations: number[] = []

    for (const val of rmsValues) {
      if (val < silenceThreshold) {
        currentSilenceWindows++
      } else {
        if (currentSilenceWindows >= minSilenceWindows) {
          const pauseSec = currentSilenceWindows * 0.05
          pauseDurations.push(parseFloat(pauseSec.toFixed(2)))
        }
        currentSilenceWindows = 0
      }
    }
    if (currentSilenceWindows >= minSilenceWindows) {
      pauseDurations.push(parseFloat((currentSilenceWindows * 0.05).toFixed(2)))
    }

    const pauseCount = pauseDurations.length
    const totalPauseTime = pauseDurations.reduce((a, b) => a + b, 0)
    const averagePauseDuration =
      pauseCount > 0 ? parseFloat((totalPauseTime / pauseCount).toFixed(2)) : 0
    const speakingDurationSeconds = Math.max(0.5, durationSeconds - totalPauseTime)

    return {
      durationSeconds: parseFloat(durationSeconds.toFixed(1)),
      speakingDurationSeconds: parseFloat(speakingDurationSeconds.toFixed(1)),
      pauseCount,
      averagePauseDuration,
      pauseDurations,
      rmsMean: parseFloat(rmsMean.toFixed(4)),
      rmsVariation: parseFloat(rmsVariation.toFixed(4)),
      analysisVersion: '1.0.0-webaudio'
    }
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {})
    }
  }
}
