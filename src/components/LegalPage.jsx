'use client'

import Navbar from './Navbar'
import Footer from './Footer'

const pages = {
  privacy: { title: 'Privacy Policy', intro: 'This policy explains what information NAIZON collects, why we collect it, and the choices available to you.', sections: [
    ['Information we collect', ['When you submit an enquiry, we collect your name, email address, phone number, selected service, estimated budget range, and the project details you provide.', 'We may also receive basic technical information normally sent by your browser or hosting provider, such as device type, browser type, IP address, and pages visited.']],
    ['How we use information', ['We use your information to review and respond to enquiries, prepare estimates or proposals, deliver requested services, provide support, maintain security, and meet legal or accounting obligations.', 'We do not sell your personal information.']],
    ['Storage and service providers', ['Website enquiries are stored using Supabase. We may use trusted hosting, communication, analytics, payment, and project-management providers where necessary to operate our services.']],
    ['Retention', ['We retain enquiry and project information only for as long as reasonably necessary to respond, maintain business records, resolve disputes, and comply with applicable obligations.']],
    ['Your choices and rights', ['You may ask us to access, correct, or delete personal information associated with your enquiry, subject to applicable law and any records we must retain. You may also ask us to stop non-essential communications.']],
    ['Security', ['We use reasonable technical and organisational safeguards. However, no internet transmission or electronic storage method can be guaranteed to be completely secure.']],
    ['Changes to this policy', ['We may update this policy as our services or legal obligations change. The effective date identifies the latest version.']],
    ['Contact', ['For privacy questions or requests, submit a message through the contact form and clearly label it as a privacy request.']],
  ]},
  terms: { title: 'Terms of Service', intro: 'These terms apply when you use this website or engage NAIZON for website, application, game, design, or related digital services.', sections: [
    ['Enquiries and proposals', ['Submitting the contact form does not create a service agreement. A project begins only after the scope, price, schedule, deliverables, and payment terms are confirmed in writing. A project-specific proposal takes priority if it conflicts with these terms.']],
    ['Your responsibilities', ['You agree to provide accurate requirements, timely feedback, required access, and content that you have the right to use. Delays in content, approvals, access, or feedback may change the delivery schedule.']],
    ['Pricing and payment', ['Displayed plan prices and features may change before purchase. Custom work is priced according to scope. Invoices must be paid according to the relevant proposal or invoice. Taxes and third-party charges may apply where stated.']],
    ['Scope changes', ['Requests outside the agreed scope—including additional pages, features, integrations, redesigns, or substantial revisions—may require a revised estimate and schedule.']],
    ['Intellectual property', ['You retain ownership of materials you provide. Unless otherwise agreed, ownership of final custom deliverables transfers after full payment. NAIZON retains its pre-existing tools, reusable code, methods, templates, and know-how. Third-party materials remain subject to their own licences.']],
    ['Third-party services', ['Domains, hosting, payment processors, app stores, APIs, plugins, and other third-party services are governed by their providers. We are not responsible for changes, outages, suspensions, or charges controlled by those providers.']],
    ['Acceptable use', ['You must not use the website or delivered services unlawfully, infringe another person’s rights, introduce malicious code, attempt unauthorised access, or interfere with service operation.']],
    ['Warranties and liability', ['We will provide services with reasonable care and skill. Except where required by law, services do not carry guarantees of uninterrupted operation, specific commercial results, rankings, revenue, or compatibility with future third-party changes.', 'To the extent permitted by law, neither party is liable for indirect or consequential losses. Aggregate liability relating to a service is limited to the amount paid for that service during the relevant claim period.']],
    ['Termination', ['Either party may end ongoing services according to the applicable proposal or plan. Amounts already due remain payable. Deliverables may be withheld until outstanding invoices are paid.']],
    ['Contact', ['Questions about these terms can be submitted through the website contact form.']],
  ]},
  refund: { title: 'Refund Policy', intro: 'This policy explains how cancellation and refund requests are handled for recurring maintenance retainers and custom digital engineering projects.', sections: [
    ['Before work begins', ['If you cancel before work has started and before any non-refundable third-party purchase has been made, amounts paid may be refunded after deducting payment-processing fees and committed third-party costs.']],
    ['Custom projects', ['Deposits and milestone payments cover reserved engineering capacity and completed deliverables. Once work on a sprint or milestone has begun, refunds are not normally available for completed work, reserved time, or committed third-party costs.', 'If a custom project is cancelled, we will provide an itemized account of completed deliverables and amounts due or refundable under the accepted contract or proposal.']],
    ['Recurring maintenance & retainers', ['You may cancel a recurring software maintenance or retainer agreement before its next renewal date to prevent subsequent billing. Charges for an ongoing billing cycle that has already commenced are non-refundable because dedicated engineering, hosting, or support availability has already been provisioned.', 'Domains, third-party cloud licenses, and annual infrastructure subscriptions are non-refundable once purchased.']],
    ['Service issues', ['If we cannot provide an agreed technical deliverable due to an issue within our direct control, contact us promptly. Depending on the circumstances, we will correct the deliverable, provide an engineering credit, or issue an agreed adjustment.']],
    ['How to request a review', ['Submit your request through our contact form or email info@naizon.in with your project reference, invoice date, and specific details. Approved adjustments are processed to the original payment method where applicable.']],
    ['Exceptions and legal rights', ['This policy does not limit any consumer or contractual rights that cannot legally be excluded. Project-specific terms in an accepted master service agreement (MSA) or statement of work (SOW) take priority where permitted by law.']],
  ]},
}

export default function LegalPage({ type }) {
  const page = pages[type]
  return <><Navbar/><main className="bg-white"><header className="border-b border-slate-200 bg-[#f8f8f5]"><div className="shell py-14 sm:py-20"><span className="eyebrow">Legal</span><h1 className="max-w-4xl text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">{page.title}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{page.intro}</p><p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-500">Effective 24 August 2026</p></div></header><article className="shell max-w-4xl py-12 sm:py-16"><div className="space-y-10">{page.sections.map(([heading, paragraphs]) => <section key={heading}><h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{heading}</h2><div className="mt-3 space-y-3">{paragraphs.map((paragraph) => <p key={paragraph} className="text-[15px] leading-7 text-slate-600 sm:text-base">{paragraph}</p>)}</div></section>)}</div><div className="mt-12 border-t border-slate-200 pt-7"><a href="/#contact" className="btn-primary">Contact us</a></div></article></main><Footer/></>
}
