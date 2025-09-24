/**
 * TypeScript type definitions for the RLHF Guide application
 */

export type AnalogyType = 'atari' | 'writing' | 'reasoning' | 'advanced';

export interface AnalogyConfig {
  name: string;
  emoji: string;
  description: string;
  color: string;
  use_cases: string[];
}

export interface ModuleMetadata {
  id: string;
  title: string;
  description: string;
  phase: 'phase-1' | 'phase-2' | 'phase-3';
  analogy: AnalogyType;
  prerequisites: string[];
  estimated_time: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export type ModuleSectionType =
  | 'equation'
  | 'intuition'
  | 'analogy'
  | 'visualization'
  | 'takeaways'
  | 'assessment';

export interface ModuleSectionDefinition {
  id: string;
  type: ModuleSectionType;
  title: string;
  eyebrow?: string;
  icon?: string;
}

export interface VisualizationConfig {
  id: string;
  type: 'line-chart' | 'bar-chart' | 'scatter-plot' | 'network' | 'timeline' | 'custom';
  title: string;
  description: string;
  data_source: string;
  parameters: VisualizationParameter[];
  accessibility: AccessibilityConfig;
}

export interface VisualizationParameter {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'string' | 'array';
  default_value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
}

export interface AccessibilityConfig {
  alt_text: string;
  aria_label: string;
  keyboard_controls: boolean;
  screen_reader_description: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'interactive' | 'code';
  question: string;
  options?: string[];
  correct_answer: string | number | boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface UserProgress {
  user_id?: string;
  modules_completed: string[];
  current_module?: string;
  quiz_scores: Record<string, number>;
  time_spent: Record<string, number>; // minutes per module
  preferences: UserPreferences;
  last_activity: Date;
}

export interface UserPreferences {
  preferred_analogy: AnalogyType;
  theme: 'light' | 'dark' | 'system';
  animation_speed: 'slow' | 'normal' | 'fast';
  show_hints: boolean;
  auto_advance: boolean;
}

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  page_load_time: number;
  visualization_render_time: number;
  bundle_size: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Event types for analytics
export type AnalyticsEvent =
  | 'module_started'
  | 'module_completed'
  | 'quiz_attempted'
  | 'quiz_completed'
  | 'visualization_interacted'
  | 'analogy_switched'
  | 'page_viewed'
  | 'error_occurred';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  module_id?: string;
  user_id?: string;
  timestamp: Date;
  properties: Record<string, any>;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface VisualizationComponentProps extends BaseComponentProps {
  config: VisualizationConfig;
  data?: any;
  onParameterChange?: (parameter: string, value: any) => void;
}

export interface AnalogyComponentProps extends BaseComponentProps {
  type: AnalogyType;
  active: boolean;
  onSelect?: (type: AnalogyType) => void;
}
