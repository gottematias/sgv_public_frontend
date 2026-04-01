#!/bin/sh
set -e

echo "Starting SGV Frontend container..."

# Set default values for environment variables
API_URL=${API_URL:-/api}
PRODUCTION=${PRODUCTION:-true}

echo "Configuration:"
echo "  API_URL: $API_URL"
echo "  PRODUCTION: $PRODUCTION"

# Copy Nginx configuration (no template substitution needed)
echo "Copying Nginx configuration..."
cp /etc/nginx/templates/default.conf.template /etc/nginx/conf.d/default.conf

# Validate Nginx configuration
echo "Validating Nginx configuration..."
nginx -t

# Generate runtime environment configuration for Angular
echo "Generating runtime environment configuration..."
cat > /usr/share/nginx/html/env-config.js <<EOF
window.env = {
  apiUrl: '${API_URL}',
  production: ${PRODUCTION}
};
EOF

echo "Environment configuration generated:"
cat /usr/share/nginx/html/env-config.js

# Start Nginx
echo "Starting Nginx..."
exec nginx -g 'daemon off;'
