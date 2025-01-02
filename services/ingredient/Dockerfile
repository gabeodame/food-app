# Use an official Node.js image as the base image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js image for the runtime
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application code
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]

