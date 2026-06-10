'use client';

import React from 'react';
import { formatHoursAsTimeString } from '@/lib/timeUtils';

export interface ConversationDetail {
  id: string;
  expertName: string;
  closerName: string;
  status: string;
  avgResponseTimeHours: number;
  messageCount: number;
  createdAt: string;
  lastMessageTime: string;
}

interface ConversationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ConversationDetail[];
}

export default function ConversationsModal({
  isOpen,
  onClose,
  conversations,
}: ConversationsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FCFAF8',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '900px',
          maxHeight: '80vh',
          overflowY: 'auto',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #D8CFC4',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#2A2A2A',
                margin: 0,
              }}
            >
              Conversas Ativas Detalhadas
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: '#5A524A',
                margin: '6px 0 0 0',
              }}
            >
              {conversations.length} conversas em andamento
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#5A524A',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Conversations List */}
        {conversations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                style={{
                  backgroundColor: '#F5F2ED',
                  border: '1px solid #D8CFC4',
                  borderRadius: '8px',
                  padding: '16px',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {/* Conversation ID */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Conversa ID
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#2A2A2A',
                        fontWeight: '600',
                      }}
                    >
                      {conv.id}
                    </div>
                  </div>

                  {/* Expert */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Expert
                    </div>
                    <div style={{ fontSize: '14px', color: '#2A2A2A' }}>
                      {conv.expertName}
                    </div>
                  </div>

                  {/* Closer */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Closer
                    </div>
                    <div style={{ fontSize: '14px', color: '#2A2A2A' }}>
                      {conv.closerName}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#758E67',
                        fontWeight: '600',
                      }}
                    >
                      {conv.status}
                    </div>
                  </div>

                  {/* Avg Response Time */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Tempo Médio Resposta
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#2A2A2A',
                        fontWeight: '600',
                      }}
                    >
                      {formatHoursAsTimeString(conv.avgResponseTimeHours)}
                    </div>
                  </div>

                  {/* Message Count */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Total de Mensagens
                    </div>
                    <div style={{ fontSize: '14px', color: '#2A2A2A' }}>
                      {conv.messageCount}
                    </div>
                  </div>

                  {/* Created At */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Iniciada em
                    </div>
                    <div style={{ fontSize: '13px', color: '#5A524A' }}>
                      {conv.createdAt}
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: '#5A524A',
                        marginBottom: '4px',
                      }}
                    >
                      Última Atividade
                    </div>
                    <div style={{ fontSize: '13px', color: '#5A524A' }}>
                      {conv.lastMessageTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#5A524A', fontSize: '14px', textAlign: 'center' }}>
            Nenhuma conversa ativa no momento.
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #D8CFC4',
            textAlign: 'center',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#2A2A2A',
              color: '#FCFAF8',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                '#1A1A1A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                '#2A2A2A';
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
