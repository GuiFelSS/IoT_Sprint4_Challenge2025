export interface Moto {
  id: number;
  placa: string;
  tipoMoto: string;
  chassi: string;
  dataCadastro: string;
}

export interface Vaga {
  id: number;
  localizacao: string;
  status: string;
}

export interface HistoricoOcupacao {
  id: number;
  moto: Moto;
  vaga: Vaga;
  dataEntrada: string;
  dataSaida: string | null;
  statusMoto: string;
}