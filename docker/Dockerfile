FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 33455 33456 8000 8001

ENTRYPOINT ["./docker/start.sh"]
