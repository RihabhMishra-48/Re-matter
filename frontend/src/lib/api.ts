import {
  DetectionResponse,
  HealthResponse,
  SupportedCategory,
  ModelMetadataResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Health check endpoint
 */
export async function getBackendHealth(
  signal?: AbortSignal
): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: signal || AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new ApiError(res.status, `Health check returned ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, "Backend unreachable");
  }
}

/**
 * Introspects active computer vision model architecture and taxonomy
 */
export async function getModelMetadata(
  signal?: AbortSignal
): Promise<ModelMetadataResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/model/metadata`, {
      method: "GET",
      signal: signal || AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new ApiError(res.status, `Model metadata returned ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, "Could not fetch model metadata");
  }
}

/**
 * Sends a base64 video frame for rapid inference with frame ordering ID
 */
export async function analyzeLiveFrame(
  base64Image: string,
  confidence: number,
  signal?: AbortSignal,
  frameId?: number,
  iouThreshold?: number
): Promise<DetectionResponse> {
  const res = await fetch(`${API_BASE_URL}/api/detect/frame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      image: base64Image,
      confidence,
      frame_id: frameId,
      iou_threshold: iouThreshold,
    }),
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      errorBody.detail || `Frame analysis failed with code ${res.status}`
    );
  }

  return await res.json();
}

/**
 * Uploads an image file (multipart/form-data)
 */
export async function analyzeImageFile(
  file: File,
  confidence: number,
  signal?: AbortSignal
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("confidence", confidence.toString());

  const res = await fetch(`${API_BASE_URL}/api/detect`, {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      errorBody.detail || `Image upload analysis failed with code ${res.status}`
    );
  }

  return await res.json();
}

/**
 * Retrieves the 8 canonical waste categories & rules
 */
export async function getCategories(
  signal?: AbortSignal
): Promise<SupportedCategory[]> {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "GET",
    signal,
  });

  if (!res.ok) {
    throw new ApiError(res.status, "Failed to load waste categories");
  }

  return await res.json();
}
