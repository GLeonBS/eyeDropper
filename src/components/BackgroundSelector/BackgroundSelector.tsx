import type { FC } from "react";

interface IProps {
    isAnimatedBackground: boolean;
    onBackgroundChange: (isAnimated: boolean) => void;
    compact?: boolean;
};

export const BackgroundSelector: FC<IProps> = ({ isAnimatedBackground, onBackgroundChange }) => {
    return (
        <div className="hidden md:block fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="text-white text-sm font-semibold mb-3">Fundo:</h3>
            
            <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="radio"
                        name="background"
                        checked={isAnimatedBackground}
                        onChange={() => onBackgroundChange(true)}
                        className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 border-white/30 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                        </div>
                        <span className="text-white text-sm">Animado</span>
                    </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="radio"
                        name="background"
                        checked={!isAnimatedBackground}
                        onChange={() => onBackgroundChange(false)}
                        className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 border-white/30 bg-black"></div>
                        <span className="text-white text-sm">Preto</span>
                    </div>
                </label>
            </div>
        </div>
    );
}


export const BackgroundSelectorContent: FC<IProps> = ({ isAnimatedBackground, onBackgroundChange, compact = false }) => {
    if (compact) {
        return (
            <div className="flex items-center justify-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="background-mobile"
                        checked={isAnimatedBackground}
                        onChange={() => onBackgroundChange(true)}
                        className="w-4 h-4 text-primary"
                        aria-label="Fundo animado"
                    />
                    <div className="w-5 h-5 rounded border border-white/40 overflow-hidden" aria-hidden="true">
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                    </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="background-mobile"
                        checked={!isAnimatedBackground}
                        onChange={() => onBackgroundChange(false)}
                        className="w-4 h-4 text-primary"
                        aria-label="Fundo preto"
                    />
                    <div className="w-5 h-5 rounded border border-white/40 bg-black" aria-hidden="true"></div>
                </label>
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-white text-base font-semibold mb-3">Fundo:</h4>
            
            <div className="space-y-3">
                <label className="flex items-center space-x-4 cursor-pointer">
                    <input
                        type="radio"
                        name="background-mobile"
                        checked={isAnimatedBackground}
                        onChange={() => onBackgroundChange(true)}
                        className="w-5 h-5 text-primary"
                    />
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded border-2 border-white/30 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                        </div>
                        <span className="text-white text-base">Fundo Animado</span>
                    </div>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer">
                    <input
                        type="radio"
                        name="background-mobile"
                        checked={!isAnimatedBackground}
                        onChange={() => onBackgroundChange(false)}
                        className="w-5 h-5 text-primary"
                    />
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded border-2 border-white/30 bg-black"></div>
                        <span className="text-white text-base">Fundo Preto</span>
                    </div>
                </label>
            </div>
        </div>
    );
}
