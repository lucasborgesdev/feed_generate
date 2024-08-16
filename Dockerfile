# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

# Crie o diretório de trabalho e ajuste as permissões antes de mudar o usuário
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Ajustar permissões do arquivo products_feed.xml
USER root
RUN chown node:node /usr/src/app/products_feed.xml

# Expose the port that the application listens on.
EXPOSE 4000

# Run the application.
CMD ["node", "server.js"]
