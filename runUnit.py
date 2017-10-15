import sys
import subprocess
import time

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
IO = 1421
for output in splitOutput:
    num = int(output[11:])
    if(num != 1411):
        IO = num


arduinoPath = "Arduino/"

arduinoCmd = "cd " + arduinoPath + \
    " &&  make && ./sheffield /dev/cu.usbmodem" + str(IO) + \
    " " + modelNumber

time.sleep(1)

subprocess.call(arduinoCmd, shell=True)
