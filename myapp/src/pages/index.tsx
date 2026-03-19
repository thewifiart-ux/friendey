import { useState, useEffect } from 'react'
import Head from 'next/head'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { Task, Profile, TimeOfDay, Priority } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import TaskCard from '@/components/TaskCard'
import AddTask from '@/components/AddTask'
import RightPanel from '@/components/RightPanel'
import Auth from '@/components/Auth'
import type { User } from '@supabase/supabase-js'

const TIME_SECTIONS: { key: TimeOfDay; label: string; emoji: string }[] = [
  { key: 'morning', label: 'Morning', emoji: '🌅' },
  { key: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { key: 'evening', label: 'Evening', emoji: '🌙' },
]

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeList, setActiveList] = useState('day')
  const [loading, setLoading] = useState(true)
  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data as Profile) })
  }, [user])

  useEffect(() => {
    if (!user) return
    supabase.from('tasks').select('*')
      .eq('user_id', user.id)
      .eq('scheduled_date', today)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setTasks(data as Task[]) })
  }, [user, today])

  const addTask = async ({ title, time_of_day, tag, priority }: { title: string; time_of_day: TimeOfDay; tag: string; priority: Priority }) => {
    if (!user) return
    const newTask = {
      user_id: user.id,
      title,
      completed: false,
      priority,
      tag,
      time_of_day,
      scheduled_date: today,
    }
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
    if (!error && data) setTasks(prev => [...prev, data as Task])
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const updated = !task.completed
    await supabase.from('tasks').update({ completed: updated }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: updated } : t))
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: 'var(--text-tertiary)' }}>
          friendey<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
      </div>
    )
  }

  if (!user) return <Auth />

  const todayLabel = format(new Date(), 'EEEE, MMMM d')
  const done = tasks.filter(t => t.completed).length

  return (
    <>
      <Head>
        <title>friendey — {todayLabel}</title>
      </Head>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar profile={profile} activeList={activeList} onListChange={setActiveList} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <div style={{
            background: 'var(--warm-white)', borderBottom: '1px solid var(--border)',
            padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, letterSpacing: '-0.3px' }}>
                {todayLabel}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                {tasks.length} tasks · {done} completed
              </div>
            </div>
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '28px 32px',
            display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start',
          }}>
            <div>
              {TIME_SECTIONS.map(section => {
                const sectionTasks = tasks.filter(t => t.time_of_day === section.key)
                return (
                  <div key={section.key} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {section.emoji} {section.label}
                        <span style={{
                          fontSize: 11, color: 'var(--text-tertiary)',
                          background: 'var(--brown-100)', padding: '2px 8px',
                          borderRadius: 10, fontFamily: 'DM Sans, sans-serif',
                        }}>
                          {sectionTasks.length}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {sectionTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                      ))}
                    </div>
                  </div>
                )
              })}
              <AddTask onAdd={addTask} />
            </div>

            <RightPanel tasks={tasks} streak={profile?.streak ?? 0} />
          </div>
        </main>
      </div>
    </>
  )
}