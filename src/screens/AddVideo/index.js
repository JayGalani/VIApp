import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform, StatusBar, KeyboardAvoidingView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';

import { SafeAreaView } from 'react-native-safe-area-context';

import { STRINGS } from '../../common/strings';
import { COLORS } from '../../common/colors';
import { requestMediaPermissions, validateVideo } from '../../utils';
import { CustomButton, CustomInput, CustomHeader, MediaPreview } from '../../components';

const AddVideoScreen = ({ navigation }) => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
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

  const simulateProgress = (fileSize = 0) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setProcessingProgress(0);

    const possibleIncrements = [5, 8, 12, 15];
    const interval_ms = 100;

    const interval = setInterval(() => {
      if (!isMounted.current) {
        clearInterval(interval);
        return;
      }
      setProcessingProgress(prev => {
        if (prev >= 90) {
          return 90;
        }
        const randomIncrement = possibleIncrements[Math.floor(Math.random() * possibleIncrements.length)];
        return Math.min(90, prev + randomIncrement);
      });
    }, interval_ms);

    progressIntervalRef.current = interval;
    return interval;
  };

  const handleCallback = async (response) => {

    if (isMounted.current) {
      setIsSelecting(false);
    }

    if (response.didCancel || !isMounted.current) {
      return;
    }

    if (response.errorCode) {
      if (isMounted.current) {
        Alert.alert(STRINGS.COMMON.ERROR, response.errorMessage || 'Failed to select video');
      }
      return;
    }

    const assets = response.assets;
    if (!assets || assets.length === 0) {
      if (isMounted.current) {
        Alert.alert(STRINGS.COMMON.ERROR, "Failed to select video. Please try again.");
      }
      return;
    }

    const selectedVideo = assets[0];

    if (!selectedVideo.uri) {
      if (isMounted.current) {
        Alert.alert(STRINGS.COMMON.ERROR, "Failed to load video. Please try another one.");
      }
      return;
    }

    const sourceUri = selectedVideo.uri;

    try {
      const { isValid, error: vError } = validateVideo(selectedVideo);

      if (!isValid) {
        if (isMounted.current) {
          Alert.alert(STRINGS.COMMON.ERROR, vError);
        }
        return;
      }

      if (isMounted.current) {

        setProcessingProgress(0);

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }

        setVideo({ ...selectedVideo, thumbnailUri: null });
        setIsProcessing(true);
      }

      const progressInterval = simulateProgress(selectedVideo.fileSize);
      const startTime = Date.now();

      let url = sourceUri;
      if (Platform.OS === 'ios' && url.startsWith('file://')) {
        url = decodeURIComponent(url.replace('file://', ''));
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Thumbnail generation timed out')), 10000)
      );

      const thumbnailPromise = createThumbnail({
        url: url,
        timeStamp: 0,
        format: 'jpeg',
      });

      const thumbnail = await Promise.race([thumbnailPromise, timeoutPromise])
        .catch((_) => {
          return null;
        });

      const elapsedTime = Date.now() - startTime;
      const minDisplayTime = 1000;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      if (progressInterval) clearInterval(progressInterval);

      if (isMounted.current) {
        let thumbnailPath = null;
        if (thumbnail && thumbnail.path) {
          thumbnailPath = thumbnail.path.startsWith('file://')
            ? thumbnail.path
            : `file://${thumbnail.path}`;
        }

        setVideo(prev => {
          if (!prev || prev.uri !== sourceUri) return prev;
          return { ...prev, thumbnailUri: thumbnailPath };
        });

        setProcessingProgress(100);
        setTimeout(() => {
          if (isMounted.current) {
            setIsProcessing(false);
          }
        }, 500);
      }
    } catch (err) {
      if (isMounted.current) {
        setIsProcessing(false);
        Alert.alert(STRINGS.COMMON.ERROR, err.message || "Failed to process video");
      }
    }
  };

  const handleSelectVideo = async (type) => {
    if (isMounted.current) setIsSelecting(true);

    const hasPermission = await requestMediaPermissions(type, STRINGS.MEDIA_TYPES.VIDEO);

    if (!hasPermission) {
      if (isMounted.current) setIsSelecting(false);
      Alert.alert(STRINGS.PERMISSIONS.DENIED_TITLE, `${STRINGS.PERMISSIONS.DENIED_MSG}${type}.`);
      return;
    }

    const options = {
      selectionLimit: 1,
      videoQuality: Platform.OS === 'ios' ? 'medium' : 'high',
      assetRepresentationMode: 'current',
    };

    try {
      let response;
      if (type === 'camera') {
        response = await launchCamera({ ...options, loadingIndicatorSource: null, mediaType: 'video', saveToPhotos: true });
      } else {
        response = await launchImageLibrary({ ...options, mediaType: 'video' });
      }

      if (isMounted.current) {
        setIsSelecting(false);
      }

      await handleCallback(response);
    } catch (err) {
      if (isMounted.current) {
        setIsSelecting(false);
        Alert.alert(STRINGS.COMMON.ERROR, type === 'camera' ? STRINGS.COMMON.CAMERA_LAUNCH_ERROR : STRINGS.COMMON.GALLERY_LAUNCH_ERROR);
      }
    } finally {
      if (isMounted.current) {
        setIsSelecting(false);
      }
    }
  };

  const handleProceedUpload = () => {
    if (!video) return;

    if (!description.trim()) {
      setError(STRINGS.ADD_VIDEO.ERROR_DESCRIPTION);
      return;
    }

    const newVideo = {
      id: Date.now().toString(),
      type: STRINGS.MEDIA_TYPES.VIDEO,
      title: description.trim(),
      description: description.trim(),
      uri: video.uri,
      thumbnailUri: video.thumbnailUri,
      size: (video.fileSize ? (video.fileSize / 1024 / 1024).toFixed(2) : '0.00') + ' MB',
      sizeInBytes: video.fileSize || 10 * 1024 * 1024,
      date: new Date().toLocaleDateString(),
    };

    navigation.navigate(STRINGS.SCREEN_NAMES.UPLOAD_SCREEN, { media: newVideo });
  };

  const handleBackPress = React.useCallback(() => {
    navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [handleBackPress])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />
      <CustomHeader
        title={STRINGS.ADD_VIDEO.TITLE}
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
            type={STRINGS.MEDIA_TYPES.VIDEO}
            uri={video ? video.uri : null}
            thumbnailUri={video ? video.thumbnailUri : null}
            fileName={video ? video.fileName : null}
            fileSize={video ? video.fileSize : null}
            isProcessing={isProcessing}
            progress={processingProgress}
          />

          {video && (
            <View style={styles.inputSection}>
              <CustomInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (error) setError('');
                }}
                placeholder={STRINGS.ADD_VIDEO.DESCRIPTION_PLACEHOLDER}
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
                title={video ? STRINGS.ADD_VIDEO.CHANGE : STRINGS.ADD_VIDEO.SELECT}
                onPress={() => handleSelectVideo('gallery')}
                secondary
                isLoading={isSelecting}
                disabled={isSelecting || isProcessing}
                style={styles.fullWidthButton}
              />
            </View>

            {video && !isProcessing && (
              <CustomButton
                title={STRINGS.ADD_VIDEO.UPLOAD}
                onPress={handleProceedUpload}
                isLoading={false}
                disabled={isSelecting || isProcessing}
                style={styles.fullWidthButton}
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
    width: '100%',
    marginBottom: 16,
  },
  footer: {
    marginTop: 20,
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  }
});

export default AddVideoScreen;
