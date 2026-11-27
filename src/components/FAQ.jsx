'use client'

import { useState } from 'react'
import { Plus, X, ChevronRight } from 'lucide-react'
import { faqCategories } from '../data/faq'

export default function FAQ() {
    const [selectedCategory, setSelectedCategory] = useState('general')
    const [openIndex, setOpenIndex] = useState(0)

    const activeCategoryData =
        faqCategories.find((cat) => cat.id === selectedCategory) || faqCategories[0]
    const currentQuestions = activeCategoryData.questions

    return (
        <section id="faq" className="section bg-[#f8f8f5]">
            <div className="shell">

                {/* Centered Heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.18em] text-[#fd5001]">
                        FAQ
                    </span>
                    <h2 className="title">Frequently Asked Questions</h2>
                    <p className="copy mt-4 text-slate-600">
                        Straight answers to common questions about our website plans, custom development, mobile apps, and technical delivery.
                    </p>
                </div>

                {/* 2-Column Content Layout (Category Sidebar + Question Cards) */}
                <div className="mt-12 sm:mt-16 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

                    {/* Left Column: Categories List */}
                    <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0">
                        <div className="flex flex-row overflow-x-auto pb-2 scrollbar-none gap-2 lg:flex-col lg:overflow-visible lg:pb-0 lg:space-y-3">
                            {faqCategories.map((category) => {
                                const isSelected = selectedCategory === category.id
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        suppressHydrationWarning
                                        onClick={() => {
                                            setSelectedCategory(category.id)
                                            setOpenIndex(0) // Default open the first question of selected category
                                        }}
                                        className={`group flex items-center justify-between whitespace-nowrap rounded-xl px-5 py-4 text-left text-sm sm:text-[15px] transition-all duration-200 ${isSelected
                                                ? 'bg-white border-2 border-[#fd5001] font-bold text-[#fd5001] shadow-md'
                                                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200/90 font-semibold shadow-sm'
                                            }`}
                                    >
                                        <span>{category.name}</span>
                                        <ChevronRight
                                            size={17}
                                            className={`ml-2 shrink-0 transition-transform ${isSelected
                                                    ? 'text-[#fd5001] translate-x-0.5'
                                                    : 'text-slate-400 group-hover:text-slate-600'
                                                }`}
                                        />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right Column: Accordion Question Cards */}
                    <div className="flex-1 space-y-4">
                        {currentQuestions.map((item, idx) => {
                            const isOpen = openIndex === idx
                            return (
                                <div
                                    key={item.q}
                                    className={`rounded-xl border transition-all duration-200 ${isOpen
                                            ? 'bg-white border-[#fd5001]/60 shadow-[0_12px_32px_rgba(253,80,1,0.08)] ring-1 ring-[#fd5001]/20'
                                            : 'bg-white hover:border-slate-300 border-slate-200/90 shadow-sm'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        suppressHydrationWarning
                                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                                    >
                                        <span
                                            className={`text-[15px] sm:text-base font-bold transition-colors ${isOpen ? 'text-slate-950' : 'text-slate-900'
                                                }`}
                                        >
                                            {item.q}
                                        </span>
                                        <span
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen
                                                    ? 'bg-[#fd5001]/10 text-[#fd5001]'
                                                    : 'text-slate-500 hover:text-slate-900'
                                                }`}
                                        >
                                            {isOpen ? <X size={17} /> : <Plus size={17} />}
                                        </span>
                                    </button>

                                    {/* Expandable Answer Drawer */}
                                    <div
                                        className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                                                <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>

            </div>
        </section>
    )
}
