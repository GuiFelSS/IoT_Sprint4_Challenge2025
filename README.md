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

- **ANÁLISE DE STATUS (Simulado):** Uma função (`ml_models.py`) simula aleatoriamente um status para a moto (ex: "Pronta para uso", "Em manutenção"), que é exibido com destaque no dashboard.

- **DASHBOARD INTERATIVO:** Uma aplicação web desenvolvida com **React Native (Expo)** e **TypeScript** exibe o status de cada vaga, consumindo os dados da API Flask e atualizando-se automaticamente.

- **PERSISTÊNCIA DE DADOS:** Todas as informações das vagas (status, ID da moto, placa e modelo simulados) são armazenadas em um banco de dados **SQLite** (`patio.db`) pelo backend.

## ARQUITETURA E COMPONENTES
### HARDWARE (Simulação no Wokwi)
O circuito IoT foi simulado na plataforma Wokwi e é composto pelos seguintes componentes:
- **MICROCONTROLADOR (ESP32):** O cérebro da operação, responsável por ler os sensores, processar os dados e comunicar-se via WI-FI.
- **SENSOR ULTRASSÔNICO (HC-SR04):** Utilizado para medir a distância e detectar se a vaga está "livre" ou "ocupada" com base em um limiar pré-definido.
- **POTENCIÔMETRO DESLIZANTE:** Simula a identificação de diferentes motos. O valor lido do potenciômetro é mapeado para um dos três tipos de moto (MOTTU-E, MOTTU-POP, MOTTU-SPORT).
- **LEDS (VERDE/VERMELHO):** Indicadores visuais locais para o status da vaga (Livre/Ocupada).
- **BUZZER:** Fornece feedback sonoro, sendo ativado quando uma mensagem é recebida no tópico de comando MQTT, funcionando como um sistema de alerta.

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
4. Inicie o servidor API (ele criará e inicializará o `patio.db` automaticamente):  
`python main.py`
5. O backend estará rodando e ouvindo MQTT. A API estará acessível em `http://localhost:5000`.

### 3. Frontend (Dashboard Expo)
1. Em um **novo terminal**, navegue até a pasta `mottu-dashboard`.
2. Instale as dependências do Node.js: `npm install`
3. **Confirme a URL da API:** Verifique se o arquivo `mottu-dashboard/src/services/api.js` está apontando para o seu backend Python (ex: `baseURL: 'http://localhost:5000'`).
4. Inicie o dashboard web (use `-c` para limpar o cache se necessário): `npm run web`
5. Acesse o dashboard no endereço fornecido pelo Expo (geralmente `http://localhost:8080` ou `http://localhost:19006`).

## ESTRUTURA DO PROJETO
```
projeto_mottu/
├── Simulador_IOT/
│   ├── src/sketch.ino
│   └── diagram.json
├── backend_ML_IOT_PYTHON/
│   ├── main.py                 # API Flask e cliente MQTT
│   ├── ml_models.py            # Funções de simulação dos modelos de ML
│   └── patio.db                # Banco de dados SQLite
├── mottu-dashboard/            # <-- NOVO FRONTEND
│   ├── src/
│   │   ├── screens/
│   │   │   └── DashboardScreen.tsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── patioService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── App.tsx
│   ├── package.json
│   └── index.ts
├── Leitura_Placas.ipynb
└── modelo_da_entrega2_Challenge2025.ipynb
```
