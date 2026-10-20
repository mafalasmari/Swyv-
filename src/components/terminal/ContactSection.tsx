"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { InputField, SelectField } from "@/components/ui/FormField";
import { CheckIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

type ContactSectionProps = {
  perks: string[];
  topics: string[];
};

export function ContactSection({ perks, topics }: ContactSectionProps) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hook up to a CRM / API route here.
    setSent(true);
  };

  return (
    <Section id="contact" className="scroll-mt-20 bg-terminal-green text-white">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl leading-tight font-semibold text-balance sm:text-5xl">
            Contact us and we will be in touch <span className="text-terminal-lime">same day, your way</span>
          </h2>
          <p className="text-lg opacity-80">
            Fill out the form, and we’ll be happy to discuss how Terminal can help you with your yard of the future:
          </p>
          <ul className="grid gap-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckIcon className="size-5 text-terminal-lime" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {sent ? (
          <div className="flex items-center rounded-md bg-white/10 p-8 text-lg" role="status">
            Thanks! A yard expert will reach out to you today.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5 rounded-md bg-white/5 p-6 sm:grid-cols-2 sm:p-8">
            <InputField label="Full name" name="name" autoComplete="name" required />
            <InputField label="Role or position" name="role" autoComplete="organization-title" required />
            <InputField label="Phone number" name="phone" type="tel" autoComplete="tel" />
            <InputField label="Email" name="email" type="email" autoComplete="email" required />
            <InputField label="Company name" name="company" autoComplete="organization" required className="sm:col-span-2" />
            <SelectField
              label="How can we help?"
              name="topic"
              options={topics}
              placeholder="Select options"
              required
              className="sm:col-span-2 [&_select]:bg-terminal-green"
            />
            <Button type="submit" size="lg" className="sm:col-span-2">
              Send
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
