import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
import { progressAPI, wordsAPI } from '../services/api';

const { width } = Dimensions.get('window');

interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation?: string;
  examples?: any[];
  mnemonics?: any[];
  etymology?: any;
}

export default function LearnScreen({ navigation }: any) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [wordsStudied, setWordsStudied] = useState(0);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'definition' | 'mnemonic' | 'etymology'>('definition');

  useEffect(() => {
    loadWords();
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const session = await progressAPI.startSession();
      setSessionId(session.session.id);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const loadWords = async () => {
    try {
      const data = await progressAPI.getDueReviews();

      if (data.count === 0) {
        const randomWords = await wordsAPI.getRandomWords(10);
        setWords(randomWords.words);
      } else {
        setWords(data.reviews.map((r: any) => r.word));
      }
    } catch (error) {
      console.error('Failed to load words:', error);
      try {
        const randomWords = await wordsAPI.getRandomWords(10);
        setWords(randomWords.words);
      } catch (e) {
        console.error('Failed to load random words:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    const currentWord = words[currentIndex];

    try {
      await progressAPI.submitReview({
        wordId: currentWord.id,
        rating,
        learningMethod: 'FLASHCARD',
        sessionId: sessionId || undefined,
      });

      const correct = rating >= 3;
      setWordsStudied(wordsStudied + 1);
      if (correct) setWordsCorrect(wordsCorrect + 1);

      if (currentIndex + 1 >= words.length) {
        // Finished
        setFinished(true);
        if (sessionId) {
          await progressAPI.endSession({
            sessionId,
            wordsStudied: wordsStudied + 1,
            wordsCorrect: wordsCorrect + (correct ? 1 : 0),
          });
        }
      } else {
        // Next word
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setActiveTab('definition');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emoji}>📚</Text>
        <Text style={styles.title}>학습할 단어가 없습니다</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          돌아가기
        </Button>
      </View>
    );
  }

  if (finished) {
    const accuracy = wordsStudied > 0 ? Math.round((wordsCorrect / wordsStudied) * 100) : 0;

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>학습 완료!</Text>

        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{wordsStudied}</Text>
              <Text style={styles.resultLabel}>학습한 단어</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={[styles.resultValue, { color: '#10b981' }]}>{wordsCorrect}</Text>
              <Text style={styles.resultLabel}>정답</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={[styles.resultValue, { color: '#8b5cf6' }]}>{accuracy}%</Text>
              <Text style={styles.resultLabel}>정확도</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={() => {
              setCurrentIndex(0);
              setFinished(false);
              setWordsStudied(0);
              setWordsCorrect(0);
              loadWords();
              startSession();
            }}
            style={styles.button}
          >
            다시 학습하기
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            돌아가기
          </Button>
        </View>
      </View>
    );
  }

  const currentWord = words[currentIndex];
  const progress = (currentIndex + 1) / words.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {words.length}
        </Text>
        <ProgressBar progress={progress} color="#0ea5e9" style={styles.progressBar} />
        <Text style={styles.accuracyText}>
          정확도: {wordsStudied > 0 ? Math.round((wordsCorrect / wordsStudied) * 100) : 0}%
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {!flipped ? (
          // Front of card
          <View style={styles.card}>
            <Text style={styles.wordTitle}>{currentWord.word}</Text>
            {currentWord.pronunciation && (
              <Text style={styles.pronunciation}>{currentWord.pronunciation}</Text>
            )}

            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setFlipped(true)}
            >
              <Text style={styles.flipButtonText}>답 확인하기</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>카드를 탭하여 답을 확인하세요</Text>
          </View>
        ) : (
          // Back of card
          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'definition' && styles.activeTab]}
                onPress={() => setActiveTab('definition')}
              >
                <Text style={[styles.tabText, activeTab === 'definition' && styles.activeTabText]}>
                  정의
                </Text>
              </TouchableOpacity>
              {currentWord.mnemonics && currentWord.mnemonics.length > 0 && (
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'mnemonic' && styles.activeTab]}
                  onPress={() => setActiveTab('mnemonic')}
                >
                  <Text style={[styles.tabText, activeTab === 'mnemonic' && styles.activeTabText]}>
                    연상법
                  </Text>
                </TouchableOpacity>
              )}
              {currentWord.etymology && (
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'etymology' && styles.activeTab]}
                  onPress={() => setActiveTab('etymology')}
                >
                  <Text style={[styles.tabText, activeTab === 'etymology' && styles.activeTabText]}>
                    어원
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === 'definition' && (
                <View>
                  <Text style={styles.wordTitleSmall}>{currentWord.word}</Text>
                  <Text style={styles.definition}>{currentWord.definition}</Text>
                  {currentWord.examples && currentWord.examples.length > 0 && (
                    <View style={styles.examplesBox}>
                      <Text style={styles.examplesTitle}>예문:</Text>
                      {currentWord.examples.slice(0, 2).map((ex: any, i: number) => (
                        <View key={i} style={styles.example}>
                          <Text style={styles.exampleSentence}>"{ex.sentence}"</Text>
                          {ex.translation && (
                            <Text style={styles.exampleTranslation}>{ex.translation}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'mnemonic' && currentWord.mnemonics?.[0] && (
                <View>
                  <Text style={styles.mnemonicTitle}>{currentWord.mnemonics[0].title}</Text>
                  <View style={styles.mnemonicBox}>
                    <Text style={styles.mnemonicContent}>{currentWord.mnemonics[0].content}</Text>
                  </View>
                  {currentWord.mnemonics[0].koreanHint && (
                    <View style={styles.hintBox}>
                      <Text style={styles.hintText}>💡 {currentWord.mnemonics[0].koreanHint}</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === 'etymology' && currentWord.etymology && (
                <View>
                  <Text style={styles.etymologyTitle}>어원</Text>
                  <View style={styles.etymologyBox}>
                    <Text style={styles.etymologyLabel}>기원</Text>
                    <Text style={styles.etymologyValue}>{currentWord.etymology.origin}</Text>
                  </View>
                  {currentWord.etymology.evolution && (
                    <View style={styles.etymologyBox}>
                      <Text style={styles.etymologyLabel}>발전 과정</Text>
                      <Text style={styles.etymologyValue}>{currentWord.etymology.evolution}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Rating Buttons */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingQuestion}>이 단어를 얼마나 잘 기억하고 있나요?</Text>
              <View style={styles.ratingButtons}>
                <RatingButton label="다시" color="#ef4444" onPress={() => handleRating(1)} />
                <RatingButton label="어려움" color="#f97316" onPress={() => handleRating(2)} />
                <RatingButton label="보통" color="#eab308" onPress={() => handleRating(3)} />
                <RatingButton label="쉬움" color="#22c55e" onPress={() => handleRating(4)} />
                <RatingButton label="완벽" color="#0ea5e9" onPress={() => handleRating(5)} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function RatingButton({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.ratingButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.ratingButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 60,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  accuracyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    minHeight: 400,
  },
  wordTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  wordTitleSmall: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pronunciation: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  definition: {
    fontSize: 24,
    color: '#333',
    marginBottom: 16,
  },
  flipButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  flipButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 16,
  },
  examplesBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  example: {
    marginBottom: 12,
  },
  exampleSentence: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  exampleTranslation: {
    fontSize: 12,
    color: '#666',
  },
  mnemonicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mnemonicBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 12,
  },
  mnemonicContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  hintBox: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#1e40af',
  },
  etymologyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  etymologyBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  etymologyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  etymologyValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  ratingQuestion: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    width: width - 32,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultItem: {
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    gap: 12,
    width: width - 32,
  },
  button: {
    marginVertical: 4,
  },
});
