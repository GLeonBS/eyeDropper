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
  const [colors, setColors] = useState<ColorData>({
    current: null,
    previous: null,
  });
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>(
    "Ainda não tem nenhuma cor selecionada :/"
  );
  const [showColors, setShowColors] = useState<boolean>(false);
  const [isAnimatedBackground, setIsAnimatedBackground] =
    useState<boolean>(false);

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

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-2 md:p-4 ${
        isAnimatedBackground ? "animated-bg" : "black-bg"
      }`}
    >
      <BackgroundSelector
        isAnimatedBackground={isAnimatedBackground}
        onBackgroundChange={handleBackgroundChange}
      />

      <MobileMenu>
        <BackgroundSelectorContent
          isAnimatedBackground={isAnimatedBackground}
          onBackgroundChange={handleBackgroundChange}
        />
      </MobileMenu>

      <main className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20">
        <article className="space-y-4">
          <header className="text-center">
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold  ${
                isAnimatedBackground
                  ? "text-white"
                  : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              }`}
            >
              Clique e Selecione uma Cor
            </h1>
          </header>

          <section className="text-center p-4 md:p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/30">
            <ButtonED
              onClick={handleChooseColor}
              ariaLabel="Abrir seletor de cores"
              variant={isAnimatedBackground ? "white" : "primary"}
            >
              Escolha uma cor
            </ButtonED>
          </section>

          {error ? (
            <section className="mb-4">
              <div
                className={`text-error text-lg md:text-xl text-center rounded-xl p-4 border border-error/30 ${
                  isAnimatedBackground ? "bg-black/70" : "bg-error/10 "
                }`}
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            </section>
          ) : null}

          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-xl">
            <section>
              <h2 className="text-2xl font-semibold text-white text-center p-4">
                {title}
              </h2>
            </section>

            {showColors && (
              <section className="mb-4 md:mb-8" aria-label="Cores selecionadas">
                <div className="flex flex-row justify-center gap-3 md:gap-6">
                  <article className="flex flex-col items-center">
                    <h3 className="text-white text-lg">Cor atual:</h3>
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/30"
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
                  </article>

                  {colors.previous ? (
                    <article className="flex flex-col items-center">
                      <h3 className="text-white text-lg">Cor anterior:</h3>
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-secondary/50 flex items-center justify-center shadow-lg shadow-secondary/30"
                        style={{ backgroundColor: colors.previous }}
                        role="img"
                        aria-label={`Cor anterior: ${colors.previous}`}
                      >
                        <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                          {colors.previous}
                        </span>
                      </div>
                    </article>
                  ) : null}
                </div>
              </section>
            )}
          </div>

          <footer className="text-center pt-3 md:pt-6 border-t border-white/10">
            <ButtonED
              onClick={handleClearColors}
              ariaLabel="Limpar todas as cores selecionadas"
              variant={isAnimatedBackground ? "white" : "primary"}
            >
              Limpar Cores
            </ButtonED>
          </footer>
        </article>
      </main>
    </div>
  );
}

export default App;
