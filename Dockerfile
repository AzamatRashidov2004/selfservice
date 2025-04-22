FROM node:18-alpine

# Install requirements
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Env vars required for build
# FixMe: Passing secrets this way is insecure.
ARG VITE_ENVIRONMENT
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_URL
ARG VITE_KRONOS_API_KEY
ARG VITE_KRONOS_URL
ARG VITE_MAESTRO_URL

RUN echo "<DEBUG_START>" \
    && echo $VITE_ENVIRONMENT \
    && echo $VITE_KEYCLOAK_CLIENT_ID \
    && echo $VITE_KEYCLOAK_REALM \
    && echo $VITE_KEYCLOAK_URL \
    && echo $VITE_KRONOS_API_KEY \
    && echo $VITE_KRONOS_URL \
    && echo $VITE_MAESTRO_URL \
    && echo "<DEBUG_END>"

# Build the React app
RUN npm run build

# Serve the built app
CMD ["npm", "run", "preview"]

EXPOSE 8080
