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
    '--background': '60 14.3% 98.6%',
    '--foreground': '60 2.6% 7.6%',
    '--primary': '15.5 58.2% 43.1%',
    '--muted-foreground': '50 2.9% 40.8%',
    '--destructive': '4.1 59.1% 44.1%',
    '--link': '218.4 61.3% 43.5%',
  },
  dark: {
    '--background': '0 0% 8.2%',
    '--foreground': '45 11.8% 93.3%',
    '--primary': '15.2 64.9% 63.1%',
    '--muted-foreground': '45 3.6% 56.1%',
    '--destructive': '9.9 72.5% 67.3%',
    '--link': '217.1 88.7% 75.7%',
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
  link: Rgb;
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
    link: read('--link', mode),
  };
}

/**
 * ANSI hues tuned for the host's surfaces. Red and blue come from the host's
 * --destructive and --link at build time; the rest are warm-leaning but
 * saturated enough that TUIs (htop meters, git diffs, prompts) read as colour
 * rather than tinted grey.
 * Dark: every colour keeps at least 5.5:1 on the background, with black lifted
 * just off it so black cell backgrounds stay visible. Light: every colour
 * except bright white keeps at least 5:1 on the off-white background, and the
 * bright variants are darker because xterm draws bold text in them.
 */
const ANSI: Record<Mode, Omit<TerminalTheme,
  'background' | 'foreground' | 'cursor' | 'cursorAccent' | 'selectionBackground' | 'red' | 'blue'>> = {
  dark: {
    black: '#3b3a37', green: '#8fcd51', yellow: '#f5bb47',
    magenta: '#e48bc3', cyan: '#49cabd', white: '#d5d2cd',
    brightBlack: '#93908a', brightRed: '#fb8a74', brightGreen: '#a5e160',
    brightYellow: '#ffcf57', brightBlue: '#99c5ff', brightMagenta: '#f391d2',
    brightCyan: '#57dbca', brightWhite: '#efeeeb',
  },
  light: {
    black: '#141413', green: '#3a7411', yellow: '#945900',
    magenta: '#a12b76', cyan: '#067174', white: '#6a6862',
    brightBlack: '#585651', brightRed: '#972820', brightGreen: '#2e600b',
    brightYellow: '#7a4500', brightBlue: '#1f4898', brightMagenta: '#882062',
    brightCyan: '#035d63', brightWhite: '#878278',
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
    blue: hex(palette.link),
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
