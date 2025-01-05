# Use the official Node.js 18 Alpine base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight image for the final production build
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependencies and built application from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
