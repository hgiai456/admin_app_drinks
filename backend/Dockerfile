
FROM node:18-alpine

WORKDIR /app

# Giới hạn RAM cho Node (cực kỳ quan trọng)
ENV NODE_OPTIONS=--max-old-space-size=256

# Copy package trước để tận dụng cache
COPY package*.json ./

# Chỉ cài dependency production
RUN npm ci --omit=dev

# Copy source code sau
COPY . .

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/api/healthcheck || exit 1

CMD ["npm", "start"]