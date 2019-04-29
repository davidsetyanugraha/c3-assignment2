# Nginx server block.
server {
    # Nginx port.
    listen 80;
    listen [::]:80;

    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip.
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/css application/javascript;
    gzip_disable "MSIE [1-6]\.";

    # Search for index.html in the root folder.
    location / {
        try_files $uri $uri/ /index.html?/$request_uri;
    }
}

