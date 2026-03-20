import { useEffect, useState } from "react";
import {
  BackgroundSelector,
  BackgroundSelectorContent,
} from "./components/BackgroundSelector/BackgroundSelector";
import { ButtonED } from "./components/Button/ButtonED";
import { MobileMenu } from "./components/MobileMenu/MobileMenu";

interface ColorData {
  current: string | null;
  previous: string | null;
}

function App() {
  const isExtensionPopup = window.location.protocol === "chrome-extension:";

  const [colors, setColors] = useState<ColorData>({
    current: null,
    previous: null,
  });
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>(
    "Ainda não tem nenhuma cor selecionada :/",
  );
  const [showColors, setShowColors] = useState<boolean>(false);
  const [isAnimatedBackground, setIsAnimatedBackground] =
    useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<"current" | "previous" | null>(null);

  useEffect(() => {
    if (!("EyeDropper" in window)) {
      setError("Error: Seu navegador ainda não suporta a aplicação :/");
      setTitle("");
      return;
    }

    const savedCurrent = localStorage.getItem("corSelecionada");
    const savedPrevious = localStorage.getItem("corAnterior");
    const savedBackground = localStorage.getItem("backgroundType");

    if (savedCurrent) {
      setColors({
        current: savedCurrent,
        previous: savedPrevious,
      });
      setTitle("Cores:");
      setShowColors(true);
    }

    if (savedBackground) {
      setIsAnimatedBackground(savedBackground === "animated");
    }
  }, []);

  const handleChooseColor = async () => {
    try {
      const dropper = new EyeDropper();
      const result = await dropper.open();

      const newColors = {
        current: result.sRGBHex,
        previous: colors.current,
      };

      setColors(newColors);
      setTitle("Cores:");
      setShowColors(true);
      setError("");

      localStorage.setItem("corSelecionada", result.sRGBHex);
      if (colors.current) {
        localStorage.setItem("corAnterior", colors.current);
      }
    } catch {
      setError("Erro ao selecionar cor");
    }
  };

  const handleClearColors = () => {
    if (!colors.current && !colors.previous) {
      setTitle("Você não tem cores para apagar ヾ( ･`⌓´･)ﾉﾞ");
      return;
    }

    setTitle("Você apagou as cores :/");
    setColors({ current: null, previous: null });
    setShowColors(false);

    localStorage.removeItem("corSelecionada");
    localStorage.removeItem("corAnterior");
  };

  const handleBackgroundChange = (isAnimated: boolean) => {
    setIsAnimatedBackground(isAnimated);
    localStorage.setItem("backgroundType", isAnimated ? "animated" : "black");
  };

  const handleCopyColor = async (
    color: string | null,
    source: "current" | "previous"
  ) => {
    if (!color) {
      return;
    }

    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(source);
      window.setTimeout(() => {
        setCopiedColor((activeSource) =>
          activeSource === source ? null : activeSource
        );
      }, 1500);
    } catch {
      setError("Nao foi possivel copiar a cor");
    }
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

      {!isExtensionPopup ? (
        <MobileMenu>
          <BackgroundSelectorContent
            isAnimatedBackground={isAnimatedBackground}
            onBackgroundChange={handleBackgroundChange}
          />
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
            <section className="rounded-lg border border-white/15 bg-white/5 p-2">
              <BackgroundSelectorContent
                isAnimatedBackground={isAnimatedBackground}
                onBackgroundChange={handleBackgroundChange}
                compact
              />
            </section>
          ) : null}

          <header className="text-center">
            <h1
              className={`font-bold ${
                isExtensionPopup
                  ? "text-2xl"
                  : "text-3xl md:text-4xl lg:text-5xl"
              } ${
                isAnimatedBackground
                  ? "text-white"
                  : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              }`}
            >
              Clique e Selecione uma Cor
            </h1>
          </header>

          <section
            className={`text-center bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 ${
              isExtensionPopup ? "p-3 rounded-xl" : "p-4 md:p-6 rounded-2xl"
            }`}
          >
            <ButtonED
              onClick={handleChooseColor}
              ariaLabel="Abrir seletor de cores"
              variant={isAnimatedBackground ? "white" : "primary"}
              className={
                isExtensionPopup
                  ? "w-full py-2 px-4 text-base md:text-base"
                  : undefined
              }
            >
              Escolha uma cor
            </ButtonED>
          </section>

          {error ? (
            <section className={isExtensionPopup ? "mb-2" : "mb-4"}>
              <div
                className={`text-error text-center rounded-xl border border-error/30 ${
                  isExtensionPopup ? "text-base p-3" : "text-lg md:text-xl p-4"
                } ${isAnimatedBackground ? "bg-black/70" : "bg-error/10 "}`}
                role="alert"
                aria-live="polite"
              >
                {error}
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
                  {title}
                </h2>
              </section>

              {showColors && (
                <section
                  className="mb-4 md:mb-8"
                  aria-label="Cores selecionadas"
                >
                  <div
                    className={`flex flex-row justify-center ${
                      isExtensionPopup ? "gap-3 pb-3" : "gap-3 md:gap-6"
                    }`}
                  >
                    <article className="flex flex-col items-center">
                      <h3
                        className={
                          isExtensionPopup
                            ? "text-white text-base"
                            : "text-white text-lg"
                        }
                      >
                        Cor atual:
                      </h3>
                      <div
                        className={`rounded-lg border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/30 ${
                          isExtensionPopup
                            ? "w-[4.5rem] h-[4.5rem]"
                            : "w-20 h-20 md:w-24 md:h-24"
                        }`}
                        style={{
                          backgroundColor: colors.current || "transparent",
                        }}
                        role="img"
                        aria-label={`Cor atual: ${colors.current}`}
                      >
                        <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                          {colors.current}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyColor(colors.current, "current")}
                        className={`mt-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors ${
                          isExtensionPopup ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"
                        }`}
                        aria-label="Copiar cor atual"
                      >
                        {copiedColor === "current" ? "Copiado!" : "Copiar"}
                      </button>
                    </article>

                    {colors.previous ? (
                      <article className="flex flex-col items-center">
                        <h3
                          className={
                            isExtensionPopup
                              ? "text-white text-base"
                              : "text-white text-lg"
                          }
                        >
                          Cor anterior:
                        </h3>
                        <div
                          className={`rounded-lg border-2 border-secondary/50 flex items-center justify-center shadow-lg shadow-secondary/30 ${
                            isExtensionPopup
                              ? "w-[4.5rem] h-[4.5rem]"
                              : "w-20 h-20 md:w-24 md:h-24"
                          }`}
                          style={{ backgroundColor: colors.previous }}
                          role="img"
                          aria-label={`Cor anterior: ${colors.previous}`}
                        >
                          <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                            {colors.previous}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyColor(colors.previous, "previous")
                          }
                          className={`mt-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors ${
                            isExtensionPopup
                              ? "px-2 py-1 text-xs"
                              : "px-3 py-1 text-sm"
                          }`}
                          aria-label="Copiar cor anterior"
                        >
                          {copiedColor === "previous" ? "Copiado!" : "Copiar"}
                        </button>
                      </article>
                    ) : null}
                  </div>
                </section>
              )}
            </div>
          ) : null}

          <footer
            className={`text-center border-t border-white/10 ${
              isExtensionPopup ? "pt-3" : "pt-3 md:pt-6"
            }`}
          >
            <ButtonED
              onClick={handleClearColors}
              ariaLabel="Limpar todas as cores selecionadas"
              variant={isAnimatedBackground ? "white" : "primary"}
              className={
                isExtensionPopup
                  ? "w-full py-2 px-4 text-base md:text-base"
                  : ""
              }
            >
              Limpar Cores
            </ButtonED>
          </footer>

          {isExtensionPopup ? (
            <div className="text-center pt-1">
              <a
                href="https://gleonbs.github.io/eyeDropper/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/80 underline underline-offset-2 hover:text-white"
              >
                Abrir versao completa
              </a>
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}

export default App;
