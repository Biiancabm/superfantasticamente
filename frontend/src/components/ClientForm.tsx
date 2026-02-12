import React, { useState, useEffect } from 'react';
import type { CreateClientDto, UpdateClientDto, Client } from '../types/client';
import './ClientForm.css';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientDto | UpdateClientDto) => Promise<void>;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        code: client.code,
        name: client.name,
        email: client.email,
        phone: client.phone,
        cpf: client.cpf,
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!client && !formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // If editing, exclude code from the update data
      if (client) {
        const { code, ...updateData } = formData;
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="code">Código *</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          disabled={!!client}
          className={errors.code ? 'error' : ''}
          placeholder="Digite o código do cliente"
        />
        {errors.code && <span className="error-message">{errors.code}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="Digite o nome do cliente"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite o email do cliente"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Telefone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Digite o telefone do cliente"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="Digite o CPF do cliente"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Salvando...
            </>
          ) : (
            client ? 'Atualizar' : 'Criar'
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
