FROM node:latest
WORKDIR /usr/src/app
ADD package.json package.json
RUN npm install

ADD . .

# EXPOSE 3000
# Run the app.  CMD is required to run on Heroku
# $PORT is set by Heroku			
CMD node --harmony-async-await --optimize_for_size --max_old_space_size=460 --gc_interval=100 server.js