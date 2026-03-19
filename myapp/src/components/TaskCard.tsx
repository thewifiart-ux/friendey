import { Task } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  Work:     { bg: '#EEF2FF', color: '#5B6FD6' },
  Personal: { bg: 'var(--green-light)', color: 'var(--green)' },
  Health:   { bg: '#FDE8E8', color: '#C45A5A' },
  Urgent:   { bg: 'var(--accent-light)', color: 'var(--accent)' },
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#E25A5A',
  medium: 'var(--accent)',
  low:    'var(--brown-200)',
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const tagStyle = TAG_STYLES[task.tag] || TAG_STYLES['Personal']

  return (
    <div
      className="animate-fade-up"
      style={{
        background: 'var(--warm-white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.15s',
        opacity: task.completed ? 0.5 : 1,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--brown-200)'
        el.style.boxShadow = '0 2px 8px rgba(61,46,30,0.06)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: 18, height: 18, minWidth: 18, borderRadius: '50%',
          border: task.completed ? 'none' : '1.5px solid var(--brown-200)',
          background: task.completed ? 'var(--green)' : 'transparent',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 1, flexShrink: 0, transition: 'all 0.15s',
          color: 'white', fontSize: 10, fontWeight: 600,
        }}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, color: 'var(--text-primary)',
          textDecoration: task.completed ? 'line-through' : 'none',
          lineHeight: 1.4,
        }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'center' }}>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 6,
            background: tagStyle.bg, color: tagStyle.color,
          }}>
            {task.tag}
          </span>
          <span style={{
            fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize'
          }}>
            {task.priority} priority
          </span>
        </div>
      </div>

      <div style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS['medium'],
        marginTop: 6,
      }} />
    </div>
  )
}