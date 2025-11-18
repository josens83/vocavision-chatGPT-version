import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <Text style={styles.subtitle}>사용자 정보가 여기에 표시됩니다</Text>
      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        로그아웃
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
