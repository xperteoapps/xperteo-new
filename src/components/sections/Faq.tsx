"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { FAQ } from "@/content/site";

/**
 * S10 · FAQ — Radix Accordion, numeracja Plex Mono. `forceMount` = odpowiedzi
 * są w HTML (SEO, bez JS), zwijanie przez CSS grid-rows na data-state.
 */
export function Faq() {
  return (
    <section id="s10" data-slug="faq" aria-labelledby="s10-heading" className="border-b border-line">
      <span id="faq" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site grid-12 gap-y-10 py-20 lg:py-28">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky" style={{ top: "calc(var(--nav-h) + 2rem)" }}>
            <p className="label-mono text-muted">S10 · FAQ</p>
            <h2 id="s10-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Pytania,
              <br />
              które padają
              <br />
              najczęściej.
            </h2>
            <p className="mt-6 max-w-[22rem] text-base text-fg/75">
              Nie ma Twojego? Odpowiemy w 24 h.{" "}
              <a href="#kontakt" className="underline underline-offset-4 hover:text-signal">
                Napisz
              </a>
              .
            </p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <Accordion.Root type="single" collapsible defaultValue="faq-0" className="border-t border-line">
            {FAQ.map((item, i) => (
              <Accordion.Item key={item.q} value={`faq-${i}`} className="faq-item border-b border-line">
                <Accordion.Header asChild>
                  <h3 className="m-0">
                    <Accordion.Trigger className="faq-trigger group">
                      <span className="label-mono w-10 shrink-0 text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-lg font-bold tracking-tight lg:text-2xl">{item.q}</span>
                      <span className="faq-icon" aria-hidden="true">
                        <span />
                        <span />
                      </span>
                    </Accordion.Trigger>
                  </h3>
                </Accordion.Header>
                <Accordion.Content forceMount className="faq-content">
                  <div className="faq-content-inner">
                    <p className="max-w-[40rem] pb-6 pl-10 text-base leading-relaxed text-fg/80 lg:text-lg">{item.a}</p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
