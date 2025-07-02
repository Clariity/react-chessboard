import React from 'react';

type HintMessageProps = {
  children: React.ReactNode;
};

export function HintMessage({ children }: HintMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#e6f3ff',
        borderLeft: '4px solid #0066cc',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0066cc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18h6M10 22h4M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
        </svg>
      </div>

      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#004d99' }}>
          Recommendation
        </h4>
        <div style={{ color: '#003366' }}>{children}</div>
      </div>
    </div>
  );
}
