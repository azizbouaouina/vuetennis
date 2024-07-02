# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Build your Vue.js application for production with minification
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Command to run your app using CMD which starts a web server for the built application
CMD ["npm", "run", "serve"]
