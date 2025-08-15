import type { FC } from "react";

interface IProps {
    onClick: () => void;
    className?: string;
};

export const Button: FC<IProps> = ({onClick, className}) => {
    return (
        <button
              type="button"
              onClick={onClick}
              className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-8 rounded-lg border-2 border-transparent hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-lg ${className}`}
              aria-label="Abrir seletor de cores"
            >
              Escolha
            </button>
    );
}
