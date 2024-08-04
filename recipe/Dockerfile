FROM node:alpine3.19

WORKDIR /app

# Copying package.json and package-lock.json
COPY package*.json ./

# Installing dependencies as root, including Prisma CLI
RUN npm ci

# Ensuring the node user has ownership of the directories Prisma CLI might write to
RUN mkdir -p node_modules/.cache prisma && chown -R node:node ./

# Switching to the node user for subsequent commands
USER node

# Copying the rest of your application code with appropriate permissions
COPY --chown=node:node . .

# Generating the Prisma client using the locally installed Prisma CLI
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
