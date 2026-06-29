import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  event?: string;
}

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: Props) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const current = testimonials[index];

  return (
    <div className="text-center md:text-left">
      <p className="font-display text-2xl font-light italic leading-relaxed text-brand-charcoal md:text-[1.65rem]">
        &ldquo;{current.quote}&rdquo;
      </p>
      <div className="mt-6 border-t border-brand-blush-dark pt-6">
        <p className="font-heading text-[0.68rem] font-medium uppercase tracking-[0.28em] text-brand-charcoal">
          {current.author}
        </p>
        {current.event && (
          <p className="mt-1 text-xs font-light uppercase tracking-widest text-brand-mauve">{current.event}</p>
        )}
      </div>
      <div className="mt-6 flex justify-center gap-2 md:justify-start">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-px transition-all duration-300 ${i === index ? 'w-8 bg-brand-charcoal' : 'w-4 bg-brand-blush-dark'}`}
            aria-label={`View testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
