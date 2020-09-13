# -*- coding: utf-8 -*-
import io
import os
from google.cloud import vision
from google.cloud.vision import types
from gpiozero import Button, MotionSensor
from picamera import PiCamera
from time import sleep
from signal import pause

button = Button(2)
pir = MotionSensor(4)
camera = PiCamera()

camera.rotation = 180
camera.start_preview()

i = 0

def stop_camera():
    camera.stop_preview()
    exit()

def take_photo():
    global i
    i = i + 1
    nombreFoto = '/home/pi/image_%s.jpg' % i
    camera.capture(nombreFoto)
    print('A photo has been taken')
    sleep(10)
    client = vision.ImageAnnotatorClient()
    with io.open(nombreFoto, 'rb') as image_file:
        content = image_file.read()
    image = types.Image(content=content)
    response = client.text_detection(image=image)
    labels = response.text_annotations
    print('Labels:')
    for label in labels:
        print(label.description)


#assign a function that runs when the button is pressed
button.when_pressed = stop_camera
#assign a function that runs when motion is detected
pir.when_motion = take_photo

pause()
