PROG = sheffield
CFLAGS = -Wall -Werror -pedantic -std=gnu99 -lcurl
CSOURCES = $(shell find -name '*.c')

.PHONY : all clean

all:
	gcc $(CFLAGS) -o $(PROG) $(CSOURCES)

clean:
	rm -f *~ $(shell find -name '*.o') $(PROG)
