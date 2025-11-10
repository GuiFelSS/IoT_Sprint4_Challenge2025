import random
def identificar_tipo_moto(moto_id_iot):
    """
    Simula o modelo de ML mapeando o ID do IoT para o tipo da moto.
    """
    if moto_id_iot == "MOTTU-E":
        return "Mottu-E"
    elif moto_id_iot == "MOTTU-POP":
        return "Mottu-Pop"
    elif moto_id_iot == "MOTTU-SPORT":
        return "Mottu-Sport"
    else:
        return "Tipo Desconhecido"

def reconhecer_placa(caminho_imagem):
    return "RFA4I58"

def identificar_status_moto():
    status_possiveis = ["Pronta para uso", "Em manutenção", "Aguardando manutenção"]
    return random.choice(status_possiveis)