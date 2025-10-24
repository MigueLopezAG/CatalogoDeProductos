FROM node:18-alpine

WORKDIR /app

# copy package.json adn package-lock.json
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencioes
RUN npm ci

# copy source code
COPY . .

# build aplication
RUN npm run build

# port exposed
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]