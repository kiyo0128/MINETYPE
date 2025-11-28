import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  let bgClass = "bg-[#727272]"; // Stone default
  
  if (variant === 'primary') bgClass = "bg-[#3e8948] hover:bg-[#4aa056]"; // Green
  if (variant === 'danger') bgClass = "bg-[#a62f2f] hover:bg-[#c23b3b]"; // Red

  return (
    <button
      className={`
        mc-btn 
        border-4 border-black text-white 
        font-pixel text-sm md:text-base 
        px-6 py-3 
        uppercase tracking-widest 
        ${bgClass} 
        ${fullWidth ? 'w-full' : ''}
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-1'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};