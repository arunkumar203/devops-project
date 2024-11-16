# Base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install && npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]