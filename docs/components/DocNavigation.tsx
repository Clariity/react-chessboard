import React from 'react';

type NavigationItem = {
  href: string;
  title: string;
  description: string;
};

type DocNavigationProps = {
  prev?: NavigationItem;
  next?: NavigationItem;
};

type ArrowIconProps = {
  direction: 'left' | 'right';
};

function ArrowIcon({ direction }: ArrowIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === 'left' ? (
        <path d="M19 12H5M12 19l-7-7 7-7" />
      ) : (
        <path d="M5 12h14M12 5l7 7-7 7" />
      )}
    </svg>
  );
}

type NavigationCardProps = {
  item: NavigationItem;
  direction: 'left' | 'right';
  isFullWidth: boolean;
};

function NavigationCard({ item, direction, isFullWidth }: NavigationCardProps) {
  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    flex: isFullWidth ? '1 1 300px' : '0 0 auto',
    minWidth: '300px',
    maxWidth: isFullWidth ? 'none' : '400px',
    transition: 'transform 0.2s ease-in-out',
  };

  const arrowContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    flexShrink: 0,
  };

  const contentStyle = {
    flex: '1 1 auto',
    minWidth: 0, // Allows text to shrink below its content size
  };

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.transform =
      direction === 'left' ? 'translateX(-4px)' : 'translateX(4px)';
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.transform = 'translateX(0)';
  }

  return (
    <a
      href={item.href}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {direction === 'left' && (
        <div style={arrowContainerStyle}>
          <ArrowIcon direction="left" />
        </div>
      )}

      <div style={contentStyle}>
        <h3 style={{ margin: '0 0 0.5rem 0', cursor: 'pointer' }}>
          {item.title}
        </h3>
        <p style={{ margin: 0, color: '#666' }}>{item.description}</p>
      </div>

      {direction === 'right' && (
        <div style={arrowContainerStyle}>
          <ArrowIcon direction="right" />
        </div>
      )}
    </a>
  );
}

export function DocNavigation({ prev, next }: DocNavigationProps) {
  const isFullWidth = Boolean(prev && next);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent:
          prev && next ? 'space-between' : prev ? 'flex-start' : 'flex-end',
        padding: '1rem 0',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {prev && (
        <NavigationCard
          item={prev}
          direction="left"
          isFullWidth={isFullWidth}
        />
      )}
      {next && (
        <NavigationCard
          item={next}
          direction="right"
          isFullWidth={isFullWidth}
        />
      )}
    </div>
  );
}
