import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar, Alert, KeyboardAvoidingView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STRINGS } from '../../common/strings';
import { COLORS } from '../../common/colors';
import { requestMediaPermissions, validatePhoto } from '../../utils';
import { CustomButton, CustomInput, CustomHeader, MediaPreview } from '../../components';


const AddPhotoScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);



  const handleSelectPhoto = async (type) => {
    const options = {
      mediaType: STRINGS.MEDIA_TYPES.PHOTO,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    const hasPermission = await requestMediaPermissions(type, STRINGS.MEDIA_TYPES.PHOTO);
    if (!hasPermission) {
      Alert.alert(STRINGS.PERMISSIONS.DENIED_TITLE, `${STRINGS.PERMISSIONS.DENIED_MSG}${type}.`);
      return;
    }

    const callback = (response) => {

      if (response.didCancel || !isMounted.current) {
        return;
      } else if (response.errorCode) {
        if (isMounted.current) {
          Alert.alert(STRINGS.COMMON.ERROR, response.errorMessage);
        }
      } else if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0];

        const { isValid, error } = validatePhoto(selectedPhoto);

        if (!isValid) {
          if (isMounted.current) {
            Alert.alert(STRINGS.COMMON.ERROR, error);
          }
          return;
        }

        if (isMounted.current) {
          setPhoto(selectedPhoto);
        }
      }
    };

    if (type === 'camera') {
      try {
        await launchCamera(options, callback);
      } catch {
        if (isMounted.current) Alert.alert(STRINGS.COMMON.ERROR, STRINGS.COMMON.CAMERA_LAUNCH_ERROR);
      }
    } else {
      try {
        await launchImageLibrary(options, callback);
      } catch {
        if (isMounted.current) Alert.alert(STRINGS.COMMON.ERROR, STRINGS.COMMON.GALLERY_LAUNCH_ERROR);
      }
    }
  };

  const handleProceedUpload = () => {
    if (!photo) return;

    if (!description.trim()) {
      setError(STRINGS.ADD_PHOTO.ERROR_DESCRIPTION);
      return;
    }

    const newPhoto = {
      id: Date.now().toString(),
      type: STRINGS.MEDIA_TYPES.PHOTO,
      title: description.trim(),
      description: description.trim(),
      uri: photo.uri,
      size: (photo.fileSize ? (photo.fileSize / 1024 / 1024).toFixed(2) : STRINGS.ADD_PHOTO.DEFAULT_SIZE) + STRINGS.ADD_PHOTO.MB,
      sizeInBytes: photo.fileSize || 500 * 1024,
      date: new Date().toLocaleDateString(),
    };

    navigation.navigate(STRINGS.SCREEN_NAMES.UPLOAD_SCREEN, { media: newPhoto });
  };

  const handleBackPress = () => {
    navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  const handleDescriptionChange = (text) => {
    setDescription(text);
    if (error) setError('');
  };

  const handleCapturePress = () => {
    handleSelectPhoto('camera');
  };

  const handleSelectPress = () => {
    handleSelectPhoto('gallery');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />
      <CustomHeader
        title={STRINGS.ADD_PHOTO.TITLE}
        showBack={true}
        onBackPress={handleBackPress}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <MediaPreview
            type="photo"
            uri={photo ? photo.uri : null}
          />

          {photo && (
            <View style={styles.inputSection}>
              <CustomInput
                value={description}
                onChangeText={handleDescriptionChange}
                placeholder={STRINGS.ADD_PHOTO.DESCRIPTION_PLACEHOLDER}
                multiline
                error={error}
                containerStyle={styles.descriptionInput}
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <CustomButton
                title={STRINGS.ADD_PHOTO.CAPTURE}
                onPress={handleCapturePress}
                secondary
                style={styles.actionButton}
              />
              <CustomButton
                title={STRINGS.ADD_PHOTO.SELECT}
                onPress={handleSelectPress}
                secondary
                style={styles.actionButton}
              />
            </View>

            {photo && (
              <CustomButton
                title={STRINGS.ADD_PHOTO.UPLOAD}
                onPress={handleProceedUpload}
                style={styles.uploadButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputSection: {
    width: '100%',
    marginVertical: 10,
  },
  descriptionInput: {
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  uploadButton: {
    width: '100%',
    marginTop: 8,
  },
  footer: {
    marginTop: 20,
    width: '100%',
  }
});

export default AddPhotoScreen;
