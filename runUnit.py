import sys
import subprocess

'''
execPath = sys.argv[1]
sketchPath = "board/arduino/arduino.ino"

boardCmd = execPath + " --port  --upload " + sketchPath

subprocess.call(boardCmd, shell=True)
'''

modelNumber = sys.argv[1]

subprocess.call("cd arduino_daemon && node index.js & cd ..", shell=True)

output = subprocess.check_output("ls /dev | grep cu.usbmodem", shell=True)
splitOutput = output.split('\n')
splitOutput = splitOutput[:-1]
lowestIO = 5000
for output in splitOutput:
    num = int(output[11:])
    print(num)
    if(num < lowestIO):
        lowestIO = num


arduinoPath = "Arduino/"

arduinoCmd = "cd " + arduinoPath + \
    " &&  make && ./sheffield /dev/cu.usbmodem" + str(lowestIO) + \
    " " + modelNumber

subprocess.call(arduinoCmd, shell=True)
