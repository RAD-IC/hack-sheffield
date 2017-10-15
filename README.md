#Hack Sheffield

##Inspiration
Drawing inspiration from our past experiences in university halls during our first year, we wanted to build a project that could make the difference for freshers. We found that it was pretty common to get locked out of one's room - doors locking behind us did not simplify the question at all - and this motivated to us working on a Slightly Smarter Door.

#What it does
Our device has 2 major features. The first is an alert system to prevent you from forgetting your keys. If, upon touching the door handle sensor (i.e. you're on your way out), you are about to forget your keys in the provided key-dock-area, an alarm will go off reminding you of your keys. Precious fresher time will be saved.
Another issue we found is that students often use headphones whilst in their rooms (halls can be very loud); this however means they may miss the faint sound of friends knocking on their door. Our device can detect knocks on a door using a Piezo Vibration Sensor and then notify the users, wirelessly, on their computers to notify them someone has knocked.

#How we built it
Production of Slightly Smarter Door was split into three distinct areas that were gradually integrated throughout the hackathon.
Some of us started off by developing the key detection system in order to get familiar with programming the Arduino then moving on to working with the Piezo vibration sensor. 
Whilst we did that other members of the group worked on setting up servers so that the device could report to a server which could then notify the end user. This meant once the sensors had been set up we could work on sending the data to the servers.
Finally we also focused on working on a simple yet functional frontend.


#Challenges we ran into
During this project our group used a lot of hardware that we had never used before.
This meant that we had to quickly, and practically, learn how to interact, build, and program with these foreign pieces of technology.
We have scripts deploying multiple nodeJS instances which inter-communicate, as clients, using websockets with an AWS server. This meant that right from the start we were forced to occasionally build remotely, slowing greatly production times. 

#Accomplishments that we're proud of
We are very happy to have produced what, in our eyes, looks as a decently functional IoT device. Surely its scope might have been quite limited, yet we believe the entirety of the infrastructure set up for server-to-server-to-server communication is solid and could withstand much greater scale applications. We're also very glad to have been able to use multiple languages creatively in multiple ways. From web-based Javascript to ruby and python scripting, passing by C and C++ for arduino and audio management respectively.


#What we learned
Throughout this hackathon we learnt -the hard way - how crucial it is to plan the structure servers must have before we actually start implementing them. Programming the communication between the servers took more than what we initially planned, and in the future we will be sure to plan more carefully ahead. We believe we've all greatly enhanced our group related skills; we will be leaving Sheffield as tighter group, and as a highly motivated team.


#What's next for S.S.Door
We are looking to extend S.S.Door to support higher quality sensors to perform data analysis on knocking patterns, aiming to recognise who exactly is knocking on your door.
By possibly introducing facial recognition, we plan to notify different people living in a same shared house when they, accordigly, forget their keys. 
