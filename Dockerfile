FROM node:18.19.0 as development
USER node
RUN mkdir /home/node/eda_app
WORKDIR /home/node/eda_app
COPY --chown=node:node package*.json ./
RUN yarn
COPY --chown=node:node . .
CMD [ "tail", "-f", "/dev/null" ]

FROM node:18.19.0-alpine3.19 as builder
USER node
RUN mkdir /home/node/eda_app
WORKDIR /home/node/eda_app
COPY --chown=node:node --from=development /home/node/eda_app ./
RUN yarn build
ENV NODE_ENV production
RUN yarn --only=production

FROM node:18.19.0-alpine3.19 as production
USER node
RUN mkdir /home/node/eda_app
WORKDIR /home/node/eda_app
COPY --chown=node:node --from=builder /home/node/eda_app/dist ./dist
COPY --chown=node:node --from=builder /home/node/eda_app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/eda_app/package.json ./
EXPOSE 3000
ENV NODE_ENV production
CMD [ "yarn", "start:prod" ]