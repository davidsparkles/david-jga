FROM node:14

ARG PORT=${PORT}
ARG DATABASE_URL=${DATABASE_URL}

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY index.ts ./index.ts

COPY frontend ./frontend

EXPOSE 80

CMD yarn run start
