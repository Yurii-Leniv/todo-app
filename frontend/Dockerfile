FROM node:22-slim

WORKDIR /app

# Same layer-caching reasoning as the backend Dockerfile: dependencies only
# get reinstalled when package.json/package-lock.json actually change.
COPY package.json package-lock.json ./

# Cypress is a devDependency, but this image only ever runs the built app
# (or Jest, in CI) — never Cypress itself, which runs against this app from
# a separate cypress/included container. Skipping its ~200MB browser
# download keeps every build of this image faster and avoids depending on
# download.cypress.io just to build an unrelated image.
ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci

COPY . .

# NEXT_PUBLIC_* variables are inlined into the client-side JS bundle at
# build time, not read at container startup — unlike a typical backend env
# var, setting this at `docker run` time would have no effect. It has to be
# provided as a build ARG instead, which docker-compose.yml does.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
