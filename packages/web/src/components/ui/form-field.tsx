import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

interface InputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {}

export function Input({ label, hint, error, id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <input id={inputId} className="form-input" {...props} />
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

interface TextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {}

export function Textarea({ label, hint, error, id, ...props }: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <textarea id={inputId} className="form-textarea" {...props} />
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

interface SelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  children: ReactNode;
}

export function Select({ label, hint, error, id, children, ...props }: SelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <select id={inputId} className="form-select" {...props}>
        {children}
      </select>
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label: string;
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <div className="form-group">
      <label className="form-checkbox-group">
        <input id={inputId} type="checkbox" className="form-checkbox" {...props} />
        <span className="form-label" style={{ marginBottom: 0 }}>{label}</span>
      </label>
    </div>
  );
}

interface FormRowProps {
  children: ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return <div className="form-row">{children}</div>;
}

interface FormActionsProps {
  children: ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
  return <div className="form-actions">{children}</div>;
}
