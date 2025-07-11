FROM node:18-alpine

# Install requirements
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Env vars required for build
# FixMe: Passing secrets this way is insecure.
ARG VERSION
ARG ENVIRONMENT
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_REALM
ARG KEYCLOAK_URL
ARG KRONOS_API_KEY
ARG KRONOS_URL
ARG MAESTRO_URL

RUN echo "<DEBUG_START>" \
    && echo $ENVIRONMENT \
    && echo $KEYCLOAK_CLIENT_ID \
    && echo $KEYCLOAK_REALM \
    && echo $KEYCLOAK_URL \
    && echo $KRONOS_URL \
    && echo $MAESTRO_URL \
    && echo "<DEBUG_END>"

# Make version available to Vite
ENV VERSION=$VERSION

# Build the React app
RUN npm run build

# Serve the built app
CMD ["npm", "run", "preview"]

EXPOSE 8080
