FROM php:8.5-apache

# PDO conecta directamente a MySQL; mbstring valida textos UTF-8.
RUN apt-get update && apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /var/www/html
COPY . /var/www/html
# El backend privado queda fuera de DocumentRoot. Los frontends usan alias explicitos.
COPY apache.conf /etc/apache2/conf-available/imsj.conf
RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && a2enconf imsj \
    && mkdir -p storage/app/public storage/cache \
    && chown -R www-data:www-data storage
RUN printf 'display_errors=Off\nlog_errors=On\nupload_max_filesize=10M\npost_max_size=24M\n' > /usr/local/etc/php/conf.d/imsj.ini
EXPOSE 80
