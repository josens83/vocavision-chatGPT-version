import { Router } from 'express';
import {
  generateContent,
  createBatchJob,
  getJobStatus,
  listJobs,
  reviewContent,
  publishContent,
  getAuditHistory,
  getPendingReview,
} from '../controllers/contentGeneration.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Content Generation
 *   description: AI 콘텐츠 생성 파이프라인 API
 */

/**
 * @swagger
 * /content/generate:
 *   post:
 *     summary: 단일 단어 콘텐츠 생성
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - word
 *             properties:
 *               word:
 *                 type: string
 *                 description: 콘텐츠를 생성할 영어 단어
 *               examCategory:
 *                 type: string
 *                 enum: [CSAT, TOEIC, TOEFL, IELTS, GRE, SAT, GENERAL]
 *                 default: CSAT
 *               cefrLevel:
 *                 type: string
 *                 enum: [A1, A2, B1, B2, C1, C2]
 *                 default: B1
 *               saveToDb:
 *                 type: boolean
 *                 default: false
 *                 description: 생성된 콘텐츠를 DB에 저장할지 여부
 *     responses:
 *       200:
 *         description: 생성된 콘텐츠
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/generate', authenticateToken, requireAdmin, generateContent);

/**
 * @swagger
 * /content/batch:
 *   post:
 *     summary: 배치 콘텐츠 생성 작업 생성
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - words
 *             properties:
 *               words:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 콘텐츠를 생성할 단어 목록 (최대 100개)
 *               examCategory:
 *                 type: string
 *                 enum: [CSAT, TOEIC, TOEFL, IELTS, GRE, SAT, GENERAL]
 *                 default: CSAT
 *               cefrLevel:
 *                 type: string
 *                 enum: [A1, A2, B1, B2, C1, C2]
 *                 default: B1
 *     responses:
 *       201:
 *         description: 배치 작업 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobId:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/batch', authenticateToken, requireAdmin, createBatchJob);

/**
 * @swagger
 * /content/jobs:
 *   get:
 *     summary: 배치 작업 목록 조회
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, cancelled]
 *         description: 작업 상태 필터
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: 작업 목록
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/jobs', authenticateToken, requireAdmin, listJobs);

/**
 * @swagger
 * /content/jobs/{jobId}:
 *   get:
 *     summary: 특정 배치 작업 상태 조회
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 작업 ID
 *     responses:
 *       200:
 *         description: 작업 상태
 *       404:
 *         description: 작업을 찾을 수 없음
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/jobs/:jobId', authenticateToken, requireAdmin, getJobStatus);

/**
 * @swagger
 * /content/pending:
 *   get:
 *     summary: 검토 대기 중인 콘텐츠 조회
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: 검토 대기 콘텐츠 목록
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/pending', authenticateToken, requireAdmin, getPendingReview);

/**
 * @swagger
 * /content/review/{wordId}:
 *   post:
 *     summary: 콘텐츠 검토 (승인/거절/수정)
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: 단어 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject, edit]
 *               fields:
 *                 type: object
 *                 description: action이 edit일 때 수정할 필드들
 *               reason:
 *                 type: string
 *                 description: 검토 사유
 *     responses:
 *       200:
 *         description: 검토 완료
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 단어를 찾을 수 없음
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/review/:wordId', authenticateToken, requireAdmin, reviewContent);

/**
 * @swagger
 * /content/publish/{wordId}:
 *   post:
 *     summary: 콘텐츠 발행
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: 단어 ID
 *     responses:
 *       200:
 *         description: 발행 완료
 *       400:
 *         description: 승인되지 않은 콘텐츠
 *       404:
 *         description: 단어를 찾을 수 없음
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/publish/:wordId', authenticateToken, requireAdmin, publishContent);

/**
 * @swagger
 * /content/audit/{wordId}:
 *   get:
 *     summary: 콘텐츠 감사 이력 조회
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: 단어 ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: 감사 이력
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/audit/:wordId', authenticateToken, requireAdmin, getAuditHistory);

export default router;
