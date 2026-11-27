'use client'

import { useEffect, useState } from 'react'

const initial = { name: '', email: '', phone: '', service: 'Web Application / SaaS', budget: '₹50,000 - ₹1,50,000', details: '' }
const fieldClass = (error) => `mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-slate-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001] ${error ? 'border-red-500' : 'border-slate-300'}`

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const handler = (event) => setForm((current) => ({ ...current, service: event.detail, budget: 'Custom Project' }))
    window.addEventListener('select-service', handler)
    return () => window.removeEventListener('select-service', handler)
  }, [])

  const update = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setStatus('idle')
    setSubmitError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    if (!form.details.trim()) next.details = 'Please add a short project description.'
    setErrors(next)
    setSubmitError('')
    if (Object.keys(next).length) return

    setStatus('submitting')
    const { supabase } = await import('../utils/supabase/client')
    const { error } = await supabase.from('enquiries').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.service,
      budget: form.budget,
      details: form.details.trim(),
    })

    if (error) {
      console.error('Unable to submit enquiry:', error.message)
      setSubmitError(
        (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') ||
        (typeof import.meta !== 'undefined' && import.meta.env?.DEV)
          ? `Supabase error: ${error.message}`
          : 'We could not send your enquiry. Please try again in a moment.'
      )
      setStatus('error')
      return
    }

    setForm(initial)
    setErrors({})
    setStatus('success')
  }

  const Field = ({ label, name, type = 'text', placeholder, autoComplete }) => <label className="block text-sm font-medium text-slate-800">{label}<input name={name} type={type} value={form[name]} onChange={update} placeholder={placeholder} autoComplete={autoComplete} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} className={fieldClass(errors[name])}/>{errors[name] && <span id={`${name}-error`} className="mt-1 block text-xs text-red-600">{errors[name]}</span>}</label>

  return <section id="contact" className="section bg-white"><div className="shell grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"><div><span className="eyebrow">Contact</span><h2 className="title">Tell us what you’re building.</h2><p className="copy mt-5 max-w-md">Share the basics of your project—whether it's a custom web app, SaaS platform, mobile app, Windows software, or web game. We’ll review the requirement and reply with a practical roadmap.</p><div className="mt-8 border-t border-slate-300 pt-5"><p className="text-sm leading-6 text-slate-500">Your details are used only to respond to this enquiry.</p></div></div><form noValidate onSubmit={submit} className="border-t-2 border-slate-900 pt-7"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" placeholder="Your name" autoComplete="name"/><Field label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email"/><Field label="Phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel"/><label className="text-sm font-medium text-slate-800">Service<select name="service" value={form.service} onChange={update} className={fieldClass()}><option>Web Application / SaaS</option><option>Website / Webpages</option><option>Mobile App (Android / iOS)</option><option>Windows / Desktop Application</option><option>Web Game / Interactive</option><option>Custom Software</option><option>Other</option></select></label><label className="text-sm font-medium text-slate-800 sm:col-span-2">Estimated Project Budget<select name="budget" value={form.budget} onChange={update} className={fieldClass()}><option>₹25,000 - ₹50,000</option><option>₹50,000 - ₹1,50,000</option><option>₹1,50,000 - ₹5,00,000</option><option>₹5,00,000+ (Enterprise / Scaled Product)</option><option>Custom Project / Flexible</option></select></label><label className="text-sm font-medium text-slate-800 sm:col-span-2">Project Details<textarea name="details" value={form.details} onChange={update} rows="5" placeholder="What do you need, and when would you like to start?" required aria-invalid={!!errors.details} aria-describedby={errors.details ? 'details-error' : undefined} className={`${fieldClass(errors.details)} resize-y`}/>{errors.details && <span id="details-error" className="mt-1 block text-xs text-red-600">{errors.details}</span>}</label></div><button type="submit" disabled={status === 'submitting'} className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60">{status === 'submitting' ? 'Sending…' : 'Send Enquiry'}</button>{status === 'success' && <p role="status" className="mt-4 border-l-2 border-emerald-600 pl-3 text-sm text-emerald-700">Thanks! Your enquiry has been sent. We’ll get back to you soon.</p>}{submitError && <p role="alert" className="mt-4 border-l-2 border-red-600 pl-3 text-sm text-red-700">{submitError}</p>}</form></div></section>
}
