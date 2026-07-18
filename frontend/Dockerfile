FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci

COPY . .

# NEXT_PUBLIC_* vars are inlined at build time, not read at container
# startup — a docker run -e would have no effect, so it must be an ARG.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
