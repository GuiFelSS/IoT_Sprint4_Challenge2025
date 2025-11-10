def identificar_tipo_moto(moto_id_iot):
    """
    Simula o modelo de ML mapeando o ID do IoT para o tipo da moto.
    Garante consistência entre o sensor IoT e a "visão computacional".
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