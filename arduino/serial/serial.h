#ifndef SERIAL_H
#define SERIAL_H

#include "../includes/include.h"

/* Serial port initialisation */
void setupSerial(const char* portname);

/* Serial port initialisation helper funcions */
int set_interface_attribs (int fd, int speed, int parity);
void set_blocking (int fd, int should_block);

/* Serial port communication handlers */
void sendByteData(uint8_t*, double);
uint8_t* readByteData();

#endif // SERIAL_H
