FROM node:alpine3.19
# Create app user and group
RUN addgroup app && adduser -S -G app app
# Change the ownership of the application directory to the created user
# RUN chown -R app:app /usr/src/app
# USER app

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Change the ownership of all files in /app to 'app' user and group
# This step needs to be done before switching to user 'app' to avoid permission issues
# Since we want all operations requiring root privileges to be done before switching to 'app'
# We do it here after all necessary files are in place and before changing the user context
USER root
RUN mkdir -p .next && chmod -R 777 .next

# Copy the rest of the application code
# This step is after changing the ownership, so new files will already have correct 'app' user permissions
COPY . .

RUN npm run build

USER app

EXPOSE 3000

CMD ["npm", "start"]

