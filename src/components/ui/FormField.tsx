import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BaseProps = {
  label: string;
  name: string;
  className?: string;
};

const labelClasses = "flex flex-col gap-2 text-sm";
const controlClasses =
  "h-12 w-full rounded-sm border border-current/20 bg-transparent px-4 text-base outline-none transition-colors placeholder:opacity-50 focus:border-current";

export function InputField({
  label,
  name,
  className,
  required,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn(labelClasses, className)}>
      <span>
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <input name={name} required={required} className={controlClasses} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  placeholder = "Select an option",
  className,
  required,
  ...props
}: BaseProps & { options: string[]; placeholder?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn(labelClasses, className)}>
      <span>
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className={cn(controlClasses, "appearance-none")}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-neutral-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
