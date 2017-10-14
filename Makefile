PROG = sheffield
CFLAGS = -Wall -Werror -pedantic -std=c99
CSOURCES = $(shell find -maxdepth 1 -name '*.c')

.PHONY : all clean

all:
	gcc $(CFLAGS) -o $(PROG) $(CSOURCES)

clean:
	rm -f *~ $(shell find -name '*.o') $(PROG)
