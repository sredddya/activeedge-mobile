import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('https://active-edge-backend.onrender.com/api/token/', {
        username,
        password,
      });
      await SecureStore.setItemAsync('access_token', res.data.access);
      await SecureStore.setItemAsync('refresh_token', res.data.refresh);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.logo}>ACTIVEDGE</Text>
        <Text style={styles.title}>SIGN IN</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>SIGN IN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Create one</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', letterSpacing: 8, textAlign: 'center', marginBottom: 32 },
  title: { fontSize: 20, fontWeight: '600', letterSpacing: 4, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 14, marginBottom: 12, fontSize: 15 },
  btn: { backgroundColor: '#000', padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 2 },
  link: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 13 },
  linkBold: { color: '#000', fontWeight: '600' },
});
