FROM node:18-alpine

# Install requirements
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Make version globally available
ARG VERSION
ENV VERSION=$VERSION

# Serve the built app
CMD ["npm", "run", "preview"]

EXPOSE 8080
