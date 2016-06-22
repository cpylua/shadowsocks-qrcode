FROM nodesource/node:4.2.5

COPY package.json package.json
COPY index.js index.js
RUN npm install

CMD ["node", "index.js"]
