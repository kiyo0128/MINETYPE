import React from 'react';

export type CharacterType = 'STEVE' | 'ALEX' | 'CREEPER' | 'ZOMBIE' | 'SKELETON';

interface PixelCharacterProps {
  type: CharacterType;
  className?: string;
  size?: number; // Size in pixels for width/height
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({ type, className = '', size = 64 }) => {
  const renderContent = () => {
    switch (type) {
      case 'STEVE':
        return (
          <>
            {/* Skin */}
            <rect x="0" y="0" width="8" height="8" fill="#e0aa94" />
            {/* Hair */}
            <path d="M0 0h8v2h-8z M0 2h1v1h-1z M7 2h1v1h-1z" fill="#2e1f14" />
            {/* Eyes */}
            <rect x="1" y="4" width="1" height="1" fill="#fff" />
            <rect x="2" y="4" width="1" height="1" fill="#4a42b8" />
            <rect x="5" y="4" width="1" height="1" fill="#fff" />
            <rect x="6" y="4" width="1" height="1" fill="#4a42b8" />
            {/* Nose/Mouth */}
            <rect x="3" y="5" width="2" height="1" fill="#ae7660" />
            <rect x="3" y="6" width="2" height="1" fill="#693c2e" />
          </>
        );
      case 'ALEX':
        return (
          <>
            {/* Skin */}
            <rect x="0" y="0" width="8" height="8" fill="#e8b193" />
            {/* Hair */}
            <path d="M0 0h8v2h-8z M0 2h1v2h-1z M7 2h1v4h-1z M6 2h1v1h-1z M0 4h1v3h-1z M1 6h1v2h-1z" fill="#cd7232" />
            {/* Eyes */}
            <rect x="2" y="4" width="1" height="1" fill="#fff" />
            <rect x="3" y="4" width="1" height="1" fill="#305e2e" />
            <rect x="5" y="4" width="1" height="1" fill="#fff" />
            <rect x="6" y="4" width="1" height="1" fill="#305e2e" />
            {/* Mouth */}
            <rect x="3" y="6" width="2" height="1" fill="#ae7660" />
          </>
        );
      case 'CREEPER':
        return (
          <>
            {/* Skin */}
            <rect x="0" y="0" width="8" height="8" fill="#0ba513" />
            {/* Noise (Simplified) */}
            <path d="M1 1h1v1h-1z M6 1h1v1h-1z M2 6h1v1h-1z M0 3h1v1h-1z" fill="#37c23e" />
            {/* Face */}
            <rect x="2" y="2" width="1" height="1" fill="#000" />
            <rect x="5" y="2" width="1" height="1" fill="#000" />
            <path d="M3 4h2v1h-2z M2 5h1v2h-1z M5 5h1v2h-1z M3 6h2v1h-2z" fill="#000" />
          </>
        );
      case 'ZOMBIE':
        return (
          <>
            {/* Skin */}
            <rect x="0" y="0" width="8" height="8" fill="#437648" />
            {/* Hair */}
            <path d="M0 0h8v2h-8z M0 2h1v1h-1z M7 2h1v1h-1z" fill="#264c2a" />
            {/* Eyes */}
            <rect x="1" y="4" width="1" height="1" fill="#000" />
            <rect x="2" y="4" width="1" height="1" fill="#000" />
            <rect x="5" y="4" width="1" height="1" fill="#000" />
            <rect x="6" y="4" width="1" height="1" fill="#000" />
            {/* Nose/Mouth */}
            <rect x="3" y="5" width="2" height="1" fill="#2a4e2e" />
            <rect x="3" y="6" width="2" height="1" fill="#2a4e2e" />
          </>
        );
      case 'SKELETON':
        return (
          <>
            {/* Bone */}
            <rect x="0" y="0" width="8" height="8" fill="#bcbcbc" />
            {/* Face */}
            <rect x="2" y="4" width="1" height="1" fill="#000" />
            <rect x="5" y="4" width="1" height="1" fill="#000" />
            <rect x="3" y="6" width="2" height="1" fill="#000" />
            <rect x="4" y="5" width="0.5" height="0.5" fill="#000" /> {/* Nose hint */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg 
      viewBox="0 0 8 8" 
      width={size} 
      height={size} 
      className={`block rendering-pixelated ${className}`}
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
    >
      {renderContent()}
    </svg>
  );
};