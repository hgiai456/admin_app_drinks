FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

COPY . .

EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3003/api/healthcheck || exit 1

CMD ["npm", "start"]