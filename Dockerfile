FROM node:20-alpine
COPY . /app
WORKDIR /app
CMD ["index.js"]