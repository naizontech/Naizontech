'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Inbox,
  Users,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  LogOut,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  ChevronRight,
  UserPlus,
  Trash2,
  Camera,
  Upload,
  Shield,
  Crown,
  FileText,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react'
import { supabase } from '../utils/supabase/client'
import {
  isSuperAdmin,
  canAccessLeads,
  getUserRole,
  getTeamMembers,
  saveTeamMember,
  removeTeamMember,
  updateUserAvatar,
} from '../utils/firebase'

export default function AdminDashboard({ currentUser, onLogout }) {
  const isAdmin = isSuperAdmin(currentUser)
  const userRole = getUserRole(currentUser)

  // Navigation: 'inbox' | 'team' | 'settings'
  const [activeNav, setActiveNav] = useState('inbox')

  // Enquiries Data
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'new' | 'contacted' | 'won' | 'archived'
  const [serviceFilter, setServiceFilter] = useState('all')

  // Selected Lead for Detail Drawer
  const [selectedLead, setSelectedLead] = useState(null)

  // Lead Statuses & Internal Notes (Persisted per lead in localStorage)
  const [leadStatuses, setLeadStatuses] = useState({})
  const [leadNotes, setLeadNotes] = useState({})
  const [currentNoteInput, setCurrentNoteInput] = useState('')

  // Team Management State
  const [teamMembers, setTeamMembers] = useState([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('lead_manager')
  const [teamFeedback, setTeamFeedback] = useState({ type: '', text: '' })

  // Avatar Upload State
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarFeedback, setAvatarFeedback] = useState('')
  const fileInputRef = useRef(null)

  // Clipboard Copied Status
  const [copiedKey, setCopiedKey] = useState('')

  // Load Lead Statuses & Notes from local cache
  useEffect(() => {
    try {
      const storedStatuses = localStorage.getItem('naizon_lead_statuses')
      if (storedStatuses) setLeadStatuses(JSON.parse(storedStatuses))

      const storedNotes = localStorage.getItem('naizon_lead_notes')
      if (storedNotes) setLeadNotes(JSON.parse(storedNotes))
    } catch (e) {
      console.warn('Notice loading local lead metadata:', e)
    }
  }, [])

  // Sync Team Members
  useEffect(() => {
    setTeamMembers(getTeamMembers())
    const handleTeamSync = () => setTeamMembers(getTeamMembers())
    window.addEventListener('naizon_team_change', handleTeamSync)
    return () => window.removeEventListener('naizon_team_change', handleTeamSync)
  }, [])

  // Fetch enquiries from Supabase
  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setEnquiries(data)
      }
    } catch (err) {
      console.warn('Error fetching enquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  // Update Lead Status (e.g. New, Contacted, Won, Archived)
  const handleStatusChange = (leadId, newStatus) => {
    const updated = { ...leadStatuses, [leadId]: newStatus }
    setLeadStatuses(updated)
    try {
      localStorage.setItem('naizon_lead_statuses', JSON.stringify(updated))
    } catch (e) {}
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }))
    }
  }

  // Save Lead Internal Note
  const handleSaveNote = (leadId) => {
    if (!currentNoteInput.trim()) return
    const prevNotes = leadNotes[leadId] || []
    const newNoteObj = {
      id: Date.now(),
      author: currentUser?.displayName || currentUser?.email || 'Team Member',
      text: currentNoteInput.trim(),
      date: new Date().toISOString(),
    }
    const updated = { ...leadNotes, [leadId]: [newNoteObj, ...prevNotes] }
    setLeadNotes(updated)
    setCurrentNoteInput('')
    try {
      localStorage.setItem('naizon_lead_notes', JSON.stringify(updated))
    } catch (e) {}
  }

  // Format Dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateStr))
    } catch {
      return String(dateStr)
    }
  }

  const formatShortDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateStr))
    } catch {
      return ''
    }
  }

  // Copy helper
  const copyToClipboard = (text, key) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    }
  }

  // Export Enquiries to CSV
  const handleExportCSV = () => {
    if (!enquiries.length) return
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Status', 'Date Received', 'Details']
    const rows = enquiries.map((item) => {
      const status = leadStatuses[item.id] || 'new'
      return [
        `"${item.id || ''}"`,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.phone || '').replace(/"/g, '""')}"`,
        `"${(item.service || '').replace(/"/g, '""')}"`,
        `"${(item.budget || '').replace(/"/g, '""')}"`,
        `"${status.toUpperCase()}"`,
        `"${formatDate(item.created_at)}"`,
        `"${(item.details || '').replace(/"/g, '""')}"`,
      ]
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `naizon_leads_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Avatar Upload
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.')
      return
    }
    setAvatarUploading(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target.result
      await updateUserAvatar(base64)
      setAvatarUploading(false)
      setAvatarFeedback('Profile picture updated successfully across the site!')
      setTimeout(() => setAvatarFeedback(''), 4000)
    }
    reader.readAsDataURL(file)
  }

  // Filtered Leads
  const filteredLeads = enquiries.filter((lead) => {
    const leadStatus = leadStatuses[lead.id] || 'new'
    if (statusFilter !== 'all' && leadStatus !== statusFilter) return false
    if (serviceFilter !== 'all' && (!lead.service || !lead.service.toLowerCase().includes(serviceFilter.toLowerCase()))) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const inName = lead.name?.toLowerCase().includes(q)
      const inEmail = lead.email?.toLowerCase().includes(q)
      const inPhone = lead.phone?.toLowerCase().includes(q)
      const inService = lead.service?.toLowerCase().includes(q)
      const inDetails = lead.details?.toLowerCase().includes(q)
      if (!inName && !inEmail && !inPhone && !inService && !inDetails) return false
    }
    return true
  })

  // KPI Metrics calculation
  const totalLeadsCount = enquiries.length
  const newLeadsCount = enquiries.filter((item) => (leadStatuses[item.id] || 'new') === 'new').length
  const contactedCount = enquiries.filter((item) => leadStatuses[item.id] === 'contacted').length
  const wonCount = enquiries.filter((item) => leadStatuses[item.id] === 'won').length

  // Team Invite Submit
  const handleInviteSubmit = (e) => {
    e.preventDefault()
    setTeamFeedback({ type: '', text: '' })
    if (!inviteEmail.trim()) {
      setTeamFeedback({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    try {
      const updated = saveTeamMember({
        email: inviteEmail.trim(),
        name: inviteName.trim() || inviteEmail.split('@')[0],
        role: inviteRole,
      })
      setTeamMembers(updated)
      setInviteEmail('')
      setInviteName('')
      setTeamFeedback({ type: 'success', text: `Access granted! ${inviteEmail} can now sign in at /login and manage contact leads.` })
      setTimeout(() => setTeamFeedback({ type: '', text: '' }), 5000)
    } catch (err) {
      setTeamFeedback({ type: 'error', text: err.message || 'Failed to add team member.' })
    }
  }

  const handleRevoke = (email) => {
    if (!window.confirm(`Revoke contact form access for ${email}?`)) return
    try {
      const updated = removeTeamMember(email)
      setTeamMembers(updated)
      setTeamFeedback({ type: 'success', text: `Access revoked for ${email}.` })
      setTimeout(() => setTeamFeedback({ type: '', text: '' }), 3000)
    } catch (err) {
      setTeamFeedback({ type: 'error', text: err.message || 'Cannot revoke access.' })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-[#fd5001] selection:text-white">
      {/* ==================================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION                                           */}
      {/* ==================================================================== */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0e1422] flex flex-col justify-between shrink-0 hidden md:flex">
        {/* Top: Logo & Nav items */}
        <div>
          {/* Brand header */}
          <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#fd5001] flex items-center justify-center shadow-md shadow-[#fd5001]/20">
                <span className="text-sm font-black text-white">N</span>
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-white">NAIZON</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agency Console</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveNav('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'inbox'
                  ? 'bg-[#fd5001] text-white shadow-md shadow-[#fd5001]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Inbox size={16} />
                <span>Inquiries & Leads</span>
              </span>
              <span className={`text-[10px] font-black rounded-full px-2 py-0.5 ${
                activeNav === 'inbox' ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {enquiries.length}
              </span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveNav('team')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeNav === 'team'
                    ? 'bg-[#fd5001] text-white shadow-md shadow-[#fd5001]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users size={16} />
                  <span>Team & Permissions</span>
                </span>
                <span className={`text-[10px] font-black rounded-full px-2 py-0.5 ${
                  activeNav === 'team' ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {teamMembers.length}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                activeNav === 'settings'
                  ? 'bg-[#fd5001] text-white shadow-md shadow-[#fd5001]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings size={16} />
              <span>Profile & Branding</span>
            </button>
          </nav>
        </div>

        {/* Bottom: User Footer & Sign out */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <a
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition mb-2"
          >
            <span>Live Website</span>
            <ArrowUpRight size={14} />
          </a>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-[#fd5001] flex items-center justify-center text-xs font-black text-white">
                    {(currentUser?.displayName || currentUser?.email || 'M')[0].toUpperCase()}
                  </div>
                )}
                {isAdmin && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 ring-1 ring-[#0e1422] flex items-center justify-center">
                    <Crown size={7} className="text-slate-950" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.displayName || 'Muhammad Sufiyan'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {userRole}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* 2. MAIN WORKSPACE CANVAS                                             */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0e1422]/90 sticky top-0 z-30 px-5 flex items-center justify-between backdrop-blur-md">
          {/* Left: Section Title & Mobile Nav Switcher */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => setActiveNav('inbox')}
                className={`p-2 rounded-lg text-xs font-bold ${activeNav === 'inbox' ? 'bg-[#fd5001] text-white' : 'text-slate-400'}`}
                title="Leads"
              >
                <Inbox size={16} />
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveNav('team')}
                  className={`p-2 rounded-lg text-xs font-bold ${activeNav === 'team' ? 'bg-[#fd5001] text-white' : 'text-slate-400'}`}
                  title="Team"
                >
                  <Users size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveNav('settings')}
                className={`p-2 rounded-lg text-xs font-bold ${activeNav === 'settings' ? 'bg-[#fd5001] text-white' : 'text-slate-400'}`}
                title="Settings"
              >
                <Settings size={16} />
              </button>
            </div>

            <div>
              <h1 className="text-sm font-extrabold text-white capitalize">
                {activeNav === 'inbox' ? 'Contact Inquiries & Leads' : activeNav === 'team' ? 'Team & Role Access' : 'Profile Settings'}
              </h1>
              <p className="text-[11px] text-slate-400">
                {activeNav === 'inbox' ? `${filteredLeads.length} total customer proposals` : activeNav === 'team' ? `${teamMembers.length} authorized users` : 'Manage your avatar and personal profile'}
              </p>
            </div>
          </div>

          {/* Right: Actions (Search, Export, Refresh) */}
          <div className="flex items-center gap-2.5">
            {activeNav === 'inbox' && (
              <>
                {/* Search input */}
                <div className="relative hidden sm:block w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads (/)..."
                    className="w-full h-9 pl-9 pr-7 rounded-lg border border-slate-700 bg-slate-900/90 text-xs text-white placeholder-slate-500 outline-none focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001] transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Export to CSV */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={!enquiries.length}
                  className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
                  title="Export leads to CSV"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </>
            )}

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchEnquiries}
              disabled={loading}
              className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
              title="Refresh leads"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-[#fd5001]' : ''} />
              <span className="hidden sm:inline">{loading ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Sign Out on mobile */}
            <button
              type="button"
              onClick={onLogout}
              className="md:hidden inline-flex h-9 items-center px-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-300"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-5 md:p-7 space-y-6 flex-1">
          {/* ================================================================ */}
          {/* VIEW A: LEADS & INQUIRIES WORKSPACE                              */}
          {/* ================================================================ */}
          {activeNav === 'inbox' && (
            <div className="space-y-6">
              {/* KPI Strip (Stripe Style) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-800 bg-[#0e1422] shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">{totalLeadsCount}</span>
                    <span className="text-xs text-slate-500">all channels</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-[#0e1422] shadow-sm">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">New Inquiries</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-blue-400">{newLeadsCount}</span>
                    <span className="text-xs text-slate-500">awaiting reply</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-[#0e1422] shadow-sm">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">In Progress</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-amber-400">{contactedCount}</span>
                    <span className="text-xs text-slate-500">contacted</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-[#0e1422] shadow-sm">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Qualified / Deals</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400">{wonCount}</span>
                    <span className="text-xs text-slate-500">converted</span>
                  </div>
                </div>
              </div>

              {/* Status & Service Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e1422] p-3 rounded-xl border border-slate-800">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Leads', count: enquiries.length },
                    { id: 'new', label: 'New', count: newLeadsCount },
                    { id: 'contacted', label: 'Contacted', count: contactedCount },
                    { id: 'won', label: 'Qualified', count: wonCount },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                        statusFilter === tab.id
                          ? 'bg-[#fd5001] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="ml-1.5 text-[10px] opacity-80">({tab.count})</span>
                    </button>
                  ))}
                </div>

                {/* Service Dropdown Filter */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="h-8 rounded-lg border border-slate-700 bg-slate-900 px-2.5 text-xs text-white outline-none focus:border-[#fd5001]"
                  >
                    <option value="all">All Services</option>
                    <option value="web">Web & SaaS</option>
                    <option value="mobile">Mobile Apps</option>
                    <option value="website">Websites</option>
                    <option value="ecommerce">Ecommerce</option>
                  </select>
                </div>
              </div>

              {/* CRM Data Table (Linear / Stripe density) */}
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Budget</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400">
                            <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#fd5001]" />
                            <span>Loading customer inquiries...</span>
                          </td>
                        </tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400">
                            <Inbox size={28} className="mx-auto mb-2 text-slate-600" />
                            <p className="font-bold text-slate-300">No inquiries found</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters or search term.' : 'Submitted contact forms will appear here live.'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const status = leadStatuses[lead.id] || 'new'
                          const statusConfig = {
                            new: { label: 'New', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
                            contacted: { label: 'Contacted', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
                            won: { label: 'Qualified', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
                            archived: { label: 'Archived', color: 'bg-slate-700/30 text-slate-400 border-slate-700' },
                          }[status] || { label: 'New', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }

                          const hasNotes = leadNotes[lead.id] && leadNotes[lead.id].length > 0

                          return (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead({ ...lead, status })}
                              className="hover:bg-slate-800/40 cursor-pointer transition"
                            >
                              {/* Client Info */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                    {(lead.name || 'C')[0].toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-bold text-white truncate max-w-[150px] sm:max-w-xs">{lead.name || 'Client'}</p>
                                      {hasNotes && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Has internal notes" />
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-xs">{lead.email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Service */}
                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                                  {lead.service || 'General'}
                                </span>
                              </td>

                              {/* Budget */}
                              <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                                {lead.budget || '—'}
                              </td>

                              {/* Status Dropdown */}
                              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={status}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                  className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none cursor-pointer ${statusConfig.color}`}
                                >
                                  <option value="new">🔵 New</option>
                                  <option value="contacted">🟡 Contacted</option>
                                  <option value="won">🟢 Qualified</option>
                                  <option value="archived">⚪ Archived</option>
                                </select>
                              </td>

                              {/* Date */}
                              <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                                {formatShortDate(lead.created_at)}
                              </td>

                              {/* Quick Contact Actions */}
                              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  {lead.phone && (
                                    <a
                                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="WhatsApp message"
                                      className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                                    >
                                      <MessageSquare size={13} />
                                    </a>
                                  )}
                                  {lead.phone && (
                                    <a
                                      href={`tel:${lead.phone}`}
                                      title="Direct Call"
                                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition"
                                    >
                                      <Phone size={13} />
                                    </a>
                                  )}
                                  {lead.email && (
                                    <a
                                      href={`mailto:${lead.email}?subject=Re: Your enquiry with NAIZON`}
                                      title="Email client"
                                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition"
                                    >
                                      <Mail size={13} />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLead({ ...lead, status })}
                                    className="p-1.5 text-slate-400 hover:text-white"
                                  >
                                    <ChevronRight size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW B: TEAM & ROLE ACCESS MANAGEMENT (RBAC)                      */}
          {/* ================================================================ */}
          {activeNav === 'team' && isAdmin && (
            <div className="space-y-6 max-w-4xl">
              {teamFeedback.text && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  teamFeedback.type === 'error'
                    ? 'border-red-500/30 bg-red-500/10 text-red-300'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                }`}>
                  {teamFeedback.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                  <span>{teamFeedback.text}</span>
                </div>
              )}

              {/* Add Member Form */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1422] shadow-sm">
                <div className="pb-4 border-b border-slate-800/80 mb-5">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <UserPlus size={18} className="text-[#fd5001]" />
                    <span>Invite Team Member / Assign Role</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized team members can log in at <strong className="text-white">/login</strong> to view, call, and manage contact enquiries.
                  </p>
                </div>

                <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. sales@naizon.com"
                      className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 outline-none focus:border-[#fd5001]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Sales Director"
                      className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 outline-none focus:border-[#fd5001]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Access Role *
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-[#fd5001]"
                    >
                      <option value="lead_manager">Lead Manager (Can View & Call/Email)</option>
                      <option value="super_admin">Super Admin (Full Root Control)</option>
                      <option value="viewer">Viewer (Read-Only Contact Forms)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center gap-2 px-5 rounded-lg bg-[#fd5001] text-xs font-bold text-white hover:bg-[#e04600] transition active:scale-95 shadow-md shadow-[#fd5001]/20"
                    >
                      <UserPlus size={14} />
                      <span>Grant Permission</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Members Roster Table */}
              <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Active Team Members ({teamMembers.length})
                </h3>

                <div className="divide-y divide-slate-800/80">
                  {teamMembers.map((member) => (
                    <div key={member.email} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                          {(member.name || member.email || 'T')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{member.name || member.email.split('@')[0]}</span>
                            {member.isOwner && (
                              <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-400">
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{member.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                          {member.roleLabel || member.role}
                        </span>

                        {!member.isOwner && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(member.email)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Revoke access"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW C: SETTINGS & PROFILE AVATAR MANAGEMENT                     */}
          {/* ================================================================ */}
          {activeNav === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              {avatarFeedback && (
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{avatarFeedback}</span>
                </div>
              )}

              {/* Profile Avatar Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1422] shadow-sm">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
                  Profile Picture & Avatar
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Avatar */}
                  <div className="relative group shrink-0">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-700 shadow-lg"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#fd5001] flex items-center justify-center text-3xl font-black text-white shadow-lg">
                        {(currentUser?.displayName || currentUser?.email || 'M')[0].toUpperCase()}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      title="Upload new picture"
                      className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                    >
                      <Camera size={20} className="text-amber-400" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {currentUser?.displayName || 'Muhammad Sufiyan'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser?.email}</p>

                    <div className="mt-3 flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="inline-flex h-9 items-center gap-2 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition"
                      >
                        <Upload size={13} className="text-[#fd5001]" />
                        <span>{avatarUploading ? 'Uploading...' : 'Upload New Photo'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Recommended: Square PNG, JPG or WEBP (up to 2MB). Automatically syncs across the Navbar and Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================== */}
      {/* 3. SLIDE-OVER LEAD DETAIL DRAWER                                      */}
      {/* ==================================================================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-[#0e1422] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proposal Details</span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedLead.name || 'Anonymous Client'}</h2>
                  <p className="text-xs text-slate-500">Received on {formatDate(selectedLead.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Switcher Strip */}
              <div className="my-5 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Lead Status</span>
                <div className="flex items-center gap-1.5">
                  {['new', 'contacted', 'won', 'archived'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${
                        (selectedLead.status || 'new') === st
                          ? 'bg-[#fd5001] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Quick Contact Toolbar */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedLead.phone ? (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition text-center"
                  >
                    <MessageSquare size={16} className="mb-1" />
                    <span className="text-[11px] font-bold">WhatsApp</span>
                  </a>
                ) : null}

                {selectedLead.phone ? (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 hover:text-white transition text-center"
                  >
                    <Phone size={16} className="mb-1" />
                    <span className="text-[11px] font-bold">Call Client</span>
                  </a>
                ) : null}

                {selectedLead.email ? (
                  <a
                    href={`mailto:${selectedLead.email}?subject=Regarding your enquiry with NAIZON`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 hover:text-white transition text-center"
                  >
                    <Mail size={16} className="mb-1" />
                    <span className="text-[11px] font-bold">Send Email</span>
                  </a>
                ) : null}
              </div>

              {/* Contact Meta Details */}
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Service</span>
                  <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded">{selectedLead.service || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Budget Range</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedLead.budget || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Email</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-200">{selectedLead.email}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedLead.email, 'drawer_email')}
                      className="text-slate-500 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === 'drawer_email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Phone</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-200">{selectedLead.phone || 'N/A'}</span>
                    {selectedLead.phone && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedLead.phone, 'drawer_phone')}
                        className="text-slate-500 hover:text-white"
                        title="Copy"
                      >
                        {copiedKey === 'drawer_phone' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Requirements Message */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Project Message / Notes</h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.details || 'No additional details provided by client.'}
                </div>
              </div>

              {/* Internal Follow-Up Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Internal Team Follow-Up Notes</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentNoteInput}
                    onChange={(e) => setCurrentNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(selectedLead.id)}
                    placeholder="Add follow-up note (e.g. Sent quote via email)..."
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 outline-none focus:border-[#fd5001]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveNote(selectedLead.id)}
                    className="px-3 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {(leadNotes[selectedLead.id] || []).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                      <p className="text-slate-300">{n.text}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {n.author} · {formatShortDate(n.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Close */}
            <div className="pt-4 border-t border-slate-800 mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
