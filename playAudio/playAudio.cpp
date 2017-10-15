#include <GL/glew.h>		// include GLEW and new version of GL on Windows
#include <GLFW/glfw3.h> // GLFW helper library
#include <SFML/Audio.hpp>

#include <sys/time.h>

using namespace std;

/* */
double getMillis() {

    struct timeval  tv;
    gettimeofday(&tv, NULL);

    /* Convert tv_sec & tv_usec to millisecond */
    double time_in_mill = (tv.tv_sec) * 1000 + (tv.tv_usec) / 1000 ;

    return time_in_mill;
}

int main(int argc, char** argv)
{
    if (argc < 2) {
        fprintf(stderr, "Please specify path of sound to be played\n");
        exit(-1);
    }

    const char* path = argv[1];

    double loggedMillis = getMillis();

    sf::SoundBuffer buffer;
    if (!buffer.loadFromFile(path)) {
        return -1;
    }

    sf::Sound sound;
    sound.setBuffer(buffer);
    sound.play();

    while (getMillis() <= loggedMillis + 2000);

    return 0;
}
