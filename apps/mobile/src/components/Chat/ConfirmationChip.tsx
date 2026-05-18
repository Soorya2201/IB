import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';
import { ToolCallRecord } from '../../types';

interface Props {
  actions: ToolCallRecord[];
  onConfirm: () => void;
  onCancel: () => void;
}

function describeAction(tc: ToolCallRecord): string {
  if (tc.name === 'add_item') return `Add ${(tc.input as any).quantity ?? 1}× ${(tc.input as any).item_id?.replace(/-/g, ' ')}`;
  if (tc.name === 'remove_item') return `Remove ${(tc.input as any).item_id?.replace(/-/g, ' ')}`;
  if (tc.name === 'clear_cart') return 'Clear cart';
  if (tc.name === 'update_quantity') return `Update quantity for ${(tc.input as any).item_id?.replace(/-/g, ' ')}`;
  return tc.name.replace(/_/g, ' ');
}

export default function ConfirmationChip({ actions, onConfirm, onCancel }: Props) {
  const applied = actions.filter(a => a.status === 'applied');
  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.card}>
      <Text style={styles.title}>Margaux wants to make these changes:</Text>
      {applied.map((a, i) => (
        <Text key={i} style={styles.action}>· {describeAction(a)}</Text>
      ))}
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.confirm]}
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onConfirm(); }}
          activeOpacity={0.8}>
          <Text style={styles.confirmText}>✓ Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.cancel]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onCancel(); }}
          activeOpacity={0.8}>
          <Text style={styles.cancelText}>✗ Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginVertical: 8, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  title: { fontSize: 12, fontWeight: '600', color: COLORS.medGray, marginBottom: 8 },
  action: { fontSize: 13, color: COLORS.bistroBrown, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  confirm: { backgroundColor: COLORS.bistroGold },
  cancel: { backgroundColor: COLORS.bistroCream2, borderWidth: 0.5, borderColor: COLORS.border },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelText: { color: COLORS.bistroBrown, fontWeight: '600', fontSize: 13 },
});
