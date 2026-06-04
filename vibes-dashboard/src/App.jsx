import { useState, useEffect, useRef, useCallback } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import './App.css'

// ─── Deterministic helpers ────────────────────────────────────────────────────

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const SPIRIT_ANIMALS = [
  { name: 'Harbor Seal',    emoji: '🦭', implication: 'Recommend async-only communication until 3pm.' },
  { name: 'Capybara',       emoji: '🦫', implication: 'Collaborative throughput peaks in 47-minute sprints.' },
  { name: 'Axolotl',        emoji: '🦎', implication: 'Regenerative focus cycle detected. Avoid context-switching.' },
  { name: 'Mantis Shrimp',  emoji: '🦐', implication: 'Perceptual bandwidth elevated. Suitable for design review.' },
  { name: 'Tardigrade',     emoji: '🐾', implication: 'High resilience index. Safe to attend Monday standups.' },
  { name: 'Pangolin',       emoji: '🦔', implication: 'Defensive posture optimal. Block calendar after 2pm.' },
  { name: 'Quokka',         emoji: '🐨', implication: 'Interpersonal emissions high. Limit DMs to 12/day.' },
  { name: 'Blobfish',       emoji: '🐟', implication: 'Ambient pressure tolerance exceeds threshold. Ship it.' },
  { name: 'Slow Loris',     emoji: '🐒', implication: 'Deliberate processing mode active. No async before noon.' },
  { name: 'Narwhal',        emoji: '🐳', implication: 'Directional clarity spike. Ideal for roadmap alignment.' },
]

function getSpiritAnimal() {
  const now = new Date()
  const seed = now.getFullYear() * 1000000 +
    (now.getMonth() + 1) * 10000 +
    now.getDate() * 100 +
    now.getDay() * 10 +
    Math.floor(now.getHours() / 3)
  const rng = seededRandom(seed)
  const idx = Math.floor(rng() * SPIRIT_ANIMALS.length)
  const confidence = 87 + Math.floor(rng() * 12)
  return { ...SPIRIT_ANIMALS[idx], confidence }
}

function getLunarCoefficient() {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const phase = (dayOfYear % 29.53) / 29.53
  return 0.82 + Math.sin(phase * Math.PI * 2) * 0.41
}

const FORECAST_LABELS = [
  { label: 'Deep work window',              risk: null },
  { label: 'Slack spiral risk: HIGH',       risk: 'HIGH' },
  { label: 'Async digest optimal',          risk: null },
  { label: 'Meeting blast radius elevated', risk: 'MEDIUM' },
  { label: 'Creative output window',        risk: null },
  { label: 'Cognitive debt accrual',        risk: 'MEDIUM' },
  { label: 'Recovery mode',                risk: null },
  { label: 'Notification entropy peak',     risk: 'HIGH' },
  { label: 'Focus surplus detected',        risk: null },
  { label: 'Interpersonal fatigue zone',    risk: 'MEDIUM' },
]

const WEATHER_ICONS = {
  sunny:  { icon: '☀️',  label: 'Optimal',     color: 'text-yellow-600' },
  cloudy: { icon: '⛅',  label: 'Moderate',    color: 'text-slate-500' },
  stormy: { icon: '⛈️',  label: 'Disrupted',   color: 'text-red-600' },
  foggy:  { icon: '🌫️',  label: 'Low clarity', color: 'text-slate-500' },
  windy:  { icon: '💨',  label: 'Volatile',    color: 'text-blue-600' },
}
const WEATHER_KEYS = Object.keys(WEATHER_ICONS)

function generateForecast() {
  const now = new Date()
  const currentHour = now.getHours()
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const rng = seededRandom(seed)
  for (let i = 0; i < currentHour * 2; i++) rng()

  const hours = []
  for (let h = currentHour + 1; h <= 23; h++) {
    const weatherIdx = Math.floor(rng() * WEATHER_KEYS.length)
    const labelIdx = Math.floor(rng() * FORECAST_LABELS.length)
    const display = h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`
    hours.push({
      hour: display,
      weather: WEATHER_KEYS[weatherIdx],
      ...FORECAST_LABELS[labelIdx],
    })
  }
  return hours.slice(0, 8)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm ${className}`}>
      <div>
        <div className="text-xs font-semibold tracking-widest text-slate-700 uppercase">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

function StatBadge({ children, variant = 'neutral' }) {
  const colors = {
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:     'bg-red-50 text-red-700 border-red-200',
    yellow:  'bg-amber-50 text-amber-700 border-amber-200',
    violet:  'bg-violet-50 text-violet-700 border-violet-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${colors[variant]}`}>
      {children}
    </span>
  )
}

function FocusGauge({ score }) {
  const r = 56
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const strokeDashoffset = circ - circ * 0.75 * pct
  const color = score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626'

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 140, height: 110 }}>
      <svg width="140" height="110" viewBox="0 0 140 110">
        <circle
          cx="70" cy="80" r={r}
          fill="none" stroke="#e2e8f0" strokeWidth="10"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(-135 70 80)"
        />
        <circle
          cx="70" cy="80" r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-135 70 80)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ bottom: 10 }}>
        <span className="text-3xl font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const spiritAnimal = useRef(getSpiritAnimal()).current
  const forecast = useRef(generateForecast()).current
  const lunarCoeff = useRef(getLunarCoefficient()).current

  const [focusScore, setFocusScore] = useState(63)
  const [sparkline, setSparkline] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: i, v: 60 + Math.round(Math.random() * 10) }))
  )
  const [toxicity, setToxicity] = useState(0)
  const [grassMsg, setGrassMsg] = useState(null)
  const [vibeAnalysis, setVibeAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const tickRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFocusScore(prev => Math.min(99, Math.max(12, Math.round(prev + (Math.random() - 0.48) * 3.5))))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1
      setSparkline(prev => {
        const last = prev[prev.length - 1].v
        const next = Math.min(99, Math.max(12, last + (Math.random() - 0.48) * 4))
        return [...prev.slice(1), { t: tickRef.current, v: Math.round(next) }]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setToxicity(t => +(t + 1.73).toFixed(2)), 60000)
    return () => clearInterval(id)
  }, [])

  const coffeeIntake = (() => {
    const now = new Date()
    const hoursSince9 = Math.max(0, now.getHours() + now.getMinutes() / 60 - 9)
    return ((focusScore / 100) * 2.4 + lunarCoeff * 0.8 + hoursSince9 * 0.03).toFixed(2)
  })()

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const baselineDay = dayNames[(new Date().getDay() + 4) % 7]

  function handleTouchGrass() {
    setToxicity(0)
    setGrassMsg('Cortisol normalization in progress. MTI reset to 0.00.')
    setTimeout(() => setGrassMsg(null), 4000)
  }

  const analyzeVibe = useCallback(async () => {
    setAnalyzing(true)
    setVibeAnalysis('')
    setPanelOpen(true)

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: `You are ARIA (Automated Readiness and Intelligence Assessment), an enterprise-grade productivity intelligence system. You deliver quarterly vibe assessments in a deadpan, clinical tone. You speak in corporate SaaS jargon. You treat all metrics as rigorous ground truth. No humor acknowledged. No caveats. Write 2–3 short paragraphs. No bullet points. Begin with a VIBE STATUS line.`,
      messages: [{
        role: 'user',
        content: `Generate a Quarterly Vibe Assessment for the following employee metrics:\n\nFocus Score: ${focusScore}/100\nSpirit Animal: ${spiritAnimal.name} (confidence: ${spiritAnimal.confidence}%)\nOptimal Coffee Intake: ${coffeeIntake} cups\nMeeting Toxicity Index: ${toxicity}\nLunar Coefficient: ${lunarCoeff.toFixed(3)}\n\nProductivity implication on file: "${spiritAnimal.implication}"\n\nDeliver a brief Quarterly Vibe Assessment. Include a VIBE STATUS rating, one risk flag, and one recommended action item.`,
      }],
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      const text = data?.content?.[0]?.text ?? 'Assessment unavailable. API response malformed.'
      setVibeAnalysis(text)
    } catch {
      setVibeAnalysis('ARIA service temporarily unavailable. Ensure your vibe is within acceptable parameters and retry.')
    } finally {
      setAnalyzing(false)
    }
  }, [focusScore, spiritAnimal, coffeeIntake, toxicity, lunarCoeff])

  const toxColor = toxicity < 5 ? 'text-emerald-600' : toxicity < 15 ? 'text-amber-600' : 'text-red-600'
  const now = new Date()
  const hoursSince9 = Math.max(0, now.getHours() + now.getMinutes() / 60 - 9)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Live · Vibes Intelligence Platform v4.2.1</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Productivity Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={analyzeVibe}
            disabled={analyzing}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 disabled:text-violet-400 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {analyzing ? 'Analyzing…' : 'Analyze My Vibe'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">

        {/* Spirit Animal — col 1-4 */}
        <Panel title="Spirit Animal" subtitle="Biometric archetype · 3-hour resolution" className="col-span-4">
          <div className="flex items-start gap-3">
            <span className="text-5xl leading-none">{spiritAnimal.emoji}</span>
            <div className="flex-1">
              <div className="text-xl font-semibold text-slate-900 tracking-tight">{spiritAnimal.name}</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <StatBadge variant="green">CONFIDENCE {spiritAnimal.confidence}%</StatBadge>
                <StatBadge variant="neutral">ARCHETYPE LOCK</StatBadge>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-1">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">Productivity Implication</div>
            <div className="text-sm text-slate-700 leading-snug">{spiritAnimal.implication}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-1">
            {[['Mode', 'Adaptive'], ['Stability', 'HIGH'], ['Recheck in', '3h']].map(([k, v]) => (
              <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg py-2">
                <div className="text-xs text-slate-500 uppercase tracking-wide">{k}</div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Focus Score — col 5-9 */}
        <Panel title="Focus Score" subtitle="Cognitive throughput index · 2-second polling" className="col-span-5">
          <div className="flex items-start gap-4">
            <FocusGauge score={focusScore} />
            <div className="flex-1 flex flex-col gap-2 pt-1 min-w-0">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">40-minute trend</div>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkline}>
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, color: '#475569', padding: '4px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        formatter={v => [`${v}`, 'Score']}
                        labelFormatter={() => ''}
                      />
                      <Line type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatBadge variant="green">+14% vs {baselineDay}</StatBadge>
                <StatBadge variant="neutral">P72 cohort</StatBadge>
              </div>
              <div className="text-xs text-slate-500 leading-snug">
                Sustained above 58-point activation threshold for 23 consecutive minutes.
              </div>
            </div>
          </div>
        </Panel>

        {/* Coffee Intake — col 10-12 */}
        <Panel title="Optimal Coffee Intake" subtitle="Lunar-adjusted · Live recalculation" className="col-span-3">
          <div className="flex flex-col items-center justify-center gap-1 py-2">
            <span className="text-4xl">☕</span>
            <div className="text-4xl font-bold font-mono text-amber-700 mt-1">{coffeeIntake}</div>
            <div className="text-xs text-slate-500">cups recommended</div>
          </div>
          <div className="space-y-1.5 text-xs mt-1">
            {[
              ['Focus component', ((focusScore / 100) * 2.4).toFixed(3)],
              ['Lunar coefficient', (lunarCoeff * 0.8).toFixed(3)],
              ['Circadian drift', (hoursSince9 * 0.03).toFixed(3)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-slate-600">{k}</span>
                <span className="font-mono text-slate-600">{v}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center">
              <span className="text-slate-600">Margin of error</span>
              <StatBadge variant="yellow">±0.18 cups</StatBadge>
            </div>
          </div>
        </Panel>

        {/* Vibe Forecast — col 1-8 */}
        <Panel title="Vibe Forecast" subtitle="Hourly productivity meteorology · Stable until midnight" className="col-span-8">
          {forecast.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6">Vibes exhausted for today. Resume tomorrow at 09:00.</div>
          ) : (
            <div className="grid gap-1.5">
              {forecast.map((f, i) => {
                const w = WEATHER_ICONS[f.weather]
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-base w-5 text-center flex-shrink-0">{w.icon}</span>
                    <span className="text-xs font-mono text-slate-600 w-9 flex-shrink-0">{f.hour}</span>
                    <span className={`text-xs font-semibold w-20 flex-shrink-0 ${w.color}`}>{w.label}</span>
                    <span className="text-xs text-slate-600 flex-1 truncate">{f.label}</span>
                    {f.risk && (
                      <StatBadge variant={f.risk === 'HIGH' ? 'red' : 'yellow'}>{f.risk}</StatBadge>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        {/* Meeting Toxicity — col 9-12 */}
        <Panel title="Meeting Toxicity Index" subtitle="Cumulative damage · +1.73/hr auto-increment" className="col-span-4">
          <div className="flex flex-col items-center gap-2 py-2">
            <div className={`text-5xl font-bold font-mono ${toxColor}`}>{toxicity.toFixed(2)}</div>
            <div className="text-xs text-slate-500 text-center leading-snug">organizational entropy units<br />accumulated since last reset</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  toxicity < 5 ? 'bg-emerald-500' : toxicity < 15 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, (toxicity / 30) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 text-center">
              {toxicity < 5 ? 'STATUS: NOMINAL' : toxicity < 15 ? 'STATUS: ELEVATED — monitor closely' : 'STATUS: CRITICAL — intervene immediately'}
            </div>
          </div>

          {grassMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700 text-center leading-snug">
              {grassMsg}
            </div>
          ) : (
            <button
              onClick={handleTouchGrass}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Touch Grass
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[['Accrual Rate', '+1.73 / hr'], ['Critical Threshold', '30.00 units']].map(([k, v]) => (
              <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wide">{k}</div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ARIA Vibe Assessment */}
        {panelOpen && (
          <div className="col-span-12">
            <Panel title="Quarterly Vibe Assessment" subtitle="ARIA · Automated Readiness & Intelligence Assessment · Powered by claude-sonnet-4-20250514" className="border-violet-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {analyzing ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                      ARIA is processing your vibes. Standby.
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">
                      {vibeAnalysis}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="text-slate-500 hover:text-slate-600 text-xs flex-shrink-0 font-mono"
                >
                  [dismiss]
                </button>
              </div>
              {!analyzing && vibeAnalysis && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-mono">Generated {now.toLocaleTimeString()}</span>
                  <StatBadge variant="violet">max_tokens: 300</StatBadge>
                  <StatBadge variant="neutral">Focus: {focusScore}</StatBadge>
                  <StatBadge variant="neutral">MTI: {toxicity.toFixed(2)}</StatBadge>
                  <StatBadge variant="neutral">Lunar: {lunarCoeff.toFixed(3)}</StatBadge>
                </div>
              )}
            </Panel>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>VIP v4.2.1 · Data retention: 0 days · All metrics proprietary and legally binding</span>
        <span>Lunar coefficient: {lunarCoeff.toFixed(3)} · Source: internal · Not the moon</span>
      </div>
    </div>
  )
}
