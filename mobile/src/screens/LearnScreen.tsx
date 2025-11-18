import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function LearnScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 화면</Text>
      <Text style={styles.subtitle}>단어 학습이 여기에 표시됩니다</Text>
      <Button mode="contained" style={styles.button}>
        학습 시작
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
