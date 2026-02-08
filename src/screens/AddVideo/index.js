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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);



  const handleSelectVideo = async (type) => {
    const hasPermission = await requestMediaPermissions(type, STRINGS.MEDIA_TYPES.VIDEO);
    if (!hasPermission) {
      Alert.alert(STRINGS.PERMISSIONS.DENIED_TITLE, `${STRINGS.PERMISSIONS.DENIED_MSG}${type}.`);
      return;
    }

    const options = {
      mediaType: STRINGS.MEDIA_TYPES.VIDEO,
    };

    const callback = async (response) => {
      if (response.didCancel || !isMounted.current) {
        return;
      }

      if (response.errorCode) {
        if (isMounted.current) {
          setIsProcessing(false);
          Alert.alert(STRINGS.COMMON.ERROR, response.errorMessage);
        }
        return;
      }

      const assets = response.assets;
      if (!assets || assets.length === 0) {
        if (isMounted.current) setIsProcessing(false);
        return;
      }

      if (isMounted.current) setIsProcessing(true);

      const selectedVideo = assets[0];
      const sourceUri = selectedVideo.uri;

      try {
        const { isValid, error } = validateVideo(selectedVideo);
        if (!isValid) {
          throw new Error(error);
        }

        if (isMounted.current) {
          setVideo({ ...selectedVideo, thumbnailUri: null });
        }

        let url = sourceUri;
        if (Platform.OS === 'ios' && url.startsWith('file://')) {
          url = decodeURIComponent(url.replace('file://', ''));
        }

        const thumbnail = await createThumbnail({
          url: url,
          timeStamp: 1000,
        }).catch(() => {
          return null;
        });

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
        }
      } catch (err) {
        if (isMounted.current) {
          Alert.alert(STRINGS.COMMON.ERROR, err.message || "Failed to process video");
        }
      } finally {
        if (isMounted.current) {
          setIsProcessing(false);
        }
      }
    };

    try {
      if (type === 'camera') {
        await launchCamera(options, callback);
      } else {
        await launchImageLibrary(options, callback);
      }
    } catch (err) {
      if (isMounted.current) {
        setIsProcessing(false);
        Alert.alert(STRINGS.COMMON.ERROR, type === 'camera' ? STRINGS.COMMON.CAMERA_LAUNCH_ERROR : STRINGS.COMMON.GALLERY_LAUNCH_ERROR);
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
      size: (video.fileSize ? (video.fileSize / 1024 / 1024).toFixed(2) : STRINGS.ADD_VIDEO.DEFAULT_SIZE) + STRINGS.ADD_VIDEO.MB,
      sizeInBytes: video.fileSize || 10 * 1024 * 1024,
      date: new Date().toLocaleDateString(),
    };

    navigation.navigate(STRINGS.SCREEN_NAMES.UPLOAD_SCREEN, { media: newVideo });
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

  const handleSelectGalleryPress = () => {
    handleSelectVideo('gallery');
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />
      <CustomHeader
        title={STRINGS.ADD_VIDEO.TITLE}
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
            type={STRINGS.MEDIA_TYPES.VIDEO}
            uri={video ? video.uri : null}
            thumbnailUri={video ? video.thumbnailUri : null}
            fileName={video ? video.fileName : null}
            fileSize={video ? video.fileSize : null}
            isProcessing={isProcessing}
          />

          {video && (
            <View style={styles.inputSection}>
              <CustomInput
                value={description}
                onChangeText={handleDescriptionChange}
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
                onPress={handleSelectGalleryPress}
                secondary
                style={styles.fullWidthButton}
              />
            </View>

            {video && !isProcessing && (
              <CustomButton
                title={STRINGS.ADD_VIDEO.UPLOAD}
                onPress={handleProceedUpload}
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
