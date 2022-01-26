FROM php:7.2-apache
# Copy built app into webserver
COPY dist/ /var/www/html/
# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
