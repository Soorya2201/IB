import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function ProfileScreen() {
  const orderHistory          = useStore(s => s.orderHistory);
  const likedItems            = useStore(s => s.likedItems);
  const restrictions          = useStore(s => s.restrictions);
  const requireConfirmation   = useStore(s => s.requireConfirmation);
  const toggleRequireConfirmation = useStore(s => s.toggleRequireConfirmation);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={40} color={COLORS.bistroCream} />
          </View>
          <Text style={styles.greeting}>Your Profile</Text>
          {restrictions.length > 0 && (
            <View style={styles.tagsRow}>
              {restrictions.map(r => (
                <View key={r} style={styles.tag}>
                  <Text style={styles.tagText}>{r}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Settings */}
        <Section title="Settings" icon="settings">
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Confirm before cart changes</Text>
              <Text style={styles.settingSub}>Review AI actions before they're applied</Text>
            </View>
            <Switch
              value={requireConfirmation}
              onValueChange={toggleRequireConfirmation}
              trackColor={{ false: COLORS.bistroCream2, true: COLORS.bistroGold }}
              thumbColor={COLORS.card}
            />
          </View>
        </Section>

        {/* Liked items */}
        <Section title="Your Favourites" icon="heart">
          {likedItems.length === 0 ? (
            <EmptyHint text="Tap the heart on any menu item to save your favourites here." />
          ) : (
            likedItems.map(item => (
              <View key={item.id} style={styles.favRow}>
                <View style={styles.favEmoji}>
                  <Text style={styles.favEmojiText}>{item.image}</Text>
                </View>
                <View style={styles.favInfo}>
                  <Text style={styles.favName}>{item.name}</Text>
                  <Text style={styles.favSub}>${item.price.toFixed(2)}</Text>
                </View>
                <Feather name="heart" size={14} color={COLORS.danger} />
              </View>
            ))
          )}
        </Section>

        {/* Order history */}
        <Section title="Order History" icon="clock">
          {orderHistory.length === 0 ? (
            <EmptyHint text="No orders yet. Place your first order to see history here." />
          ) : (
            orderHistory.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <Text style={styles.orderDate}>{formatDate(order.timestamp)}</Text>
                  <Text style={styles.orderTime}>{formatTime(order.timestamp)}</Text>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                </View>
                {order.items.map(({ menuItem, quantity }) => (
                  <View key={menuItem.id} style={styles.orderLine}>
                    <Text style={styles.orderLineQty}>×{quantity}</Text>
                    <Text style={styles.orderLineName}>{menuItem.name}</Text>
                    <Text style={styles.orderLinePrice}>${(menuItem.price * quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Feather name={icon as any} size={16} color={COLORS.bistroGold} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <View style={styles.emptyHint}>
      <Text style={styles.emptyHintText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bistroCream },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl * 2 },

  avatarSection: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.bistroBrown,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.bistroBrown, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
  },
  greeting: { ...TYPOGRAPHY.subheading, marginTop: SPACING.md },
  tagsRow:  { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
  tag: {
    backgroundColor: COLORS.bistroGold + '22',
    borderWidth: 1, borderColor: COLORS.bistroGold,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 3,
  },
  tagText: { fontSize: 12, color: COLORS.bistroGold, fontWeight: '600' },

  section: { marginTop: SPACING.lg },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: SPACING.sm,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  sectionTitle: { ...TYPOGRAPHY.subheading, fontSize: 15 },

  favRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  favEmoji:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  favEmojiText: { fontSize: 24 },
  favInfo:      { flex: 1 },
  favName:      { fontSize: 14, fontWeight: '600', color: COLORS.bistroBrown },
  favSub:       { fontSize: 12, color: COLORS.medGray, marginTop: 2 },

  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  orderCardHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: SPACING.sm, paddingBottom: SPACING.xs,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  orderDate:      { fontSize: 13, fontWeight: '600', color: COLORS.bistroBrown, flex: 1 },
  orderTime:      { fontSize: 12, color: COLORS.medGray, marginRight: SPACING.sm },
  orderTotal:     { fontSize: 14, fontWeight: '700', color: COLORS.bistroGold },
  orderLine:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  orderLineQty:   { fontSize: 13, color: COLORS.medGray, width: 28 },
  orderLineName:  { flex: 1, fontSize: 13, color: COLORS.bistroBrown },
  orderLinePrice: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray },

  emptyHint:     { padding: SPACING.md, alignItems: 'center' },
  emptyHintText: { ...TYPOGRAPHY.small, textAlign: 'center' },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  settingInfo:  { flex: 1, marginRight: SPACING.md },
  settingLabel: { fontSize: 14, fontWeight: '600', color: COLORS.bistroBrown },
  settingSub:   { fontSize: 11, color: COLORS.medGray, marginTop: 2 },
});
