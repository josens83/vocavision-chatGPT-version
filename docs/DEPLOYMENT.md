# VocaVision 배포 가이드

## 사전 요구사항

- Node.js 20+
- PostgreSQL 14+
- npm/yarn/pnpm
- Stripe 계정
- OpenAI API 키
- Cloudinary 계정 (선택사항)

## 환경 설정

### Backend 환경 변수

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vocavision"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# CORS
CORS_ORIGIN=https://your-domain.com
```

### Web 환경 변수

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_...
```

## 데이터베이스 설정

### 1. PostgreSQL 설치 및 데이터베이스 생성

```bash
# PostgreSQL 설치 (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib

# 데이터베이스 생성
sudo -u postgres psql
CREATE DATABASE vocavision;
CREATE USER vocavision_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vocavision TO vocavision_user;
\q
```

### 2. Prisma 마이그레이션

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 3. 초기 데이터 시딩 (선택사항)

```bash
npm run prisma:seed
```

## Backend 배포

### Option 1: AWS EC2

1. **EC2 인스턴스 생성**
   - Ubuntu 22.04 LTS
   - t3.medium 이상 권장
   - 보안 그룹: 포트 3001, 22 개방

2. **서버 설정**

```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# 프로젝트 클론
git clone https://github.com/josens83/vocavision.git
cd vocavision/backend

# 의존성 설치
npm install

# 빌드
npm run build

# PM2로 실행
pm2 start dist/index.js --name vocavision-api
pm2 save
pm2 startup
```

3. **Nginx 리버스 프록시 설정**

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

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

### Option 2: Heroku

```bash
# Heroku CLI 설치
# https://devcenter.heroku.com/articles/heroku-cli

# 앱 생성
heroku create vocavision-api

# PostgreSQL 추가
heroku addons:create heroku-postgresql:hobby-dev

# 환경 변수 설정
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# ... 기타 환경 변수

# 배포
git push heroku main

# 데이터베이스 마이그레이션
heroku run npx prisma migrate deploy
```

## Web 배포 (Vercel)

1. **Vercel 계정 생성**
   - https://vercel.com

2. **프로젝트 연결**
   - GitHub 레포지토리 연결
   - Root Directory: `web`
   - Framework Preset: Next.js

3. **환경 변수 설정**
   - Vercel 대시보드에서 환경 변수 추가

4. **자동 배포**
   - main 브랜치에 push하면 자동 배포

## Mobile 배포

### iOS (App Store)

1. **Expo EAS 설정**

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
```

2. **빌드**

```bash
eas build --platform ios
```

3. **App Store Connect 업로드**
   - https://appstoreconnect.apple.com

### Android (Google Play)

1. **빌드**

```bash
eas build --platform android
```

2. **Google Play Console 업로드**
   - https://play.google.com/console

## SSL 인증서 (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
sudo certbot --nginx -d www.your-domain.com
```

## 모니터링

### PM2 모니터링

```bash
pm2 monit
pm2 logs
```

### 로그 확인

```bash
# Backend logs
tail -f /var/log/vocavision/backend.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 백업

### 데이터베이스 백업

```bash
# 백업
pg_dump -U vocavision_user vocavision > backup.sql

# 복원
psql -U vocavision_user vocavision < backup.sql
```

### 자동 백업 스크립트

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump vocavision > /backups/vocavision_$DATE.sql
find /backups -mtime +7 -delete
```

## 업데이트

```bash
# 코드 업데이트
git pull origin main

# 의존성 업데이트
npm install

# 빌드
npm run build

# 재시작
pm2 restart vocavision-api
```

## 트러블슈팅

### 포트가 이미 사용 중인 경우

```bash
sudo lsof -i :3001
sudo kill -9 <PID>
```

### 데이터베이스 연결 실패

- DATABASE_URL 환경 변수 확인
- PostgreSQL 서비스 상태 확인: `sudo systemctl status postgresql`
- 방화벽 규칙 확인

### 메모리 부족

- PM2 메모리 제한 설정: `pm2 start app.js --max-memory-restart 500M`
- Swap 메모리 추가

## 보안 체크리스트

- [ ] 모든 환경 변수 설정
- [ ] JWT Secret 변경
- [ ] 데이터베이스 비밀번호 강화
- [ ] 방화벽 설정
- [ ] SSL 인증서 설치
- [ ] Rate Limiting 활성화
- [ ] CORS 설정 확인
- [ ] Helmet.js 보안 헤더 적용
- [ ] 정기적인 보안 업데이트
