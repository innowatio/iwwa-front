FROM iojs
RUN mkdir /iwwa-front
ADD ./ /iwwa-front/
WORKDIR /iwwa-front
RUN npm install --no-optional
EXPOSE 8080
ENTRYPOINT ["npm", "start"]
