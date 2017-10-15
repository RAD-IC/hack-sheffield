PROG = audio
CXXFLAGS = -Wall -Werror -pedantic -std=c++11
CPPSOURCES = $(shell find -name '*.cpp')
INC = -I ../common/include
SFML_LIB = -lsfml-audio -lsfml-system
SYS_LIB = -lGL

.PHONY : all clean

all:
	$(CXX) $(CXXFLAGS) -o $(PROG) $(CPPSOURCES) $(INC) $(SYS_LIB) $(SFML_LIB)

clean:
	rm -f *~ $(shell find -name '*.o') $(PROG)
