FROM arm32v7/node:8

COPY qemu-arm-static /usr/bin/

# create a directory for client
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# install app dependencies
COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

# bind to port 3000
EXPOSE 3000

CMD ["npm", "run", "server"]
