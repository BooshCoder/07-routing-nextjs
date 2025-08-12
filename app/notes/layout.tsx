import { ReactNode } from 'react';
import css from '../LayoutNotes.module.css';

export default function NotesLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className={css.layout}>
      {sidebar}
      <main className={css.main}>
        {children}
      </main>
    </div>
  );
} 