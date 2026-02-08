import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus } from '../redux/actions/authActions';

import { 
  SplashScreen, 
  LoginScreen, 
  DashboardScreen, 
  ListScreen, 
  AddVideoScreen, 
  AddPhotoScreen, 
  UploadScreen 
} from '../screens';
import { STRINGS } from '../common/strings';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (!isInitialAuthChecked) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name={STRINGS.SCREEN_NAMES.LOGIN} component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name={STRINGS.SCREEN_NAMES.DASHBOARD} component={DashboardScreen} />
            <Stack.Screen name={STRINGS.SCREEN_NAMES.LIST} component={ListScreen} />
            <Stack.Screen name={STRINGS.SCREEN_NAMES.ADD_VIDEO} component={AddVideoScreen} />
            <Stack.Screen name={STRINGS.SCREEN_NAMES.ADD_PHOTO} component={AddPhotoScreen} />
            <Stack.Screen name={STRINGS.SCREEN_NAMES.UPLOAD_SCREEN} component={UploadScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
