import type { ReactNode } from 'react';

import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function ModulesLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <SidebarNav />
      </div>
      <section className="flex-1 space-y-6">{children}</section>
    </div>
  );
}
