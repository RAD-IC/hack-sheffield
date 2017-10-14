#include <Servo.h>
#include <time.h>
#include <stdlib.h>

/* threshold for updates.
   Applies to both servo Motor communiction ans Serial port. */
#define updateMilliThreshold 100

/* General global value definitions */
#define ARDUINO_ID 201
#define C_ID 200
#define BUFFER_DATA_LENGTH 5
#define BAUDRATE 9600

long updateTime = 0;

/* Main setup loop for BAoBOS. */
void setup() {
  /* Begin communication over Serial Port with a baud
     rate of 9600*/
  Serial.begin(BAUDRATE);
}

/* Main Arduino loop */
void loop() {
  /* Temporary bool to handle serial port writing. By default set to
     true, will be invalidated should the write speed be faster than a
     given threshold */
  bool writeToSerial = true;

  /* Retrieve the mmilliseconds elapsed since the beginning of the
     sessioon. */
  long curMillis = millis();

  /* Trigger every updateMilliThreshold */
  if (!(curMillis - updateTime >= updateMilliThreshold)) {
    /* Prevent writing to serial to avoid serial port data overflow */
    writeToSerial = false;
  }

  /* Wait for 6 bytes of data to have been sent over serial */
  if (Serial.available() >= BUFFER_DATA_LENGTH + 1) {
    /* Peek at the first byte to determine if it's a valid read ID */
    uint8_t peekVal = Serial.peek();

    /* ID of 200 is used by BAoBUI */
    if (peekVal == C_ID) {
      /* Read the servoAngles */
      Serial.read();

      for (int i = 0; i < BUFFER_DATA_LENGTH; i++) {
        uint8_t data = (uint8_t) Serial.read();

        // TODO: Do something with data
      }

      /* Force a reply */
      writeToSerial = true;      
    } else {
      Serial.read();
    }
  }

  /* When it is possible to reply to serial */
  if (writeToSerial) {
    /* Identification byte */
    Serial.write(ARDUINO_ID);

    for (int i = 0; i < BUFFER_DATA_LENGTH; i++) {
        Serial.write((uint8_t) 0);

        // TODO: Instead of writing zero, write something else
      }
  }
}
