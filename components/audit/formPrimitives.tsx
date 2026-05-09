import type { InputHTMLAttributes, ReactNode } from "react";

export function Overline({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[11px] tracking-[0.16em] text-[var(--sage-strong)] uppercase">
      {children}
    </p>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="mb-6 text-3xl leading-[1.12] tracking-[-0.01em] text-[var(--forest)] sm:text-[2.125rem]">
      {children}
    </h1>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-8 text-[16px] leading-relaxed text-[var(--ink)]">{children}</p>;
}

interface FieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
}

export function FieldShell({ id, label, helper, error, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className="mb-8">
      <label htmlFor={id} className="mb-1 block font-mono text-[11px] tracking-[0.14em] text-[var(--sage-strong)] uppercase">
        {label}
      </label>
      {helper ? <p className="mb-3 text-[13px] leading-relaxed italic text-[var(--muted)]">{helper}</p> : null}
      {children}
      {error ? <p className="mt-2 text-[13px] text-[var(--clay)]">{error}</p> : null}
    </div>
  );
}

type CurrencyInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> & {
  value: string;
  onDigitsChange: (next: string) => void;
  invalid?: boolean;
};

export function CurrencyInput({ value, onDigitsChange, invalid, ...rest }: CurrencyInputProps) {
  return (
    <input
      {...rest}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-invalid={invalid || undefined}
      className={`w-full rounded-[2px] border bg-white px-[14px] py-3 text-[16px] text-[var(--ink)] outline-none ring-1 ring-transparent transition-[box-shadow] focus:ring-[var(--mint)] ${invalid ? "border-[var(--clay)]" : "border-[var(--line)]"}`}
      value={value}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, "");
        onDigitsChange(next);
      }}
    />
  );
}

export function FooterNav({
  secondary,
  primary,
}: {
  secondary?: { label: string; onClick: () => void };
  primary: { label: string; disabled?: boolean; onClick: () => void };
}) {
  return (
    <nav className="audit-no-print mt-14 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:gap-4 print:hidden">
      {secondary ? (
        <button
          type="button"
          className="font-mono text-[13px] tracking-[0.12em] text-[var(--forest)] uppercase"
          style={{ letterSpacing: "0.08em" }}
          onClick={secondary.onClick}
        >
          {secondary.label}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        disabled={primary.disabled}
        onClick={primary.onClick}
        className="rounded-[2px] bg-[var(--forest)] px-7 py-[14px] font-mono text-[13px] tracking-[0.12em] text-white uppercase outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {primary.label}
      </button>
    </nav>
  );
}
