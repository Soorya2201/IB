import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../../store';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface OrderRecapProps {
  narrationText: string;
}

export default function OrderRecap({ narrationText }: OrderRecapProps) {
  const items    = useStore(state => state.items);
  const subtotal = useStore(state => state.getTotal());
  const tax      = Math.round(subtotal * 0.1 * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  return (
    <View style={styles.container}>

      {/* AI one-liner */}
      <View style={styles.quoteRow}>
        <View style={styles.avatarDot}>
          <Text style={styles.avatarLetter}>B</Text>
        </View>
        <Text style={styles.quoteText} numberOfLines={2}>
          {narrationText || 'Reviewing your order…'}
        </Text>
      </View>

      {/* Receipt card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Feather name="file-text" size={20} color={COLORS.bistroGold} />
          </View>
          <Text style={styles.cardTitle}>Your Order</Text>
          <View style={styles.cardHeaderRule} />
        </View>

        <View style={styles.cardBody}>
          {items.map(item => (
            <View key={item.menuItem.id} style={styles.lineItem}>
              <Text style={styles.lineQty}>{item.quantity}×</Text>
              <Text style={styles.lineName} numberOfLines={1}>{item.menuItem.name}</Text>
              <Text style={styles.linePrice}>${(item.menuItem.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.lineItem}>
            <Text style={[styles.lineName, styles.subtotalLabel]}>Subtotal</Text>
            <Text style={styles.subtotalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.lineItem}>
            <Text style={[styles.lineName, styles.subtotalLabel]}>Tax (10%)</Text>
            <Text style={styles.subtotalValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.md },

  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  avatarDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.bistroGold,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarLetter: { color: '#fff', fontSize: 12, fontWeight: '700', fontStyle: 'italic' },
  quoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.bistroBrown,
    fontStyle: 'italic',
    lineHeight: 19,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.bistroBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.bistroCream,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  cardHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bistroGold + '18',
    borderWidth: 1,
    borderColor: COLORS.bistroGold + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.bistroBrown,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  cardHeaderRule: {
    width: 32,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.bistroGold,
    marginTop: 6,
  },

  cardBody: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  lineQty: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.bistroGold,
    width: 24,
  },
  lineName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.bistroBrown,
  },
  linePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.bistroBrown,
  },

  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  subtotalLabel: { color: COLORS.medGray, fontSize: 12 },
  subtotalValue: { fontSize: 12, color: COLORS.medGray, fontWeight: '500' },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.bistroBrown,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.bistroGold,
  },
});
