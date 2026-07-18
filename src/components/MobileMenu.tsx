'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

export function MobileMenu({ links, cta }: { links: NavItem[]; cta: { primaryHref: string; primaryLabel: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt)', display: 'none' }}
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav>
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-cta">
              <Link href={cta.primaryHref} onClick={() => setOpen(false)} className="nav-cta">{cta.primaryLabel}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
