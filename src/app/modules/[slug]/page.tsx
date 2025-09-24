import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ModuleLayout } from '@/components/modules/module-layout';
import { getModuleContent } from '@/lib/module-content';
import { MODULES, getAdjacentModules, getModuleBySlug } from '@/lib/modules';

interface ModulePageProps {
  params: { slug: string };
}

export function generateStaticParams(): Array<{ slug: string }> {
  return MODULES.filter((moduleEntry) => moduleEntry.status === 'available').map((moduleEntry) => ({
    slug: moduleEntry.slug,
  }));
}

export function generateMetadata({ params }: ModulePageProps): Metadata {
  const moduleEntry = getModuleBySlug(params.slug);

  if (!moduleEntry || moduleEntry.status !== 'available') {
    return {
      title: 'Module not found',
    };
  }

  return {
    title: `${moduleEntry.title} • RLHF Module`,
    description: moduleEntry.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps): Promise<JSX.Element> {
  const moduleEntry = getModuleBySlug(params.slug);

  if (!moduleEntry || moduleEntry.status !== 'available') {
    notFound();
  }

  const content = await getModuleContent(params.slug);

  if (!content) {
    notFound();
  }

  const { previous, next } = getAdjacentModules(params.slug);
  const MDXContent = content.default;

  return (
    <ModuleLayout module={moduleEntry} previous={previous} next={next}>
      <MDXContent />
    </ModuleLayout>
  );
}
