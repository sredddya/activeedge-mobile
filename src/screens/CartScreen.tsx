import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function CartScreen({ navigation }: any) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>YOUR CART</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.shopBtnText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>YOUR CART ({getTotalItems()})</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.footer}>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', letterSpacing: 4, textAlign: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: '#666' },
  shopBtn: { borderWidth: 1, borderColor: '#000', padding: 12, paddingHorizontal: 24 },
  shopBtnText: { fontSize: 13, letterSpacing: 2 },
  item: { padding: 16 },
  itemInfo: { marginBottom: 8 },
  itemName: { fontSize: 14, fontWeight: '500' },
  itemPrice: { fontSize: 14, color: '#666', marginTop: 4 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18 },
  qty: { fontSize: 16, fontWeight: '500', minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 'auto' },
  removeBtnText: { fontSize: 16, color: '#999' },
  separator: { height: 1, backgroundColor: '#eee' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  total: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 14, letterSpacing: 2 },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#000', padding: 16, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 2 },
});
