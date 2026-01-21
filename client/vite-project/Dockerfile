FROM node:20-alpine AS builder

WORKDIR /app

#Copy package.json and package-lock.json
COPY package*.json ./

#Run 
RUN npm ci

# Copy source code
COPY . .

#Build production
RUN npm run build

#STAGE 2: Production
FROM nginx:alpine

#Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

#COPY nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]