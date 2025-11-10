import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';

import { getStatusPatio, registrarSaida } from '../services/patioService';

interface VagaPython {
  id_vaga: string;
  status: string;
  moto_id: string | null;
  tipo_moto_ml: string | null;
  placa_ml: string | null;
  ultimo_update: string;
}

const DashboardScreen = () => {
  const [vagas, setVagas] = useState<VagaPython[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await getStatusPatio();
      
      const ocupadas = data.filter(vaga => vaga.status === 'ocupada');
      setVagas(ocupadas);

    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRegistrarSaida = async (item: VagaPython) => {
    
    console.log("CLICOU NO BOTÃO LIBERAR! Vaga:", item.id_vaga);

    const confirmou = window.confirm(
      `Deseja realmente liberar a vaga ${item.id_vaga}?`
    );

    if (confirmou) {
      try {
        console.log("Confirmado. Chamando API de saída...");
        await registrarSaida(item.id_vaga); 
        
        window.alert("Sucesso! Vaga liberada.");
        fetchData();

      } catch (error) {
        console.error("Erro ao tentar liberar vaga:", error);

        window.alert(
          `Erro ao liberar a vaga. O endpoint '/saida/${item.id_vaga}' ` +
          `não foi encontrado no backend Python. Verifique o console F12.`
        );
      }
    } else {
      console.log("Usuário cancelou a saída.");
    }
  };

  const renderItem = ({ item }: { item: VagaPython }) => (
    <View style={styles.card}>

      <Text style={styles.vagaIdCorner}>{item.id_vaga.replace('_', ' ').toUpperCase()}</Text>
      <Text style={styles.cardTitle}>{item.id_vaga.replace('_', ' ').toUpperCase()}</Text>

      <Text style={styles.placa}>{item.placa_ml || 'Lendo placa...'}</Text>

      <Text style={styles.motoInfo}>{item.tipo_moto_ml || 'Identificando...'}</Text>

      <Text style={styles.statusMoto}>Moto ID (IoT): {item.moto_id || 'N/A'}</Text>
      
      <TouchableOpacity
        style={styles.botaoSaida}
        onPress={() => handleRegistrarSaida(item)}
      >
        <Text style={styles.botaoSaidaTexto}>LIBERAR VAGA</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color="#E60000" />;
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pátio em Tempo Real (API Python)</Text>
      <FlatList
        data={vagas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_vaga}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma moto no pátio.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  vagaIdCorner: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 80,
  },
  placa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  motoInfo: {
    fontSize: 16,
    color: '#666',
  },
  statusMoto: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  botaoSaida: {
    backgroundColor: '#E60000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  botaoSaidaTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default DashboardScreen;