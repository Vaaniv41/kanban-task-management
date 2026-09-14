FROM node:20-alpine

# Install OpenSSL required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
# Generate the Prisma Client specifically for Alpine Linux
RUN npx prisma generate

COPY . .

EXPOSE 4000
CMD ["npm", "start"]