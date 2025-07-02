import React from 'react';

type WarningMessageProps = {
  children: React.ReactNode;
};

export function WarningMessage({ children }: WarningMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#fff9e6',
        borderLeft: '4px solid #e6b800',
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
          stroke="#e6b800"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#b38600' }}>Warning</h4>
        <div style={{ color: '#4d3800' }}>{children}</div>
      </div>
    </div>
  );
}
