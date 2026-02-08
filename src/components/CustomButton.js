import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';

const CustomButton = ({ title, onPress, isLoading, disabled, style, textStyle, secondary }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        secondary && styles.secondaryButton,
        (disabled || isLoading) && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={secondary ? COLORS.PRIMARY : COLORS.WHITE} />
      ) : (
        <Text style={[
            styles.text, 
            secondary && styles.secondaryText,
            textStyle
        ]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  secondaryButton: {
      backgroundColor: COLORS.SECONDARY,
      elevation: 0,
      shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    ...FONTS.BOLD,
    color: COLORS.WHITE,
    fontSize: SIZES.body1,
    letterSpacing: 0.5,
  },
  secondaryText: {
      color: COLORS.WHITE, 
  }
});

export default CustomButton;
