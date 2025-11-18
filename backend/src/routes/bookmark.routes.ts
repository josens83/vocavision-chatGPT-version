import { Router } from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  updateBookmarkNotes,
} from '../controllers/bookmark.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getBookmarks);
router.post('/', authenticateToken, addBookmark);
router.delete('/:wordId', authenticateToken, removeBookmark);
router.patch('/:wordId/notes', authenticateToken, updateBookmarkNotes);

export default router;
