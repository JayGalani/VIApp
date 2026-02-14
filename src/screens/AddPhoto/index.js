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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSelectingCamera, setIsSelectingCamera] = useState(false);
  const [isSelectingGallery, setIsSelectingGallery] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const isMounted = useRef(true);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const simulateProgress = () => {
    const possibleIncrements = [10, 15, 20];
    const interval_ms = 50;

    const interval = setInterval(() => {
      if (!isMounted.current) {
        clearInterval(interval);
        return;
      }
      setProcessingProgress(prev => {
        if (prev >= 95) {
          return 95;
        }
        const randomIncrement = possibleIncrements[Math.floor(Math.random() * possibleIncrements.length)];
        return Math.min(95, prev + randomIncrement);
      });
    }, interval_ms);

    progressIntervalRef.current = interval;
    return interval;
  };

  const handleCallback = async (response) => {
    if (!isMounted.current) return;

    if (response.didCancel) {
      setIsSelectingCamera(false);
      setIsSelectingGallery(false);
      return;
    }

    if (response.errorCode) {
      setIsSelectingCamera(false);
      setIsSelectingGallery(false);
      Alert.alert(STRINGS.COMMON.ERROR, response.errorMessage || "An error occurred");
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      setIsSelectingCamera(false);
      setIsSelectingGallery(false);
      Alert.alert(STRINGS.COMMON.ERROR, "Failed to select image. Please try again.");
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const selectedPhoto = response.assets[0];

      if (!selectedPhoto.uri) {
        setIsSelectingCamera(false);
        setIsSelectingGallery(false);
        Alert.alert(STRINGS.COMMON.ERROR, "Failed to load image. Please try another one.");
        return;
      }

      const { isValid, error: vError } = validatePhoto(selectedPhoto);

      if (!isValid) {
        setIsSelectingCamera(false);
        setIsSelectingGallery(false);
        Alert.alert(STRINGS.COMMON.ERROR, vError);
        return;
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setProcessingProgress(0);
      setPhoto(selectedPhoto);
      setIsProcessing(true);

      setIsSelectingCamera(false);
      setIsSelectingGallery(false);

      const progressInterval = simulateProgress();

      await new Promise(resolve => setTimeout(resolve, 500));

      clearInterval(progressInterval);

      if (isMounted.current) {
        setProcessingProgress(100);
        setTimeout(() => {
          if (isMounted.current) {
            setIsProcessing(false);
          }
        }, 200);
      }
    }
  };

  const handleSelectPhoto = async (type) => {
    const isCamera = type === 'camera';
    if (isMounted.current) {
      if (isCamera) setIsSelectingCamera(true);
      else setIsSelectingGallery(true);
    }

    const hasPermission = await requestMediaPermissions(type, STRINGS.MEDIA_TYPES.PHOTO);
    if (!hasPermission) {
      if (isMounted.current) {
        setIsSelectingCamera(false);
        setIsSelectingGallery(false);
      }
      Alert.alert(STRINGS.PERMISSIONS.DENIED_TITLE, `${STRINGS.PERMISSIONS.DENIED_MSG}${type}.`);
      return;
    }

    const options = {
      selectionLimit: 1,
      quality: 0.8,
      maxWidth: 1080,
      maxHeight: 1080,
      includeBase64: false,
      assetRepresentationMode: 'current',
    };

    try {
      let response;
      if (isCamera) {
        response = await launchCamera({ ...options, mediaType: 'photo', saveToPhotos: true });
      } else {
        response = await launchImageLibrary({ ...options, mediaType: 'photo' });
      }

      handleCallback(response);
    } catch (err) {
      if (isMounted.current) {
        setIsSelectingCamera(false);
        setIsSelectingGallery(false);
        Alert.alert(STRINGS.COMMON.ERROR, isCamera ? STRINGS.COMMON.CAMERA_LAUNCH_ERROR : STRINGS.COMMON.GALLERY_LAUNCH_ERROR);
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
      size: (photo.fileSize ? (photo.fileSize / 1024 / 1024).toFixed(2) : '0.00') + ' MB',
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />
      <CustomHeader
        title={STRINGS.ADD_PHOTO.TITLE}
        showBack={true}
        onBackPress={handleBackPress}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <MediaPreview
            type="photo"
            uri={photo ? photo.uri : null}
            isProcessing={isProcessing}
            progress={processingProgress}
          />

          {photo && (
            <View style={styles.inputSection}>
              <CustomInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (error) setError('');
                }}
                placeholder={STRINGS.ADD_PHOTO.DESCRIPTION_PLACEHOLDER}
                multiline
                error={error}
                editable={!isProcessing}
                containerStyle={styles.descriptionInput}
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <CustomButton
                title={STRINGS.ADD_PHOTO.CAPTURE}
                onPress={() => handleSelectPhoto('camera')}
                secondary
                isLoading={isSelectingCamera}
                disabled={isSelectingCamera || isSelectingGallery || isProcessing}
                style={styles.actionButton}
              />
              <CustomButton
                title={STRINGS.ADD_PHOTO.SELECT}
                onPress={() => handleSelectPhoto('gallery')}
                secondary
                isLoading={isSelectingGallery}
                disabled={isSelectingCamera || isSelectingGallery || isProcessing}
                style={styles.actionButton}
              />
            </View>

            {photo && !isProcessing && (
              <CustomButton
                title={STRINGS.ADD_PHOTO.UPLOAD}
                onPress={handleProceedUpload}
                isLoading={false}
                disabled={isSelectingCamera || isSelectingGallery || isProcessing}
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
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
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
