import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TerminalLogo } from "@/components/terminal/TerminalLogo";
import {
  terminalActions,
  terminalFooterColumns,
  terminalNav,
  terminalSocials,
} from "@/content/terminal";

export const metadata: Metadata = {
  title: "Terminal Yard Operating System | The New Industry Standard in Yard Operations",
  description:
    "Max throughput. Easy-to-use. Rapid ROI. Terminal Yard Operating System is the only AI-native, fully-integrated platform for the yard of the future.",
};

export default function TerminalLayout({ children }: LayoutProps<"/terminal">) {
  return (
    <>
      <SiteHeader
        logo={<TerminalLogo />}
        homeHref="/terminal"
        nav={terminalNav}
        actions={terminalActions}
        tone="dark"
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        className="bg-black text-white"
        logo={<TerminalLogo />}
        aside={
          <p className="max-w-xs text-sm opacity-80">
            Ready for your yard of the future?{" "}
            <a href="#contact" className="text-terminal-lime underline-offset-4 hover:underline">
              Reach us
            </a>
            . Follow us today.
          </p>
        }
        columns={terminalFooterColumns}
        socials={terminalSocials}
        copyright="Copyright Terminal Industries © 2025 All Rights Reserved"
      />
    </>
  );
}
