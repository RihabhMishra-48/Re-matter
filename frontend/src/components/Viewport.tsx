import React, { useRef, useState, useEffect } from "react";
import {
  DetectionItem,
  WorkspaceMode,
  CameraStatus,
} from "@/lib/types";
import {
  Video,
  Upload,
  Camera,
  Scan,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface ViewportProps {
  mode: WorkspaceMode;
  cameraStatus: CameraStatus;
  errorMessage?: string | null;
  stream?: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  uploadedImageUrl: string | null;
  detections: DetectionItem[];
  selectedDetection: DetectionItem | null;
  onSelectDetection: (det: DetectionItem | null) => void;
  onStartCamera: () => void;
  onTriggerUpload: () => void;
  isAnalyzing: boolean;
}

export const Viewport: React.FC<ViewportProps> = ({
  mode,
  cameraStatus,
  errorMessage,
  stream,
  videoRef,
  canvasRef,
  uploadedImageUrl,
  detections,
  selectedDetection,
  onSelectDetection,
  onStartCamera,
  onTriggerUpload,
  isAnalyzing,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [contentAspect, setContentAspect] = useState<number>(16 / 9);

  // Keep video element attached to live media stream
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream && cameraStatus === "streaming") {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.play().catch((playErr) => {
          console.warn("Video play error on stream update:", playErr);
        });
      }
    }
  }, [stream, cameraStatus, videoRef]);

  // Handle uploaded image load to match aspect ratio
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setContentAspect(img.naturalWidth / img.naturalHeight);
    }
  };

  const getStatusBorder = (recyclability?: string, isSelected?: boolean) => {
    if (isSelected) {
      return {
        border: "border-emerald-500 ring-2 ring-emerald-500/40 z-30",
        bg: "bg-emerald-500/15",
        tag: "bg-[#18181B] text-emerald-400 border border-emerald-500 shadow-md",
      };
    }

    switch (recyclability) {
      case "Recyclable":
        return {
          border: "border-emerald-500/80 hover:border-emerald-400 z-10",
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          tag: "bg-emerald-800 text-white border border-emerald-600/60 shadow-xs",
        };
      case "Conditionally recyclable":
        return {
          border: "border-sky-500/80 hover:border-sky-400 z-10",
          bg: "bg-sky-500/10 hover:bg-sky-500/20",
          tag: "bg-sky-800 text-white border border-sky-600/60 shadow-xs",
        };
      case "Reusable":
        return {
          border: "border-indigo-500/80 hover:border-indigo-400 z-10",
          bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
          tag: "bg-indigo-800 text-white border border-indigo-600/60 shadow-xs",
        };
      case "Compostable":
        return {
          border: "border-lime-500/80 hover:border-lime-400 z-10",
          bg: "bg-lime-500/10 hover:bg-lime-500/20",
          tag: "bg-lime-800 text-white border border-lime-600/60 shadow-xs",
        };
      case "Special handling required":
      case "Special handling":
        return {
          border: "border-amber-500/80 hover:border-amber-400 z-10",
          bg: "bg-amber-500/10 hover:bg-amber-500/20",
          tag: "bg-amber-800 text-white border border-amber-600/60 shadow-xs",
        };
      case "Generally non-recyclable":
      case "Non-recyclable":
        return {
          border: "border-rose-500/80 hover:border-rose-400 z-10",
          bg: "bg-rose-500/10 hover:bg-rose-500/20",
          tag: "bg-rose-800 text-white border border-rose-600/60 shadow-xs",
        };
      case "Needs verification":
        return {
          border: "border-amber-500/80 hover:border-amber-400 z-10",
          bg: "bg-amber-500/10 hover:bg-amber-500/20",
          tag: "bg-amber-800 text-white border border-amber-600/60 shadow-xs",
        };
      default:
        return {
          border: "border-zinc-400/80 hover:border-zinc-300 z-10",
          bg: "bg-zinc-500/10 hover:bg-zinc-500/20",
          tag: "bg-zinc-800 text-white border border-zinc-700 shadow-xs",
        };
    }
  };

  const isLiveActive = mode === "live" && cameraStatus === "streaming";
  const isImageActive = mode === "upload" && !!uploadedImageUrl;
  const hasActiveContent = isLiveActive || isImageActive;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 bg-[#141517] overflow-hidden flex items-center justify-center select-none"
      onClick={() => onSelectDetection(null)}
    >
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Subtle alignment crosshair grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Primary Video / Image Frame Wrapper — Centered with Locked Aspect Ratio */}
      {hasActiveContent ? (
        <div
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={{
            aspectRatio: contentAspect,
            width: "auto",
            height: "auto",
          }}
        >
          {/* Live Video */}
          {mode === "live" && (
            <video
              ref={(el) => {
                if (videoRef) {
                  (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                }
                if (el && stream && el.srcObject !== stream) {
                  el.srcObject = stream;
                  el.play().catch((playErr) => {
                    console.warn("Video play on ref attach interrupted:", playErr);
                  });
                }
              }}
              playsInline
              autoPlay
              muted
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (v.videoWidth > 0 && v.videoHeight > 0) {
                  setContentAspect(v.videoWidth / v.videoHeight);
                }
              }}
              className="w-full h-full object-fill rounded-xs shadow-md"
            />
          )}

          {/* Uploaded Image */}
          {mode === "upload" && uploadedImageUrl && (
            <img
              src={uploadedImageUrl}
              alt="Analyzed target waste preview"
              onLoad={handleImageLoad}
              className="w-full h-full object-fill rounded-xs shadow-md"
            />
          )}

          {/* Precision Normalized Overlays Layer (Anchored 100% to Content Rectangle) */}
          <div className="absolute inset-0 pointer-events-none">
            {detections.map((detection) => {
              const isSelected = selectedDetection?.id === detection.id;
              const styles = getStatusBorder(
                detection.intelligence?.recyclability_state ||
                detection.intelligence?.recyclability,
                isSelected
              );
              const bbox = detection.bbox;

              const topPct = bbox.y1 * 100;
              const leftPct = bbox.x1 * 100;
              const widthPct = bbox.width * 100;
              const heightPct = bbox.height * 100;

              return (
                <div
                  key={detection.id}
                  style={{
                    top: `${topPct}%`,
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDetection(detection);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select detected ${detection.class_name}, confidence ${Math.round(detection.confidence * 100)} percent`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectDetection(detection);
                    }
                  }}
                  className={`absolute pointer-events-auto cursor-pointer border-[1.5px] rounded-xs transition-colors duration-100 ${styles.border} ${styles.bg}`}
                >
                  {/* Corner registration marks */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/90" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white/90" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white/90" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/90" />

                  {/* Detection Label & Recyclability Status Pill */}
                  {(() => {
                    const recState =
                      detection.intelligence?.recyclability_state ||
                      detection.intelligence?.recyclability ||
                      "";
                    let badgeLabel = "";
                    let badgeEmoji = "";
                    if (recState === "Recyclable") {
                      badgeLabel = "Recyclable";
                      badgeEmoji = "♻️";
                    } else if (recState === "Conditionally recyclable") {
                      badgeLabel = "Conditional";
                      badgeEmoji = "🔄";
                    } else if (
                      (recState as string) === "Generally non-recyclable" ||
                      (recState as string) === "Non-recyclable"
                    ) {
                      badgeLabel = "Trash / Non-Recyclable";
                      badgeEmoji = "⛔";
                    } else if (recState === "Compostable") {
                      badgeLabel = "Compost";
                      badgeEmoji = "🌱";
                    } else if (recState === "Special handling required") {
                      badgeLabel = "Special / E-Waste";
                      badgeEmoji = "⚠️";
                    } else if (recState === "Reusable") {
                      badgeLabel = "Reusable";
                      badgeEmoji = "🔁";
                    }

                    return (
                      <div
                        className={`absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shadow-sm ${styles.tag}`}
                      >
                        <span className="capitalize font-semibold">{detection.class_name}</span>
                        {badgeLabel && (
                          <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-black/40 text-[10px] font-bold">
                            <span>{badgeEmoji}</span>
                            <span>{badgeLabel}</span>
                          </span>
                        )}
                        <span className="text-[10px] opacity-80 font-mono">
                          {Math.round(detection.confidence * 100)}%
                        </span>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty / Standby States */
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm z-10 select-none">
          {mode === "live" ? (
            cameraStatus === "permission_denied" ||
            cameraStatus === "not_found" ||
            cameraStatus === "error" ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-rose-950/40 border border-rose-800/80 flex items-center justify-center mb-3 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">
                  {cameraStatus === "permission_denied"
                    ? "Camera Permission Required"
                    : cameraStatus === "not_found"
                    ? "Camera Hardware Not Found"
                    : "Camera Stream Error"}
                </h3>
                <p className="text-zinc-400 text-xs mb-4 leading-relaxed max-w-[280px]">
                  {errorMessage ||
                    (cameraStatus === "permission_denied"
                      ? "Browser camera access was denied. Enable camera permissions in your browser settings to analyze objects live."
                      : cameraStatus === "not_found"
                      ? "No video input devices were detected on this machine. Connect a webcam or switch to Still Image mode."
                      : "Could not initialize video capture stream. Ensure no other application is using the camera.")}
                </p>
                <button
                  type="button"
                  onClick={onStartCamera}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Camera Connection</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-3 text-emerald-400 shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">
                  Optical Waste Inspector
                </h3>
                <p className="text-zinc-400 text-xs mb-5 leading-relaxed">
                  Turn on your webcam to detect multiple waste items in real-time
                  and evaluate material recyclability.
                </p>
                <button
                  id="viewport-enable-camera-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartCamera();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Feed</span>
                </button>
              </div>
            )
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onTriggerUpload();
              }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700/80 rounded-xl hover:border-zinc-500 hover:bg-zinc-800/20 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-3 text-emerald-400">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">
                Upload Still Image
              </h3>
              <p className="text-zinc-400 text-xs mb-4 max-w-[240px]">
                Drop or select a JPEG, PNG, or WebP photo of waste objects to inspect.
              </p>
              <span className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium hover:bg-zinc-700">
                Choose Photo
              </span>
            </div>
          )}
        </div>
      )}

      {/* Non-shifting Telemetry & Inference Status */}
      {isAnalyzing && (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-[#18181B]/90 backdrop-blur-xs border border-zinc-700/80 px-2.5 py-1 rounded text-white text-[11px] font-mono shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Inference active</span>
        </div>
      )}

      {/* Empty detection notice when active */}
      {hasActiveContent && detections.length === 0 && !isAnalyzing && (
        <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 bg-[#18181B]/80 backdrop-blur-xs border border-zinc-800 px-2.5 py-1 rounded text-zinc-400 text-[11px]">
          <Scan className="w-3.5 h-3.5 text-zinc-500" />
          <span>No waste objects detected above threshold</span>
        </div>
      )}
    </div>
  );
};
