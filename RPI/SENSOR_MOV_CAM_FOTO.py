
#Project 13 - Burglar Detector With Photo Capture
#latest code updates available at: https://github.com/RuiSantosdotme/RaspberryPiProject
#project updates at: https://nostarch.com/RaspberryPiProject

#import the necessary packages
from gpiozero import Button, MotionSensor
from picamera import PiCamera
from time import sleep
from signal import pause
from google.cloud import texttospeech
import pygame
import requests

client = texttospeech.TextToSpeechClient()
voice = texttospeech.types.VoiceSelectionParams(language_code='es-ES', ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)
audio_config = texttospeech.types.AudioConfig(audio_encoding=texttospeech.enums.AudioEncoding.MP3)

button = Button(2)
pir = MotionSensor(4)
camera = PiCamera()
camera.rotation = 180
camera.start_preview()
i = 0

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

def stop_camera():
    camera.stop_preview()
    exit()

def take_photo():
    global i
    i = i + 1
    client = texttospeech.TextToSpeechClient()
    camera.capture('/home/pi/Foto.jpg' )

    r = requests.post('http://api.sochamar.cl/visitor', files = {'files': open("/home/pi/Foto.jpg", 'rb')})
    voz("Verificando...")
    sleep(1)
    print (r.status_code)
    if r.status_code == 201:
        voz("Bienvenido!")
    if r.status_code == 202:
        voz("Ingrese nuevamente su tarjeta...")

print ("OKS")
button.when_pressed = stop_camera
pir.when_motion = take_photo
pause()
