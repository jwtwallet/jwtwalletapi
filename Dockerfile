# Builder stage
FROM node:20.12-bullseye as builder
RUN corepack enable

# Setup working directory
WORKDIR /app


COPY --chown=node:node .yarnrc.yml package.json yarn.lock ./

# Installing all dependencies
RUN yarn install --immutable

# Copying source files
COPY --chown=node:node ./src /app/src
COPY --chown=node:node tsconfig.json nest-cli.json  /app/

# Running the package script
RUN yarn build

# Runner stage
FROM node:20.12-bullseye as runner
RUN corepack enable

WORKDIR /app

COPY --chown=node:node .yarnrc.yml package.json yarn.lock ./
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

# Setting environment variables
ENV NODE_ENV production

# Exposing port
EXPOSE 3000

# Setting the command to run
CMD [ "node", "--enable-source-maps", "dist/main" ]
