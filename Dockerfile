FROM arm32v7/node:8.11.4-jessie

WORKDIR /usr/

# package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY ./src/ ./src/

# set default zip to Seattle
ENV zip 98101

ENV interval 600000

RUN apt-get update && apt-get -y install sudo

CMD ["sh", "-c", "npm start -- ${zip} ${interval}"]
