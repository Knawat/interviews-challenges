FROM node:lts-alpine


RUN mkdir /app
WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./


RUN npm install --silent --progress=false --production

COPY . . -node_modules/

CMD ["npm", "start"]