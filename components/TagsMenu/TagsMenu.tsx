"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './TagsMenu.module.css';

const tags = [
  { name: 'All notes', slug: 'All' },
  { name: 'Work', slug: 'Work' },
  { name: 'Personal', slug: 'Personal' },
  { name: 'Todo', slug: 'Todo' },
  { name: 'Meeting', slug: 'Meeting' },
  { name: 'Shopping', slug: 'Shopping' },
];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Використовуємо useEffect для уникнення проблем з гідратацією
  const [currentTagName, setCurrentTagName] = useState('All notes');
  
  React.useEffect(() => {
    const tag = pathname.includes('/notes/filter/') 
      ? pathname.split('/notes/filter/')[1] 
      : 'All';
    
    const tagName = tags.find(t => t.slug === tag)?.name || 'All notes';
    
    setCurrentTagName(tagName);
  }, [pathname]);

  return (
    <div className={css.menuContainer} suppressHydrationWarning>
      <button 
        className={css.menuButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {currentTagName} ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag.slug} className={css.menuItem}>
              <Link 
                href={`/notes/filter/${tag.slug}`} 
                className={css.menuLink}
                onClick={() => setIsOpen(false)}
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
