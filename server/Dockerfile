FROM node:21-alpine

WORKDIR /app/server/

COPY package.json package-lock.json ./

RUN npm install

COPY  . .

EXPOSE 8080

CMD ["npm", "start"]