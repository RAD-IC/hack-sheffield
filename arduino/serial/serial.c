#include "serial.h"

#define C_ID 200
#define ARDUINO_ID 201

/* ---------------------------- SERIAL PORT --------------------------------- */

/* Serial port file descriptor used for handling */
int serialFd;

/* Boolean to keep track of serial successful initialisation status */
bool isSerialReady;

/* Keeps track of time intervals inbetween serial writes.
   Necessary to synch read and write time intervals */
double updateTime = 0;
float writeTimeInterval = 0.05f;

/* The following functions to set up serial communication were taken from:
https://stackoverflow.com/questions/6947413/how-to-open-read-and-write-from-serial-port-in-c
 */

/* Helper function which sets the attributes for serial port communication */
int set_interface_attribs (int fd, int speed, int parity)
{
	struct termios tty;
	memset (&tty, 0, sizeof tty);
	if (tcgetattr (fd, &tty) != 0)
	{
		fprintf( stderr, "error %d from tcgetattr", errno);
	  return -1;
	}

	cfsetospeed (&tty, speed);
	cfsetispeed (&tty, speed);

	tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;     // 8-bit chars
	// disable IGNBRK for mismatched speed tests; otherwise receive break
	// as \000 chars
	tty.c_iflag &= ~IGNBRK;         // disable break processing
	tty.c_lflag = 0;                // no signaling chars, no echo,
	                                // no canonical processing
	tty.c_oflag = 0;                // no remapping, no delays
	tty.c_cc[VMIN]  = 0;            // read doesn't block
	tty.c_cc[VTIME] = 5;            // 0.5 seconds read timeout

	tty.c_iflag &= ~(IXON | IXOFF | IXANY); // shut off xon/xoff ctrl

	tty.c_cflag |= (CLOCAL | CREAD);// ignore modem controls,
	                                // enable reading
	tty.c_cflag &= ~(PARENB | PARODD);      // shut off parity
	tty.c_cflag |= parity;
	tty.c_cflag &= ~CSTOPB;
	tty.c_cflag &= ~CRTSCTS;

	if (tcsetattr (fd, TCSANOW, &tty) != 0)
	{
	  fprintf( stderr, "error %d from tcsetattr", errno);
	  return -1;
	}
	return 0;
}

/* Helper funtion to set blocking serial port communication */
void set_blocking (int fd, int should_block)
{
	struct termios tty;
	memset (&tty, 0, sizeof tty);
	if (tcgetattr (fd, &tty) != 0)
	{
    fprintf( stderr, "error %d from tggetattr", errno);
    return;
	}

	tty.c_cc[VMIN]  = should_block ? 1 : 0;
	tty.c_cc[VTIME] = 5;            // 0.5 seconds read timeout

	if (tcsetattr (fd, TCSANOW, &tty) != 0)
    fprintf(stderr, "error %d setting term attributes", errno);
}

/* Serial port setup function.
   Given a port name it opens the port if available.
   Should no device be listening on said port the program keeps running but all
   serial communication will be disabled. */
void setupSerial(const char* portname) {
  serialFd = open (portname, O_RDWR | O_NOCTTY | O_SYNC);
  isSerialReady = true;

  /* Open will return -1 as a filedescriptor should there be an error */
  if (serialFd < 0)
	{
    fprintf(stderr, "Serial Port Error %d\n", errno);
    fprintf(stderr, "Could not open %s: %s\n", portname, strerror (errno));
    isSerialReady = false;
	}

  /* If serial has been opened correctly proceed to set Baudrate and blocking */
  if (isSerialReady) {
    /* BaudRate is set to 115200 bps with no parity check */
  	set_interface_attribs (serialFd, B9600, 0);

    /* Serial communication will be non blocking */
  	set_blocking (serialFd, 0);
  }
}

/* Sends sizeof(data) serialised bytes of data over the serial port.
   Bytes are uint8_t values allowed between 0 <= x <= 199 */
void sendByteData(uint8_t* data, double timeData) {
  /* Keep track of time intervals inbetween updates */
  double deltaTime = timeData - updateTime;

  /* Serial must be intialised */
  if (isSerialReady && deltaTime >= writeTimeInterval) {
    /* An extra byte is sent prior to the 5 data bytes.
       The value 200 is sent to authenticate the data as sent from the PC. */
  	uint8_t bytes_to_send[1];
  	bytes_to_send[0] = C_ID;

    /* The authentication byte is written over the serial port */
    write (serialFd, bytes_to_send, 1);
  	usleep ((1 + 25) * 100);

    /* The actual serialised data is written over the serial port.
       A minimal sleep delay is necessary to process the write command */
  	write (serialFd, data, sizeof(data));
  	usleep ((sizeof(data) + 25) * 100);

    /* The data byte was malloced and must be freed */
    free(data);

    /* Update the last-update.time with the new timeData */
    updateTime = timeData;
  }
}

/* Reads and returns num bytes of data from the Serial Port.
   NOTE: Must free received buffer */
uint8_t* readByteData(int num) {
  if (isSerialReady) {
    /* Determines the number of bytes pending on the serial port */
    int bytes_avail;
    ioctl(serialFd, FIONREAD, &bytes_avail);

    /* Should there be more than 6 bytes reading can proceed */
    if (bytes_avail >= num+1) {
      /* The authentication byte is read */
      uint8_t auth [1];
      read (serialFd, auth, sizeof auth);

      /* We only accept data sent by Arduino with auth code 201 */
      if (auth[0] == ARDUINO_ID) {
        /* Allocates a new buffer to store the data to be read */
        uint8_t* buf = (uint8_t*) malloc(sizeof (uint8_t) * num);
        read (serialFd, buf, sizeof buf);  // read up to 100 characters if ready to read

		printf("Read %i Bytes\n", num);

        /* Serial Read data is printed to stout */
        for (int i = 0; i < num; i++) {
            printf("%i ", buf[i]);
        }
        printf("\n");

        /* Return the newly initialised buffer. Must be freed later */
        return buf;
      }
    }
  }

  /* Returns NULL when no read can be performed */
  return NULL;
}
