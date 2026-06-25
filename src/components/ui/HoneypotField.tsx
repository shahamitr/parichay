'use client';

/**
 * HoneypotField — invisible form field that traps bots.
 *
 * Bots auto-fill all fields; humans never see or interact with this.
 * If this field has a value on submit, the submission is from a bot.
 *
 * @example
 * ```tsx
 * <HoneypotField {...honeypotProps} />
 * ```
 */
interface HoneypotFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  tabIndex?: number;
  'aria-hidden'?: boolean;
}

export default function HoneypotField(props: HoneypotFieldProps) {
  return (
    <div
      className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={`hp_${props.name}`}>
        Do not fill this field
      </label>
      <input
        id={`hp_${props.name}`}
        type="text"
        {...props}
      />
    </div>
  );
}
