"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/Button";
import { FieldLabel, Select, TextArea, TextInput, controlClass } from "@/components/ui/controls";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { submitForm } from "@/lib/forms/actions";
import { FORMS, formMessages, type FieldDef, type FormId, type FormState } from "@/lib/forms/schemas";

type SchemaFormProps = {
  formId: FormId;
  locale: Locale;
  privacyHref: string;
  /** Pre-selects a value, e.g. the role when applying from a job card. */
  defaults?: Record<string, string>;
};

const initialState: FormState = { status: "idle" };

/** Renders any form from its schema and posts it to the shared server action. */
export function SchemaForm({ formId, locale, privacyHref, defaults = {} }: SchemaFormProps) {
  const schema = FORMS[formId];
  const [state, action, pending] = useActionState(submitForm, initialState);
  // Time the visitor started; sent with every submit so the server can reject instant bot posts.
  // Kept in a ref because React resets uncontrolled inputs after each action.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const value = (name: string) => state.values?.[name] ?? defaults[name];

  return (
    <form
      action={action}
      noValidate
      onSubmit={(e) => {
        const field = e.currentTarget.elements.namedItem("_started");
        if (field instanceof HTMLInputElement) field.value = String(startedAt.current);
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <input type="hidden" name="_locale" value={locale} />
      <input type="hidden" name="_form" value={formId} />
      <input type="hidden" name="_started" defaultValue="0" />
      {/* Honeypot */}
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {schema.fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          locale={locale}
          error={state.errors?.[field.name]}
          defaultValue={value(field.name)}
          privacyHref={privacyHref}
        />
      ))}

      <div className="flex flex-col gap-3 sm:col-span-2">
        {state.status === "error" && state.message && (
          <p role="alert" className="border-s-2 border-red bg-red/10 px-3 py-2 text-sm text-error">
            {state.message}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending} className="sm:self-start">
          {pending ? formMessages.sending[locale] : schema.submit[locale]}
        </Button>
      </div>
    </form>
  );
}

function Field({
  field,
  locale,
  error,
  defaultValue,
  privacyHref,
}: {
  field: FieldDef;
  locale: Locale;
  error?: string;
  defaultValue?: string | string[];
  privacyHref: string;
}) {
  const label = field.label[locale];
  const common = {
    name: field.name,
    required: field.required,
    "aria-invalid": error ? true : undefined,
  };
  const span = field.wide && "sm:col-span-2";

  if (field.type === "consent") {
    return (
      <div className={cn("flex flex-col gap-1", span)}>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" value="yes" {...common} className="peer sr-only" />
          <span
            aria-hidden
            className="mt-0.5 grid size-5 shrink-0 place-items-center border border-line text-transparent peer-checked:border-red peer-checked:bg-red peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-red"
          >
            <CheckIcon className="size-3.5" />
          </span>
          <span>
            {label}
            <span aria-hidden className="text-red">
              {" "}
              *
            </span>
          </span>
        </label>
        <Link href={privacyHref} target="_blank" className="ps-8 text-xs text-steel underline underline-offset-4 hover:text-concrete">
          {formMessages.readPolicy[locale]}
        </Link>
        {error && (
          <span role="alert" className="ps-8 text-xs text-error">
            {error}
          </span>
        )}
      </div>
    );
  }

  if (field.type === "multi") {
    const selected = new Set(Array.isArray(defaultValue) ? defaultValue : []);
    return (
      <fieldset className={cn("flex flex-col gap-2 text-sm", span)} aria-invalid={error ? true : undefined}>
        <legend className="mb-2 text-concrete/90">
          {label}
          {field.required && <span className="text-red"> *</span>}
        </legend>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {field.options?.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-3 bg-ink px-3 py-2.5 hover:bg-panel">
              <input
                type="checkbox"
                name={field.name}
                value={o.value}
                defaultChecked={selected.has(o.value)}
                className="size-4 accent-red"
              />
              {o.label[locale]}
            </label>
          ))}
        </div>
        {error && (
          <span role="alert" className="text-xs text-error">
            {error}
          </span>
        )}
      </fieldset>
    );
  }

  const text = typeof defaultValue === "string" ? defaultValue : undefined;

  return (
    <FieldLabel label={label} required={field.required} error={error} className={cn(span || undefined)}>
      {field.type === "select" ? (
        <Select
          {...common}
          defaultValue={text ?? ""}
          options={[
            { value: "", label: `${formMessages.select[locale]}…` },
            ...(field.options ?? []).map((o) => ({ value: o.value, label: o.label[locale] })),
          ]}
        />
      ) : field.type === "textarea" ? (
        <TextArea {...common} defaultValue={text} rows={5} />
      ) : field.type === "file" ? (
        <input
          {...common}
          type="file"
          accept={field.accept}
          multiple={field.multiple}
          className={cn(
            controlClass,
            "h-auto py-2.5 file:me-3 file:border-0 file:bg-asphalt file:px-3 file:py-1.5 file:text-xs file:text-concrete",
          )}
        />
      ) : (
        <TextInput
          {...common}
          type={field.type === "number" ? "number" : field.type}
          inputMode={field.type === "number" ? "numeric" : field.type === "tel" ? "tel" : undefined}
          dir={field.type === "email" || field.type === "tel" || field.type === "number" ? "ltr" : undefined}
          min={field.min}
          autoComplete={field.autoComplete}
          defaultValue={text}
          className={field.type === "tel" || field.type === "number" || field.type === "email" ? "text-start" : undefined}
        />
      )}
    </FieldLabel>
  );
}
