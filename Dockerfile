FROM node:latest

WORKDIR /usr/src
RUN npx create-react-app react-tutorial \
  && rm -f react-tutorial/src/*

CMD [ "npm", "start", "--prefix", "/usr/src/react-tutorial" ]

