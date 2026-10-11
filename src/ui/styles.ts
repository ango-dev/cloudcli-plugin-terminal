/**
 * Stylesheet injection.
 *
 * xterm's own CSS is bundled in as text rather than pulled from a CDN, so the
 * terminal renders correctly on an air-gapped machine, behind a strict CSP, or
 * simply when the user is on a train.
 */

import xtermCss from '@xterm/xterm/css/xterm.css';

const STYLE_ID = 'wt-css';

const PLUGIN_CSS = `
/* Colours, fonts and corner radius come from the CloudCLI host, which mounts
   the plugin straight into its page. Host variables are HSL triplets; each is
   copied into a --wt-* name (never redefining the host's own names) with the
   host's stock value as the fallback for a host that does not define it. */
.wt-root {
  --wt-bg:var(--background, 0 0% 8%);
  --wt-fg:var(--foreground, 45 12% 93%);
  --wt-card:var(--card, 60 2% 12%);
  --wt-primary:var(--primary, 15 65% 63%);
  --wt-primary-fg:var(--primary-foreground, 40 6% 10%);
  --wt-muted:var(--muted, 0 0% 13%);
  --wt-muted-fg:var(--muted-foreground, 45 4% 56%);
  --wt-accent:var(--accent, 0 1% 17%);
  --wt-border:var(--border, 30 2% 18%);
  --wt-input:var(--input, 30 2% 21%);
  --wt-ring:var(--ring, 15 65% 63%);
  --wt-danger:var(--destructive, 10 72% 67%);
  /* The host has no success/warning tokens; these sit beside its palette. */
  --wt-success:74 34% 58%;
  --wt-warning:40 70% 63%;
  --wt-radius:var(--radius, 0.625rem);
  --wt-font-sans:Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --wt-shadow:0 8px 24px rgba(0,0,0,.45);

  display:flex; flex-direction:column; height:100%; min-height:0;
  background:hsl(var(--wt-bg)); color:hsl(var(--wt-fg));
  font-family:var(--wt-font-sans);
  overflow:hidden; color-scheme:dark;
}
.wt-root.wt-light {
  --wt-bg:var(--background, 60 14% 99%);
  --wt-fg:var(--foreground, 60 3% 8%);
  --wt-card:var(--card, 0 0% 100%);
  --wt-primary:var(--primary, 15 58% 43%);
  --wt-primary-fg:var(--primary-foreground, 0 0% 100%);
  --wt-muted:var(--muted, 60 3% 94%);
  --wt-muted-fg:var(--muted-foreground, 50 3% 41%);
  --wt-accent:var(--accent, 48 12% 92%);
  --wt-border:var(--border, 60 2% 88%);
  --wt-input:var(--input, 60 2% 87%);
  --wt-ring:var(--ring, 15 56% 52%);
  --wt-danger:var(--destructive, 4 59% 44%);
  --wt-success:85 56% 30%;
  --wt-warning:36 100% 34%;
  --wt-shadow:0 8px 24px rgba(30,25,20,.12);
  color-scheme:light;
}
.wt-root :focus-visible { outline:2px solid hsl(var(--wt-ring)); outline-offset:1px; }

.wt-toolbar {
  display:flex; align-items:center; gap:2px;
  padding:4px 6px; background:hsl(var(--wt-bg));
  border-bottom:1px solid hsl(var(--wt-border)); flex-shrink:0; min-height:36px;
}
.wt-tabs { display:flex; align-items:center; flex:1; overflow-x:auto; gap:2px; scrollbar-width:none; min-width:0; }
.wt-tabs::-webkit-scrollbar { display:none; }
.wt-tab {
  display:flex; align-items:center; gap:6px; padding:4px 4px 4px 10px;
  border-radius:calc(var(--wt-radius) - 4px); cursor:pointer; white-space:nowrap;
  background:transparent; font-size:12px; font-weight:500;
  transition:background .15s,color .15s;
  user-select:none; border:1px solid transparent; flex-shrink:0;
  color:hsl(var(--wt-muted-fg)); font-family:inherit; max-width:220px;
}
.wt-tab:hover { color:hsl(var(--wt-fg)); background:hsl(var(--wt-accent)); }
.wt-tab[aria-selected="true"] {
  color:hsl(var(--wt-fg)); background:hsl(var(--wt-card));
  border-color:hsl(var(--wt-border));
}
.wt-tab-label { overflow:hidden; text-overflow:ellipsis; max-width:150px; }
.wt-tab-dot { width:6px; height:6px; border-radius:50%; background:hsl(var(--wt-success)); flex-shrink:0; }
.wt-tab-dot.wt-off { background:hsl(var(--wt-muted-fg)); }
.wt-tab-dot.wt-warn { background:hsl(var(--wt-warning)); }
.wt-tab-dot.wt-err { background:hsl(var(--wt-danger)); }
.wt-tab-close {
  display:flex; align-items:center; justify-content:center;
  width:20px; height:20px; border-radius:calc(var(--wt-radius) - 6px); border:none; background:none;
  color:inherit; cursor:pointer; opacity:.6; padding:0; flex-shrink:0;
}
.wt-tab-close svg { width:11px; height:11px; }
.wt-tab-close:hover { opacity:1; color:hsl(var(--wt-danger)); background:hsl(var(--wt-danger) / .14); }

.wt-btn {
  display:flex; align-items:center; justify-content:center;
  height:28px; min-width:28px; padding:0 6px; border-radius:calc(var(--wt-radius) - 4px);
  border:none; background:transparent; color:hsl(var(--wt-muted-fg)); font-size:12px;
  cursor:pointer; flex-shrink:0; transition:background .15s,color .15s;
}
.wt-btn:hover { background:hsl(var(--wt-accent)); color:hsl(var(--wt-fg)); }
.wt-btn span { display:flex; align-items:center; }
.wt-btn svg { width:14px; height:14px; }
.wt-divider { width:1px; height:18px; background:hsl(var(--wt-border)); margin:0 3px; flex-shrink:0; }

.wt-panes { flex:1; position:relative; overflow:hidden; min-height:0; }
.wt-pane { position:absolute; inset:0; display:flex; flex-direction:column; overflow:hidden; padding:4px; }
.wt-pane[hidden] { display:none; }
.wt-pane .xterm { height:100%; }
.wt-pane .xterm-viewport { overflow-y:auto !important; scrollbar-width:thin; }
.wt-pane .xterm-viewport::-webkit-scrollbar { width:10px; }
.wt-pane .xterm-viewport::-webkit-scrollbar-thumb { background:hsl(var(--wt-muted-fg) / .4); border-radius:5px; }
.xterm .xterm-screen { outline:none !important; }

.wt-overlay {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:10px;
  background:hsl(var(--wt-bg) / .8); backdrop-filter:blur(4px);
  z-index:10; text-align:center; padding:24px;
}
.wt-overlay[hidden] { display:none; }
.wt-overlay-title { font-size:14px; font-weight:600; }
.wt-overlay-sub { font-size:12px; color:hsl(var(--wt-muted-fg)); max-width:34em; }
.wt-overlay-actions { display:flex; gap:8px; margin-top:6px; }
/* While reconnecting the terminal must stay readable and selectable — a
   full-screen cover hides the very output the user wants to look at. */
.wt-overlay.wt-mini {
  inset:auto 0 auto 0; flex-direction:row; flex-wrap:wrap; gap:8px;
  padding:6px 12px; background:hsl(var(--wt-card) / .94); backdrop-filter:none;
  border-bottom:1px solid hsl(var(--wt-border));
  justify-content:center; pointer-events:none;
}
.wt-overlay.wt-mini .wt-overlay-title { font-size:12px; }
.wt-overlay.wt-mini .wt-overlay-sub { font-size:12px; }
.wt-overlay.wt-mini .wt-overlay-actions { margin-top:0; pointer-events:auto; }
.wt-overlay.wt-mini .wt-overlay-btn { padding:3px 10px; font-size:12px; }
.wt-overlay.wt-mini .wt-spinner { width:14px; height:14px; }
.wt-overlay-btn {
  padding:7px 18px; border-radius:calc(var(--wt-radius) - 2px); border:1px solid transparent;
  background:hsl(var(--wt-primary)); color:hsl(var(--wt-primary-fg));
  font-size:13px; font-family:inherit; cursor:pointer; font-weight:500;
}
.wt-overlay-btn.wt-secondary {
  background:hsl(var(--wt-card)); color:hsl(var(--wt-fg)); border-color:hsl(var(--wt-border));
}
.wt-overlay-btn:hover { filter:brightness(1.08); }
.wt-overlay-btn.wt-secondary:hover { filter:none; background:hsl(var(--wt-accent)); }

.wt-settings-wrap { position:relative; }
.wt-popover {
  position:absolute; top:calc(100% + 6px); right:0; z-index:50;
  background:hsl(var(--wt-card)); color:hsl(var(--wt-fg));
  border:1px solid hsl(var(--wt-border));
  border-radius:var(--wt-radius); padding:12px 14px; min-width:210px; max-width:min(92vw,300px);
  box-shadow:var(--wt-shadow);
  display:none; flex-direction:column; gap:10px;
  max-height:min(70vh,420px); overflow-y:auto;
}
.wt-popover.wt-open { display:flex; }
.wt-popover label {
  font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.5px;
  color:hsl(var(--wt-muted-fg));
}
.wt-popover select {
  width:100%; height:28px; padding:0 6px; border-radius:calc(var(--wt-radius) - 4px);
  border:1px solid hsl(var(--wt-input)); background:hsl(var(--wt-bg)); color:inherit;
  font-size:12px; font-family:inherit; cursor:pointer; outline:none;
}
.wt-popover select:focus { border-color:hsl(var(--wt-ring)); box-shadow:0 0 0 2px hsl(var(--wt-ring) / .25); }
/* Scoped under .wt-popover so it outranks the uppercase section-label rule
   above; option labels must not read as section headers. */
.wt-popover .wt-check {
  display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;
  text-transform:none; letter-spacing:0; font-weight:400; color:hsl(var(--wt-fg));
}
.wt-check input { accent-color:hsl(var(--wt-primary)); width:14px; height:14px; cursor:pointer; }
.wt-hint { font-size:11px; color:hsl(var(--wt-muted-fg)); line-height:1.4; }
.wt-fs-row { display:flex; align-items:center; gap:8px; }
.wt-fs-row span { flex:1; text-align:center; font-size:13px; font-weight:500; font-variant-numeric:tabular-nums; }
.wt-fs-row .wt-btn { border:1px solid hsl(var(--wt-input)); }

.wt-search {
  display:none; align-items:center; gap:6px; flex-shrink:0;
  padding:5px 8px; background:hsl(var(--wt-bg)); border-bottom:1px solid hsl(var(--wt-border));
}
.wt-search.wt-open { display:flex; }
.wt-search input {
  flex:1; min-width:0; height:26px; padding:0 8px; border-radius:calc(var(--wt-radius) - 4px);
  border:1px solid hsl(var(--wt-input)); background:hsl(var(--wt-bg)); color:inherit;
  font-size:12px; outline:none; font-family:inherit;
}
.wt-search input::placeholder { color:hsl(var(--wt-muted-fg)); }
.wt-search input:focus { border-color:hsl(var(--wt-ring)); box-shadow:0 0 0 2px hsl(var(--wt-ring) / .25); }
.wt-search-count { font-size:11px; color:hsl(var(--wt-muted-fg)); min-width:5.5em; text-align:right; font-variant-numeric:tabular-nums; }

.wt-keybar {
  display:none; flex-shrink:0; overflow-x:auto; flex-wrap:nowrap;
  gap:4px; padding:5px 6px; background:hsl(var(--wt-bg));
  border-top:1px solid hsl(var(--wt-border)); scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
}
.wt-keybar::-webkit-scrollbar { display:none; }
.wt-key {
  flex-shrink:0; height:34px; min-width:38px; padding:0 10px;
  border-radius:calc(var(--wt-radius) - 2px); border:1px solid hsl(var(--wt-border));
  background:hsl(var(--wt-card)); color:hsl(var(--wt-fg)); font-size:12px;
  font-family:inherit; font-weight:500; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
.wt-key:active, .wt-key.wt-active {
  background:hsl(var(--wt-primary)); color:hsl(var(--wt-primary-fg)); border-color:hsl(var(--wt-primary));
}
.wt-key, .wt-btn, .wt-tab, .wt-tab-close, .wt-new-tab { touch-action:manipulation; }
.wt-key svg { width:16px; height:16px; }

.wt-toast {
  position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
  background:hsl(var(--wt-card)); color:hsl(var(--wt-fg));
  border:1px solid hsl(var(--wt-border)); box-shadow:var(--wt-shadow); font-size:12px;
  padding:7px 14px; border-radius:var(--wt-radius); z-index:60; pointer-events:none;
  opacity:0; transition:opacity .18s;
}
.wt-toast.wt-open { opacity:1; }
.wt-toast.wt-actionable { pointer-events:auto; display:flex; align-items:center; gap:10px; }
.wt-toast-action {
  background:none; border:none; color:hsl(var(--wt-primary)); font:inherit;
  font-weight:600; cursor:pointer; padding:0;
}

.wt-fatal {
  display:flex; align-items:center; justify-content:center; height:100%;
  color:hsl(var(--wt-danger)); padding:24px; text-align:center;
  font-family:var(--wt-font-sans);
}
.wt-fatal-title { font-size:16px; font-weight:600; margin-bottom:8px; }
.wt-fatal-detail { font-size:12px; opacity:.85; }

@media (max-width:768px), (hover:none) and (pointer:coarse) {
  .wt-keybar { display:flex; }
  .wt-toolbar { min-height:34px; padding:3px 4px; }
  .wt-btn { height:30px; min-width:30px; }
  /* Keep the toolbar buttons reachable: without a tighter cap the tab strip
     eats the width and the last controls fall off the edge. */
  .wt-tab { font-size:11px; padding:5px 4px 5px 8px; max-width:130px; }
  .wt-tab-label { max-width:80px; }
  .wt-tab-close { width:24px; height:24px; }
  /* iOS zooms the whole page whenever a focused control is below 16px. */
  .wt-popover select, .wt-search input { font-size:16px; height:34px; }
  /* Soft keyboards shrink the visual viewport without resizing the layout
     viewport, which would otherwise leave the prompt hidden behind the keys. */
  .wt-root { max-height:var(--wt-vvh, 100%); }
}

@keyframes wt-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
.wt-spinner { width:24px; height:24px; border:2px solid hsl(var(--wt-border)); border-top-color:hsl(var(--wt-primary)); border-radius:50%; animation:wt-spin .8s linear infinite; }
@media (prefers-reduced-motion:reduce) {
  .wt-spinner { animation:none; border-top-color:hsl(var(--wt-border)); }
  .wt-tab, .wt-btn, .wt-toast { transition:none; }
}

.wt-new-tab {
  display:flex; align-items:center; justify-content:center;
  width:28px; height:28px; border-radius:calc(var(--wt-radius) - 4px); border:none;
  background:none; color:hsl(var(--wt-muted-fg)); font-size:17px; font-family:inherit; cursor:pointer;
  flex-shrink:0;
}
.wt-new-tab:hover { color:hsl(var(--wt-fg)); background:hsl(var(--wt-accent)); }
`;

/** Injects xterm's stylesheet and the plugin's own, exactly once per page. */
export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `${xtermCss}\n${PLUGIN_CSS}`;
  document.head.appendChild(style);
}
