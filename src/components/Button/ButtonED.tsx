import type { FC } from "react";

interface IProps {
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'white';
};

export const ButtonED: FC<IProps> = ({onClick, className, ariaLabel, children, variant = 'primary'}) => {
    const baseClasses = "cursor-pointer font-poppins font-semibold py-3 px-6 md:py-4 md:px-10 rounded-xl border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none text-base md:text-xl";
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white border-primary-200 hover:border-secondary focus:ring-4 focus:ring-secondary/30",
        white: "bg-white hover:bg-gray-100 text-gray-800 border-white hover:border-gray-200 focus:ring-4 focus:ring-white/30"
    };

    return (
        <button
              type="button"
              onClick={onClick}
              className={`${baseClasses} ${variantClasses[variant]} ${className}`}
              aria-label={ariaLabel}
            >
              {children}
            </button>
    );
}
