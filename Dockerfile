FROM node:20

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY package.json ./

USER node

RUN npm install
COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
