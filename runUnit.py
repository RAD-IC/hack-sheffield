import sys
from subprocess import call

execPath = sys.argv[1]
port = "dev/cu.usbmodem1421"
sketchPath = "board/arduino/arduino.ino"

boardCmd = execPath + " --port " + port + " --upload " + sketchPath

call(boardCmd, shell=True);

arduinoPath = "Arduino/"

arduinoCmd = "cd " + arduinoPath + " &&  make && ./sheffield"

call(arduinoCmd, shell=True);


