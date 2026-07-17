FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npx tsc -p tsconfig.server.json
EXPOSE 3001
CMD ["node", "dist-server/server.js"]
