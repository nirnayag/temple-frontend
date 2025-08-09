# Use Node.js 20 Alpine for compatibility with React Router 7.6.2
FROM node:20-alpine

# Install serve globally first
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables for build
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN npm run build

# Remove node_modules to reduce image size
RUN rm -rf node_modules

# Expose port
EXPOSE 3000

# Start command with dynamic port
CMD ["sh", "-c", "serve -s build -p ${PORT:-3000}"]