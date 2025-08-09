# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps --production=false

# Copy source code
COPY . .

# Set environment variables for build
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build:prod

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start command
CMD ["serve", "-s", "build", "-p", "3000"]