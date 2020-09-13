
from google.cloud import texttospeech
import pygame
from time import sleep

client = texttospeech.TextToSpeechClient()
voice = texttospeech.types.VoiceSelectionParams(language_code='es-ES', ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)
audio_config = texttospeech.types.AudioConfig(audio_encoding=texttospeech.enums.AudioEncoding.MP3)

def voz( str ):
    synthesis_input = texttospeech.types.SynthesisInput(text=str)
    response = client.synthesize_speech(synthesis_input, voice, audio_config)
    with open('output.mp3', 'wb') as out2:
        out2.write(response.audio_content)
        print('Audio content written to file "output.mp3"')
    out2.close()
    pygame.mixer.init()
    pygame.mixer.music.load("output.mp3")
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy() == True:
        continue
    return;

voz("Enviando imagenes!")
sleep(5)
voz("Verificando...")
sleep(5)
voz("Bienvenido!")
sleep(5)
voz("Lo siento no hemos podido reconocer su tarjeta")

# pygame.mixer.music.load("output.mp3")
# pygame.mixer.music.play()
# while pygame.mixer.music.get_busy() == True:
#     continue
