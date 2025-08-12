import { ReactNode } from 'react';
import css from '../LayoutNotes.module.css';

interface NotesLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  return (
    <div className={css.layout}>
      {sidebar}
      <main className={css.main}>
        {children}
      </main>
    </div>
  );
} 