'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  highlight?: 'default' | 'warning' | 'success';
}

export default function MetricCard({
  label,
  value,
  subtext,
  highlight = 'default',
}: MetricCardProps) {
  const bgColor =
    highlight === 'warning'
      ? '#F5E4B8'
      : highlight === 'success'
        ? '#D0DEC8'
        : '#FCFAF8';

  const textColor =
    highlight === 'warning'
      ? '#E2B04B'
      : highlight === 'success'
        ? '#758E67'
        : '#2A2A2A';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: '1px solid #D8CFC4',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        minWidth: '160px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          color: '#5A524A',
          marginBottom: '12px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: textColor,
          marginBottom: subtext ? '8px' : '0',
        }}
      >
        {value}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: '14px',
            color: '#5A524A',
            marginTop: '8px',
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
