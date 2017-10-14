#include <Servo.h>
#include <time.h>
#include <stdlib.h>

/* threshold for updates.
   Applies to both servo Motor communiction ans Serial port. */
#define updateMilliThreshold 100

/* General global value definitions */
#define ARDUINO_ID 201
#define C_ID 200
#define BUFFER_DATA_LENGTH 3
#define BAUDRATE 9600
#define LED_PIN 2
#define LIGHT_SENSOR_PIN A0
#define TOUCH_SENSOR_PIN 3
#define BUZZER_PIN 4
#define PIEZO_PIN A1

long updateTime = 0;

/* Main setup loop for BAoBOS. */
void setup() {
  /* Begin communication over Serial Port with a baud
     rate of 9600*/
  Serial.begin(BAUDRATE);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  pinMode(TOUCH_SENSOR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
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

      uint8_t data = (uint8_t) Serial.read();
      if(data == 1) {
        digitalWrite(BUZZER_PIN, HIGH);
      } else {
        digitalWrite(BUZZER_PIN, LOW);
      }
      Serial.read();
        

      /* Force a reply */
      writeToSerial = true;      
    } else {
      Serial.read();
    }
  }

  /* When it is possible to reply to serial */
  if (writeToSerial) {
    updateTime = curMillis;
    /* Identification byte */
    Serial.write(ARDUINO_ID);

    Serial.write(analogRead(LIGHT_SENSOR_PIN) < 800 );
    Serial.write(digitalRead(TOUCH_SENSOR_PIN));
    Serial.write(analogRead(PIEZO_PIN) > 600);
    
  }
}
