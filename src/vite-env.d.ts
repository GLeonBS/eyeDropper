/// <reference types="vite/client" />

// Declarações para a API EyeDropper
declare global {
  interface Window {
    EyeDropper: typeof EyeDropper;
  }
}

interface EyeDropperResult {
  sRGBHex: string;
}

declare class EyeDropper {
  constructor();
  open(): Promise<EyeDropperResult>;
}
