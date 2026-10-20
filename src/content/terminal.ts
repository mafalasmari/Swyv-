import type { FaqItem, FooterColumn, LogoAsset, NavItem, SocialLink } from "@/lib/types";

const SITE = "https://terminal-industries.com";
const CDN = "https://a.storyblok.com/f/337048";
const link = (label: string, path: string) => ({ label, href: `${SITE}${path}` });

export const terminalNav: NavItem[] = [
  {
    label: "System",
    links: [
      link("What is YOS™", "/what-is-terminal-yos"),
      link("SmartYard™ YMS", "/smart-yard-tm-yms"),
      link("The Agentic AI Yard", "/the-agentic-ai-yard"),
      link("Terminal at the Gate", "/terminal-at-the-gate"),
      link("Terminal in the Yard", "/terminal-in-the-yard"),
      link("Terminal at the Dock", "/terminal-at-the-dock"),
      link("Terminal Across Your Operations", "/terminal-across-your-operation"),
      link("AI Computer Vision", "/terminal-ai-computer-vision"),
      link("Yard Security", "/yard-security"),
      link("YOS vs. YMS", "/yos-vs-yms"),
    ],
  },
  {
    label: "Markets",
    links: [
      link("Enterprise Operations", "/what-is-terminal-yos"),
      link("Medium-Sized Operations", "/markets/terminal-for-medium-sized-operations"),
      link("Gate Management", "/modules/gate-management"),
      link("Yard Visibility", "/modules/yard-visibility"),
      link("Load Verification", "/modules/load-verification"),
      link("Carrier Appointments", "/modules/carrier-appointments"),
      link("Third Party Logistics", "/markets/terminal-for-3pls"),
      link("Retail & Grocery", "/markets/terminal-for-retail-grocery"),
      link("Consumer Packaged Goods", "/markets/terminal-for-consumer-packaged-goods-cpg-"),
      link("Manufacturing Facilities", "/markets/terminal-for-manufacturing-facilities"),
    ],
  },
  {
    label: "Featured",
    links: [
      link("2026 State of the Yard Survey", "/interactive-highlights-2026-state-of-the-yard-survey"),
      link("Terminal on the Road", "/events"),
      link("Yard Security Grader", "/yard-security-grader"),
      link("Yard Efficiency Calculator", "/yard-efficiency-calculator"),
    ],
  },
  {
    label: "Resources",
    links: [
      link("All Resources", "/resources"),
      link("Press Releases", "/resources/press-releases"),
      link("Podcasts & Articles", "/resources/podcasts-articles"),
      link("Videos", "/resources/videos"),
      link("Blogs", "/resources/blogs"),
      link("Case Studies", "/resources/case-studies"),
      link("Webinars", "/resources/webinars"),
    ],
  },
  link("About", "/about"),
];

export const terminalActions = [
  { children: "Request Demo", href: "#contact", variant: "lime" as const },
  { children: "Contact Us", href: "#contact", variant: "outline-light" as const },
];

export const heroHeadlines = [
  "We have reinvented the future of logistics through the yard.",
  "AI-native technology that turns the space between your gate and your dock…",
  "into one connected, automated system.",
];

export const heroVideo = `${CDN}/x/41cc2fcad6/dummy-01.mp4`;

const logo = (path: string, alt: string): LogoAsset => ({ src: `${CDN}/${path}`, alt });

export const customerLogos: LogoAsset[] = [
  logo("1280x395/5d869ff961/dsv-b-w.svg", "DSV"),
  logo("170x44/9386c9fae8/lineage.svg", "Lineage"),
  logo("160x120/90aa0c203e/goodyear2.svg", "Goodyear"),
  logo("161x62/44ea74f049/nfi.svg", "NFI"),
  logo("176x49/27affef2ea/ryder-green.svg", "Ryder"),
  logo("2500x2500/6c9f6434ea/hp.svg", "HP"),
  logo("1280x319/621d5efa86/tjx-b-w.svg", "TJX"),
  logo("249x47/15a7349d4e/prologis.svg", "Prologis"),
  logo("1366x768/802a86b588/marc-jacobs2.svg", "Marc Jacobs"),
  logo("1280x302/92b80c4809/pods-b-w-1.svg", "PODS"),
  logo("1280x142/4da4eb329e/foxconn-b-w.svg", "Foxconn"),
  logo("3840x1181/df7256d5e0/kirkland-b-w.svg", "Kirkland"),
  logo("869x147/26858fd378/db-schenker-2.svg", "DB Schenker"),
];

export const investorLogos: LogoAsset[] = [
  logo("114x45/04e08dca33/8vc.svg", "8VC"),
  logo("176x49/27affef2ea/ryder-green.svg", "Ryder"),
  logo("170x44/9386c9fae8/lineage.svg", "Lineage"),
  logo("249x47/15a7349d4e/prologis.svg", "Prologis"),
  logo("161x62/44ea74f049/nfi.svg", "NFI"),
];

const images = {
  gate: `${CDN}/768x432/ce73b10067/gate-entry.jpg`,
  yard: `${CDN}/1272x1196/29dcba4210/yard.png`,
  dock: `${CDN}/565x336/e5f3b11568/dock-doors.png`,
  operations: `${CDN}/2034x1150/c561abc6ba/r.webp`,
  quote: `${CDN}/5112x3410/74c4e40128/quote-image.jpg`,
};

export const productPaths = [
  {
    eyebrow: "01 Fast Start",
    title: "Fix One Problem in the Yard",
    description:
      "Gate, security, dock — start with the single problem slowing your yard down today. Go live in days with no disruption and at low cost.",
    image: images.gate,
    cta: { label: "Fix now", href: `${SITE}/markets/terminal-for-medium-sized-operations` },
  },
  {
    eyebrow: "02 Single Site & Growing",
    title: "I Have a Few Yards to Optimize",
    description:
      "Begin with one site, prove the value, and roll out to the rest on your own timeline. No big platform commitment to get started.",
    image: images.yard,
    cta: { label: "Learn more", href: `${SITE}/markets/terminal-for-medium-sized-operations` },
  },
  {
    eyebrow: "03 Enterprise Network",
    title: "I Run a Network of Yards",
    description:
      "One control tower across every site, with the analytics and orchestration to manage your whole operation from a single view.",
    image: images.operations,
    cta: { label: "One system for all", href: `${SITE}/what-is-terminal-yos` },
  },
];

export const featureSteps = [
  {
    title: "Orchestrate Yard Execution",
    description:
      "Computer vision automates check-in, location, and validation gate to dock — up to 50% more throughput and 85% faster gate processing.",
    caption: "Check-in process time and asset location time shrinks to seconds.",
    video: `${CDN}/x/f0f51ea10f/vid_3-1_prerender_1.mp4`,
  },
  {
    title: "Build the System You Need",
    description:
      "Start with the applications you need most and then expand as your needs grow or as your operations become more complex. Live in 5 days, low IT lift, no third-party devices to support.",
    caption: "OTIF penalties fade away.",
    video: `${CDN}/x/5c039660e1/vid_3-3_prerender_1.mp4`,
  },
  {
    title: "Eliminate Unnecessary Labor",
    description:
      "Automated workflows eliminate the need for labor at the gate, dispatch, yard checks, and make the dock more efficient.",
    caption: "Every asset is fully visible and predictable throughout its full journey.",
    video: `${CDN}/x/daeedd63c8/vid_3-5_prerender_1.mp4`,
  },
  {
    title: "Fast Payback",
    description:
      "All-inclusive, priced as a service. Measurable payback in months, without a capital project.",
    caption: "Information silos across the supply chain vanish.",
    video: `${CDN}/x/5d1992bef6/vid_3-2_prerender_1.mp4`,
  },
];

export const platformSlides = [
  {
    id: "gate",
    label: "At the Gate",
    title: "Automate and Expedite Gate Operations",
    description:
      "Our system automates and streamlines the entire check-in and check-out process. The AI Computer Vision system accelerates gate flow, improves data accuracy, reduces manual labor, and by integrating with your TMS, manages arrivals and enables digital compliance forms, replacing paper-based inspections.",
    image: images.gate,
    href: `${SITE}/terminal-at-the-gate`,
  },
  {
    id: "yard",
    label: "In the Yard",
    title: "Real-Time Visibility and Workflow Automation",
    description:
      "Our solution provides real-time visibility of all assets and goods from arrival to departure. It automates critical workflows, manages spotter vehicles, and helps plan shipments and appointments.",
    image: images.yard,
    href: `${SITE}/terminal-in-the-yard`,
  },
  {
    id: "dock",
    label: "At the Dock",
    title: "Optimize Loading and Improve Dock Efficiency",
    description:
      "YOS™ streamlines loading and monitoring by integrating with your Warehouse Management System (WMS) to synchronize dock schedules with real-time yard activity. It offers a clear view of all incoming and outgoing shipments, helps manage dock door availability, and allows for pre-planning to reduce wait times.",
    image: images.dock,
    href: `${SITE}/terminal-at-the-dock`,
  },
  {
    id: "operations",
    label: "Across Operations",
    title: "A Unified, Connected Data-Driven System",
    description:
      "From gate to dock and beyond, our system offers a cohesive platform that optimizes workflows and provides maximum visibility across all your yards. It delivers real-time insights and analytics through custom dashboards and alerts, helping you make data-driven decisions.",
    image: images.operations,
    href: `${SITE}/terminal-across-your-operation`,
  },
];

export const testimonial = {
  quote:
    "We have not seen this kind of accuracy with computer-vision technology… this is a significant milestone in the race to modernize the yard.",
  name: "Karen Jones",
  role: "Head of New Product",
  company: "Ryder System, Inc.",
  image: images.quote,
};

export const contactPerks = ["30-minute demo", "Needs discovery call", "Yard ROI assessment"];

export const contactTopics = [
  "Schedule a 30-minute meeting with a yard expert",
  "Schedule a YOS™ Demo",
  "Arrange ROI consultation",
  "Set Up a 2-Day Proof of Value on site",
  "Something else",
];

export const faqCategories: { id: string; label: string; items: FaqItem[] }[] = [
  {
    id: "core",
    label: "Core Technology",
    items: [
      {
        question: "What does Terminal actually do?",
        answer:
          "Terminal is an AI-native Yard Operating System™ (YOS™) that uses computer vision to automate yard execution from gate to dock. It replaces manual logs with a system that proactively decides and executes the next best move in real-time.",
      },
      {
        question: "How is this different from a traditional Yard Management System (YMS)?",
        answer:
          'Traditional YMS are "digital clipboards" that record what already happened; Terminal is an operating system that sees what is happening now and orchestrates what needs to happen next in the yard.',
      },
      {
        question: 'What is "Agentic AI" in the context of the yard?',
        answer:
          "It acts as a 24/7 autonomous supervisor that handles exceptions and reprioritizes tasks based on real-time conditions, ensuring the most critical moves happen first (e.g. how to prepare and reallocate resources for a late appointment).",
      },
      {
        question: "How accurate is the data captured by your system?",
        answer:
          'Our proprietary computer vision stack delivers 50% or more improvement in data accuracy vs. manual operations, virtually eliminating the human error and "lost assets" common with manual entry.',
      },
      {
        question: "Can we manage multiple sites from a single login?",
        answer:
          'Yes; Terminal provides a "Global Control Tower" view, allowing you to compare KPIs, dwell times, and performance across all facilities in your network in one place.',
      },
    ],
  },
  {
    id: "value",
    label: "Value",
    items: [
      {
        question: "How is Terminal priced?",
        answer:
          "Terminal is priced as a competitive annual, all-inclusive as-a-service model for all hardware, support, and services. Deployments can vary and are charged as a separate up-front fee.",
      },
      {
        question: "What kind of ROI can I expect?",
        answer:
          "Most customers see a 4x+ ROI within the first year and achieve a full payback in less than 5 months through labor savings and faster throughput.",
      },
      {
        question: "How does Terminal reduce carrier and facility costs?",
        answer:
          "We reduce labor costs by automating routine yard tasks, reduce driver detention fees by improving gate processing times, faster responsiveness at the dock, and maximum visibility to all asset inventory in the yard.",
      },
      {
        question: "Can Terminal help with regulatory compliance?",
        answer:
          "Yes; our Indirect Source Rule (ISR) feature automates compliance by generating audit-ready data for regulations like Rule 2305.",
      },
      {
        question: "Who is Terminal best suited for?",
        answer:
          "Highly modular, Terminal is built for both mid-market and enterprise 3PLs, retailers, and manufacturers managing complex, medium- to high-volume multi-yard networks that want to scale without adding headcount.",
      },
      {
        question: "Is Terminal a stable long-term partner?",
        answer:
          "Founded in 2023 and backed by 8VC and four of the top 10 U.S. logistics firms (including Prologis and Ryder), Terminal offers deep financial and strategic stability.",
      },
    ],
  },
  {
    id: "implementation",
    label: "Implementation",
    items: [
      {
        question: "How fast can we go live?",
        answer:
          "Gate automation can be live in as little as 5 days, with full yard orchestration typically completed in 45 days.",
      },
      {
        question: "Does Terminal integrate with my existing WMS/TMS?",
        answer:
          "Yes; we offer seamless, event-driven integration with major platforms like Manhattan, SAP, Blue Yonder, FourKites, and project44.",
      },
      {
        question: "Do I need to buy expensive proprietary cameras?",
        answer:
          'No; Terminal is hardware-agnostic and can often leverage your existing IP cameras, or you can use our plug-and-play "Terminal in a Camera" bundles.',
      },
      {
        question: 'Is the platform modular or "all-or-nothing"?',
        answer:
          "The system is highly configurable; you can start with a single use case, like Gate Acceleration, and expand into full yard orchestration over time.",
      },
      {
        question: "What happens if our site’s internet goes down?",
        answer:
          "Terminal is designed with local resilience; mission-critical tasks continue to buffer locally and sync to the cloud once connectivity is restored.",
      },
      {
        question: "How does Terminal protect my data?",
        answer:
          "We use a zero-trust security model with industry-standard encryption and are currently in the process of achieving SOC-2 compliance.",
      },
    ],
  },
  {
    id: "operations",
    label: "Site Operations",
    items: [
      {
        question: "How do drivers and yard spotters interact with the system?",
        answer:
          "Terminal is browser-based (no app to download). Drivers can use their personal mobile devices, while spotters and dock workers can be outfitted with any browser-enabled mobile device approved by the operator.",
      },
      {
        question: "How does this change the role of my yard office staff?",
        answer:
          'Staff shift from manual data entry to "exception management," only intervening when the AI flags a specific issue that requires human judgment.',
      },
      {
        question: "Will implementation disrupt my current operations?",
        answer:
          "No; our deployment model requires little operational downtime and carries a very low IT lift for your team.",
      },
      {
        question: "What kind of support and training do you provide?",
        answer:
          'We provide "White-Glove" on-site training for all shifts, 24/7 live technical support, and a dedicated hypercare period post-launch.',
      },
      {
        question: "What is your system availability guarantee?",
        answer:
          "As long as yard internet is running, Terminal runs at a 99.9% uptime for all mission-critical workflows to ensure your yard operations never stop.",
      },
    ],
  },
];

export const terminalFooterColumns: FooterColumn[] = [
  {
    title: "Technology",
    links: [
      { label: "Homepage", href: "/terminal" },
      link("Yard Operating System", "/what-is-terminal-yos"),
      link("The Agentic AI Yard", "/the-agentic-ai-yard"),
      { label: "Yard Efficiency Calculator", href: "#calculator" },
    ],
  },
  {
    title: "Company",
    links: [link("About", "/about"), link("Resources", "/resources"), { label: "Contact", href: "#contact" }],
  },
];

export const terminalSocials: SocialLink[] = [
  { network: "linkedin", href: "https://www.linkedin.com/company/terminal-industries/" },
  { network: "x", href: "https://x.com/Terminal_Indust" },
  { network: "youtube", href: "https://www.youtube.com/@Terminal-Industries" },
];
