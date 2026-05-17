import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

export default function MenuCardSkeleton() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.body}>
        <View style={styles.lineLong} />
        <View style={styles.lineShort} />
        <View style={styles.footer}>
          <View style={styles.pricePlaceholder} />
          <View style={styles.addBtnPlaceholder} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 130,
    backgroundColor: COLORS.bistroCream2,
  },
  body: {
    padding: 12,
  },
  lineLong: {
    height: 12,
    width: '70%',
    backgroundColor: COLORS.bistroCream2,
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    height: 10,
    width: '40%',
    backgroundColor: COLORS.bistroCream2,
    borderRadius: 6,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricePlaceholder: {
    height: 16,
    width: 40,
    backgroundColor: COLORS.bistroCream2,
    borderRadius: 4,
  },
  addBtnPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bistroCream2,
  },
});
