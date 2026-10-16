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
  --wt-bg:var(--background, 0 0% 8.2%);
  --wt-fg:var(--foreground, 45 11.8% 93.3%);
  --wt-card:var(--card, 60 1.6% 12.4%);
  --wt-popover:var(--popover, 60 1.6% 12.4%);
  --wt-primary:var(--primary, 15.2 64.9% 63.1%);
  --wt-primary-fg:var(--primary-foreground, 40 5.7% 10.4%);
  --wt-muted:var(--muted, 0 0% 12.9%);
  --wt-muted-fg:var(--muted-foreground, 45 3.6% 56.1%);
  --wt-accent:var(--accent, 0 1.2% 16.7%);
  --wt-border:var(--border, 0 1.2% 15.9%);
  --wt-input:var(--input, 30 1.9% 21.2%);
  --wt-ring:var(--ring, 15.2 64.9% 63.1%);
  --wt-danger:var(--destructive, 9.9 72.5% 67.3%);
  /* The host has no success/warning tokens; these are the terminal's own ANSI
     green and yellow (ui/hostColors.ts), so status dots match the shell. */
  --wt-success:90 55% 56%;
  --wt-warning:40 90% 62%;
  --wt-radius:var(--radius, 0.625rem);
  --wt-font-sans:Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --wt-shadow:0 8px 24px rgba(0,0,0,.45);
  --wt-shadow-lg:0 20px 25px -5px rgba(0,0,0,.5), 0 8px 10px -6px rgba(0,0,0,.5);

  display:flex; flex-direction:column; height:100%; min-height:0;
  background:hsl(var(--wt-bg)); color:hsl(var(--wt-fg));
  font-family:var(--wt-font-sans);
  overflow:hidden; color-scheme:dark;
}
.wt-root.wt-light {
  --wt-bg:var(--background, 60 14.3% 98.6%);
  --wt-fg:var(--foreground, 60 2.6% 7.6%);
  --wt-card:var(--card, 0 0% 100%);
  --wt-popover:var(--popover, 0 0% 100%);
  --wt-primary:var(--primary, 15.5 58.2% 43.1%);
  --wt-primary-fg:var(--primary-foreground, 0 0% 100%);
  --wt-muted:var(--muted, 60 3.2% 93.9%);
  --wt-muted-fg:var(--muted-foreground, 50 2.9% 40.8%);
  --wt-accent:var(--accent, 48 12.2% 92%);
  --wt-border:var(--border, 60 1.7% 88.4%);
  --wt-input:var(--input, 60 1.5% 87.3%);
  --wt-ring:var(--ring, 15.1 55.6% 52.4%);
  --wt-danger:var(--destructive, 4.1 59.1% 44.1%);
  --wt-success:95 75% 26%;
  --wt-warning:36 100% 29%;
  --wt-shadow:0 8px 24px rgba(30,25,20,.12);
  --wt-shadow-lg:0 20px 25px -5px rgba(30,25,20,.1), 0 8px 10px -6px rgba(30,25,20,.1);
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
/* Overflow cues as in the host's header: a fade at each edge with more tabs
   past it, and (wider screens) an arrow that takes the strip to that end. */
.wt-tabs-wrap { position:relative; display:flex; flex:1; min-width:0; }
.wt-tabs { overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch; }
.wt-tabs-fade {
  position:absolute; top:0; bottom:0; width:48px; z-index:1; pointer-events:none; display:none;
}
.wt-tabs-fade.wt-start { left:0; background:linear-gradient(to right, hsl(var(--wt-bg)), hsl(var(--wt-bg) / .9) 50%, hsl(var(--wt-bg) / 0)); }
.wt-tabs-fade.wt-end { right:0; background:linear-gradient(to left, hsl(var(--wt-bg)), hsl(var(--wt-bg) / .9) 50%, hsl(var(--wt-bg) / 0)); }
.wt-tabs-wrap.wt-can-back .wt-tabs-fade.wt-start, .wt-tabs-wrap.wt-can-forward .wt-tabs-fade.wt-end { display:block; }
.wt-tabs-arrow {
  position:absolute; top:50%; transform:translateY(-50%); z-index:2; display:none;
  align-items:center; justify-content:center; width:28px; height:28px; padding:0;
  border-radius:calc(var(--wt-radius) - 2px); border:1px solid hsl(var(--wt-border) / .7);
  background:hsl(var(--wt-bg) / .95); color:hsl(var(--wt-muted-fg));
  box-shadow:0 1px 2px rgba(0,0,0,.05); cursor:pointer; transition:background .15s,color .15s;
}
.wt-tabs-arrow span { display:flex; }
.wt-tabs-arrow svg { width:16px; height:16px; }
.wt-tabs-arrow.wt-start { left:4px; }
.wt-tabs-arrow.wt-end { right:4px; }
.wt-tabs-arrow:focus-visible { outline:none; box-shadow:0 0 0 2px hsl(var(--wt-primary) / .6); }
@media (min-width:640px) {
  .wt-tabs-wrap.wt-can-back .wt-tabs-arrow.wt-start, .wt-tabs-wrap.wt-can-forward .wt-tabs-arrow.wt-end { display:flex; }
}
.wt-tab {
  display:flex; align-items:center; gap:6px; height:28px; padding:0 4px 0 10px;
  border-radius:calc(var(--wt-radius) - 2px); cursor:pointer; white-space:nowrap;
  background:transparent; font-size:13px; font-weight:400;
  transition:background .15s,color .15s;
  user-select:none; border:none; flex-shrink:0;
  color:hsl(var(--wt-muted-fg)); font-family:inherit; max-width:220px;
}
/* Flat tabs as in the host's workspace header: the active one is a filled chip. */
.wt-tab[aria-selected="true"] { color:hsl(var(--wt-fg)); background:hsl(var(--wt-accent)); font-weight:500; }
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

.wt-btn {
  display:flex; align-items:center; justify-content:center;
  height:28px; min-width:28px; padding:0 6px; border-radius:calc(var(--wt-radius) - 2px);
  border:none; background:transparent; color:hsl(var(--wt-muted-fg)); font-size:12px;
  cursor:pointer; flex-shrink:0; transition:background .15s,color .15s;
}
.wt-btn span { display:flex; align-items:center; }
.wt-btn svg { width:14px; height:14px; }
.wt-divider { width:1px; height:18px; background:hsl(var(--wt-border)); margin:0 3px; flex-shrink:0; }

.wt-panes { flex:1; position:relative; overflow:hidden; min-height:0; }
.wt-pane { position:absolute; inset:0; display:flex; flex-direction:column; overflow:hidden; padding:4px; }
.wt-pane[hidden] { display:none; }
.wt-pane .xterm { height:100%; }
.wt-pane .xterm-viewport { overflow-y:auto !important; }
.xterm .xterm-screen { outline:none !important; }
/* xterm's own stylesheet draws the input-method composition (CJK input,
   dead-key accents) as white on black; put it on the host's surface, with the
   usual underline marking text that is still being composed. */
.wt-root .xterm .composition-view {
  background:hsl(var(--wt-card)); color:hsl(var(--wt-fg));
  box-shadow:inset 0 -2px 0 hsl(var(--wt-primary));
}

.wt-overlay {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:10px;
  background:hsl(var(--wt-bg) / .9); backdrop-filter:blur(4px);
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
  padding:6px 12px; background:hsl(var(--wt-bg) / .92); backdrop-filter:none;
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

.wt-settings-wrap { position:relative; }
.wt-popover {
  position:absolute; top:calc(100% + 6px); right:0; z-index:50;
  background:hsl(var(--wt-popover)); color:hsl(var(--wt-fg));
  border:1px solid hsl(var(--wt-border));
  border-radius:calc(var(--wt-radius) + 2px); padding:10px 12px 12px; min-width:210px; max-width:min(92vw,300px);
  box-shadow:var(--wt-shadow-lg);
  display:none; flex-direction:column; gap:10px;
  max-height:min(70vh,420px); overflow-y:auto;
}
.wt-popover.wt-open { display:flex; }
/* Section labels as in the host's menus: small, sentence case, muted. */
.wt-popover label {
  font-size:11px; font-weight:500; color:hsl(var(--wt-muted-fg)); margin-bottom:-4px;
}
.wt-popover select {
  width:100%; height:28px; padding:0 6px; border-radius:calc(var(--wt-radius) - 4px);
  border:1px solid hsl(var(--wt-input)); background:hsl(var(--wt-bg)); color:inherit;
  font-size:12px; font-family:inherit; cursor:pointer; outline:none;
}
.wt-popover select:focus { border-color:hsl(var(--wt-ring)); box-shadow:0 0 0 2px hsl(var(--wt-ring) / .25); }
/* Scoped under .wt-popover so it outranks the section-label rule above;
   option labels must not read as section headers. */
.wt-popover .wt-check {
  display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;
  font-weight:400; color:hsl(var(--wt-fg)); margin-bottom:0;
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
.wt-key, .wt-btn, .wt-tab, .wt-tab-close, .wt-new-tab, .wt-tabs-arrow { touch-action:manipulation; }
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
  width:28px; height:28px; border-radius:calc(var(--wt-radius) - 2px); border:none;
  background:none; color:hsl(var(--wt-muted-fg)); font-size:17px; font-family:inherit; cursor:pointer;
  flex-shrink:0;
}

/* Scrollbars as in the host (and Claude Code): the browser's standard bar with
   a gray thumb on a transparent track, on desktop only; touch screens keep
   their native overlay indicator. */
@media (hover:hover) and (pointer:fine) {
  .wt-root { scrollbar-color:#5c5c5a transparent; }
  .wt-root.wt-light { scrollbar-color:#b5b3ad transparent; }
}

/* Hover styles only where there is a real pointer, as the host does: on an
   iPad the first tap on a control with a hover style lands as a hover. */
@media (hover:hover) {
  .wt-tab:not([aria-selected="true"]):hover { color:hsl(var(--wt-fg)); background:hsl(var(--wt-accent) / .6); }
  .wt-tab-close:hover { opacity:1; color:hsl(var(--wt-danger)); background:hsl(var(--wt-danger) / .14); }
  .wt-btn:hover, .wt-new-tab:hover, .wt-tabs-arrow:hover { color:hsl(var(--wt-fg)); background:hsl(var(--wt-accent)); }
  .wt-overlay-btn:hover { filter:brightness(1.08); }
  .wt-overlay-btn.wt-secondary:hover { filter:none; background:hsl(var(--wt-accent)); }
}
`;

/** Injects xterm's stylesheet and the plugin's own, exactly once per page. */
export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `${xtermCss}\n${PLUGIN_CSS}`;
  document.head.appendChild(style);
}
