# MONITORAMENTO DE PÁTIO DE MOTOS COM IOT E IA - SPRINT 4 MOTTU

### INTEGRANTES
● Alexsandro Macedo: RM557068 ● Guilherme Felipe da Silva Souza: RM558282 ● Leonardo Faria Salazar: RM557484

Este projeto é uma solução completa para o monitoramento em tempo real de um pátio de motocicletas, utilizando tecnologias de Internet das Coisas (IoT) para a detecção de ocupação e funções simuladas de Inteligência Artificial (IA) para identificação de placas e modelos.

## DESCRIÇÃO
O sistema simula um ambiente de pátio onde vagas de estacionamento são equipadas com sensores IoT. Quando uma moto ocupa uma vaga, o sistema é notificado via MQTT. O backend Python processa essa informação, simula o reconhecimento de ML e salva os dados. Um dashboard web separado, feito em **Expo (React Native)**, consome essa API e exibe o status do pátio em tempo real.

## FUNCIONALIDADES
- **DETECÇÃO DE OCUPAÇÃO VIA IoT:** Um dispositivo simulado (ESP32) com sensor ultrassônico detecta a presença de veículos nas vagas.

- **COMUNICAÇÃO EM TEMPO REAL:** O status de cada vaga é enviado em tempo real para um broker MQTT, garantindo a comunicação instantânea.

- **RECONHECIMENTO DE PLACA (Simulado):** Uma função (`ml_models.py`) simula o retorno de um modelo de Visão Computacional, retornando uma placa estática (ex: `RFA4I58`).

- **IDENTIFICAÇÃO DE MODELO (Simulado):** Uma função (`ml_models.py`) simula um modelo de Deep Learning, mapeando o ID do IoT recebido para um tipo de moto (ex: Mottu-E, Mottu-Pop).

- **DASHBOARD INTERATIVO:** Uma aplicação web desenvolvida com **React Native (Expo)** e **TypeScript** exibe o status de cada vaga, consumindo os dados da API Flask e atualizando-se automaticamente.

- **PERSISTÊNCIA DE DADOS:** Todas as informações das vagas (status, ID da moto, placa e modelo simulados) são armazenadas em um banco de dados **SQLite** (`patio.db`) pelo backend.

## ARQUITETURA E COMPONENTES
### HARDWARE (Simulação no Wokwi)
(Esta seção permanece igual)
- **MICROCONTROLADOR (ESP32):** O cérebro da operação...
- **SENSORES ULTRASSÔNICO:** Utilizado para medir a distância...
- **POTENCIÔMETRO DESLIZANTE:** Simula a identificação de diferentes motos...
- **BUZZER:** Fornece feedback sonoro...

### SOFTWARE E COMUNICAÇÃO
1. **DISPOSITIVO IOT:** O sensor ultrassônico no ESP32 mede a distância e publica uma mensagem JSON no tópico MQTT `mottu/patio/{id_vaga}/status`.
2. **BROKER MQTT:** Recebe a mensagem do IoT.
3. **BACKEND (API FLASK):**
    - Um cliente MQTT (`main.py`) se inscreve no tópico para receber as atualizações.
    - Ao receber uma mensagem de "ocupada", as funções de simulação de ML (`ml_models.py`) são chamadas.
    - Os dados são salvos no banco de dados `patio.db`.
    - Expõe um endpoint (`/status_patio`) que retorna um JSON com o estado atual de todas as vagas.
4. **FRONTEND (EXPO):**
    - Uma aplicação separada (`mottu-dashboard`) roda em seu próprio servidor (ex: `localhost:8080`).
    - O dashboard faz requisições (usando `axios`) para a API Flask (`http://localhost:5000/status_patio`) a cada 5 segundos para buscar os dados.
    - Os dados JSON recebidos são renderizados na tela usando componentes React.

## TECNOLOGIAS UTILIZADAS
- **BACKEND:** Python, Flask, **Flask-CORS**
- **MACHINE LEARNING (Simulação):** Python
- **IoT (Simulação):** Wokwi (Simulador de ESP32), C++ (Arduino)
- **COMUNICAÇÃO:** MQTT (Paho MQTT Client, PubSubClient)
- **BANCO DE DADOS:** SQLite
- **FRONTEND:** **React**, **React Native (Expo)**, **TypeScript**, **Axios**
- **AMBIENTE DE DESENVOLVIMENTO:** Google Colab, Jupyter Notebook, VS Code

## COMO EXECUTAR O PROJETO
### Pré-requisitos
- Python 3.8+
- Node.js (v18+ recomendado) e `npm`
- Wokwi para simulação do IoT (ou um ESP32 físico)
- Um broker MQTT (ex: `broker.mqtt-dashboard.com`)

### 1. Simulador IoT (Sem Mudança)
1. Abra o arquivo `Simulador_IOT/src/sketch.ino` no Wokwi ou na IDE do Arduino.
2. Compile e execute a simulação. O dispositivo começará a enviar dados para o broker MQTT.

### 2. Backend (API Python)
1. Navegue até a pasta `backend_ML_IOT_PYTHON`.
2. Crie e ative um ambiente virtual:  
`python -m venv venv source venv/bin/activate # No Windows: venv\Scripts\activate`
3. Instale as dependências:  
`pip install flask paho-mqtt requests flask-cors`
5. Inicie o servidor API (ele criará e inicializará o `patio.db` automaticamente):  
`pip install flask paho-mqtt requests flask-cors`
