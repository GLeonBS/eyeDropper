import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isExtensionBuild = mode === "extension";

  return {
    plugins: [react(), tailwindcss()],
    base: isExtensionBuild ? "./" : "/eyeDropper/",
    build: isExtensionBuild
      ? {
          outDir: "dist-extension",
          emptyOutDir: true,
        }
      : undefined,
  };
});
