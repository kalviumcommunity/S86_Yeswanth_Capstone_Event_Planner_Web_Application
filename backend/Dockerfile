FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
