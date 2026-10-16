import React from "react";
import {
  Video,
  UploadCloud,
  Circle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { HealthResponse, WorkspaceMode, CameraStatus } from "@/lib/types";

interface HeaderProps {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  health: HealthResponse | null;
  cameraStatus: CameraStatus;
  onOpenCategoriesModal: () => void;
  onOpenGeminiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  health,
  cameraStatus,
  onOpenCategoriesModal,
  onOpenGeminiModal,
}) => {
  const isHealthy = health?.status === "healthy";

  const getCameraStatusLabel = () => {
    switch (cameraStatus) {
      case "streaming":
        return { label: "Live Feed", dot: "bg-emerald-500 animate-pulse" };
      case "requesting_permission":
        return { label: "Requesting...", dot: "bg-amber-500 animate-pulse" };
      case "permission_denied":
        return { label: "Camera Denied", dot: "bg-rose-500" };
      case "error":
        return { label: "Camera Error", dot: "bg-rose-500" };
      default:
        return { label: "Camera Standby", dot: "bg-zinc-400" };
    }
  };

  const camState = getCameraStatusLabel();

  return (
    <header className="h-12 border-b border-[#E4E4E7] bg-white px-4 md:px-5 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#18181B] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
            <span className="text-emerald-400">R</span>M
          </div>
          <span className="font-semibold text-xs text-[#18181B] tracking-tight">
            ReMatter AI
          </span>
        </div>

        <div className="h-3.5 w-px bg-[#E4E4E7]" />

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#71717A] font-medium hidden sm:inline">
            Waste Intelligence Workspace
          </span>
          <span className="text-[10px] text-zinc-600 bg-zinc-100 border border-zinc-200/80 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide">
            Studio
          </span>
        </div>
      </div>

      {/* Center: Mode Switcher */}
      <nav aria-label="Analysis Mode" className="flex items-center bg-[#F7F8FA] p-0.5 rounded-lg border border-[#E4E4E7]">
        <button
          id="mode-live-webcam-btn"
          type="button"
          onClick={() => onModeChange("live")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === "live"
              ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Live Feed</span>
        </button>
        <button
          id="mode-image-upload-btn"
          type="button"
          onClick={() => onModeChange("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === "upload"
              ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>Still Image</span>
        </button>
      </nav>

      {/* Right: Camera Status, Backend Status, Guide */}
      <div className="flex items-center gap-2">
        {/* Camera Status Pill (shown in live mode) */}
        {mode === "live" && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-[#E4E4E7] bg-[#F7F8FA] text-[11px] text-[#71717A]"
            title={`Camera state: ${cameraStatus}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${camState.dot}`} />
            <span>{camState.label}</span>
          </div>
        )}

        {/* Backend Connection Status Pill */}
        <div
          id="backend-status-pill"
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#E4E4E7] bg-[#F7F8FA] text-[11px]"
          title={
            isHealthy
              ? `Connected to ${health?.app_name} (${health?.model_name} on ${health?.device})`
              : "Backend disconnected. Verify FastAPI is running on port 8000."
          }
        >
          <Circle
            className={`w-2 h-2 fill-current ${
              isHealthy ? "text-emerald-500" : "text-rose-500"
            }`}
          />
          <span className="text-[#18181B] font-medium hidden sm:inline">
            {isHealthy ? "Backend Ready" : "Disconnected"}
          </span>
          {isHealthy && (
            <span className="text-[10px] text-[#71717A] font-mono border-l border-zinc-200 pl-1.5 hidden md:inline">
              {health?.model_name}
            </span>
          )}
        </div>

        {/* ReMatter Waste-YOLO Neural Core Button */}
        <button
          id="neural-core-btn"
          type="button"
          onClick={onOpenGeminiModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
          title="Configure ReMatter Custom Waste-YOLO Neural Core"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Waste-YOLO Neural Core</span>
          <span className="sm:hidden">Neural Core</span>
        </button>

        {/* Knowledge Catalog Trigger */}
        <button
          id="categories-guide-btn"
          type="button"
          onClick={onOpenCategoriesModal}
          className="flex items-center gap-1 p-1.5 rounded hover:bg-zinc-100 text-[#71717A] hover:text-[#18181B] transition-colors"
          title="Categories & Recycling Rules"
          aria-label="View Waste Categories and Recycling Rules"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
