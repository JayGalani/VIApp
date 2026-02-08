import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser, clearError } from '../../redux/actions/authActions';
import { STRINGS } from '../../common/strings';
import { COLORS } from '../../common/colors';
import { FONTS, SIZES } from '../../common/fonts';
import { CustomInput, CustomButton } from '../../components';
import { validateEmail, validatePassword } from '../../utils';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const isMounted = useRef(true);

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (error && isMounted.current) {
      setIsLoginLoading(false);
    }
  }, [error]);

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');


    let hasError = false;

    if (!email) {
      setEmailError(STRINGS.LOGIN.ERROR_EMPTY_EMAIL);
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError(STRINGS.LOGIN.ERROR_INVALID_EMAIL);
      hasError = true;
    }

    if (!password) {
      setPasswordError(STRINGS.LOGIN.ERROR_EMPTY_PASSWORD);
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError(STRINGS.LOGIN.ERROR_INVALID_PASSWORD);
      hasError = true;
    }

    if (hasError) return;

    setIsLoginLoading(true);
    dispatch(loginUser({ email, password }))
      .then(() => {
        if (isMounted.current) setIsLoginLoading(false);
      })
      .catch(() => {
        if (isMounted.current) setIsLoginLoading(false);
      });
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError('');
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError('');
    if (error) dispatch(clearError());
  };

  const handleRightIconPress = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{STRINGS.LOGIN.TITLE}</Text>
          <Text style={styles.subtitle}>{STRINGS.LOGIN.SUBTITLE}</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            value={email}
            onChangeText={handleEmailChange}
            placeholder={STRINGS.LOGIN.EMAIL_PLACEHOLDER}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            LeftIcon={Mail}
          />

          <CustomInput
            value={password}
            onChangeText={handlePasswordChange}
            placeholder={STRINGS.LOGIN.PASSWORD_PLACEHOLDER}
            secureTextEntry={!showPassword}
            error={passwordError}
            LeftIcon={Lock}
            RightIcon={
              showPassword ? (
                <EyeOff size={20} color={passwordError ? COLORS.ERROR : COLORS.GRAY} />
              ) : (
                <Eye size={20} color={passwordError ? COLORS.ERROR : COLORS.GRAY} />
              )
            }
            onRightIconPress={handleRightIconPress}
          />

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>{STRINGS.LOGIN.FORGOT_PASSWORD}</Text>
          </TouchableOpacity>

          <CustomButton
            title={STRINGS.LOGIN.BUTTON}
            onPress={handleLogin}
            isLoading={isLoginLoading}
          />

          {error ? (
            <Text style={styles.errorBanner}>{error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...FONTS.BOLD,
    fontSize: 32,
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    ...FONTS.REGULAR,
    fontSize: SIZES.body1,
    color: COLORS.TEXT_SECONDARY,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    ...FONTS.MEDIUM,
    color: COLORS.PRIMARY,
    fontSize: SIZES.body2,
  },

  errorBanner: {
    ...FONTS.MEDIUM,
    color: COLORS.ERROR,
    fontSize: SIZES.body2,
    marginTop: 24,
    textAlign: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
});

export default LoginScreen;
