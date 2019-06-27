# version 8 of node
FROM arm32v7/node:8-slim

# create a directory for client
RUN "mkdir -p /home/node/app"
WORKDIR /home/node/app

# install app dependencies
COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

# bind to port 3000
EXPOSE 3000

COPY qemu-arm-static /usr/bin/

CMD ["npm", "run", "server"]
