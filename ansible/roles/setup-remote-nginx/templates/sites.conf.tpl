server {
    # Nginx port.
    listen 80;

    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip.
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/css application/javascript;
    gzip_disable "MSIE [1-6]\.";

    # Example forward proxy.
    location /nectar/ {
        proxy_pass http://172.26.37.235:5984/;
        # If you want to connect from HTTP to HTTPS, you probably need this.
        proxy_ssl_server_name on;
        proxy_http_version 1.1;
    }

    # Search for index.html in the root folder.
    location / {
        try_files $uri $uri/ /index.html?/$request_uri;
    }
}

