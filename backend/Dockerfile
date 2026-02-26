FROM node:20-alpine

WORKDIR /app/backend

ENV NODE_ENV=production

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]

