FROM node:alpine3.19

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

CMD [ "npm", "start" ]