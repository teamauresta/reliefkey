import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              index === 0 && styles.optionFirst,
              index === options.length - 1 && styles.optionLast,
            ]}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextSelected]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: colors.accent.primary,
  },
  optionFirst: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  optionLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  optionText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.background.start,
    fontWeight: '600',
  },
});
