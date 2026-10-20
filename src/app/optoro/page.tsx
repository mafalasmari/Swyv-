import { BlogRoundup } from "@/components/optoro/BlogRoundup";
import { CaseStudies } from "@/components/optoro/CaseStudies";
import { ContactBanner } from "@/components/optoro/ContactBanner";
import { Integrations } from "@/components/optoro/Integrations";
import { LogoStrip } from "@/components/optoro/LogoStrip";
import { OptoroHero } from "@/components/optoro/OptoroHero";
import { ReportPromo } from "@/components/optoro/ReportPromo";
import { ValueBlocks } from "@/components/optoro/ValueBlocks";
import {
  blogPosts,
  brandLogos,
  caseStudies,
  caseStudiesCta,
  contactBanner,
  integrations,
  newsCta,
  optoroHero,
  pressLogos,
  reportPromo,
  valueBlocks,
} from "@/content/optoro";

export default function OptoroPage() {
  return (
    <>
      <OptoroHero {...optoroHero} />
      <LogoStrip logos={brandLogos} className="border-b border-black/5" />
      <ValueBlocks blocks={valueBlocks} />
      <ReportPromo {...reportPromo} />
      <CaseStudies title="Don’t Just Take Our Word for It" items={caseStudies} cta={caseStudiesCta} />
      <ContactBanner {...contactBanner} />
      <Integrations {...integrations} />
      <BlogRoundup
        title="Returns Roundup"
        description="Expand your understanding of the returns management world and learn from thought leaders."
        posts={blogPosts}
      />
      <LogoStrip title="As Featured In" logos={pressLogos} cta={newsCta} className="text-optoro-graphite" />
    </>
  );
}
