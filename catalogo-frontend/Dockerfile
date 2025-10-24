FROM node:18-alpine

WORKDIR /app

# Copy package.json y package-lock.json
COPY package*.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Port exposed
EXPOSE 3001

# Command to start application
CMD ["npm", "start"]