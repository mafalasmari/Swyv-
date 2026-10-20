import { ClosingCta } from "@/components/terminal/ClosingCta";
import { ContactSection } from "@/components/terminal/ContactSection";
import { FaqSection } from "@/components/terminal/FaqSection";
import { FeatureSteps } from "@/components/terminal/FeatureSteps";
import { Hero } from "@/components/terminal/Hero";
import { LogoWall } from "@/components/terminal/LogoWall";
import { PlatformTabs } from "@/components/terminal/PlatformTabs";
import { ProductPaths } from "@/components/terminal/ProductPaths";
import { RoiCalculator } from "@/components/terminal/RoiCalculator";
import { Testimonial } from "@/components/terminal/Testimonial";
import {
  contactPerks,
  contactTopics,
  customerLogos,
  faqCategories,
  featureSteps,
  heroHeadlines,
  heroVideo,
  investorLogos,
  platformSlides,
  productPaths,
  testimonial,
} from "@/content/terminal";

export default function TerminalPage() {
  return (
    <>
      <Hero headlines={heroHeadlines} video={heroVideo} />
      <LogoWall title="Powering the yards behind the brands you know" logos={customerLogos} />
      <ProductPaths title="Fix one yard problem today. Expand on your timetable." paths={productPaths} />
      <RoiCalculator />
      <FeatureSteps
        eyebrow="Why Terminal"
        title="Introducing the Terminal Yard Operating System"
        intro="The Terminal Yard Operating System™ (YOS™) uses computer vision and autonomous decision intelligence to turn chaotic, manually run yards into self-aware logistics environments. Its key benefits include:"
        steps={featureSteps}
      />
      <PlatformTabs
        eyebrow="Platform"
        title="One Modular Platform. Infinite Possibilities."
        description="Build your Yard Operating System one application at a time. From gate to dock, start with the application you need most and then expand as your needs grow. Terminal is designed to automate workflows, optimize worker productivity, and deliver maximum visibility of every asset and movement in the yard."
        slides={platformSlides}
      />
      <Testimonial
        eyebrow="Built by the Industry"
        title="Built by logistics leaders who want a new industry standard in the yard"
        logos={investorLogos}
        quote={testimonial}
      />
      <ContactSection perks={contactPerks} topics={contactTopics} />
      <FaqSection
        title="FAQs"
        description="Here are the most common questions teams have before getting started with Terminal."
        categories={faqCategories}
      />
      <ClosingCta />
    </>
  );
}
