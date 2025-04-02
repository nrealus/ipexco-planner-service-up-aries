FROM ubuntu:noble
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get upgrade -y
RUN apt install libffi-dev -y

RUN apt-get install -y make 
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y cmake 
RUN apt-get install -y g++
RUN apt-get install -y libboost-all-dev
RUN apt-get install -y autoconf
RUN apt-get install -y bison 
RUN apt-get install -y flex
RUN apt-get install -y libgrpc++1
RUN apt-get install -y libeigen3-dev
RUN apt-get install -y pkgconf
RUN apt-get install -y libgrpc++-dev 
RUN apt-get install -y  libprotobuf-dev
RUN apt-get install -y  protobuf-compiler
RUN apt-get install -y  protobuf-compiler-grpc

# Python
RUN apt-get remove -y python3.12
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt-get update -y
RUN apt-get install -y python3.11
RUN python3 --version
RUN apt-get install -y python3-pip
RUN python3 -m pip install numpy --break-system-packages
RUN python3 -m pip install scipy --break-system-packages
RUN python3 -m pip install mip --break-system-packages

# Unified planning (Python)
RUN python3 -m pip install unified-planning --break-system-packages
RUN python3 -m pip install unified-planning[grpc] --break-system-packages
# is this (^) needed ?
RUN python3 -m pip install unified-planning[aries] --break-system-packages

## Rust
#RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
#ENV PATH="/root/.cargo/bin:${PATH}"

#spot
RUN apt-get install -y ca-certificates wget gnupg
RUN wget -q -O - https://www.lrde.epita.fr/repo/debian.gpg | apt-key add -
RUN echo 'deb http://www.lrde.epita.fr/repo/debian/ stable/' >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y spot libspot-dev

# Planning scripts (+ maybe binaries)
RUN mkdir -p /usr/src/beluga-up-aries
COPY beluga-up-aries/ /usr/src/beluga-up-aries/
WORKDIR /usr/src/beluga-up-aries

RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/temp

#install Node.js
WORKDIR /usr/src/app
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

#copy app bin
COPY src/ /usr/src/app/src
COPY package-lock.json/ /usr/src/app
COPY package.json/ /usr/src/app
COPY tsconfig.json/ /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm install -g ts-node

## run
#EXPOSE 3333

ENV PLANNER_SERVICE_PLANNER="/usr/src/beluga-up-aries/beluga.py"
ENV TEMP_RUN_FOLDERS="/usr/temp"

WORKDIR /usr/src/app/
CMD npm start
