/* Main.cpp */

#include "includes/include.h"
#include "serial/serial.h"

int main(int argc, char** argv) {

    if (argc < 2) {
        fprintf(stderr, "No device path for aruino selected\n");
        exit(-1);
    }

    /* "/dev/ttyACM0" */
    const char* path = argv[1];

    /* Force communication */
    setupSerial(path);



	return 0;
}
