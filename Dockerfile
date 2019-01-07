FROM node:10

RUN mkdir /app
WORKDIR /app

# ENV NODE_ENV=production

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
