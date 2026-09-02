import React from 'react';

/**
 * GlassCard component applies a glassmorphism effect to its children.
 * It uses CSS custom properties defined in glass.css for the background blur and translucency.
 */
const GlassCard = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`}>
    {children}
  </div>
);

export default GlassCard;
