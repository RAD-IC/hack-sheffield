/* Main.cpp */

#include "includes/include.h"
#include "serial/serial.h"

#define BUFFER_DATA_SIZE 1
#define C_AUTH 200

/* */
double getMillis() {

    struct timeval  tv;
    gettimeofday(&tv, NULL);

    /* Convert tv_sec & tv_usec to millisecond */
    double time_in_mill = (tv.tv_sec) * 1000 + (tv.tv_usec) / 1000 ;

    return time_in_mill;
 }

int main(int argc, char** argv) {

    if (argc < 2) {
        fprintf(stderr, "No device path for aruino selected\n");
        exit(-1);
    }

    /* "/dev/ttyACM0" */
    const char* path = argv[1];

    /* Force communication */
    setupSerial(path);

    while (true) {
        uint8_t* buffer = (uint8_t*) malloc (sizeof(uint8_t) * BUFFER_DATA_SIZE);

        for (int i = 0; i < BUFFER_DATA_SIZE; i++) {
            buffer[i] = 1;
        }

        sendByteData(buffer, getMillis());

        uint8_t* data = readByteData(BUFFER_DATA_SIZE);

        free(data);
    }

	return 0;
}
