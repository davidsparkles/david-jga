FROM node:14

ARG PORT=${PORT}
ARG DATABASE_URL=${DATABASE_URL}

RUN npm install -g yarn

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN npm install --save-prod

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY index.ts ./index.ts

COPY frontend ./frontend
RUN npm build

CMD npm start
