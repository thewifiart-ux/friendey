import { Sun, Star, Calendar, Briefcase, Home, Heart, Plus, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/types'

interface SidebarProps {
  profile: Profile | null
  activeList: string
  onListChange: (list: string) => void
}

const navItems = [
  { id: 'day', label: 'My Day', icon: Sun },
  { id: 'important', label: 'Important', icon: Star },
  { id: 'planned', label: 'Planned', icon: Calendar },
]

const lists = [
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'personal', label: 'Personal', icon: Home },
  { id: 'health', label: 'Health', icon: Heart },
]

export default function Sidebar({ profile, activeList, onListChange }: SidebarProps) {
  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'Me'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: 'var(--warm-white)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh',
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.5px' }}>
          friendey<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, fontWeight: 300, letterSpacing: '0.05em' }}>
          your life, organized
        </div>
      </div>

      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>
          Today
        </div>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activeList === item.id
          return (
            <button key={item.id} onClick={() => onListChange(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8, fontSize: 13.5,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
              border: 'none', cursor: 'pointer', width: '100%',
              textAlign: 'left', transition: 'all 0.15s',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              <Icon size={15} />
              {item.label}
            </button>
          )
        })}

        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6, marginTop: 20 }}>
          Lists
        </div>
        {lists.map(item => {
          const Icon = item.icon
          const isActive = activeList === item.id
          return (
            <button key={item.id} onClick={() => onListChange(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8, fontSize: 13.5,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
              border: 'none', cursor: 'pointer', width: '100%',
              textAlign: 'left', transition: 'all 0.15s',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              <Icon size={15} />
              {item.label}
            </button>
          )
        })}

        <button style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8, fontSize: 13.5,
          color: 'var(--text-tertiary)', background: 'transparent',
          border: 'none', cursor: 'pointer', width: '100%',
          textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
        }}>
          <Plus size={15} /> New list
        </button>
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent-light)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fraunces, serif', fontSize: 13,
          color: 'var(--accent)', fontWeight: 500, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.name || 'You'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
            {profile?.plan || 'free'} plan
          </div>
        </div>
        <button onClick={handleSignOut} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4 }}>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}