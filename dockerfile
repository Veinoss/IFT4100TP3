# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy project files to the container
COPY . .

# Install dependencies
RUN npm install -g truffle ganache-cli && \
    npm install

# Expose ports
# Ganache HTTP-RPC server (default: 8545)
EXPOSE 8545

# Start Ganache CLI and Truffle console in the same container
CMD ganache-cli -h 0.0.0.0 > /dev/null &