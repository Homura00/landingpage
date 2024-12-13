# Use the official Node.js 18 image as base
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 8254
EXPOSE 8254

# Start the application
CMD [ "node", "server.js" ]
