import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface TechniqueHeaderProps {
  title: string;
  onClose: () => void;
  rightElement?: React.ReactNode;
}

export function TechniqueHeader({ title, onClose, rightElement }: TechniqueHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.backButton} onPress={onClose} testID="back-button">
          <Text style={styles.arrowText}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        {rightElement && (
          <View style={styles.rightContainer}>
            {rightElement}
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  arrowText: {
    fontSize: 24,
    color: colors.text.primary,
    fontWeight: '300',
    marginTop: -2,
  },
  backText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
