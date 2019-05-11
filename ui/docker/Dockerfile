FROM ubuntu:bionic

# Install Nginx for the web server.
RUN apt-get update && apt-get install -y nginx curl software-properties-common

# Install NodeJS for our ExpressJS server.
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
  apt-get install -y nodejs

# Copy the config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY build /usr/share/nginx/html
