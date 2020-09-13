import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
PIN_PIR = 17
GPIO.setup(PIN_PIR, GPIO.IN)

while True:
	if(GPIO.input(PIN_PIR)):
		print ("OLA")
	else:
		print ("bajaaaaadaaa")
