import { useEffect } from 'react';

function getHeaderHeight() {
  const header = document.getElementById('site-header');
  return header?.offsetHeight ?? 116;
}

function setHeaderHeightVar() {
  const height = getHeaderHeight();
  document.documentElement.style.setProperty('--header-height', `${height}px`);
  const spacer = document.getElementById('header-spacer');
  if (spacer) spacer.style.height = `${height}px`;
}

function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;

  const headerHeight = getHeaderHeight();
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  if (menu) {
    menu.classList.add('hidden');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  btn?.setAttribute('aria-expanded', 'false');
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  if (menu) {
    menu.classList.remove('hidden');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  btn?.setAttribute('aria-expanded', 'true');
}

export default function SiteClient() {
  useEffect(() => {
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);
    return () => window.removeEventListener('resize', setHeaderHeightVar);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[data-close-menu]')) {
        closeMobileMenu();
        return;
      }

      const navLink = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (navLink) {
        const hash = navLink.getAttribute('href');
        if (hash && hash.length > 1) {
          e.preventDefault();
          closeMobileMenu();
          scrollToHash(hash);
          history.pushState(null, '', hash);
        }
      }
    };

    document.addEventListener('click', handleClick);

    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuClose = document.getElementById('mobile-menu-close');

    menuBtn?.addEventListener('click', openMobileMenu);
    menuClose?.addEventListener('click', closeMobileMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      menuBtn?.removeEventListener('click', openMobileMenu);
      menuClose?.removeEventListener('click', closeMobileMenu);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (reducedMotion) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['services', 'packages', 'process', 'gallery', 'about', 'contact'];
    const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link, .nav-link-mobile');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: `-${getHeaderHeight()}px 0px -50% 0px`, threshold: 0 },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
