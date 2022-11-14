FROM node:18.9
WORKDIR /app
COPY package.json ./
COPY package-lock.json  ./
RUN npm install --production
RUN npm install node-sass
RUN npx browserslist@latest --update-db
#RUN npm i --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

