import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Accessibility, DoorOpen, MapPin, Crosshair, RefreshCw, X } from 'lucide-react-native';
import { GradientBackground, FloatingOrbs } from '../components/ui';
import { useRestrooms } from '../hooks/useRestrooms';
import { Restroom } from '../types/restroom';
import { colors, typography, spacing, borderRadius } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a3a4a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#134e5e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#64ffda' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a3a4a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a3a4a' }] },
];

function formatDistance(meters?: number): string {
  if (meters == null) return '';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function FilterChip({
  label,
  icon: IconComponent,
  active,
  onPress,
}: {
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      style={animatedStyle}
    >
      <View style={[styles.chip, active && styles.chipActive]}>
        <IconComponent
          size={16}
          color={active ? '#0a1628' : colors.text.primary}
          strokeWidth={1.5}
        />
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

function RestroomDetailSheet({
  restroom,
  onClose,
  onNavigate,
}: {
  restroom: Restroom;
  onClose: () => void;
  onNavigate: () => void;
}) {
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18).stiffness(200)}
      exiting={SlideOutDown.duration(200)}
      style={styles.sheetContainer}
    >
      {Platform.OS === 'web' ? (
        <View style={styles.sheetWebBlur}>
          <SheetContent restroom={restroom} onClose={onClose} onNavigate={onNavigate} />
        </View>
      ) : (
        <BlurView intensity={40} tint="dark" style={styles.sheetBlur}>
          <SheetContent restroom={restroom} onClose={onClose} onNavigate={onNavigate} />
        </BlurView>
      )}
    </Animated.View>
  );
}

function SheetContent({
  restroom,
  onClose,
  onNavigate,
}: {
  restroom: Restroom;
  onClose: () => void;
  onNavigate: () => void;
}) {
  return (
    <View style={styles.sheetContent}>
      <View style={styles.sheetHandle} />

      <Pressable onPress={onClose} style={styles.closeButton}>
        <X size={16} color={colors.text.secondary} strokeWidth={2} />
      </Pressable>

      <Text style={styles.sheetName}>{restroom.name}</Text>
      <Text style={styles.sheetAddress}>{restroom.address}</Text>

      {restroom.distance != null && (
        <Text style={styles.sheetDistance}>{formatDistance(restroom.distance)} away</Text>
      )}

      <View style={styles.badgeRow}>
        {restroom.isUnisex && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Single-stall</Text>
          </View>
        )}
        {restroom.isAccessible && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Accessible</Text>
          </View>
        )}
        {restroom.openNow != null && (
          <View style={[styles.badge, restroom.openNow ? styles.badgeOpen : styles.badgeClosed]}>
            <Text style={styles.badgeText}>{restroom.openNow ? 'Open' : 'Closed'}</Text>
          </View>
        )}
        {restroom.source === 'refuge' && (
          <View style={[styles.badge, styles.badgeRefuge]}>
            <Text style={styles.badgeText}>Refuge</Text>
          </View>
        )}
      </View>

      {restroom.directions ? (
        <Text style={styles.sheetDirections}>{restroom.directions}</Text>
      ) : null}

      <Pressable onPress={onNavigate} style={styles.navigateButton}>
        <Text style={styles.navigateText}>Navigate</Text>
      </Pressable>
    </View>
  );
}

export function RestroomFinderScreen() {
  const {
    location,
    restrooms,
    loading,
    error,
    filters,
    setFilters,
    refresh,
  } = useRestrooms();

  const mapRef = useRef<MapView>(null);
  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(null);

  const handleMarkerPress = useCallback((restroom: Restroom) => {
    setSelectedRestroom(restroom);
    mapRef.current?.animateToRegion(
      {
        latitude: restroom.location.latitude,
        longitude: restroom.location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      300,
    );
  }, []);

  const handleNavigate = useCallback(() => {
    if (!selectedRestroom) return;
    const { latitude, longitude } = selectedRestroom.location;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    })!;
    Linking.openURL(url);
  }, [selectedRestroom]);

  const handleRecenter = useCallback(() => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        300,
      );
    }
  }, [location]);

  const toggleFilter = useCallback(
    (key: keyof typeof filters) => {
      setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [setFilters],
  );

  // Loading / error states
  if (!location && loading) {
    return (
      <GradientBackground>
        <FloatingOrbs />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Finding your location...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (error && !location) {
    return (
      <GradientBackground>
        <FloatingOrbs />
        <View style={styles.centered}>
          <MapPin size={48} color={colors.accent.primary} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Location Required</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      </GradientBackground>
    );
  }

  const initialRegion: Region | undefined = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={MAP_STYLE}
          onPress={() => setSelectedRestroom(null)}
        >
          {restrooms.map((restroom) => (
            <Marker
              key={restroom.id}
              coordinate={{
                latitude: restroom.location.latitude,
                longitude: restroom.location.longitude,
              }}
              pinColor={
                restroom.isUnisex
                  ? colors.accent.primary
                  : restroom.source === 'refuge'
                    ? '#4fd1c5'
                    : colors.accent.secondary
              }
              onPress={() => handleMarkerPress(restroom)}
            />
          ))}
        </MapView>
      )}

      {/* Filter bar overlay */}
      <Animated.View entering={FadeIn.delay(300)} style={styles.filterBar}>
        {Platform.OS === 'web' ? (
          <View style={styles.filterWebBlur}>
            <FilterBarContent
              filters={filters}
              toggleFilter={toggleFilter}
              count={restrooms.length}
              loading={loading}
            />
          </View>
        ) : (
          <BlurView intensity={40} tint="dark" style={styles.filterBlur}>
            <FilterBarContent
              filters={filters}
              toggleFilter={toggleFilter}
              count={restrooms.length}
              loading={loading}
            />
          </BlurView>
        )}
      </Animated.View>

      {/* Re-center FAB */}
      <Pressable onPress={handleRecenter} style={styles.fab}>
        {Platform.OS === 'web' ? (
          <View style={styles.fabWebBlur}>
            <Crosshair size={22} color={colors.accent.primary} strokeWidth={1.5} />
          </View>
        ) : (
          <BlurView intensity={40} tint="dark" style={styles.fabBlur}>
            <Crosshair size={22} color={colors.accent.primary} strokeWidth={1.5} />
          </BlurView>
        )}
      </Pressable>

      {/* Refresh FAB */}
      <Pressable onPress={refresh} style={styles.refreshFab}>
        {Platform.OS === 'web' ? (
          <View style={styles.fabWebBlur}>
            <RefreshCw size={22} color={colors.accent.primary} strokeWidth={1.5} />
          </View>
        ) : (
          <BlurView intensity={40} tint="dark" style={styles.fabBlur}>
            <RefreshCw size={22} color={colors.accent.primary} strokeWidth={1.5} />
          </BlurView>
        )}
      </Pressable>

      {/* Detail sheet */}
      {selectedRestroom && (
        <RestroomDetailSheet
          restroom={selectedRestroom}
          onClose={() => setSelectedRestroom(null)}
          onNavigate={handleNavigate}
        />
      )}
    </View>
  );
}

function FilterBarContent({
  filters,
  toggleFilter,
  count,
  loading,
}: {
  filters: { accessible: boolean; unisex: boolean };
  toggleFilter: (key: 'accessible' | 'unisex') => void;
  count: number;
  loading: boolean;
}) {
  return (
    <View style={styles.filterContent}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <FilterChip
          label="Accessible"
          icon={Accessibility}
          active={filters.accessible}
          onPress={() => toggleFilter('accessible')}
        />
        <FilterChip
          label="Single-stall"
          icon={DoorOpen}
          active={filters.unisex}
          onPress={() => toggleFilter('unisex')}
        />
      </ScrollView>
      <Text style={styles.countText}>
        {loading ? 'Searching...' : `${count} found`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.start,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorIcon: {
    marginBottom: spacing.md,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  retryText: {
    ...typography.button,
    color: colors.background.start,
  },

  // Filter bar
  filterBar: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  filterBlur: {
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
  },
  filterWebBlur: {
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
    backdropFilter: 'blur(40px)',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  countText: {
    ...typography.caption,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },

  // Filter chips
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.surface,
  },
  chipActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  chipTextActive: {
    color: '#0a1628',
  },

  // FABs
  fab: {
    position: 'absolute',
    bottom: 120,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshFab: {
    position: 'absolute',
    bottom: 180,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabBlur: {
    flex: 1,
    backgroundColor: colors.glass.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabWebBlur: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Detail sheet
  sheetContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetBlur: {
    backgroundColor: colors.glass.surface,
  },
  sheetWebBlur: {
    backgroundColor: 'rgba(10, 22, 40, 0.9)',
    backdropFilter: 'blur(40px)',
  },
  sheetContent: {
    padding: spacing.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.glass.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    paddingRight: spacing.xl,
  },
  sheetAddress: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  sheetDistance: {
    ...typography.caption,
    color: colors.accent.primary,
    marginBottom: spacing.md,
  },
  sheetDirections: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.glass.surfaceHover,
  },
  badgeOpen: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  badgeClosed: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
  },
  badgeRefuge: {
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
  },
  badgeText: {
    ...typography.small,
    color: colors.text.primary,
  },
  navigateButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  navigateText: {
    ...typography.button,
    color: colors.background.start,
  },
});
