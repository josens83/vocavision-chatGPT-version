'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface DailyGoalData {
  dailyGoal: number;
  dailyProgress: number;
  completed: boolean;
  percentage: number;
}

export default function DailyGoalWidget() {
  const [goalData, setGoalData] = useState<DailyGoalData | null>(null);
  const [editing, setEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(10);

  useEffect(() => {
    loadGoalData();
  }, []);

  const loadGoalData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/goals/daily`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoalData(response.data);
      setNewGoal(response.data.dailyGoal);
    } catch (error) {
      console.error('Failed to load goal data:', error);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/goals/daily`,
        { goal: newGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      loadGoalData();
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert('목표 업데이트 실패');
    }
  };

  if (!goalData) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold mb-4">일일 목표</h3>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">오늘의 목표</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition"
        >
          {editing ? '취소' : '수정'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">일일 단어 학습 목표</label>
            <input
              type="number"
              min="1"
              max="100"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg text-gray-900"
            />
          </div>
          <button
            onClick={handleUpdateGoal}
            className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            목표 저장
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold">{goalData.dailyProgress}</span>
              <span className="text-2xl opacity-80">/ {goalData.dailyGoal}</span>
            </div>
            <div className="text-green-100">
              {goalData.completed ? '목표 달성! 🎉' : '단어 학습'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, goalData.percentage)}%` }}
            />
          </div>
          <div className="text-sm text-green-100">
            {goalData.percentage}% 완료
          </div>

          {goalData.completed && (
            <div className="mt-4 bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-sm font-semibold">
                오늘의 목표를 달성했어요!
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
