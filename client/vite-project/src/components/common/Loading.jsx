/**
 * LoadingSpinner — Smart reusable loading component
 *
 * Variants:
 *   spinner   — Vòng tròn quay (default)
 *   dots      — 3 chấm nảy
 *   wave      — 5 thanh sóng
 *   skeleton  — Skeleton card/row placeholder
 *   overlay   — Full-panel loading overlay
 *   inline    — Badge nhỏ inline
 *
 * Usage examples:
 *   <Loading />
 *   <Loading variant="dots" />
 *   <Loading variant="spinner" size="lg" color="info" text="Đang tải..." />
 *   <Loading variant="skeleton" skeletonType="table" rows={5} />
 *   <Loading variant="overlay" text="Đang xử lý..." />
 *   <Loading variant="inline" text="Đang lưu..." />
 */

import React from "react";

const styles = `
  @keyframes _spin  { to { transform: rotate(360deg); } }
  @keyframes _pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.85);} }
  @keyframes _bounce{ 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
  @keyframes _wave  { 0%,60%,100%{transform:scaleY(.4);}30%{transform:scaleY(1);} }
  @keyframes _shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
  @keyframes _fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

  .ld-ring {
    border-radius: 50%;
    border-style: solid;
    animation: _spin .7s linear infinite;
  }
  .ld-ring--sm  { width:18px; height:18px; border-width:2px; }
  .ld-ring--md  { width:32px; height:32px; border-width:3px; }
  .ld-ring--lg  { width:52px; height:52px; border-width:4px; }
  .ld-ring--success { border-color:#E1F5EE; border-top-color:#1D9E75; }
  .ld-ring--info    { border-color:#E6F1FB; border-top-color:#378ADD; }
  .ld-ring--danger  { border-color:#FAECE7; border-top-color:#D85A30; }
  .ld-ring--warning { border-color:#FAEEDA; border-top-color:#BA7517; }
  .ld-ring--default { border-color:#D3D1C7; border-top-color:#5F5E5A; }

  .ld-dots { display:flex; gap:6px; align-items:center; }
  .ld-dots span {
    width:9px; height:9px; border-radius:50%; background:#1D9E75;
    animation: _bounce 1s ease-in-out infinite;
  }
  .ld-dots span:nth-child(2){ animation-delay:.15s; opacity:.75; }
  .ld-dots span:nth-child(3){ animation-delay:.3s;  opacity:.5; }

  .ld-wave { display:flex; gap:4px; align-items:flex-end; }
  .ld-wave span {
    width:5px; border-radius:3px; background:#378ADD;
    animation: _wave 1.1s ease-in-out infinite;
  }
  .ld-wave span:nth-child(1){ height:24px; }
  .ld-wave span:nth-child(2){ height:24px; animation-delay:.1s;  opacity:.85; }
  .ld-wave span:nth-child(3){ height:24px; animation-delay:.2s;  opacity:.7; }
  .ld-wave span:nth-child(4){ height:24px; animation-delay:.3s;  opacity:.85; }
  .ld-wave span:nth-child(5){ height:24px; animation-delay:.4s;  }

  .ld-skeleton-block {
    border-radius:6px;
    background: linear-gradient(90deg,
      #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 600px 100%;
    animation: _shimmer 1.5s infinite;
  }

  .ld-overlay {
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:14px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(2px);
    border-radius: inherit;
    animation: _fadein .25s ease;
    z-index: 10;
  }
  .ld-overlay-text {
    font-size:14px;
    color:#5F5E5A;
    font-weight:500;
  }

  .ld-panel {
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:14px; padding:48px 24px;
  }
  .ld-panel-text { font-size:14px; color:#888780; }

  .ld-inline {
    display:inline-flex; align-items:center; gap:7px;
    font-size:13px; font-weight:500;
    padding:5px 12px; border-radius:20px;
    background:#F1EFE8; color:#444441;
    border:1px solid #D3D1C7;
  }

  .ld-text-below {
    margin-top:10px;
    font-size:13px;
    color:#888780;
    text-align:center;
    animation: _fadein .4s ease;
  }

  .ld-sk-row { display:flex; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f0; }
  .ld-sk-circle { border-radius:50%; flex-shrink:0; }
  .ld-sk-lines { flex:1; display:flex; flex-direction:column; gap:6px; }
`;

let _injected = false;
function injectStyles() {
  if (_injected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = styles;
  document.head.appendChild(tag);
  _injected = true;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SpinnerRing({ size = "md", color = "success" }) {
  injectStyles();
  return (
    <div
      className={`ld-ring ld-ring--${size} ld-ring--${color}`}
      role="status"
      aria-label="Đang tải"
    />
  );
}

function DotsLoader({ color = "#1D9E75" }) {
  injectStyles();
  return (
    <div className="ld-dots" role="status" aria-label="Đang tải">
      <span style={{ background: color }} />
      <span style={{ background: color }} />
      <span style={{ background: color }} />
    </div>
  );
}

function WaveLoader({ color = "#378ADD" }) {
  injectStyles();
  return (
    <div className="ld-wave" role="status" aria-label="Đang tải">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ background: color }} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  injectStyles();
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div
          className="ld-skeleton-block ld-sk-circle"
          style={{ width: 40, height: 40 }}
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}
        >
          <div className="ld-skeleton-block" style={{ height: 11 }} />
          <div
            className="ld-skeleton-block"
            style={{ height: 10, width: "60%" }}
          />
        </div>
      </div>
      <div
        className="ld-skeleton-block"
        style={{ height: 10, marginTop: 14 }}
      />
      <div
        className="ld-skeleton-block"
        style={{ height: 10, marginTop: 7, width: "70%" }}
      />
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 4 }) {
  injectStyles();
  const widths = ["10%", "35%", "25%", "15%", "15%"];
  return (
    <div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="ld-sk-row">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="ld-skeleton-block"
              style={{
                height: 11,
                flex: `0 0 ${widths[c] || "20%"}`,
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonRow({ cols = 4 }) {
  return <SkeletonTable rows={1} cols={cols} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * @param {object}  props
 * @param {'spinner'|'dots'|'wave'|'skeleton'|'overlay'|'inline'|'panel'} props.variant
 * @param {'sm'|'md'|'lg'}  props.size        – spinner size
 * @param {'success'|'info'|'danger'|'warning'|'default'} props.color – spinner color
 * @param {string}  props.text               – label text
 * @param {'card'|'table'|'row'} props.skeletonType  – skeleton sub-type
 * @param {number}  props.rows               – skeleton table rows
 * @param {number}  props.cols               – skeleton table cols
 */
function Loading({
  variant = "spinner",
  size = "md",
  color = "success",
  text = "",
  skeletonType = "table",
  rows = 5,
  cols = 4,
}) {
  injectStyles();

  // ── inline badge ─────────────────────────────────────────────────────────
  if (variant === "inline") {
    return (
      <span className="ld-inline">
        <DotsLoader color="#888780" />
        {text || "Đang xử lý..."}
      </span>
    );
  }

  // ── absolute overlay (parent must have position:relative) ─────────────────
  if (variant === "overlay") {
    return (
      <div className="ld-overlay">
        <SpinnerRing size={size === "sm" ? "md" : "lg"} color={color} />
        {text && <span className="ld-overlay-text">{text}</span>}
      </div>
    );
  }

  // ── centered panel (no absolute, fills flex/grid cell) ────────────────────
  if (variant === "panel") {
    return (
      <div className="ld-panel">
        <SpinnerRing size="lg" color={color} />
        {text && <span className="ld-panel-text">{text}</span>}
      </div>
    );
  }

  // ── skeleton ──────────────────────────────────────────────────────────────
  if (variant === "skeleton") {
    if (skeletonType === "card") return <SkeletonCard />;
    if (skeletonType === "row") return <SkeletonRow cols={cols} />;
    return <SkeletonTable rows={rows} cols={cols} />;
  }

  // ── dots / wave ───────────────────────────────────────────────────────────
  if (variant === "dots") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DotsLoader />
        {text && <p className="ld-text-below">{text}</p>}
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WaveLoader />
        {text && <p className="ld-text-below">{text}</p>}
      </div>
    );
  }

  // ── spinner (default) ─────────────────────────────────────────────────────
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SpinnerRing size={size} color={color} />
      {text && <p className="ld-text-below">{text}</p>}
    </div>
  );
}

export default Loading;

// named exports để import riêng lẻ nếu cần
export { SpinnerRing, DotsLoader, WaveLoader, SkeletonCard, SkeletonTable };
