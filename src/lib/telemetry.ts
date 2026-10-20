import { t, type Tx } from "@/i18n/localize";

export type AssetType = "trailer" | "van" | "pallet" | "cage" | "crate";
export type AssetStatus = "in_transit" | "at_hub" | "at_branch" | "loading" | "exception" | "delivered";
export type Zone = "north" | "central" | "east" | "west" | "south";
export type Direction = "inbound" | "return";

export type Asset = {
  id: string;
  type: AssetType;
  direction: Direction;
  status: AssetStatus;
  location: Tx;
  zone: Zone;
  /** Minutes at the current location. */
  dwell: number;
  /** Dwell limit for this asset type and status, in minutes. */
  sla: number;
  /** Seconds since the last scan or GPS ping. */
  lastPing: number;
};

export const ASSET_TYPES: Record<AssetType, { label: Tx; prefix: string }> = {
  trailer: { label: t("شاحنة", "Trailer"), prefix: "TR" },
  van: { label: t("فان", "Van"), prefix: "VN" },
  pallet: { label: t("طبلية", "Pallet"), prefix: "PLT" },
  cage: { label: t("قفص", "Cage"), prefix: "CGE" },
  crate: { label: t("صندوق", "Crate"), prefix: "CRT" },
};

export const ASSET_STATUS: Record<AssetStatus, { label: Tx; tone: "ok" | "warn" | "bad" | "info" | "idle" }> = {
  in_transit: { label: t("في الطريق", "In transit"), tone: "info" },
  at_hub: { label: t("في نقطة العبور", "At cross-dock"), tone: "warn" },
  at_branch: { label: t("في الفرع", "At branch"), tone: "idle" },
  loading: { label: t("تحميل", "Loading"), tone: "warn" },
  exception: { label: t("ملاحظة", "Exception"), tone: "bad" },
  delivered: { label: t("مُسلّم", "Delivered"), tone: "ok" },
};

export const ZONES: Record<Zone, Tx> = {
  north: t("شمال", "North"),
  central: t("وسط", "Central"),
  east: t("شرق", "East"),
  west: t("غرب", "West"),
  south: t("جنوب", "South"),
};

const BRANCHES: { name: Tx; zone: Zone }[] = [
  { name: t("فرع الملقا", "Al Malqa branch"), zone: "north" },
  { name: t("فرع الياسمين", "Al Yasmin branch"), zone: "north" },
  { name: t("فرع النرجس", "An Narjis branch"), zone: "north" },
  { name: t("فرع حطين", "Hittin branch"), zone: "north" },
  { name: t("فرع العليا", "Al Olaya branch"), zone: "central" },
  { name: t("فرع الملز", "Al Malaz branch"), zone: "central" },
  { name: t("فرع الروضة", "Ar Rawdah branch"), zone: "east" },
  { name: t("فرع السويدي", "As Suwaidi branch"), zone: "west" },
  { name: t("فرع الشفا", "Ash Shifa branch"), zone: "south" },
];
const HUB = { name: t("نقطة العبور · شرق 01", "Cross-dock · East 01"), zone: "east" as Zone };
const IN_TRANSIT = t("على الطريق", "On the road");

/** Dwell limits in minutes. */
const SLA: Record<AssetStatus, number> = {
  in_transit: 180,
  at_hub: 240,
  at_branch: 120,
  loading: 45,
  exception: 60,
  delivered: 720,
};

/** Small deterministic PRNG so server and client render the same starting data. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedAssets(count = 36, seed = 1042): Asset[] {
  const rand = rng(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  const types: AssetType[] = ["trailer", "van", "van", "pallet", "pallet", "pallet", "cage", "crate", "crate"];
  const counters: Record<AssetType, number> = { trailer: 1040, van: 2205, pallet: 410, cage: 30, crate: 700 };

  return Array.from({ length: count }, () => {
    const type = pick(types);
    counters[type] += 1 + Math.floor(rand() * 3);
    const statuses: AssetStatus[] =
      type === "trailer"
        ? ["in_transit", "at_hub", "at_hub"]
        : type === "van"
          ? ["in_transit", "loading", "at_branch", "exception"]
          : ["at_hub", "at_branch", "in_transit", "delivered", "exception"];
    const status = pick(statuses);
    const place = status === "at_hub" || status === "loading" ? HUB : pick(BRANCHES);
    const sla = SLA[status];
    return {
      id: `${ASSET_TYPES[type].prefix}-${counters[type]}`,
      type,
      direction: type === "crate" || type === "cage" || rand() < 0.3 ? "return" : "inbound",
      status,
      location: status === "in_transit" ? IN_TRANSIT : place.name,
      zone: place.zone,
      dwell: Math.round(sla * (0.15 + rand() * 1.15)),
      sla,
      lastPing: Math.floor(rand() * 90),
    } satisfies Asset;
  });
}

/**
 * Advances the simulated clock. Each tick adds `dwellMinutes` to every active asset
 * and `pingSeconds` since the last ping, unless the asset reports in this tick.
 */
export function tick(
  assets: Asset[],
  dwellMinutes: number,
  pingSeconds: number,
  rand: () => number = Math.random,
): Asset[] {
  return assets.map((a) => ({
    ...a,
    dwell: a.status === "delivered" ? a.dwell : a.dwell + dwellMinutes,
    lastPing: rand() < 0.35 ? 0 : a.lastPing + pingSeconds,
  }));
}

export const dwellRatio = (a: Asset) => a.dwell / a.sla;
