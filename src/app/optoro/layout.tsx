import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmartImage } from "@/components/ui/SmartImage";
import {
  optoroActions,
  optoroFooterColumns,
  optoroLegalLinks,
  optoroLogo,
  optoroLogoWhite,
  optoroNav,
  optoroSocials,
} from "@/content/optoro";

export const metadata: Metadata = {
  title: "Returns Management System for Retailers and 3PLs - Optoro",
  description: "Returns Management System (RMS) for Retailers and 3PLs",
};

export default function OptoroLayout({ children }: LayoutProps<"/optoro">) {
  return (
    <>
      <SiteHeader
        logo={<SmartImage src={optoroLogo} alt="Optoro" width={180} height={40} className="h-8 w-auto lg:h-10" priority />}
        homeHref="/optoro"
        nav={optoroNav}
        actions={optoroActions}
        tone="light"
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        className="bg-optoro-graphite text-white"
        logo={<SmartImage src={optoroLogoWhite} alt="Optoro" width={180} height={40} className="h-10 w-auto" />}
        columns={optoroFooterColumns}
        socials={optoroSocials}
        copyright="© Optoro, Inc."
        legalLinks={optoroLegalLinks}
      />
    </>
  );
}
