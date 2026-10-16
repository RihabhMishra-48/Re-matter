import React, { useState } from "react";
import { DetectionItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { UpcyclingStudioModal } from "./UpcyclingStudioModal";
import {
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  Trash2,
  AlertCircle,
  PackageCheck,
  X,
  ChevronRight,
  ChevronDown,
  Wrench,
  Leaf,
  ShieldAlert,
  Maximize2,
} from "lucide-react";

interface InspectorPanelProps {
  selectedDetection: DetectionItem | null;
  onClearSelection: () => void;
  allDetections: DetectionItem[];
  onSelectDetection: (det: DetectionItem) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedDetection,
  onClearSelection,
  allDetections,
  onSelectDetection,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(false);

  const toggleCheck = (idx: number) => {
    const key = `${selectedDetection?.id}_${idx}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getUpcycledVisual = (label: string, material?: string) => {
    const text = `${label} ${material || ""}`.toLowerCase();
    if (text.includes("glass") || text.includes("jar") || (text.includes("bottle") && text.includes("glass"))) {
      return {
        src: "/upcycling/glass_terrarium.jpg",
        title: "Minimalist Botanical Succulent & Moss Terrarium",
        category: "Biophilic Interior Ecology",
        co2: "310g CO₂e avoided",
        lifespan: "Permanent Utility",
        diversion: "100% Landfill Diverted",
        energy: "100% Furnace Remelt Energy Saved",
        steps: [
          { phase: "Phase 1: Sterilization", text: "Wash glass thoroughly with hot water and dry with a lint-free cloth." },
          { phase: "Phase 2: Drainage Bed", text: "Layer 1 inch of clean gravel or activated charcoal at the base for root aeration." },
          { phase: "Phase 3: Botanical Planting", text: "Add cactus potting soil and delicately embed miniature succulents, pebbles, and moss." },
          { phase: "Phase 4: Microclimate Setup", text: "Mist lightly with clean water; place on a bright desk or windowsill for biophilic elegance." },
        ],
      };
    }
    if (text.includes("bottle") || text.includes("plastic") || text.includes("pet") || text.includes("polyethylene")) {
      return {
        src: "/upcycling/bottle_planter.jpg",
        title: "Self-Watering Hydroponic Botanical Planter",
        category: "Zero-Waste Horticultural Design",
        co2: "185g CO₂e avoided",
        lifespan: "+36 Months Utility",
        diversion: "100% Landfill Diverted",
        energy: "88% Less Energy vs Virgin Resin",
        steps: [
          { phase: "Phase 1: Decontamination", text: "Strip exterior labels, remove plastic cap ring, and rinse with warm water." },
          { phase: "Phase 2: Precision Cut", text: "Slice horizontally across the bottle 4 inches below the shoulder neck seam." },
          { phase: "Phase 3: Capillary Wick Setup", text: "Pierce bottle cap with a 5mm hole, thread a 10-inch braided cotton wick, and invert top cone into base." },
          { phase: "Phase 4: Planting & Auto-Hydration", text: "Fill upper cone with potting soil & microgreen seeds; fill base with water for passive wicking." },
        ],
      };
    }
    if (text.includes("can") || text.includes("tin") || text.includes("aluminum") || text.includes("metal")) {
      return {
        src: "/upcycling/can_organizer.jpg",
        title: "Rustic Desk Organizer & Artisan Tool Caddy",
        category: "Sustainable Workspace Utility",
        co2: "220g CO₂e avoided",
        lifespan: "+48 Months Utility",
        diversion: "100% Landfill Diverted",
        energy: "95% Smelting Energy Conserved",
        steps: [
          { phase: "Phase 1: Deburring & Safety", text: "Crimp and fold the inner cut edge using pliers to remove sharp hazards." },
          { phase: "Phase 2: Degrease & Dry", text: "Rinse interior with mild dish soap and dry completely to prevent spot oxidation." },
          { phase: "Phase 3: Artisan Twine Wrap", text: "Spiral natural jute twine around the canister using water-based non-toxic sealant." },
          { phase: "Phase 4: Workspace Utility", text: "Organize drafting markers, scissors, cables, or artist brushes to declutter your desk." },
        ],
      };
    }
    if (text.includes("cup") || text.includes("paper") || text.includes("carton") || text.includes("cardboard")) {
      return {
        src: "/upcycling/cup_seedling.jpg",
        title: "Biodegradable Nursery Seedling Starter",
        category: "Organic Soil Regeneration",
        co2: "95g CO₂e avoided",
        lifespan: "+6 Months Organic Cycle",
        diversion: "100% Natural Soil Return",
        energy: "Zero Industrial Reprocessing",
        steps: [
          { phase: "Phase 1: Base Aeration", text: "Puncture 3 small drainage perforations through the bottom rim using a pushpin." },
          { phase: "Phase 2: Soil Enrichment", text: "Fill cup 3/4 with peat-free organic seed compost and moisten lightly with spray mist." },
          { phase: "Phase 3: Seed Sowing", text: "Press herb or vegetable seeds 0.25 inches deep and set in a warm, indirect sunlit spot." },
          { phase: "Phase 4: Direct Ground Planting", text: "Once roots establish, plant the entire paper pot directly into outdoor soil—it naturally enriches the earth." },
        ],
      };
    }
    return {
      src: "/upcycling/bottle_planter.jpg",
      title: "Modular Circular Container & Organizer",
      category: "Sustainable Resource Recovery",
      co2: "120g CO₂e avoided",
      lifespan: "+24 Months Utility",
      diversion: "100% Landfill Diverted",
      energy: "Direct Material Re-utility",
      steps: [
        { phase: "Phase 1: Fraction Sorting", text: "Disassemble components into clean single-material fractions." },
        { phase: "Phase 2: Structural Trimming", text: "Cut along natural molded structural ridges for optimal durability." },
        { phase: "Phase 3: Hardware Sorting", text: "Deploy as stackable sorting trays for hardware, craft beads, or seed markers." },
      ],
    };
  };

  const upcycledVisual = selectedDetection
    ? getUpcycledVisual(
        selectedDetection.class_name,
        selectedDetection.intelligence?.material_classification?.likely_material ||
          selectedDetection.intelligence?.material
      )
    : null;

  return (
    <aside
      className="w-full md:w-80 lg:w-92 border-l border-[#E4E4E7] bg-white flex flex-col shrink-0 h-full overflow-hidden select-none z-20"
      aria-label="Object Inspector"
    >
      {/* Inspector Panel Top Bar */}
      <div className="h-10 px-4 border-b border-[#E4E4E7] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#71717A]" />
          <span className="text-xs font-semibold text-[#18181B] tracking-tight">
            Inspector
          </span>
          {allDetections.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-[#71717A] font-mono">
              {allDetections.length} in frame
            </span>
          )}
        </div>

        {selectedDetection && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-[#71717A] hover:text-[#18181B] p-1 rounded hover:bg-zinc-100 transition-colors"
            title="Deselect object"
            aria-label="Deselect object"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedDetection ? (
          <>
            {/* Object Header & Recyclability State */}
            <div className="border border-[#E4E4E7] rounded-lg p-3.5 bg-[#F7F8FA]/60">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] block">
                    Detected Object
                  </span>
                  <h3 className="font-semibold text-sm text-[#18181B] capitalize tracking-tight mt-0.5">
                    {selectedDetection.class_name}
                  </h3>
                </div>
                <StatusBadge
                  status={
                    selectedDetection.intelligence.recyclability_state ||
                    selectedDetection.intelligence.recyclability
                  }
                  size="md"
                />
              </div>

              {/* Recyclability State Rationale */}
              {selectedDetection.intelligence.state_rationale && (
                <p className="text-xs text-zinc-600 bg-white p-2 rounded border border-[#E4E4E7] mb-2 leading-relaxed">
                  {selectedDetection.intelligence.state_rationale}
                </p>
              )}

              {/* Confidence Progress Bar */}
              <div className="mt-2 pt-2 border-t border-[#E4E4E7]">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#71717A]">Detection Confidence</span>
                  <span className="font-mono font-medium text-[#18181B]">
                    {Math.round(selectedDetection.confidence * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E4E4E7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-200"
                    style={{
                      width: `${Math.round(selectedDetection.confidence * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Independent Material Classification */}
            {selectedDetection.intelligence.material_classification ? (
              <div className="border border-[#E4E4E7] rounded-lg p-3.5 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#18181B]">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <h4 className="text-xs font-semibold">Material Classification</h4>
                  </div>
                  {/* Material Confidence Pill */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      selectedDetection.intelligence.material_classification.confidence_level === "High"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : selectedDetection.intelligence.material_classification.confidence_level === "Medium"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {selectedDetection.intelligence.material_classification.confidence_level} Confidence
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider block">
                    Likely Material
                  </span>
                  <span className="text-xs font-semibold text-[#18181B] mt-0.5 block">
                    {selectedDetection.intelligence.material_classification.likely_material}
                  </span>
                </div>

                {selectedDetection.intelligence.material_classification.uncertainty_reason && (
                  <div className="p-2 rounded bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 leading-snug">
                    <span className="font-semibold block mb-0.5">Uncertainty Assessment:</span>
                    {selectedDetection.intelligence.material_classification.uncertainty_reason}
                  </div>
                )}

                {selectedDetection.intelligence.material_classification.condition_assessed && (
                  <div className="text-[11px] text-[#71717A] bg-[#F7F8FA] p-2 rounded border border-[#E4E4E7]">
                    <span className="font-medium text-[#18181B]">Condition Assessment: </span>
                    {selectedDetection.intelligence.material_classification.condition_assessed}
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider block mb-1">
                    Composition Candidates
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDetection.intelligence.material_classification.candidates.map((cand, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                      >
                        {cand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback for legacy format */
              <div className="border border-[#E4E4E7] rounded-lg p-3.5 bg-white">
                <div className="flex items-center gap-1.5 mb-2.5 text-[#18181B]">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <h4 className="text-xs font-semibold">Material Evaluation</h4>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider block mb-1">
                    Waste Stream
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-[#18181B] text-xs font-medium border border-[#E4E4E7]">
                    {selectedDetection.intelligence.category}
                  </span>
                </div>
                {selectedDetection.intelligence.material_candidates && (
                  <div>
                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block mb-1">
                      Likely Material Candidates
                    </span>
                    <ul className="space-y-1">
                      {selectedDetection.intelligence.material_candidates.map((mat, i) => (
                        <li key={i} className="text-xs text-[#18181B] flex items-start gap-1.5 leading-snug">
                          <span className="text-[#71717A] mt-0.5">•</span>
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Disposal Route */}
            <div className="border border-[#E4E4E7] rounded-lg p-3.5 bg-white">
              <div className="flex items-center gap-1.5 mb-1.5 text-[#18181B]">
                <Trash2 className="w-3.5 h-3.5 text-[#71717A]" />
                <h4 className="text-xs font-semibold">Responsible Disposal Recommendation</h4>
              </div>
              <p className="text-xs text-[#18181B] leading-relaxed bg-[#F7F8FA] p-2.5 rounded border border-[#E4E4E7] font-normal">
                {selectedDetection.intelligence.disposal_recommendation ||
                  selectedDetection.intelligence.recommended_disposal}
              </p>
            </div>

            {/* Interactive Physical Verification Checklist */}
            {selectedDetection.intelligence.verification_checklist?.length > 0 && (
              <div className="border border-amber-200 rounded-lg p-3.5 bg-amber-50/20">
                <div className="flex items-center gap-1.5 mb-1.5 text-amber-900">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                  <h4 className="text-xs font-semibold">
                    Physical Verification Checklist
                  </h4>
                </div>
                <p className="text-[11px] text-[#71717A] mb-2 leading-relaxed">
                  Verify these physical conditions before disposal or reuse:
                </p>

                <div className="space-y-1.5">
                  {selectedDetection.intelligence.verification_checklist.map(
                    (step, idx) => {
                      const isChecked = !!checkedItems[
                        `${selectedDetection.id}_${idx}`
                      ];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleCheck(idx)}
                          className={`flex items-start gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                            isChecked
                              ? "bg-white border-emerald-300 text-zinc-500"
                              : "bg-white/90 border-[#E4E4E7] text-[#18181B] hover:bg-white"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                          </div>
                          <span
                            className={`leading-tight ${
                              isChecked ? "line-through text-zinc-400" : ""
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Circular Economy: Upcycling Blueprint & Creation Workflow */}
            {(() => {
              const recState = selectedDetection.intelligence.recyclability_state;
              const isNonRecyclable =
                recState === "Generally non-recyclable" ||
                (recState as string) === "Non-recyclable" ||
                Boolean(selectedDetection.intelligence.recyclability?.toLowerCase().includes("non-recyclable"));

              if (isNonRecyclable) {
                return (
                  <div className="border border-rose-300 rounded-xl p-3.5 bg-rose-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-rose-950">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <h4 className="text-xs font-bold">Non-Recyclable Material Warning</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        Landfill Bound
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-700 leading-snug">
                      This object consists of composite or contaminated polymers that cannot be processed in municipal recycling facilities or safely upcycled into domestic items without toxic leach risk.
                    </p>

                    {/* Environmental Impact Risk */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-md bg-white border border-rose-200 shadow-2xs">
                        <span className="text-zinc-500 block text-[9px]">Landfill Lifespan</span>
                        <span className="font-bold text-rose-700 text-[11px]">400+ Years</span>
                      </div>
                      <div className="p-2 rounded-md bg-white border border-rose-200 shadow-2xs">
                        <span className="text-zinc-500 block text-[9px]">Ecological Hazard</span>
                        <span className="font-bold text-rose-700 text-[11px]">Microplastic Leaching</span>
                      </div>
                    </div>

                    {/* Responsible Containment */}
                    <div className="p-2.5 rounded-md bg-white border border-zinc-200 text-[11px] text-zinc-800 space-y-1">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-zinc-900">
                        <Trash2 className="w-3.5 h-3.5 text-zinc-600" />
                        Recommended Disposal Action:
                      </span>
                      <p className="text-zinc-600 leading-snug">
                        {selectedDetection.intelligence.disposal_recommendation}
                      </p>
                    </div>

                    {/* Future Eco Alternative */}
                    <div className="p-2.5 rounded-md bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Environmental Preservation Tip:</span>
                        <span className="text-emerald-900 leading-tight block mt-0.5">
                          To maintain environmental sustainability, substitute this item with reusable alternatives (e.g. refillable glass bottles, cotton tote bags, or stainless steel canisters).
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="border border-emerald-300/80 rounded-xl overflow-hidden bg-white shadow-xs space-y-0">
                  {/* Visual Transformation Showcase Preview Photo */}
                  {upcycledVisual && (
                    <div
                      onClick={() => setIsStudioOpen(true)}
                      className="relative group overflow-hidden bg-zinc-950 cursor-pointer"
                      title="Click to view full-screen Upcycling Studio"
                    >
                      <img
                        src={upcycledVisual.src}
                        alt={upcycledVisual.title}
                        className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-[10px] font-semibold tracking-wide">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Upcycled Transformation</span>
                        </span>
                        <span className="p-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom Banner Title */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <p className="text-[10px] text-emerald-300 font-mono tracking-wider uppercase font-semibold">
                          {upcycledVisual.category}
                        </p>
                        <h4 className="text-xs font-bold leading-tight mt-0.5 text-white drop-shadow-xs">
                          {upcycledVisual.title}
                        </h4>
                      </div>
                    </div>
                  )}

                  {/* Clean Impact Snapshot & Fullscreen CTA */}
                  {upcycledVisual && (
                    <div className="p-3 bg-gradient-to-b from-emerald-50/50 to-white space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-white p-2 rounded-lg border border-emerald-200/80 shadow-2xs">
                          <span className="text-zinc-500 block text-[9px] font-medium">Carbon Avoided</span>
                          <span className="font-bold text-emerald-800 text-[11px] block mt-0.5">
                            🌱 {upcycledVisual.co2}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-emerald-200/80 shadow-2xs">
                          <span className="text-zinc-500 block text-[9px] font-medium">Utility Lifespan</span>
                          <span className="font-bold text-teal-800 text-[11px] block mt-0.5">
                            🔄 {upcycledVisual.lifespan}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Fullscreen Studio CTA */}
                      <button
                        type="button"
                        onClick={() => setIsStudioOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ring-1 ring-emerald-500/20"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>View Fullscreen Upcycling Studio</span>
                      </button>

                      {/* Optional Expandable Workflow Accordion for Quick Peek */}
                      <div className="pt-1 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setIsWorkflowExpanded((prev) => !prev)}
                          className="w-full flex items-center justify-between text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 py-1 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Wrench className="w-3 h-3 text-emerald-600" />
                            <span>Quick Creation Workflow (4 Phases)</span>
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isWorkflowExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isWorkflowExpanded && (
                          <div className="space-y-1.5 mt-2 pt-1.5 border-t border-zinc-100">
                            {upcycledVisual.steps.map((st, sIdx) => (
                              <div key={sIdx} className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/60 text-[10px]">
                                <span className="font-bold text-emerald-900 uppercase block">
                                  Phase {sIdx + 1}: {st.phase}
                                </span>
                                <p className="text-zinc-600 leading-snug mt-0.5">{st.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Extensible Local Guidance */}
            {selectedDetection.intelligence.local_guidance && (
              <div className="border border-sky-200 rounded-lg p-3.5 bg-sky-50/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800">
                    Local Jurisdiction Guidance
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      selectedDetection.intelligence.local_guidance.facility_acceptance_verified
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {selectedDetection.intelligence.local_guidance.facility_acceptance_verified
                      ? "Verified Program"
                      : "Unverified Program"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-800">
                  {selectedDetection.intelligence.local_guidance.jurisdiction}
                </div>
                <div className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                  <span>Curbside Pickup:</span>
                  <span
                    className={`font-medium ${
                      selectedDetection.intelligence.local_guidance.curbside_accepted
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {selectedDetection.intelligence.local_guidance.curbside_accepted ? "Accepted" : "Not accepted"}
                  </span>
                </div>
                {selectedDetection.intelligence.local_guidance.facility_notes && (
                  <p className="text-[11px] text-zinc-600 leading-snug">
                    {selectedDetection.intelligence.local_guidance.facility_notes}
                  </p>
                )}
                <p className="text-[10px] text-zinc-400 italic pt-1 border-t border-sky-100">
                  {selectedDetection.intelligence.local_guidance.disclaimer}
                </p>
              </div>
            )}

            {/* Scientific Caveat & CV Boundary Disclaimer */}
            <div className="p-3 rounded-lg bg-zinc-50 border border-[#E4E4E7] text-[#71717A] text-[11px] flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#18181B] block mb-0.5">
                  Computer Vision & Material Limitation
                </span>
                <span>{selectedDetection.intelligence.caveat}</span>
              </div>
            </div>
          </>
        ) : (
          /* Small Intentional Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#71717A]">
            <div className="w-10 h-10 rounded-lg bg-[#F7F8FA] border border-[#E4E4E7] flex items-center justify-center mb-2 text-[#71717A]">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-medium text-xs text-[#18181B] mb-0.5">
              No Object Selected
            </h4>
            <p className="text-[11px] text-[#71717A] max-w-[200px] mb-3 leading-relaxed">
              Select any bounding box in the preview or pick a detected chip below.
            </p>

            {/* Quick list of objects in current view */}
            {allDetections.length > 0 && (
              <div className="w-full text-left mt-2 pt-3 border-t border-[#E4E4E7]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] tracking-wider mb-2 block">
                  Detected in Current Frame ({allDetections.length})
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allDetections.map((det) => (
                    <button
                      key={det.id}
                      type="button"
                      onClick={() => onSelectDetection(det)}
                      className="w-full flex items-center justify-between p-2 rounded border border-[#E4E4E7] hover:border-zinc-300 hover:bg-[#F7F8FA] text-left transition-colors"
                    >
                      <div>
                        <span className="text-xs font-medium text-[#18181B] capitalize block leading-tight">
                          {det.class_name}
                        </span>
                        <span className="text-[10px] text-[#71717A]">
                          {det.intelligence.category} •{" "}
                          {Math.round(det.confidence * 100)}%
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#71717A]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Upcycling Studio Modal */}
      {selectedDetection && upcycledVisual && (
        <UpcyclingStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          project={upcycledVisual}
          objectLabel={selectedDetection.class_name}
          materialName={
            selectedDetection.intelligence?.material_classification?.likely_material ||
            selectedDetection.intelligence?.material ||
            "Recyclable Material"
          }
        />
      )}
    </aside>
  );
};
