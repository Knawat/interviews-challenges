FROM node:12.18.3

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]