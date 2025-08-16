/// <reference types="vite/client" />

interface ColorSelectionResult {
  sRGBHex: string;
}

interface ColorSelectionOptions {
  signal: AbortSignal;
}

declare class EyeDropper {
  constructor(options?: ColorSelectionOptions) {}

  open(): Promise<ColorSelectionResult>;
}
interface Window {
  EyeDropper: EyeDropper;
}
