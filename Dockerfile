# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
# We still need the original src if we want to use some configs or if tsc-alias depends on it, 
# but usually dist is enough if paths are resolved correctly.
# However, to be safe and simple:
COPY --from=builder /app/package.json ./package.json

EXPOSE 3500

CMD ["node", "dist/server.js"]
