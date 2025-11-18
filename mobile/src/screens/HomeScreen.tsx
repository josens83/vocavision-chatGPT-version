import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VocaVision</Text>
        <Text style={styles.subtitle}>오늘도 열심히 학습해볼까요?</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>오늘의 학습</Text>
          <Text style={styles.cardText}>복습할 단어: 15개</Text>
          <Text style={styles.cardText}>현재 연속 일수: 7일 🔥</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Learn')}
          >
            학습 시작
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>학습 방법</Text>
        <View style={styles.featureGrid}>
          <FeatureCard icon="📸" title="이미지 학습" />
          <FeatureCard icon="🎬" title="동영상" />
          <FeatureCard icon="🎵" title="라이밍" />
          <FeatureCard icon="🧠" title="연상법" />
          <FeatureCard icon="📚" title="어원" />
          <FeatureCard icon="🔄" title="간격 반복" />
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#0ea5e9',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  card: {
    margin: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
  },
  features: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '30%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
