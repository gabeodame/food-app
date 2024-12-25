FROM node:alpine3.19

WORKDIR /app

COPY package.json .

RUN npm install 

ENV MONGO_URI=mongodb://auth-mongo-service:27017/auth

COPY . .

CMD [ "npm", "start" ]