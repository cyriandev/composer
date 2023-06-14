# Use an official PHP runtime as the base image
FROM php:8.0-apache

RUN docker-php-ext-install pdo pdo_mysql sockets
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN composer self-update

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .
RUN composer install

# Set the working directory in the container
# WORKDIR /var/www/html

# # INSTALL AND UPDATE COMPOSER
# COPY --from=composer /usr/bin/composer /usr/bin/composer
# RUN composer self-update

# # Install PHP extensions and dependencies
# RUN docker-php-ext-install pdo pdo_mysql

# # Copy composer files to the working directory
# COPY composer.json composer.lock ./

# # Install app dependencies
# RUN composer install 

# # Copy the rest of the app's source code to the container
# COPY . .

# # Generate the autoloader
# RUN composer dump-autoload --optimize

# # Expose the port that the Laravel app will run on
# EXPOSE 80

# # Define the command to run the Apache web server
# CMD ["apache2-foreground"]

# FROM composer:2.4 as build
# COPY . /app/
# RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction

# FROM php:8.1-apache-buster as dev

# ENV APP_ENV=dev
# ENV APP_DEBUG=true
# ENV COMPOSER_ALLOW_SUPERUSER=1

# RUN apt-get update && apt-get install -y zip
# RUN docker-php-ext-install pdo pdo_mysql

# COPY . /var/www/html/
# COPY --from=build /usr/bin/composer /usr/bin/composer
# RUN composer install --prefer-dist --no-interaction