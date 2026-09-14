FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]