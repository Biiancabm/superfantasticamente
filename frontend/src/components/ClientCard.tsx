import React from 'react';
import type { Client } from '../types/client';
import './ClientCard.css';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (code: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  const similarity = (client as any).similarity;
  
  return (
    <div className="client-card glass">
      <div className="client-card-header">
        <div className="client-avatar">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div className="client-info">
          <div className="client-name-row">
            <h3 className="client-name">{client.name}</h3>
            {similarity !== undefined && (
              <span className="similarity-badge" title="Similaridade encontrada pela IA">
                {Math.round(similarity * 100)}%
              </span>
            )}
          </div>
          <span className="client-code">#{client.code}</span>
        </div>
      </div>

      <div className="client-details">
        {client.email && (
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{client.email}</span>
          </div>
        )}
        
        {client.phone && (
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{client.phone}</span>
          </div>
        )}
        
        {client.cpf && (
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span>{client.cpf}</span>
          </div>
        )}
      </div>

      <div className="client-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(client)} title="Editar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(client.code)} title="Deletar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Deletar
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
