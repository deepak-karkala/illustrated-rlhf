'use client';

import { Switch } from '@headlessui/react';

interface ControlToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ControlToggle({
  label,
  description,
  value,
  onChange,
}: ControlToggleProps): JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-foreground">
          <span>{label}</span>
        </div>
        <Switch
          checked={value}
          onChange={onChange}
          className={`${
            value ? 'bg-primary text-primary-foreground' : 'bg-muted'
          } relative inline-flex h-6 w-11 items-center rounded-full border border-border transition`}
        >
          <span
            className={`${value ? 'translate-x-6 bg-white' : 'translate-x-1 bg-border'} inline-block h-4 w-4 transform rounded-full transition`}
          />
        </Switch>
      </div>
      {description ? <p className="text-[11px] text-muted-foreground">{description}</p> : null}
    </div>
  );
}
