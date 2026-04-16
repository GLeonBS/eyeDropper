import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackgroundSelector,
  BackgroundSelectorContent,
} from "./components/BackgroundSelector/BackgroundSelector";
import { ButtonED } from "./components/Button/ButtonED";
import { ColorCard } from "./components/ColorCard/ColorCard";
import { ColorHistory } from "./components/ColorHistory/ColorHistory";
import { ExportPalette } from "./components/ExportPalette/ExportPalette";
import {
  LanguageSelectorDesktop,
  LanguageSelector,
} from "./components/LanguageSelector/LanguageSelector";
import { MobileMenu } from "./components/MobileMenu/MobileMenu";

const MAX_HISTORY = 10;

interface ColorData {
  current: string | null;
  previous: string | null;
}

function App() {
  const { t } = useTranslation();
  const isExtensionPopup = window.location.protocol === "chrome-extension:";

  const [colors, setColors] = useState<ColorData>({ current: null, previous: null });
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("noColorSelected");
  const [showColors, setShowColors] = useState<boolean>(false);
  const [isAnimatedBackground, setIsAnimatedBackground] = useState<boolean>(false);

  useEffect(() => {
    if (!("EyeDropper" in window)) {
      setError("browserNotSupported");
      setTitle("");
      return;
    }

    const savedCurrent = localStorage.getItem("corSelecionada");
    const savedPrevious = localStorage.getItem("corAnterior");
    const savedBackground = localStorage.getItem("backgroundType");
    const savedHistory = localStorage.getItem("colorHistory");

    if (savedCurrent) {
      setColors({ current: savedCurrent, previous: savedPrevious });
      setTitle("colorsTitle");
      setShowColors(true);
    }
    if (savedBackground) {
      setIsAnimatedBackground(savedBackground === "animated");
    }
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch { /* ignore */ }
    }
  }, []);

  const addToHistory = useCallback((color: string) => {
    setHistory((prev) => {
      const next = [color, ...prev.filter((c) => c !== color)].slice(0, MAX_HISTORY);
      localStorage.setItem("colorHistory", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleChooseColor = async () => {
    try {
      const dropper = new EyeDropper();
      const result = await dropper.open();
      const newColors = { current: result.sRGBHex, previous: colors.current };
      setColors(newColors);
      setTitle("colorsTitle");
      setShowColors(true);
      setError("");
      localStorage.setItem("corSelecionada", result.sRGBHex);
      if (colors.current) localStorage.setItem("corAnterior", colors.current);
      addToHistory(result.sRGBHex);
    } catch {
      setError("colorSelectionError");
    }
  };

  const handleClearColors = () => {
    if (!colors.current && !colors.previous) {
      setTitle("noColorsToDelete");
      return;
    }
    setTitle("colorsCleared");
    setColors({ current: null, previous: null });
    setShowColors(false);
    localStorage.removeItem("corSelecionada");
    localStorage.removeItem("corAnterior");
  };

  const handleBackgroundChange = (isAnimated: boolean) => {
    setIsAnimatedBackground(isAnimated);
    localStorage.setItem("backgroundType", isAnimated ? "animated" : "black");
  };

  const handleColorChange = (source: "current" | "previous", newColor: string) => {
    setColors((prev) => ({ ...prev, [source]: newColor }));
    localStorage.setItem(
      source === "current" ? "corSelecionada" : "corAnterior",
      newColor,
    );
  };

  const handleUseFromHistory = (color: string) => {
    const prev = colors.current;
    setColors({ current: color, previous: prev });
    setTitle("colorsTitle");
    setShowColors(true);
    localStorage.setItem("corSelecionada", color);
    if (prev) localStorage.setItem("corAnterior", prev);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("colorHistory");
  };

  return (
    <div
      className={`flex justify-center p-2 md:p-4 ${
        isExtensionPopup
          ? "w-full min-h-[500px] items-start"
          : "min-h-screen items-center"
      } ${isAnimatedBackground ? "animated-bg" : "black-bg"}`}
    >
      {!isExtensionPopup ? (
        <BackgroundSelector
          isAnimatedBackground={isAnimatedBackground}
          onBackgroundChange={handleBackgroundChange}
        />
      ) : null}

      {!isExtensionPopup ? <LanguageSelectorDesktop /> : null}

      {!isExtensionPopup ? (
        <MobileMenu>
          <BackgroundSelectorContent
            isAnimatedBackground={isAnimatedBackground}
            onBackgroundChange={handleBackgroundChange}
          />
          <LanguageSelector />
        </MobileMenu>
      ) : null}

      <main
        className={`w-full bg-white/10 backdrop-blur-sm shadow-2xl border border-white/20 ${
          isExtensionPopup
            ? "max-w-[360px] rounded-2xl p-3"
            : "max-w-2xl rounded-3xl p-4 md:p-8"
        }`}
      >
        <article className={isExtensionPopup ? "space-y-3" : "space-y-4"}>
          {isExtensionPopup ? (
            <section className="rounded-lg border border-white/15 bg-white/5 p-2 space-y-2">
              <BackgroundSelectorContent
                isAnimatedBackground={isAnimatedBackground}
                onBackgroundChange={handleBackgroundChange}
                compact
              />
              <LanguageSelector compact />
            </section>
          ) : null}

          <header className="text-center">
            <h1
              className={`font-bold ${
                isExtensionPopup ? "text-2xl" : "text-3xl md:text-4xl lg:text-5xl"
              } ${
                isAnimatedBackground
                  ? "text-white"
                  : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              }`}
            >
              {t("clickAndSelect")}
            </h1>
          </header>

          <section
            className={`text-center bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 ${
              isExtensionPopup ? "p-3 rounded-xl" : "p-4 md:p-6 rounded-2xl"
            }`}
          >
            <ButtonED
              onClick={handleChooseColor}
              ariaLabel={t("openColorPicker")}
              variant={isAnimatedBackground ? "white" : "primary"}
              className={
                isExtensionPopup ? "w-full py-2 px-4 text-base md:text-base" : undefined
              }
            >
              {t("chooseColor")}
            </ButtonED>
          </section>

          {error ? (
            <section className={isExtensionPopup ? "mb-2" : "mb-4"}>
              <div
                className={`text-error text-center rounded-xl border border-error/30 ${
                  isExtensionPopup ? "text-base p-3" : "text-lg md:text-xl p-4"
                } ${isAnimatedBackground ? "bg-black/70" : "bg-error/10"}`}
                role="alert"
                aria-live="polite"
              >
                {t(error)}
              </div>
            </section>
          ) : null}

          {!error ? (
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-xl">
              <section>
                <h2
                  className={`font-semibold text-white text-center ${
                    isExtensionPopup ? "text-xl p-3" : "text-2xl p-4"
                  }`}
                >
                  {title ? t(title) : ""}
                </h2>
              </section>

              {showColors && colors.current && (
                <section
                  className={`${isExtensionPopup ? "pb-3" : "mb-4 md:mb-6"}`}
                  aria-label={t("selectedColors")}
                >
                  <div
                    className={`flex flex-row justify-center ${
                      isExtensionPopup ? "gap-4 px-2" : "gap-6 md:gap-10"
                    }`}
                  >
                    <ColorCard
                      color={colors.current}
                      label={t("currentColor")}
                      colorAriaLabel={t("currentColorAria", { color: colors.current })}
                      onColorChange={(c) => handleColorChange("current", c)}
                      onError={setError}
                      compact={isExtensionPopup}
                      borderClass="border-primary/50"
                      shadowClass="shadow-lg shadow-primary/30"
                    />

                    {colors.previous ? (
                      <ColorCard
                        color={colors.previous}
                        label={t("previousColor")}
                        colorAriaLabel={t("previousColorAria", { color: colors.previous })}
                        onColorChange={(c) => handleColorChange("previous", c)}
                        onError={setError}
                        compact={isExtensionPopup}
                        borderClass="border-secondary/50"
                        shadowClass="shadow-lg shadow-secondary/30"
                      />
                    ) : null}
                  </div>

                  <ColorHistory
                    history={history}
                    onUseColor={handleUseFromHistory}
                    onClear={handleClearHistory}
                    compact={isExtensionPopup}
                  />
                </section>
              )}
            </div>
          ) : null}

          <footer
            className={`text-center border-t border-white/10 ${
              isExtensionPopup ? "pt-3 space-y-2" : "pt-3 md:pt-4 space-y-3"
            }`}
          >
            <ButtonED
              onClick={handleClearColors}
              ariaLabel={t("clearAllColors")}
              variant={isAnimatedBackground ? "white" : "primary"}
              className={
                isExtensionPopup ? "w-full py-2 px-4 text-base md:text-base" : ""
              }
            >
              {t("clearColors")}
            </ButtonED>

            <ExportPalette colors={history} />
          </footer>

          {isExtensionPopup ? (
            <div className="text-center pt-1">
              <a
                href="https://gleonbs.github.io/eyeDropper/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/80 underline underline-offset-2 hover:text-white"
              >
                {t("openFullVersion")}
              </a>
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}

export default App;
