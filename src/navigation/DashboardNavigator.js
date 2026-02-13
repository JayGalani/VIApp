import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Menu, LogOut } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { logoutUser } from '../redux/actions/authActions';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';
import { STRINGS } from '../common/strings';
import { TabItem } from '../components';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const contentStyle = [
    styles.content,
    { paddingBottom: 60 + Math.max(insets.bottom, 10) }
  ];

  const tabBarStyle = [
    styles.tabBar,
    {
      paddingBottom: Math.max(insets.bottom, 10),
      height: 60 + Math.max(insets.bottom, 10)
    }
  ];

  const handleListPress = () => navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
  const handleLogoutPress = () => dispatch(logoutUser());

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          STRINGS.DASHBOARD.EXIT_TITLE,
          STRINGS.DASHBOARD.EXIT_MESSAGE,
          [
            {
              text: STRINGS.COMMON.CANCEL,
              onPress: () => null,
              style: 'cancel',
            },
            { text: STRINGS.COMMON.YES, onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentContainer} edges={['top', 'left', 'right']}>
        <View style={contentStyle}>
          <Text style={styles.text}>{STRINGS.DASHBOARD.SCREEN_NAME}</Text>
        </View>
      </SafeAreaView>

      <View style={tabBarStyle}>
        <TabItem
          onPress={handleListPress}
          Icon={Menu}
          label={STRINGS.NAV.LIST}
        />

        <TabItem
          onPress={handleLogoutPress}
          Icon={LogOut}
          label={STRINGS.NAV.LOGOUT}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...FONTS.REGULAR,
    fontSize: SIZES.h3,
    color: COLORS.TEXT_PRIMARY,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default DashboardLayout;
