FROM node:18-alpine

WORKDIR /code

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 3000
CMD [ "npm", "start" ]
