const MODULE_IMPORTERS: Record<string, () => Promise<{ default: (props: any) => JSX.Element }>> = {
  introduction: () => import('../../content/modules/introduction.mdx'),
  'reward-modeling': () => import('../../content/modules/reward-modeling.mdx'),
  'policy-gradients': () => import('../../content/modules/policy-gradients.mdx'),
};

export async function getModuleContent(slug: string) {
  const importer = MODULE_IMPORTERS[slug];
  if (!importer) {
    return null;
  }
  return importer();
}
