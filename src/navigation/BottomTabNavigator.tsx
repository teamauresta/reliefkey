import React from 'react';
import { StyleSheet, View, Platform, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Home, MapPin, BarChart3, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { RestroomFinderScreen } from '../screens/RestroomFinderScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator();

const icons = {
  Home,
  Find: MapPin,
  Progress: BarChart3,
  Settings,
};

function TabIcon({ name, focused }: { name: keyof typeof icons; focused: boolean }) {
  const Icon = icons[name];

  return (
    <View style={styles.iconContainer}>
      <Icon
        size={24}
        color={focused ? colors.accent.primary : colors.text.secondary}
        strokeWidth={focused ? 2 : 1.5}
      />
      {focused && <View style={styles.indicator} />}
    </View>
  );
}

function CustomTabBar(props: any) {
  const { state, descriptors, navigation } = props;

  return (
    <View style={styles.tabBarContainer}>
      {Platform.OS === 'web' ? (
        <View style={styles.webBlur}>
          <TabBarContent
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        </View>
      ) : (
        <BlurView intensity={40} tint="dark" style={styles.blurView}>
          <TabBarContent
            state={state}
            descriptors={descriptors}
            navigation={navigation}
          />
        </BlurView>
      )}
    </View>
  );
}

function TabBarContent({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContent}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} style={styles.tabItem} onPress={onPress}>
            <View style={styles.tabButton}>
              <TabIcon name={route.name} focused={isFocused} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Find" component={RestroomFinderScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  blurView: {
    flex: 1,
    backgroundColor: colors.glass.surface,
  },
  webBlur: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    backdropFilter: 'blur(40px)',
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    padding: spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
    marginTop: 6,
  },
});
