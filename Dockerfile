FROM node:18-alpine

EXPOSE 3000

WORKDIR /app
COPY . .

ENV NODE_ENV=production
#RUN npm install --omit=dev
RUN npm ci --omit=dev
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/app @shopify/cli
RUN rm -f extensions
RUN npm run build
#RUN npm prisma migrate dev -- --name init
#RUN npm run prisma migrate reset
# You'll probably want to remove this in production, it's here to make it easier to test things!
#RUN rm -f prisma/dev.sqlite

RUN chmod +x ./setupAndStart.sh
CMD ["./setupAndStart.sh"]
#CMD ["npm", "run", "docker-start"]

