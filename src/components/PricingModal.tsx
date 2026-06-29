/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

interface PricingSection {
  title: string;
  type: string;
  columns?: any[];
  features?: any[];
  items?: string[];
  tiers?: any[];
  note?: string;
  text?: string;
}

interface PricingData {
  title: string;
  sections: PricingSection[];
}

interface Props {
  data: PricingData;
  onClose: () => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="bg-brand-red-dark px-4 py-2 font-heading text-sm font-bold uppercase tracking-wide text-white">
      {title}
    </h3>
  );
}

function PricingGrid({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <div className={`grid gap-0 border border-gray-200 ${(section.columns?.length ?? 0) > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
        {section.columns?.map((col: any, i: number) => (
          <div key={i} className={`bg-white p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            <h4 className="font-heading text-sm font-bold uppercase text-brand-black">{col.name}</h4>
            {col.price && <p className="mt-2 font-heading text-2xl font-bold text-brand-red">{col.price}</p>}
            {col.suffix && <p className="text-sm text-gray-500">{col.suffix}</p>}
            {col.description && <p className="mt-2 text-sm text-gray-600">{col.description}</p>}
            {col.items && (
              <ul className="mt-3 space-y-1">
                {col.items.map((item: any, j: number) => (
                  <li key={j} className="flex justify-between text-sm">
                    <span>{item.service}</span>
                    <span className="font-semibold text-brand-red">{item.price}</span>
                  </li>
                ))}
              </ul>
            )}
            {col.features && (
              <ul className="mt-3 space-y-1">
                {col.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brand-red">✓</span> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PackageColumns({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <div className="grid md:grid-cols-2">
        {section.columns?.map((col: any, i: number) => (
          <div key={i} className={`bg-white p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            <h4 className="font-heading text-sm font-bold uppercase">{col.name}</h4>
            <ul className="mt-3 space-y-1">
              {col.features?.map((f: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand-red">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddonColumns({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <div className="grid md:grid-cols-2">
        {section.columns?.map((col: any, i: number) => (
          <div key={i} className={`bg-white p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            <h4 className="font-heading text-sm font-bold uppercase">{col.name}</h4>
            <ul className="mt-3 space-y-2">
              {col.items?.map((item: any, j: number) => (
                <li key={j} className="flex justify-between border-b border-dotted border-gray-200 pb-1 text-sm">
                  <span>{item.service}</span>
                  <span className="font-semibold whitespace-nowrap pl-4 text-brand-red">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CeramicSection({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      {section.note && <p className="bg-gray-50 px-4 py-2 text-sm italic text-gray-600">{section.note}</p>}
      <div className="grid md:grid-cols-3">
        {section.tiers?.map((tier: any, i: number) => (
          <div key={i} className={`bg-white p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            <h4 className="font-heading text-sm font-bold uppercase">{tier.name}</h4>
            <p className="mt-2 font-heading text-xl font-bold text-brand-red">{tier.price}</p>
            <ul className="mt-3 space-y-1">
              {tier.features.map((f: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand-red">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistColumns({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <div className="grid bg-white md:grid-cols-2">
        {section.columns?.map((col: string[], i: number) => (
          <ul key={i} className={`space-y-2 p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            {col.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-brand-red">✓</span> {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <div className="grid grid-cols-2 gap-4 bg-white p-5 md:grid-cols-3 lg:grid-cols-5">
        {section.features?.map((f: any, i: number) => (
          <div key={i} className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white text-lg">
              {f.icon === 'calendar' && '📅'}
              {f.icon === 'dollar' && '$'}
              {f.icon === 'shield' && '🛡'}
              {f.icon === 'star' && '★'}
              {f.icon === 'sparkle' && '✨'}
            </div>
            <p className="font-heading text-xs font-bold uppercase">{f.title}</p>
            {f.description && <p className="mt-1 text-xs text-gray-500">{f.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BulletsSection({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      <ul className="space-y-2 bg-gray-50 p-5">
        {section.items?.map((item, i) => (
          <li key={i} className="text-sm text-gray-700">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function NoticeSection({ section }: { section: PricingSection }) {
  return (
    <div className="border border-brand-red-dark bg-red-50 p-4 text-center text-sm text-gray-700">
      {section.text}
    </div>
  );
}

function CeramicPriceSheetSection({ section }: { section: PricingSection }) {
  return (
    <div>
      <SectionHeader title={section.title} />
      {section.note && <p className="bg-gray-50 px-4 py-2 text-sm italic text-gray-600">{section.note}</p>}
      <div className="grid md:grid-cols-3">
        {section.tiers?.map((tier: any, i: number) => (
          <div key={i} className={`bg-white p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-gray-200' : ''}`}>
            <h4 className="font-heading text-sm font-bold uppercase">{tier.name}</h4>
            <p className="mt-2 font-heading text-2xl font-bold text-brand-red">{tier.price}</p>
            <ul className="mt-3 space-y-1">
              {tier.features.map((f: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand-red">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(section: PricingSection) {
  switch (section.type) {
    case 'pricing-grid': return <PricingGrid section={section} />;
    case 'package-columns': return <PackageColumns section={section} />;
    case 'addon-columns': return <AddonColumns section={section} />;
    case 'ceramic': return <CeramicSection section={section} />;
    case 'ceramic-price-sheet': return <CeramicPriceSheetSection section={section} />;
    case 'checklist-columns': return <ChecklistColumns section={section} />;
    case 'features': return <FeaturesSection section={section} />;
    case 'bullets': return <BulletsSection section={section} />;
    case 'notice': return <NoticeSection section={section} />;
    default: return null;
  }
}

export default function PricingModal({ data, onClose }: Props) {
  useEffect(() => {
    const handleBackdrop = (e: MouseEvent) => {
      if ((e.target as HTMLElement).dataset.backdrop) onClose();
    };
    document.addEventListener('click', handleBackdrop);
    return () => document.removeEventListener('click', handleBackdrop);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
      data-backdrop="true"
      onClick={(e) => {
        if ((e.target as HTMLElement).dataset.backdrop) onClose();
      }}
    >
      <div
        className="flex w-full max-w-4xl flex-col rounded-lg bg-gray-100 shadow-2xl"
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="flex shrink-0 items-center justify-between rounded-t-lg bg-brand-black px-6 py-4">
          <h2 id="pricing-modal-title" className="font-heading text-lg font-bold uppercase text-white">
            {data.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/10"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content — only this area scrolls */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4 md:p-6">
            {data.sections.map((section, i) => (
              <div key={i}>{renderSection(section)}</div>
            ))}
          </div>
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 rounded-b-lg border-t border-gray-200 bg-white px-6 py-4 text-center">
          <a href="tel:9042937070" className="btn-primary inline-block">
            Call to Book — (904) 293-7070
          </a>
        </div>
      </div>
    </div>
  );
}
