/* Main.cpp */

#include "includes/include.h"
#include "serial/serial.h"

#define BUFFER_DATA_SIZE 2
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

    bool keyInDock;
    bool handleTouched;

    while (true) {

        uint8_t* data = readByteData(BUFFER_DATA_SIZE);
        if(data){
            keyInDock = data[0] == 1;
            handleTouched = data[1] == 1;

            free(data);
        }

        uint8_t* buffer = (uint8_t*) malloc (sizeof(uint8_t) * BUFFER_DATA_SIZE);

        buffer[0] = buffer[1] = keyInDock && handleTouched;

        sendByteData(buffer, getMillis());
    }

	return 0;
}
