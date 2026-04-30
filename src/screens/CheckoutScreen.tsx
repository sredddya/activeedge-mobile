import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

export default function CheckoutScreen({ navigation }: any) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', address: '', city: '', zip: ''
  });

  const handlePlaceOrder = async () => {
    if (!form.full_name || !form.email || !form.address || !form.city || !form.zip) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) {
      Alert.alert('Error', 'Please login to place an order');
      navigation.navigate('Login');
      return;
    }
    setIsLoading(true);
    try {
      for (const item of items) {
        await axios.post(
          'http://192.168.1.190:8000/api/orders/',
          { product: item.id, quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      clearCart();
      Alert.alert('Order Placed!', 'Your order has been placed successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>CHECKOUT</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHIPPING DETAILS</Text>
          {['full_name', 'email', 'address', 'city', 'zip'].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field.replace('_', ' ').toUpperCase()}
              value={form[field as keyof typeof form]}
              onChangeText={(text) => setForm({ ...form, [field]: text })}
              autoCapitalize="none"
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name} x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handlePlaceOrder} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>PLACE ORDER</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', letterSpacing: 4, textAlign: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 12, letterSpacing: 2, color: '#666', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 14, marginBottom: 10, fontSize: 14 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  orderItemName: { fontSize: 14, color: '#333', flex: 1 },
  orderItemPrice: { fontSize: 14, fontWeight: '500' },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  totalLabel: { fontSize: 14, letterSpacing: 2 },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  btn: { backgroundColor: '#000', padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 2 },
});
