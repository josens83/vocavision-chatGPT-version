# VocaVision - Production Deployment Guide

This guide covers deploying VocaVision to production using Docker or manual deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment (Recommended)](#docker-deployment-recommended)
3. [Manual Deployment](#manual-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)

## Prerequisites

### For Docker Deployment

- **Server**: Linux server (Ubuntu 20.04+ recommended)
- **Docker**: v24.0+
- **Docker Compose**: v2.0+
- **Domain**: Registered domain name
- **SSL Certificate**: Let's Encrypt or similar

### For Manual Deployment

- **Node.js**: v20+
- **PostgreSQL**: v14+
- **Nginx**: v1.18+ (for reverse proxy)
- **PM2**: For process management

## Docker Deployment (Recommended)

### 1. Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again for group changes to take effect
```

### 2. Clone Repository

```bash
git clone https://github.com/josens83/vocavision.git
cd vocavision
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Update the following variables:

```env
# Database
POSTGRES_PASSWORD=your-strong-password-here

# Backend
JWT_SECRET=your-32-character-or-longer-secret-key
DATABASE_URL=postgresql://postgres:your-strong-password-here@postgres:5432/vocavision?schema=public

# API Keys (Optional)
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

### 4. Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Start all services
./deploy.sh up

# View logs
./deploy.sh logs

# Check status
./deploy.sh ps
```

### 5. Initialize Database

```bash
# Run migrations
./deploy.sh migrate

# Seed database with initial data
./deploy.sh seed
```

### 6. Verify Deployment

```bash
# Check if all containers are running
docker-compose ps

# Test backend API
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost:3000
```

## Manual Deployment

### 1. Install Dependencies

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 2. Setup PostgreSQL

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql << EOF
CREATE DATABASE vocavision;
CREATE USER vocavision WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE vocavision TO vocavision;
\q
EOF
```

### 3. Deploy Backend

```bash
cd backend

# Install dependencies
npm ci --production

# Configure environment
cat > .env << EOF
DATABASE_URL=postgresql://vocavision:your-password@localhost:5432/vocavision?schema=public
JWT_SECRET=your-jwt-secret
PORT=3001
NODE_ENV=production
EOF

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name vocavision-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Deploy Frontend

```bash
cd ../web

# Install dependencies
npm ci --production

# Configure environment
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name vocavision-web -- start

# Save PM2 configuration
pm2 save
```

### 5. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vocavision

# Add the following configuration:
```

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vocavision /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-secret-key-min-32-chars` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `strong-password` |

### Optional Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key | AI-generated mnemonics |
| `STRIPE_SECRET_KEY` | Stripe secret key | Payment processing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Payment webhooks |

## Database Setup

### Migrations

```bash
# With Docker
./deploy.sh migrate

# Manual
cd backend
npx prisma migrate deploy
```

### Seeding

```bash
# With Docker
./deploy.sh seed

# Manual
cd backend
npm run seed
```

### Backup

```bash
# Create backup
pg_dump -U vocavision vocavision > backup-$(date +%Y%m%d).sql

# Restore backup
psql -U vocavision vocavision < backup-20240101.sql
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (Certbot sets this up automatically)
sudo certbot renew --dry-run
```

### Manual SSL Setup

1. Obtain SSL certificates from your provider
2. Update Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # ... rest of configuration
}
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# View specific app logs
pm2 logs vocavision-backend
pm2 logs vocavision-web
```

### Docker Logging

```bash
# View all logs
./deploy.sh logs

# View specific service
./deploy.sh logs backend
./deploy.sh logs web

# Follow logs
docker-compose logs -f
```

### Log Rotation

```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup & Recovery

### Database Backups

```bash
# Automated daily backup script
cat > /home/vocavision/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/vocavision/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U postgres vocavision > $BACKUP_DIR/vocavision_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "vocavision_*.sql" -mtime +7 -delete

echo "Backup completed: vocavision_$DATE.sql"
EOF

chmod +x /home/vocavision/backup.sh

# Add to crontab for daily execution at 2 AM
crontab -e
# Add: 0 2 * * * /home/vocavision/backup.sh
```

### Disaster Recovery

```bash
# Stop services
./deploy.sh down

# Restore database
docker-compose up -d postgres
docker-compose exec -T postgres psql -U postgres vocavision < backup.sql

# Restart all services
./deploy.sh up
```

## Performance Optimization

### PostgreSQL Tuning

```sql
-- In PostgreSQL config (/etc/postgresql/*/main/postgresql.conf)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB
```

### Nginx Caching

```nginx
# Add to Nginx server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
./deploy.sh logs

# Check Docker status
docker-compose ps

# Restart services
./deploy.sh restart
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
./deploy.sh shell backend
ping postgres

# Verify DATABASE_URL
echo $DATABASE_URL
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Restart specific service
docker-compose restart backend
```

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Set up fail2ban
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting enabled

## Maintenance

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
./deploy.sh down
./deploy.sh up
```

### Health Checks

```bash
# Check service health
curl http://localhost:3001/api/health
curl http://localhost:3000

# Check container status
./deploy.sh ps
```

---

**Need Help?**

- Check logs: `./deploy.sh logs`
- Open an issue on GitHub
- Review troubleshooting section above

**Happy Deploying! 🚀**
