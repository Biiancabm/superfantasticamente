import React, { useState, useEffect } from 'react';
import { clientApi } from '../services/api';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/client';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import Modal from '../components/Modal';
import './ClientsPage.css';

const Home: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchTerm(''); // Clear search when reloading full list
      setIsSearchPerformed(false); // Reset search state
      const data = await clientApi.getAll();
      setClients(data);
    } catch (err) {
      setError('Erro ao carregar clientes. Verifique se o backend está rodando.');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClient = async (data: CreateClientDto | UpdateClientDto) => {
    if (editingClient) {
      // Update existing client
      try {
        await clientApi.update(editingClient.code, data as UpdateClientDto);
        
        showNotification('Cliente atualizado com sucesso!', 'success');
        setIsModalOpen(false);
        setEditingClient(undefined);
        loadClients();
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'Erro ao atualizar cliente', 'error');
        throw err;
      }
    } else {
      // Create new client
      try {
        await clientApi.create(data as CreateClientDto);
        
        showNotification('Cliente criado com sucesso!', 'success');
        setIsModalOpen(false);
        loadClients();
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'Erro ao criar cliente', 'error');
        throw err;
      }
    }
  };

  const handleDeleteClient = async (code: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      await clientApi.delete(code);
      showNotification('Cliente deletado com sucesso!', 'success');
      loadClients();
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Erro ao deletar cliente', 'error');
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingClient(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingClient(undefined);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadClients();
      return;
    }

    try {
      setLoading(true);
      setClients([]); // Limpa a lista para garantir que apenas resultados novos apareçam
      
      const results = await clientApi.searchSimilar(encodeURIComponent(searchTerm));
      
      // Filtra apenas os que tem uma similaridade de 60% ou mais (0.6)
      const highSimilarityResults = results.filter((client: any) => 
        client.similarity !== undefined && client.similarity >= 0.6
      );
      
      setClients(highSimilarityResults);
      setIsSearchPerformed(true); // Tag as search performed
      
      if (highSimilarityResults.length === 0) {
        showNotification('Nenhum cliente foi encontrado.', 'error');
      }
    } catch (err) {
      showNotification('Erro na busca inteligente. Verifique se os embeddings foram gerados.', 'error');
      // Em caso de erro, volta para a lista completa para não travar a tela
      loadClients();
    } finally {
      setLoading(false);
    }
  };



  // Se houve uma busca, mostramos apenas o que o servidor trouxe.
  // Caso contrário, mostramos todos os clientes (quando searchTerm está vazio).
  const filteredClients = clients;

  return (
    <div className="home-container">
      <header className="home-header glass-strong">
        <div className="header-content">
          <div className="header-title">
            <h1>Gerenciamento de Clientes</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary add-btn" onClick={handleAddClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Cliente
            </button>
          </div>
        </div>
      </header>

      <div className="search-section">
        <div className="search-bar glass">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar clientes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <button className="clear-search" onClick={loadClients} title="Limpar busca">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button className="search-btn" onClick={handleSearch}>
            Buscar
          </button>
        </div>
        
        {/* Novo botão para voltar à tela inicial apenas APÓS a busca ser realizada */}
        {isSearchPerformed && !loading && (
          <div className="search-info fade-in">
            <button className="btn btn-secondary back-btn" onClick={loadClients}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ver todos os clientes
            </button>
          </div>
        )}
      </div>

      <main className="home-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Carregando clientes...</p>
          </div>
        ) : error ? (
          <div className="error-state glass">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>Erro ao carregar</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadClients}>
              Tentar Novamente
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="empty-state glass">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3>Nenhum cliente encontrado</h3>
            <p>Comece adicionando seu primeiro cliente</p>
            <button className="btn btn-primary" onClick={handleAddClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Cliente
            </button>
          </div>
        ) : (
          <div className="clients-grid">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.code}
                client={client}
                onEdit={handleEditClick}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmitClient}
          onCancel={handleModalClose}
        />
      </Modal>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {notification.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
