FROM iojs
RUN mkdir /iwwa-front
ADD ./ /iwwa-front/
WORKDIR /iwwa-front
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "start"]
