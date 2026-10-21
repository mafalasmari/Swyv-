"use client";

import dynamic from "next/dynamic";

/**
 * The tools in their own client chunks (next/dynamic must be called from a client
 * module for Next to split them). They are still prerendered, so the HTML and the
 * layout are unchanged; React hydrates each one as a separate task.
 */
export const SavingsCalculator = dynamic(() => import("./SavingsCalculator").then((m) => m.SavingsCalculator));
export const DispositionEngine = dynamic(() => import("./DispositionEngine").then((m) => m.DispositionEngine));
export const TelemetryDashboard = dynamic(() => import("./TelemetryDashboard").then((m) => m.TelemetryDashboard));
export const DecisionSimulator = dynamic(() => import("./DecisionSimulator").then((m) => m.DecisionSimulator));
