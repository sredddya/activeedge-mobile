import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products/', { params: search ? { search } : {} });
      setProducts(res.data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Product', { product: item })}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No image</Text>
        </View>
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ACTIVEDGE</Text>
      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item: any) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', letterSpacing: 8, paddingVertical: 16 },
  search: { margin: 16, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, fontSize: 14 },
  list: { padding: 8 },
  row: { justifyContent: 'space-between', paddingHorizontal: 8 },
  card: { width: '48%', marginBottom: 16 },
  image: { width: '100%', aspectRatio: 3/4, backgroundColor: '#f5f5f5', borderRadius: 4 },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#999', fontSize: 12 },
  name: { fontSize: 13, fontWeight: '500', marginTop: 6 },
  price: { fontSize: 13, color: '#666', marginTop: 2 },
});
