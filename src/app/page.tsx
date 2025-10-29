"use client";

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

export default function Home() {
  const year = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/10">
        <div className="glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <a href="#home" className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Koshikai</span>
              </a>
              <nav className="hidden md:flex items-center gap-8 text-sm">
                <a href="#about" className="link-underline text-gray-700 dark:text-gray-200">About</a>
                <a href="#skills" className="link-underline text-gray-700 dark:text-gray-200">Skills</a>
                <a href="#projects" className="link-underline text-gray-700 dark:text-gray-200">Projects</a>
                <a href="#contact" className="link-underline text-gray-700 dark:text-gray-200">Contact</a>
                <ThemeToggle />
              </nav>
              <button onClick={() => setOpen((v) => !v)} className="md:hidden chip rounded-lg p-2" aria-label="Open menu">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          {open && (
            <div className="md:hidden border-t border-black/5 dark:border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
                <a href="#about" onClick={() => setOpen(false)} className="text-gray-800 dark:text-gray-200">About</a>
                <a href="#skills" onClick={() => setOpen(false)} className="text-gray-800 dark:text-gray-200">Skills</a>
                <a href="#projects" onClick={() => setOpen(false)} className="text-gray-800 dark:text-gray-200">Projects</a>
                <a href="#contact" onClick={() => setOpen(false)} className="text-gray-800 dark:text-gray-200">Contact</a>
                <div className="ml-auto"><ThemeToggle /></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="reveal" style={{ ['--reveal-delay' as any]: '0ms' }}>
              <span className="inline-flex items-center gap-2 chip rounded-full px-3 py-1 text-xs text-gray-700 dark:text-gray-200">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                AVAILABLE FOR WORK
              </span>
              <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Build delightful products with a modern stack
              </h1>
              <p className="mt-5 text-lg text-gray-700 dark:text-gray-300 max-w-xl">
                I design and develop accessible, performant web experiences using Next.js, TypeScript, and Tailwind.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 shadow-md hover:shadow-lg transition-shadow">See Projects</a>
                <a href="#contact" className="rounded-lg chip px-6 py-3 text-gray-900 dark:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors">Get In Touch</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-2 text-sm">
                {["Next.js", "TypeScript", "React", "Tailwind"].map((t) => (
                  <span key={t} className="chip rounded-full px-3 py-1 text-gray-700 dark:text-gray-200">{t}</span>
                ))}
              </div>
            </div>
            <div className="reveal" style={{ ['--reveal-delay' as any]: '120ms' }}>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-500/25 via-purple-500/25 to-pink-500/25 blur-2xl" aria-hidden />
                <div className="relative glass rounded-3xl p-6">
                  <div className="relative h-56 w-full overflow-hidden rounded-2xl">
                    <Image src="/avatar.jpg" alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    {[{k:"Years",v:"5+"},{k:"Projects",v:"24"},{k:"Clients",v:"12"}].map((s)=> (
                      <div key={s.k} className="rounded-lg chip py-3">
                        <div className="text-xl font-semibold text-gray-900 dark:text-white">{s.v}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{s.k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 reveal"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2></div>
            <div className="md:col-span-2 reveal" style={{ ['--reveal-delay' as any]: '120ms' }}>
              <div className="glass rounded-2xl p-6 leading-relaxed text-gray-700 dark:text-gray-300">
                I’m a full‑stack developer focused on craft, accessibility, and performance. I thrive at the intersection of design and engineering and enjoy collaborating closely with teams to ship user‑centric products.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="reveal text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Prisma"].map((s, i) => (
              <div key={s} className="reveal" style={{ ['--reveal-delay' as any]: `${i*80}ms` }}>
                <div className="chip rounded-xl px-4 py-3 text-center text-gray-800 dark:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="reveal text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
            <a href="#" className="reveal link-underline text-blue-600 dark:text-blue-400" style={{ ['--reveal-delay' as any]: '120ms' }}>All projects</a>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {title:"Analytics Dashboard",desc:"Next.js + Tailwind + Charting",tag:"SaaS"},
              {title:"E‑commerce Storefront",desc:"Headless commerce with modern UX",tag:"E‑commerce"},
              {title:"Marketing Site",desc:"Fast, accessible landing experiences",tag:"Web"}
            ].map((p,i)=> (
              <article key={p.title} className="reveal" style={{ ['--reveal-delay' as any]: `${80 + i*120}ms` }}>
                <div className="group glass rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 transition-transform">
                  <div className="relative h-40 bg-gradient-to-br from-gray-200/70 to-gray-100/40 dark:from-gray-800/60 dark:to-gray-900/40">
                    <div className="absolute inset-0 grid grid-cols-4 opacity-30">
                      {Array.from({length:16}).map((_,k)=> <div key={k} className="border border-black/5 dark:border-white/10" />)}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="chip rounded-full px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300">{p.tag}</span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{p.desc}</p>
                    <a href="#" className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 link-underline">View case study</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="reveal text-2xl font-bold text-gray-900 dark:text-white">Let’s work together</h2>
            <p className="reveal mt-3 text-gray-700 dark:text-gray-300" style={{ ['--reveal-delay' as any]: '120ms' }}>
              Have a project in mind? I’m open to freelance and full‑time opportunities.
            </p>
            <div className="reveal mt-6 flex justify-center gap-3" style={{ ['--reveal-delay' as any]: '220ms' }}>
              <a href="mailto:your.email@example.com" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 shadow-md hover:shadow-lg transition-shadow">Email Me</a>
              <a href="#projects" className="rounded-lg chip px-6 py-3 text-gray-900 dark:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-colors">See Work</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <a aria-label="GitHub" href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.5 8.2 11 .6.1.8-.2.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.7-1.8-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.5 1.3a11.9 11.9 0 0 1 6.3 0c2.5-1.6 3.5-1.3 3.5-1.3.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.4 0 4.8-2.9 5.9-5.7 6.2.5.4.8 1.1.8 2.3v3.2c0 .4.2.7.8.6 4.8-1.5 8.2-5.8 8.2-11A11.5 11.5 0 0 0 12 .5Z"/></svg>
            </a>
            <a aria-label="Twitter" href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M19.6 7.6c.01.2.01.41.01.62 0 6.34-4.82 13.64-13.64 13.64-2.71 0-5.24-.8-7.36-2.19.38.04.76.06 1.15.06 2.25 0 4.33-.77 5.97-2.07a4.81 4.81 0 0 1-4.49-3.34c.3.05.6.07.91.07.44 0 .87-.06 1.28-.17A4.79 4.79 0 0 1 .95 9.6v-.06c.65.36 1.39.57 2.18.6a4.79 4.79 0 0 1-1.48-6.4 13.65 13.65 0 0 0 9.91 5.02 4.79 4.79 0 0 1 8.16-4.37 9.56 9.56 0 0 0 3.04-1.16 4.8 4.8 0 0 1-2.1 2.65 9.58 9.58 0 0 0 2.75-.75 10.27 10.27 0 0 1-2.41 2.5Z"/></svg>
            </a>
          </div>
          <p>© {year} Koshikai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
