import type { ReactNode } from 'react';

import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function ModulesLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <SidebarNav />
      <section className="flex-1">
        <div className="space-y-6 rounded-xl border border-border bg-card/40 p-6">{children}</div>
      </section>
    </div>
  );
}
