# -*- coding: utf-8 -*-
import io
import os
from google.cloud import vision
from google.cloud.vision import types

client = vision.ImageAnnotatorClient()
with io.open('/home/mauro/Imágenes/capture.png', 'rb') as image_file:
	content = image_file.read()
image = vision.types.Image(content=content)

response = client.text_detection(image=image)
texts = response.text_annotations
print('Texts:')

for text in texts:
	print('\n"{}"'.format(text.description))
	vertices = (['({},{})'.format(vertex.x, vertex.y)
		for vertex in text.bounding_poly.vertices])
	print('bounds: {}'.format(','.join(vertices)))
