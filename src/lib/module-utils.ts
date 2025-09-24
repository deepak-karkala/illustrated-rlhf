import { ANALOGY_CONFIG } from '@/lib/constants';
import type { AnalogyType } from '@/lib/types';

export function getAnalogyMetadata(type: AnalogyType) {
  return ANALOGY_CONFIG[type];
}
