import type { FooterColumn, LogoAsset, NavItem, NavLink, SocialLink } from "@/lib/types";

const SITE = "https://www.optoro.com";
const UPLOADS = `${SITE}/wp-content/uploads`;
const CONTACT_URL = "https://info.optoro.com/optoro-blue-yonder";
const link = (label: string, path: string): NavLink => ({ label, href: `${SITE}${path}` });

export const optoroLogo = `${UPLOADS}/2025/09/Optoro-BY-Logo-Web.svg`;
export const optoroLogoWhite = `${UPLOADS}/2025/08/Optoro-BY-Logo-White.svg`;

const product = [
  link("Returns Management System", "/returns-management-system-rms/"),
  link("Store Returns", "/in-store-returns-software-solution-rms/"),
  link("Returns Processing", "/returns-processing/"),
  link("Partners & Integrations", "/partners-and-integrations/"),
];
const solutions = [
  link("For 3PLs", "/3pl-third-party-logistics-returns-software/"),
  link("For Store Returns", "/in-store-returns-software-solution-rms/"),
];
const library = (label: string, slug: string) =>
  link(label, `/returns-content/?_resources_library=${slug}`);
const resources = [
  link("Articles", "/returns-blog/"),
  link("Content Library", "/returns-content/"),
  library("Returnology", "returnology"),
  library("Data Reports", "data-report"),
  library("White Papers", "white-paper"),
  library("Webinars", "webinar"),
  link("In the News", "/returns-news/?_press_types_new=in-the-news"),
  link("Case Studies", "/customer-stories/"),
];
const company = [
  link("About", "/about/"),
  link("Environmental Impact", "/environmental-impact/"),
  link("Press", "/returns-news/"),
];

export const optoroNav: NavItem[] = [
  { label: "Product", links: product },
  { label: "Solutions", links: solutions },
  { label: "Resources", links: resources },
  { label: "Company", links: company },
];

export const optoroActions = [
  { children: "Client Login", href: "https://www.optiturn.com/session/new", variant: "outline-dark" as const },
  { children: "Contact Us", href: CONTACT_URL, variant: "orange" as const },
];

export const optoroHero = {
  title: "Returns don’t have to suck.",
  description:
    "Delight customers, reduce costs, and accelerate processing with returns software that spans the entire returns lifecycle",
  image: `${UPLOADS}/2024/03/optoro-home-hero-lg.png`,
  primary: { label: "Learn More About RMS", href: `${SITE}/returns-management-system-rms/` },
  secondary: { label: "Contact Us", href: CONTACT_URL },
};

const brand = (file: string, alt: string): LogoAsset => ({ src: `${UPLOADS}/2024/03/${file}`, alt });

export const brandLogos: LogoAsset[] = [
  brand("gap-logo.png", "Gap"),
  brand("vineyardvines-logo.png", "Vineyard Vines"),
  brand("tuckernuck-logo.png", "Tuckernuck"),
  brand("stevemadden-logo.png", "Steve Madden"),
  brand("ralphlauren-logo.png", "Ralph Lauren"),
  brand("hatch-logo.png", "Hatch"),
  brand("bby-logo.png", "Best Buy"),
  brand("plow-logo.png", "Plow & Hearth"),
  brand("lacrosse-logo.png", "LaCrosse"),
  brand("danner-logo.png", "Danner"),
];

export const pressLogos: LogoAsset[] = [
  ["abc-news", "ABC News"],
  ["ap", "Associated Press"],
  ["axios", "Axios"],
  ["CBS", "CBS"],
  ["cnbc", "CNBC"],
  ["cnnmoney", "CNN Money"],
  ["fastco", "Fast Company"],
  ["forbes", "Forbes"],
  ["huffpo", "HuffPost"],
  ["nrf", "NRF"],
  ["nyt", "The New York Times"],
  ["retaildive", "Retail Dive"],
  ["washbiz", "Washington Business Journal"],
  ["wsj", "The Wall Street Journal"],
  ["yahoo-finance", "Yahoo Finance"],
].map(([file, alt]) => brand(`press-logo-${file}.png`, alt));

export const valueBlocks = [
  {
    title: "Curate the Ideal Returns Experience: Seamless, Efficient, & Profitable",
    body: "When it comes to retail the shopper reigns supreme. In fact, 55% of shoppers won’t shop with a brand if they don’t like the returns policy. That’s why a holistic returns strategy with the right technology is paramount. Returns can create friction for shoppers, crush margins for retailers, and result in cumbersome backlogs for warehouse management systems (WMS) and operations. That is until you approach ecommerce returns with a strategy and the right technology in place. That’s where we come in.",
    image: `${UPLOADS}/2024/08/optoro-home-experience-new.png`,
  },
  {
    title: "Recover More Revenue",
    body: "Returns can be margin-crushers and waste-creators if not managed well. With a consolidated system in place, retailers and brands can capture repurchases through instant exchanges and store credit, reduce transportation costs by up to 20%, and improve recovery by instantly dispositioning available-to-sell inventory to the most profitable channels.",
    image: `${UPLOADS}/2024/08/optoro-home-revenue-new.png`,
  },
  {
    title: "Bring Reverse Logistics Forward",
    body: "Reverse logistics entails cumbersome, higher-touch processes than outbound fulfillment. Yet since most four-wall technology was designed for outbound, operations teams are left to manage the complexity of returns with workarounds, clipboards, tribal knowledge, or swivel-chair processes. With a system built for returns, operators can automate processing, avoid exceptions, and banish backlogs.",
    image: `${UPLOADS}/2025/03/optoro-home-forward-new.png`,
    cta: { label: "Explore returns processing", href: `${SITE}/returns-processing/` },
  },
];

export const reportPromo = {
  eyebrow: "Free download",
  title: "The State of Retail Returns 2024",
  description:
    "Returns avoidance is a short-sighted strategy for returns management. Transforming returns into revenue for 2024 is possible with these tactics and a thorough understanding of the state of the market.",
  image: `${UPLOADS}/2024/05/OP24_State-of-Returns-Content-Block.png`,
  cta: { label: "Get the Report", href: "https://info.optoro.com/report-state-of-retail-returns-2024" },
};

export const caseStudies = [
  {
    segment: "High-end fashion retailer",
    stat: "93%",
    label: "reduction in returns processing timeline",
    image: `${UPLOADS}/2024/02/customer-1-3.png`,
  },
  {
    segment: "Global footwear brand",
    stat: "45%",
    label: "improvement in recovery for previously recycled inventory",
    image: `${UPLOADS}/2024/02/customer-2-1.png`,
  },
  {
    segment: "Fashion retailer",
    stat: "600K",
    label: "reduction in returns backlog in 10 days",
    image: `${UPLOADS}/2024/02/customer-3.png`,
  },
  {
    segment: "Maternity retailer",
    stat: "37%",
    label: "increase in average order value (AOV) by encouraging exchanges instead of returns",
    image: `${UPLOADS}/2024/02/customer-6-1.png`,
  },
];

export const caseStudiesCta = { label: "Read more customer success stories", href: `${SITE}/customer-stories/` };

export const contactBanner = {
  title: "Ready to join us on the journey to reimagine returns?",
  description:
    "Connect with our returns and reverse logistics experts to assess the current state of your returns experience, and what software makes the most sense for your business.",
  cta: { label: "Contact Us", href: CONTACT_URL },
};

export const integrations = {
  title: "Fold Optoro into Your Tech Stack",
  body: "Optoro’s modular, system-agnostic, API-first approach to integrations in conjunction with our preconfigured integration-platform-as-a-service (iPaaS) enables you to quickly integrate RMS into the systems that matter most.",
  image: `${UPLOADS}/2024/03/AdobeStock_496186629-scaled.jpeg`,
  cta: { label: "Our Partners & Integrations", href: `${SITE}/partners-and-integrations/` },
};

export const blogPosts = [
  {
    title: "Reducing Waste from Returns: How an RMS powers TIMWOODS & Recommerce",
    excerpt:
      "In today’s dynamic retail landscape, retailers, brands, and third-party logistics (3PL) providers…",
    image: `${UPLOADS}/2025/05/TIMWOODS-RMS-1024x536.png`,
    href: `${SITE}/returns-blog/timwood-recommerce-returns-sustainability/`,
  },
  {
    title: "Reverse the Curse: Key Questions and Returns Strategies for Retailers",
    excerpt: "Returns are an integral part of the retail industry, significantly impacting customer…",
    image: `${UPLOADS}/2025/03/optoro-returns-strategies-1024x536.png`,
    href: `${SITE}/returns-blog/returns-strategies-for-retailers/`,
  },
  {
    title: "Return Initiation Best Practices (and What to Avoid)",
    excerpt: "Returns are a big part of shopping, especially as online sales keep…",
    image: `${UPLOADS}/2025/02/returns-initiation-poll-optoro-1024x569.png`,
    href: `${SITE}/returns-blog/return-initiation-best-practices/`,
  },
];

export const newsCta = { label: "Read the Latest News Around Returns", href: `${SITE}/returns-news/` };

export const optoroFooterColumns: FooterColumn[] = [
  { title: "Products", links: product },
  { title: "Solutions", links: solutions },
  {
    title: "Resources",
    links: [
      ...resources,
      { label: "Help Center", href: "https://help.optoro.com" },
      { label: "Developers", href: "https://developer.optoro.com" },
    ],
  },
  { title: "Company", links: [...company, { label: "Contact Us", href: CONTACT_URL }] },
];

export const optoroLegalLinks: NavLink[] = [
  link("Privacy Policy", "/privacy-policy/"),
  link("Terms & Conditions", "/terms-conditions/"),
  link("Security", "/security/"),
];

export const optoroSocials: SocialLink[] = [
  { network: "linkedin", href: "https://www.linkedin.com/company/optoro/" },
  { network: "x", href: "https://twitter.com/optoroinc" },
  { network: "youtube", href: "https://www.youtube.com/channel/UCJLsPkvQb4P82sm6YIVqtrg" },
  { network: "instagram", href: "https://www.instagram.com/optoro/" },
];
