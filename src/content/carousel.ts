import { t } from "@/i18n/localize";
import type { SceneKey } from "@/components/sections/CarouselScenes";
import type { RouteKey } from "./site";

/**
 * How-it-works carousel: the six steps (copy lives in howItWorks.steps) split into
 * the trip out and the trip back, three cards each, so the open card takes 60% and
 * the other two 20%. Each card links to where that step is described in full.
 */
export const carousel = {
  tabs: [
    { label: t("التوصيل", "Delivery"), steps: [0, 1, 2] },
    { label: t("المرتجعات", "Returns"), steps: [3, 4, 5] },
  ],
  more: t("اعرف المزيد", "Learn more"),
  cards: [
    { scene: "booking", route: "portal", hash: "" },
    { scene: "crossdock", route: "services", hash: "#night-cross-dock" },
    { scene: "delivery", route: "services", hash: "#branch-delivery" },
    { scene: "inspection", route: "services", hash: "#returns-inspection" },
    { scene: "sorting", route: "howItWorks", hash: "#engine" },
    { scene: "invoice", route: "services", hash: "#reports" },
  ] satisfies { scene: SceneKey; route: RouteKey; hash: string }[],
};
