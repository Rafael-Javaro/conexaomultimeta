'use client';

import React from 'react';

interface AlertBadgeProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export default function AlertBadge({ type, title, items }: AlertBadgeProps) {
  const colors = {
    warning: { bg: '#FEF3C7', text: '#92400E', border: '#D97706' },
    error: { bg: '#F5E0E0', text: '#B54A4B', border: '#B54A4B' },
    info: { bg: '#C9DBEA', text: '#6B8DAD', border: '#6B8DAD' },
  };

  const color = colors[type];
  const icon =
    type === 'warning'
      ? '⚠️'
      : type === 'error'
        ? '❌'
        : 'ℹ️';

  return (
    <div
      style={{
        backgroundColor: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          fontSize: '20px',
        }}
      >
        <span style={{ marginRight: '8px' }}>{icon}</span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: color.text,
          }}
        >
          {title}
        </span>
      </div>

      {items.length > 0 ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: '24px',
            listStyle: 'disc',
          }}
        >
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: '13px', color: color.text, marginBottom: '6px' }}>
              <strong>{item.label}</strong> {item.value}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '13px', color: color.text, margin: 0 }}>
          Nenhum alerta no momento.
        </p>
      )}
    </div>
  );
}
