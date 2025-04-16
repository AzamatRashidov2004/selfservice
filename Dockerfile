# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app into the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Command to run the app in production mode (serve the built app)
CMD ["npm", "run", "preview"]
