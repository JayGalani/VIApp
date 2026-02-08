import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';

const CustomInput = ({ 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry, 
    error, 
    LeftIcon, 
    RightIcon,
    onRightIconPress,
    keyboardType,
    autoCapitalize,
    multiline,
    editable,
    style,
    inputStyle,
    containerStyle
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[
                styles.inputWrapper, 
                error && styles.inputWrapperError,
                style
            ]}>
                {LeftIcon && (
                    <LeftIcon 
                        size={20} 
                        color={error ? COLORS.ERROR : COLORS.GRAY} 
                        style={styles.inputIcon} 
                    />
                )}
                <TextInput
                    style={[styles.input, inputStyle, multiline && styles.multilineInput]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.GRAY}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    editable={editable}
                    textAlignVertical={multiline ? 'top' : 'center'}
                />
                {RightIcon && (
                    <TouchableOpacity 
                        onPress={onRightIconPress} 
                        disabled={!onRightIconPress} 
                        style={styles.eyeIcon}
                    >
                        {RightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      marginBottom: 16,
      width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputWrapperError: {
    borderColor: COLORS.ERROR,
    backgroundColor: '#FFF8F8',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    ...FONTS.REGULAR,
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.TEXT_PRIMARY,
    height: '100%',
  },
  multilineInput: {
      height: 120,
      paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  fieldErrorText: {
    ...FONTS.MEDIUM,
    color: COLORS.ERROR,
    fontSize: SIZES.caption,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomInput;
