FROM arm32v7/node:8.11.4-jessie

WORKDIR /usr/

# package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY ./src/ ./src/

# set default zip to Seattle
ENV zip 98101

# set default to ten minutes (ms)
ENV interval 600000

# Need sudo to be able to access GPIO
RUN apt-get update && apt-get -y install sudo

# Copy entry script
COPY ./entry.sh ./

# Entry script to be able to catch interrupts
ENTRYPOINT ["./entry.sh"]

CMD ["sh", "-c", "npm start -- ${zip} ${interval}"]
