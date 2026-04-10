import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    children: React.ReactNode;
};

export const MobileMenu: FC<IProps> = ({ children }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Botão Hambúrguer - Visível apenas no mobile */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 right-4 z-50 md:hidden bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                aria-label={t("openMenu")}
            >
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
            </button>

            {/* Overlay - Visível apenas quando menu está aberto */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Bottom Sheet - Visível apenas no mobile */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white text-lg font-semibold">{t("settings")}</h3>
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-gray-300"
                            aria-label={t("closeMenu")}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
