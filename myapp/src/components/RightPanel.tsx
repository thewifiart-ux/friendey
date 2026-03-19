import { useState, useEffect, useRef } from 'react'
import { Task } from '@/lib/types'

interface RightPanelProps {
  tasks: Task[]
  streak: number
}

export default function RightPanel({ tasks, streak }: RightPanelProps) {
  const total = tasks.length
  const done = tasks.filter(t => t.completed).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const circumference = 163
  const offset = circumference - (circumference * pct / 100)
  const nextTask = tasks.find(t => !t.completed)

  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { setRunning(false); return 0 }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const toggleTimer = () => setRunning(r => !r)
  const resetTimer = () => { setRunning(false); setSeconds(25 * 60) }

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0')
  const ss = (seconds % 60).toString().padStart(2, '0')

  const today = new Date()
  const dayLabels = ['S','M','T','W','T','F','S']
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today.getDay() - 6 + i + 7) % 7
    return { label: dayLabels[dayIndex], filled: i < streak && streak > 0, isToday: i === 6 }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 400, marginBottom: 14 }}>
          📊 Today's progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--brown-100)" strokeWidth="5" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent)" strokeWidth="5"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              {pct}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{done} of {total} done</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {total - done} task{total - done !== 1 ? 's' : ''} remaining
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, var(--accent-light), var(--cream))',
        border: '1px solid rgba(196,135,58,0.2)', borderRadius: 12, padding: 18,
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 400, marginBottom: 10 }}>
          🎯 Focus now
        </div>
        {nextTask ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>
              {nextTask.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {nextTask.priority} priority · {nextTask.tag}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            All done for today! 🎉
          </div>
        )}
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, color: 'var(--accent)', margin: '8px 0', letterSpacing: -1 }}>
          {mm}:{ss}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleTimer} style={{
            flex: 1, padding: 7, borderRadius: 7,
            border: 'none', background: 'var(--accent)', color: 'white',
            fontSize: 12, fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {running ? 'Pause' : seconds === 25 * 60 ? 'Start focus' : 'Resume'}
          </button>
          <button onClick={resetTimer} style={{
            flex: 1, padding: 7, borderRadius: 7,
            border: '1px solid var(--border)', background: 'white',
            fontSize: 12, fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 400, marginBottom: 12 }}>
          🔥 Daily streak
        </div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
          {streakDays.map((d, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '1',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 500,
              background: d.isToday ? 'var(--accent-light)' : d.filled ? 'var(--green)' : 'var(--brown-100)',
              color: d.isToday ? 'var(--accent)' : d.filled ? 'white' : 'var(--text-tertiary)',
              border: d.isToday ? '1px solid var(--accent)' : 'none',
            }}>
              {d.label}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: 'var(--text-primary)' }}>
          {streak} {streak === 1 ? 'day' : 'days'} 🔥
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          Complete today's tasks to keep your streak
        </div>
      </div>

    </div>
  )
}