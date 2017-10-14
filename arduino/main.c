/* Main.cpp */

#include <stdio.h>
#include <curl/curl.h>

#include "includes/include.h"
#include "serial/serial.h"

#define BUFFER_DATA_SIZE 3
#define C_AUTH 200

#define MODEL_NAME 12345678

/* */
double getMillis() {

    struct timeval  tv;
    gettimeofday(&tv, NULL);

    /* Convert tv_sec & tv_usec to millisecond */
    double time_in_mill = (tv.tv_sec) * 1000 + (tv.tv_usec) / 1000 ;

    return time_in_mill;
}

void send_post_request(int modelNumber, char *type)
{
    CURL *curl;
    CURLcode res;

    /* In windows, this will init the winsock stuff */
    curl_global_init(CURL_GLOBAL_ALL);

    /* get a curl handle */
    curl = curl_easy_init();
    if(curl) {
        char req[5000] = "";
        sprintf(req, "model=%d&type=%s", modelNumber, type);

        /* First set the URL that is about to receive our POST. This URL can
           just as well be a https:// URL if that is what should receive the
           data. */
        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost");
        curl_easy_setopt(curl, CURLOPT_PORT, 3004);

        /* Now specify the POST data */
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, req);

        /* Perform the request, res will get the return code */
        res = curl_easy_perform(curl);

        /* Check for errors */
        if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\n",
                    curl_easy_strerror(res));

        /* always cleanup */
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
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
    bool knock = false;
    bool knockingEdge = false;

    /* data[2] get 1 when there is a knock */
    while (true) {

        uint8_t* data = readByteData(BUFFER_DATA_SIZE);
        if(data){
            keyInDock = data[0];
            handleTouched = data[1];
            knock = data[2];
            free(data);
        }

        uint8_t* buffer = (uint8_t*) malloc (sizeof(uint8_t) * BUFFER_DATA_SIZE);

        buffer[0] = buffer[1] = keyInDock && handleTouched;
        sendByteData(buffer, getMillis());
        if (knock && !knockingEdge) {
            knockingEdge = true;
            send_post_request(MODEL_NAME, "knock");
        } else {
            if (!knock && knockingEdge) {
                knockingEdge = false;
            }
        }
    }

    return 0;
}

