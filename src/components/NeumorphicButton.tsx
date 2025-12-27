import React from 'react';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'google' | 'text';
  fullWidth?: boolean;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center py-3 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95";
  const widthStyle = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-[#f0f2f5] text-blue-600 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] hover:text-blue-700 hover:shadow-[7px_7px_14px_rgba(163,177,198,0.7),-7px_-7px_14px_rgba(255,255,255,0.6)]",
    google: "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50 shadow-[5px_5px_10px_rgba(163,177,198,0.4),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:scale-[1.02] hover:shadow-[7px_7px_14px_rgba(163,177,198,0.5),-7px_-7px_14px_rgba(255,255,255,0.5)]",
    text: "bg-transparent text-gray-500 hover:text-gray-700 py-1 px-2"
  };

  const currentVariant = variant === 'text' ? variants.text : `${variants[variant]} ${baseStyles}`;

  return (
    <button className={`${currentVariant} ${widthStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default NeumorphicButton;