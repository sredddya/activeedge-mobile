import { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function ProductScreen({ route, navigation }: any) {
  const { product } = route.params;
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !selectedVariant) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }
    const variant = product.variants?.find((v: any) => v.id === selectedVariant);
    if (variant && variant.stock === 0) {
      Alert.alert('Out of Stock', 'This size is out of stock');
      return;
    }
    const sizeName = variant ? ` (${variant.size})` : '';
    addItem({
      id: product.id,
      name: `${product.name}${sizeName}`,
      price: parseFloat(product.price),
      quantity: 1,
    });
    Alert.alert('Added to Cart', `${product.name}${sizeName} added to your cart`, [
      { text: 'Continue Shopping', onPress: () => navigation.goBack() },
      { text: 'View Cart', onPress: () => navigation.getParent()?.navigate('CartTab') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back button */}
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Image */}
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>

          {/* Sizes */}
          {product.variants?.length > 0 && (
            <View style={styles.sizesSection}>
              <Text style={styles.sizeLabel}>SELECT SIZE</Text>
              <View style={styles.sizes}>
                {product.variants.map((variant: any) => (
                  <TouchableOpacity
                    key={variant.id}
                    onPress={() => variant.stock > 0 && setSelectedVariant(variant.id)}
                    style={[
                      styles.sizeBtn,
                      selectedVariant === variant.id && styles.sizeBtnSelected,
                      variant.stock === 0 && styles.sizeBtnDisabled,
                    ]}
                  >
                    <Text style={[
                      styles.sizeBtnText,
                      selectedVariant === variant.id && styles.sizeBtnTextSelected,
                      variant.stock === 0 && styles.sizeBtnTextDisabled,
                    ]}>
                      {variant.size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {product.description ? (
            <View style={styles.description}>
              <Text style={styles.descLabel}>DESCRIPTION</Text>
              <Text style={styles.descText}>{product.description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Add to cart button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>ADD TO BAG</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { padding: 16 },
  backText: { fontSize: 16, color: '#666' },
  image: { width: '100%', aspectRatio: 3/4, backgroundColor: '#f5f5f5' },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#999' },
  info: { padding: 16 },
  name: { fontSize: 22, fontWeight: '600', letterSpacing: 1 },
  price: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  sizesSection: { marginTop: 20 },
  sizeLabel: { fontSize: 12, letterSpacing: 2, color: '#666', marginBottom: 10 },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBtn: { width: 48, height: 48, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  sizeBtnSelected: { borderColor: '#000', backgroundColor: '#000' },
  sizeBtnDisabled: { opacity: 0.3 },
  sizeBtnText: { fontSize: 13, fontWeight: '500' },
  sizeBtnTextSelected: { color: '#fff' },
  sizeBtnTextDisabled: { color: '#999' },
  description: { marginTop: 20 },
  descLabel: { fontSize: 12, letterSpacing: 2, color: '#666', marginBottom: 8 },
  descText: { fontSize: 14, color: '#666', lineHeight: 22 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  addBtn: { backgroundColor: '#000', padding: 16, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 2 },
});
