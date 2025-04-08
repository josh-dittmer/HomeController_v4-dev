FROM ubuntu:latest
LABEL Description="HomeController development environment"

RUN apt -y update && apt install -y
RUN apt install -y g++ make cmake git unzip python3-setuptools wget curl ca-certificates gdb libssl-dev libglib2.0-dev libsystemd-dev bluez

# install docker and docker compose

RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc

RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# confirm installation

RUN docker --version
RUN docker compose version

# install node and npm

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash

RUN apt-get update
RUN apt-get install -y nodejs

# confirm installation

RUN node -v
RUN npm -v

# install flatbuffers compiler

RUN git clone https://github.com/google/flatbuffers.git \
    && cd flatbuffers \
    && cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release \
    && make -j1 \
    && make install

# install required C++ libraries

RUN git clone https://github.com/zaphoyd/websocketpp.git \
    && cd websocketpp \
    && mkdir build \
    && cd build \
    && cmake .. \
    && make install

RUN wget https://gigenet.dl.sourceforge.net/project/asio/asio/1.30.2%20%28Stable%29/asio-1.30.2.tar.gz \
    && tar -xvzf asio-1.30.2.tar.gz \
    && rm asio-1.30.2.tar.gz \
    && cd asio-1.30.2 \
    && ./configure \
    && make install

RUN git clone https://github.com/Tencent/rapidjson.git \
    && cd rapidjson \
    && mkdir build \
    && cd build \
    && cmake .. \
    && make install

RUN git clone https://github.com/socketio/socket.io-client-cpp.git \
    && cd socket.io-client-cpp \
    && cmake ./ \
    && make install

RUN wget https://github.com/joan2937/pigpio/archive/master.zip \
    && unzip master.zip \
    && rm master.zip \
    && cd pigpio-master \
    && make \
    && make install

RUN git clone https://github.com/Kistler-Group/sdbus-cpp.git \
    && cd sdbus-cpp \
    && mkdir build \
    && cd build \
    && cmake .. -DCMAKE_BUILD_TYPE=RELEASE \
    && cmake --build . \
    && cmake --build . --target install


RUN echo "/usr/local/lib" > "/etc/ld.so.conf.d/999local.conf"
RUN ldconfig

RUN rm -r flatbuffers
RUN rm -r websocketpp
RUN rm -r socket.io-client-cpp
RUN rm -r asio-1.30.2
RUN rm -r pigpio-master
RUN rm -r rapidjson

EXPOSE 3000
EXPOSE 42069

# keep container from immediately exiting

CMD [ "tail", "-F", "VqKVJUkBQKmcNkfC" ]
