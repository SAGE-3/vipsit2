FROM node:18-bullseye

# Install in that directory
WORKDIR /app

# Debian package
RUN apt-get update && apt-get install -y exiftool libvips-tools ffmpeg && rm -rf /var/lib/apt/lists/*

# Project files
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY ./public/favicon.ico public/favicon.ico
COPY ./dist dist

# Install in production mode
RUN npm install

RUN mkdir uploads tmp

# Environment variables
# ENV SERVER_SSL=1
ENV SERVER_URL="https://pods.evl.uic.edu/vipsit/assets/"
ENV SERVER_PORT=3000
ENV NODE_ENV=production

EXPOSE ${SERVER_PORT}

ENV VIPS_CONCURRENCY=8
RUN rm  /etc/ImageMagick-6/policy.xml

COPY ./.next .next
COPY ./next.config.js next.config.js

CMD ["node", "dist/index.js"]
