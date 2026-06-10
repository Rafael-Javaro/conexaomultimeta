'use client';

import React from 'react';
import { RecentConversationItem } from '../lib/metrics';

interface RecentActivityTableProps {
  conversations: RecentConversationItem[];
}

export default function RecentActivityTable({ conversations }: RecentActivityTableProps) {
  return (
    <div
      style={{
        backgroundColor: '#FCFAF8',
        border: '1px solid #D8CFC4',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 100px 100px 120px 200px 60px',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: '#F5F2ED',
          borderBottom: '1px solid #D8CFC4',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          color: '#5A524A',
        }}
      >
        <div>ID</div>
        <div>Expert</div>
        <div>Closer</div>
        <div>Status</div>
        <div>Última msg</div>
        <div>Quando</div>
      </div>

      {conversations.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#5A524A' }}>
          Sem conversas recentes.
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 100px 100px 120px 200px 60px',
              gap: '16px',
              padding: '16px 24px',
              borderBottom: '1px solid #D8CFC4',
              alignItems: 'center',
              fontSize: '13px',
              color: '#2A2A2A',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              {conv.id.slice(-4)}
            </div>
            <div>{conv.expertName}</div>
            <div>{conv.closerName}</div>
            <div
              style={{
                fontWeight: '600',
                color:
                  conv.status === '✓ Contratado'
                    ? '#758E67'
                    : conv.status === 'Arquivado'
                      ? '#9CAF8F'
                      : '#6B8DAD',
              }}
            >
              {conv.status}
            </div>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
                color: conv.hasUnreadMessages ? '#2A2A2A' : '#5A524A',
                fontWeight: conv.hasUnreadMessages ? '600' : '400',
              }}
              title={conv.lastMessagePreview}
            >
              {conv.lastMessagePreview}
            </div>
            <div style={{ fontSize: '12px', color: '#5A524A' }}>
              {conv.hoursAgo}h atrás
            </div>
          </div>
        ))
      )}
    </div>
  );
}
