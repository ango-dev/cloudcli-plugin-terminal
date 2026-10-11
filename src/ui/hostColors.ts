/**
 * Colours read from the CloudCLI host's CSS variables.
 *
 * The plugin is mounted straight into the host page, so the host's theme
 * variables (HSL triplets such as `--background: 0 0% 8%`) are on
 * `document.documentElement`. xterm.js and the search addon need concrete hex
 * values rather than CSS, so this reads them, converts them, and falls back to
 * the host's stock palette when a variable is missing.
 */

import type { TerminalTheme } from './themes.js';

type Mode = 'dark' | 'light';

/** The host's own values, used whenever it does not define a variable. */
const FALLBACKS: Record<Mode, Record<string, string>> = {
  light: {
    '--background': '60 14% 99%',
    '--foreground': '60 3% 8%',
    '--primary': '15 58% 43%',
    '--muted-foreground': '50 3% 41%',
    '--destructive': '4 59% 44%',
  },
  dark: {
    '--background': '0 0% 8%',
    '--foreground': '45 12% 93%',
    '--primary': '15 65% 63%',
    '--muted-foreground': '45 4% 56%',
    '--destructive': '10 72% 67%',
  },
};

type Rgb = [number, number, number];

/** Parses "H S% L%" (commas, `deg` and a trailing alpha are tolerated). */
function parseHsl(value: string): Rgb | null {
  const parts = value.replace(/deg|%|,|\//g, ' ').trim().split(/\s+/).map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some((part) => !Number.isFinite(part))) return null;
  const h = (((parts[0] % 360) + 360) % 360) / 360;
  const s = Math.min(100, Math.max(0, parts[1])) / 100;
  const l = Math.min(100, Math.max(0, parts[2])) / 100;
  if (s === 0) return [l, l, l].map((c) => Math.round(c * 255)) as Rgb;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number): number => {
    const k = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (k < 1 / 6) return p + (q - p) * 6 * k;
    if (k < 1 / 2) return q;
    if (k < 2 / 3) return p + (q - p) * (2 / 3 - k) * 6;
    return p;
  };
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)].map((c) => Math.round(c * 255)) as Rgb;
}

const hex = (rgb: Rgb): string => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

/** `amount` of `top` laid over `base`. */
const mix = (top: Rgb, base: Rgb, amount: number): Rgb =>
  top.map((c, i) => Math.round(c * amount + base[i] * (1 - amount))) as Rgb;

const luminance = (rgb: Rgb): number => {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export interface HostPalette {
  /** Judged from the background actually read, not just the host's flag. */
  dark: boolean;
  background: Rgb;
  foreground: Rgb;
  primary: Rgb;
  mutedForeground: Rgb;
  destructive: Rgb;
}

/**
 * Reads the host palette. Call it again whenever the host may have switched
 * mode: the values come from whatever `<html>` currently has applied.
 */
export function readHostPalette(hostTheme: Mode): HostPalette {
  const computed = getComputedStyle(document.documentElement);
  const read = (name: string, mode: Mode): Rgb =>
    parseHsl(computed.getPropertyValue(name)) ?? (parseHsl(FALLBACKS[mode][name]) as Rgb);

  const background = read('--background', hostTheme);
  // If the host defines the background but not everything else, take the
  // remaining fallbacks from the mode that background actually belongs to.
  const mode: Mode = luminance(background) < 0.2 ? 'dark' : 'light';
  return {
    dark: mode === 'dark',
    background,
    foreground: read('--foreground', mode),
    primary: read('--primary', mode),
    mutedForeground: read('--muted-foreground', mode),
    destructive: read('--destructive', mode),
  };
}

/**
 * ANSI hues matching CloudCLI's own Shell, so the plugin terminal and the
 * built-in one look alike. Red comes from --destructive at build time.
 * Dark: softened warm variants of the classic set, with black lifted just off
 * the background so black cell backgrounds stay visible. Light: every colour except
 * the two whites keeps at least 4.5:1 on the off-white background, and the
 * bright variants are darker because xterm draws bold text in them.
 */
const ANSI: Record<Mode, Omit<TerminalTheme,
  'background' | 'foreground' | 'cursor' | 'cursorAccent' | 'selectionBackground' | 'red'>> = {
  dark: {
    black: '#3b3a37', green: '#a7b86f', yellow: '#e3b660',
    blue: '#86abcc', magenta: '#cc92b5', cyan: '#86bcb1', white: '#cfcecb',
    brightBlack: '#93918b', brightRed: '#f09a87', brightGreen: '#bfcd8a',
    brightYellow: '#efca80', brightBlue: '#a3c0db', brightMagenta: '#dcaccb',
    brightCyan: '#a2cec5', brightWhite: '#f0efec',
  },
  light: {
    black: '#141413', green: '#4a6a1e', yellow: '#875800',
    blue: '#2f5f8a', magenta: '#8e3f6e', cyan: '#1d6b66', white: '#6b6a65',
    brightBlack: '#55534e', brightRed: '#952a22', brightGreen: '#3d5817',
    brightYellow: '#714a00', brightBlue: '#244d73', brightMagenta: '#76325b',
    brightCyan: '#175955', brightWhite: '#8a857b',
  },
};

/** The xterm theme that follows the host. */
export function hostTerminalTheme(palette: HostPalette): TerminalTheme {
  const ansi = ANSI[palette.dark ? 'dark' : 'light'];
  return {
    ...ansi,
    background: hex(palette.background),
    foreground: hex(palette.foreground),
    cursor: hex(palette.primary),
    cursorAccent: hex(palette.background),
    // Pre-blended (xterm would otherwise apply its own 30% alpha to an opaque
    // colour) and paired with an explicit foreground so selected text stays legible.
    selectionBackground: hex(mix(palette.primary, palette.background, palette.dark ? 0.32 : 0.26)),
    selectionForeground: hex(palette.foreground),
    selectionInactiveBackground: hex(mix(palette.mutedForeground, palette.background, 0.25)),
    red: hex(palette.destructive),
    brightWhite: palette.dark ? hex(palette.foreground) : ansi.brightWhite,
    black: palette.dark ? ansi.black : hex(palette.foreground),
  };
}

/** Search highlight colours; the addon only accepts #RRGGBB. */
export function hostSearchDecorations(palette: HostPalette): {
  matchBackground: string; matchBorder: string; matchOverviewRuler: string;
  activeMatchBackground: string; activeMatchBorder: string; activeMatchColorOverviewRuler: string;
} {
  return {
    matchBackground: hex(mix(palette.primary, palette.background, 0.22)),
    matchBorder: hex(mix(palette.primary, palette.background, 0.6)),
    matchOverviewRuler: hex(palette.primary),
    activeMatchBackground: hex(mix(palette.primary, palette.background, 0.5)),
    activeMatchBorder: hex(palette.foreground),
    activeMatchColorOverviewRuler: hex(palette.foreground),
  };
}
