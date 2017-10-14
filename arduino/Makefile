PROG = sheffield
CFLAGS = -Wall -Werror -pedantic -std=gnu99
CSOURCES = $(shell find -name '*.c')

.PHONY : all clean

all:
	gcc $(CFLAGS) -o $(PROG) $(CSOURCES)

clean:
	rm -f *~ $(shell find -name '*.o') $(PROG)
