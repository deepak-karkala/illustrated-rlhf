'use client';

interface ControlSliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

export function ControlSlider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  description,
}: ControlSliderProps): JSX.Element {
  return (
    <label htmlFor={id} className="block space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-foreground">
        <span>{label}</span>
        <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
      {description ? <p className="text-[11px] text-muted-foreground">{description}</p> : null}
    </label>
  );
}
