import paho.mqtt.client as mqtt
from flask import Flask, jsonify, render_template
import threading
import json
import sqlite3
from datetime import datetime
import requests
from flask_cors import CORS

from ml_models import identificar_tipo_moto, reconhecer_placa

MQTT_BROKER = "broker.mqtt-dashboard.com"
MQTT_PORT = 1883
MQTT_TOPIC = "mottu/patio/+/status"
DATABASE_FILE = "patio.db"
URL_JAVA_API_ENTRADA = "http://localhost:8080/api/patio/entrada"
URL_JAVA_API_SAIDA = "http://localhost:8080/api/patio/saida"

def init_db():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vagas (
            id_vaga TEXT PRIMARY KEY,
            status TEXT NOT NULL,
            moto_id TEXT,
            tipo_moto_ml TEXT,
            placa_ml TEXT,
            ultimo_update TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def on_message(client, userdata, message):
    try:
        topic_parts = message.topic.split('/')
        vaga_id_num = topic_parts[2]
        vaga_id_str = f"VAGA_{vaga_id_num}"

        payload_json = json.loads(message.payload.decode("utf-8"))
        status = payload_json.get("status_ocupacao")
        moto_id = payload_json.get("moto_id")

        print(f"--- MENSAGEM MQTT RECEBIDA --- Vaga: {vaga_id_str}")

        tipo_moto_ml = None
        placa_ml = None

        if status == "ocupada":
            print(f"  Vaga OCUPADA pela moto IoT ID: {moto_id}.")

            placa_ml = reconhecer_placa("caminho/falso/imagem.png")
            tipo_moto_ml = identificar_tipo_moto(moto_id)
            print(f"  [ML] Tipo de Moto: {tipo_moto_ml}")
            print(f"  [ML] Placa: {placa_ml}")

            try:
                dados_para_java = {
                    "placa": placa_ml,
                    "tipo": tipo_moto_ml,
                    "id_vaga": vaga_id_str
                }
                print(f"  Enviando ENTRADA para API Java: {dados_para_java}")
                requests.post(URL_JAVA_API_ENTRADA, json=dados_para_java, timeout=5)
            except Exception as e:
                print(f"  AVISO: Não foi possível conectar à API Java: {e}")

        else:
            print(f"  Vaga LIVRE.")

            try:
                url_saida_java = f"{URL_JAVA_API_SAIDA}/{vaga_id_str}"
                print(f"  Enviando SAÍDA para API Java: {url_saida_java}")
                requests.post(url_saida_java, timeout=5)
            except Exception as e:
                print(f"  AVISO: Não foi possível conectar à API Java: {e}")

        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute('''
            REPLACE INTO vagas (id_vaga, status, moto_id, tipo_moto_ml, placa_ml, ultimo_update)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (vaga_id_str, status, moto_id, tipo_moto_ml, placa_ml, timestamp))

        conn.commit()
        conn.close()
        print(f"  Dados da vaga {vaga_id_str} salvos no banco de dados local (Sprint 3).")
        print("--------------------------------\n")

    except Exception as e:
        print(f"Erro ao processar mensagem: {e}")

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
thread = threading.Thread(target=mqtt_client.loop_forever)
thread.start()

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"status": "API_MOTTU_PYTHON_ONLINE"})

@app.route('/status_patio')
def get_status_patio():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vagas")
    vagas = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(vagas)

if __name__ == '__main__':
    init_db()
    mqtt_client.subscribe(MQTT_TOPIC)
    print("Backend iniciado. Ouvindo MQTT e pronto para receber conexões na API.")
    app.run(host='0.0.0.0', port=5000, debug=False)