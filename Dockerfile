FROM --platform=linux/amd64 node:16
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . ./
EXPOSE 8000
CMD ["npm", "run", "start"]