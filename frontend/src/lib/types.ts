export interface PixelCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  x1: number; // 0.0 - 1.0 normalized
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  pixel: PixelCoords;
}

export type RecyclabilityState =
  | "Recyclable"
  | "Conditionally recyclable"
  | "Reusable"
  | "Compostable"
  | "Special handling required"
  | "Generally non-recyclable"
  | "Needs verification";

export type RecyclabilityStatus = RecyclabilityState | "Non-recyclable" | "Special handling";

export interface ReuseIdea {
  title: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  materials_needed?: string[] | string;
  instructions: string[] | string;
  safety_precautions?: string[] | string;
  food_safe?: boolean;
  heat_warning?: boolean;
}

export interface ReuseSuitability {
  object_label: string;
  suitable: boolean;
  reason: string;
  warning?: string | null;
  ideas: ReuseIdea[];
}

export interface MaterialClassification {
  object_label: string;
  likely_material: string;
  candidates: string[];
  confidence_level: "High" | "Medium" | "Low / Uncertain";
  uncertainty_reason?: string | null;
  condition_assessed?: string | null;
  contamination_notes?: string | null;
}

export interface LocalGuidance {
  jurisdiction: string;
  region_code: string;
  curbside_accepted: boolean;
  facility_acceptance_verified: boolean;
  facility_notes?: string | null;
  disclaimer: string;
}

export interface RecyclingIntelligence {
  category: string;
  material_classification: MaterialClassification;
  recyclability_state: RecyclabilityState;
  state_rationale: string;
  disposal_recommendation: string;
  reuse_suitability: ReuseSuitability;
  local_guidance: LocalGuidance;
  verification_checklist: string[];
  caveat: string;
  // Backward compatibility convenience fields
  material?: string;
  material_candidates?: string[];
  recyclability?: RecyclabilityState | string;
  recommended_disposal?: string;
  reuse_ideas?: string[];
}

export interface DetectionItem {
  id: string;
  class_name: string;
  class_id: number;
  confidence: number;
  bbox: BoundingBox;
  intelligence: RecyclingIntelligence;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DetectionResponse {
  detections: DetectionItem[];
  count: number;
  image_dimensions: ImageDimensions;
  inference_time_ms: number;
  model_name: string;
  model_type: string;
  active_threshold: number;
  frame_id?: number;
  iou_threshold?: number;
}

export interface ModelMetadataResponse {
  model_name: string;
  model_path: string;
  model_type: string;
  is_waste_specific: boolean;
  device: string;
  supported_classes_count: number;
  classes: string[];
  default_confidence: number;
  default_iou_threshold: number;
  waste_taxonomy_mapping: Record<string, string>;
  concurrency_limit: number;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "offline";
  app_name: string;
  version: string;
  model_loaded: boolean;
  model_name: string;
  device: string;
  supported_classes_count: number;
}

export interface SupportedCategory {
  name: string;
  description: string;
  icon_name: string;
  known_coco_examples: string[];
  disposal_overview: string;
}

export interface DetectionHistoryItem {
  id: string;
  timestamp: string;
  source: "webcam" | "upload";
  detection: DetectionItem;
  thumbnailUrl?: string;
}

export type CameraStatus =
  | "idle"
  | "requesting_permission"
  | "streaming"
  | "paused"
  | "permission_denied"
  | "not_found"
  | "error";

export type WorkspaceMode = "live" | "upload";
