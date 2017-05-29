FROM node:7.7.4-alpine

#Create app directory
#RUN apt-get remove docker docker-engine
#RUN apt-get install docker-ce
RUN mkdir -p /usr/src/icolor
WORKDIR /usr/src/icolor
COPY . /usr/src/icolor
EXPOSE 3000
EXPOSE 3001
RUN npm install
RUN cd gulp && npm install
CMD ["npm", "start"]
