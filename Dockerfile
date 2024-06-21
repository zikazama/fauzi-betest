FROM node:lts-alpine

# Set environment variables
ENV PORT=3000

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install

# Copy .env.example and rename it to .env
COPY .env.example .env

# Copy the rest of the application code
COPY . .

# Expose port 3000 (the port your app listens on)
EXPOSE 3000

# Set the user to 'node'
USER node

# Start your Node.js app
CMD ["npm", "run", "start"]
