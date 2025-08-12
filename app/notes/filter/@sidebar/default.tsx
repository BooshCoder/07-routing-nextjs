"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './SidebarNotes.module.css';

const tags = [
  { name: 'All notes', slug: 'All' },
  { name: 'Work', slug: 'Work' },
  { name: 'Personal', slug: 'Personal' },
  { name: 'Todo', slug: 'Todo' },
  { name: 'Meeting', slug: 'Meeting' },
  { name: 'Shopping', slug: 'Shopping' },
];

export default function SidebarNotes() {
  const pathname = usePathname();
  const [currentTagName, setCurrentTagName] = useState('All notes');
  
  React.useEffect(() => {
    const tag = pathname.includes('/notes/filter/') 
      ? pathname.split('/notes/filter/')[1] 
      : 'All';
    
    const tagName = tags.find(t => t.slug === tag)?.name || 'All notes';
    
    setCurrentTagName(tagName);
  }, [pathname]);

  return (
    <aside className={css.sidebar}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag.slug} className={css.menuItem}>
            <Link 
              href={`/notes/filter/${tag.slug}`} 
              className={`${css.menuLink} ${currentTagName === tag.name ? css.active : ''}`}
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
