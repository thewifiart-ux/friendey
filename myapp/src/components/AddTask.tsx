import { useState, useRef } from 'react'
import { TimeOfDay, Priority } from '@/lib/types'

interface AddTaskProps {
  onAdd: (task: { title: string; time_of_day: TimeOfDay; tag: string; priority: Priority }) => void
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [tag, setTag] = useState('Personal')
  const [priority, setPriority] = useState<Priority>('medium')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, time_of_day: timeOfDay, tag, priority })
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') { setValue(''); setFocused(false) }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: 'var(--warm-white)',
          border: `1.5px ${focused ? 'solid' : 'dashed'} ${focused ? 'var(--accent)' : 'var(--brown-200)'}`,
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'text',
          transition: 'all 0.15s',
        }}
      >
        <div style={{
          width: 18, height: 18, minWidth: 18, borderRadius: '50%',
          border: '1.5px dashed var(--brown-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-tertiary)', fontSize: 12, flexShrink: 0,
        }}>+</div>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!value) setFocused(false) }}
          onKeyDown={handleKeyDown}
          placeholder="Add a task... (press Enter to save)"
          style={{
            border: 'none', background: 'transparent',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            color: 'var(--text-primary)', outline: 'none', width: '100%',
          }}
        />
      </div>

      {focused && (
        <div className="animate-fade-in" style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map(t => (
            <button key={t} onClick={() => setTimeOfDay(t)} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              border: `1px solid ${timeOfDay === t ? 'var(--accent)' : 'var(--border)'}`,
              background: timeOfDay === t ? 'var(--accent-light)' : 'transparent',
              color: timeOfDay === t ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
          <div style={{ width: 1, background: 'var(--border)', margin: '0 2px' }} />
          {(['Work', 'Personal', 'Health'] as string[]).map(t => (
            <button key={t} onClick={() => setTag(t)} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              border: `1px solid ${tag === t ? 'var(--accent)' : 'var(--border)'}`,
              background: tag === t ? 'var(--accent-light)' : 'transparent',
              color: tag === t ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>{t}</button>
          ))}
          <div style={{ width: 1, background: 'var(--border)', margin: '0 2px' }} />
          {(['high', 'medium', 'low'] as Priority[]).map(p => (
            <button key={p} onClick={() => setPriority(p)} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              border: `1px solid ${priority === p ? 'var(--accent)' : 'var(--border)'}`,
              background: priority === p ? 'var(--accent-light)' : 'transparent',
              color: priority === p ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              textTransform: 'capitalize',
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}