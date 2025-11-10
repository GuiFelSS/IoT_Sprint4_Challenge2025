import { HistoricoOcupacao } from '../types';
import api from './api';

export const getStatusPatio = async (): Promise<any[]> => {
  try {
    const response = await api.get('/status_patio'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar status do pátio:", error);
    throw error;
  }
};

export const registrarSaida = async (vagaLocalizacao: string): Promise<any> => {
  try {
    const response = await api.post(`/saida/${vagaLocalizacao}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar saída:", error);
    throw error;
  }
};