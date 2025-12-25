# Web Vital & Lighthouse 목표치

홈/Landing 경험을 위한 주요 품질 목표치와 모니터링 경로를 정리합니다.

## 측정 지표
- **Largest Contentful Paint (LCP)**: 4.0초 이하 (Lighthouse 수집 시 `warn`, Playwright 예산 테스트에서 `<= 4000ms`).
- **Cumulative Layout Shift (CLS)**: 0.10 이하 (Lighthouse `error` 기준, Playwright 예산 테스트 포함).
- **접근성 카테고리 점수**: 0.90 이상 (Lighthouse `categories:accessibility` 최소 점수).

## CI 모니터링
- **Playwright 성능 예산**: `.github/workflows/ci.yml`의 `Playwright Performance Budget` 잡에서 `e2e/performance-metrics.spec.ts`를 실행하여 런타임 LCP/CLS를 검증합니다.
- **Lighthouse CI**: 동일 워크플로의 `Lighthouse Scores` 잡에서 `lighthouserc.json`을 기반으로 LCP/CLS/접근성 목표를 단언합니다.

## 로컬 확인 방법
```bash
npm run build && npm run start -- --hostname 0.0.0.0 --port 3000
npm run lighthouse:ci  # Lighthouse CI 프로필로 측정 (CI와 동일 설정)
```

테스트 실패 시 Hero 섹션의 이미지 지연 로딩, Next.js 이미지 최적화 적용, 인터랙션 포커스 가시성 개선을 우선적으로 점검합니다.
