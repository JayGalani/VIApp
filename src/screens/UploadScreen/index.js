import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity, Image, ActivityIndicator, Animated, useWindowDimensions, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, XCircle, FileVideo, Image as ImageIcon } from 'lucide-react-native';

import { addMedia } from '../../redux/actions/mediaActions';
import { COLORS } from '../../common/colors';
import { STRINGS } from '../../common/strings';
import { FONTS, SIZES } from '../../common/fonts';
import { CustomButton, CustomHeader } from '../../components';

const renderMediaIcon = (type) => {
    if (type === STRINGS.MEDIA_TYPES.VIDEO) {
        return <FileVideo size={48} color={COLORS.PRIMARY} />;
    }
    return <ImageIcon size={48} color={COLORS.PRIMARY} />;
};

const UploadScreen = ({ navigation, route }) => {
    const { media } = route.params || {};
    const { width } = useWindowDimensions();
    const [status, setStatus] = useState('uploading');
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    const intervalRef = useRef(null);
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const startUpload = useCallback(() => {
        setStatus('uploading');
        setProgress(0);

        if (intervalRef.current) clearInterval(intervalRef.current);

        const fileSize = media?.sizeInBytes || 1024 * 1024;
        const uploadSpeed = 2 * 1024 * 1024;
        const totalSteps = 100;

        const totalDuration = (fileSize / uploadSpeed) * 1000;
        const stepDuration = Math.max(50, totalDuration / totalSteps);

        let currentProgress = 0;

        intervalRef.current = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(intervalRef.current);
                setStatus('success');
                dispatch(addMedia(media));
            }
        }, stepDuration);
    }, [media, dispatch]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        if (!media) {
            setStatus('error');
            return;
        }
        startUpload();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [media, startUpload, fadeAnim]);





    const handleRetry = () => {
        startUpload();
    };

    const handleCancel = () => {
        if (status === 'success') {
            navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
        } else if (status === 'uploading') {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setStatus('cancelled');
        } else {
            navigation.goBack();
        }
    };

    const handleGoBack = () => {
        if (status === 'success') {
            navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
        } else {
            handleCancel();
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                handleGoBack();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [status, navigation])
    );

    const handleNavigateToList = () => {
        navigation.navigate(STRINGS.SCREEN_NAMES.LIST);
    };



    const getStatusColor = () => {
        switch (status) {
            case 'success': return COLORS.SUCCESS;
            case 'error': return COLORS.ERROR;
            case 'cancelled': return COLORS.WARNING;
            default: return COLORS.PRIMARY;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.SURFACE} />

            <CustomHeader
                title={STRINGS.UPLOAD.TITLE}
                showBack={status === 'cancelled' || status === 'error'}
                onBackPress={handleGoBack}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.mainLayout}>
                    <View style={styles.mediaHero}>
                        <View style={[
                            styles.glowContainer,
                            {
                                width: width * 0.65,
                                height: width * 0.65,
                                borderRadius: (width * 0.65) / 2,
                                backgroundColor: `${getStatusColor()}15`
                            }
                        ]}>
                            <View style={[
                                styles.previewWrapper,
                                {
                                    width: width * 0.55,
                                    height: width * 0.55,
                                    borderRadius: (width * 0.55) / 2,
                                    borderColor: getStatusColor()
                                }
                            ]}>
                                {media?.thumbnailUri || (media?.type === STRINGS.MEDIA_TYPES.PHOTO && media?.uri) ? (
                                    <Image
                                        source={{ uri: media.thumbnailUri || media.uri }}
                                        style={styles.heroThumbnail}
                                    />
                                ) : (
                                    <View style={styles.iconPlaceholder}>
                                        {renderMediaIcon(media?.type)}
                                    </View>
                                )}
                                {status === 'uploading' && (
                                    <View style={styles.overlay}>
                                        <ActivityIndicator size="large" color={COLORS.WHITE} />
                                    </View>
                                )}
                            </View>
                        </View>
                        <Text style={styles.mediaTitle} numberOfLines={2}>{media?.title || STRINGS.UPLOAD.DEFAULT_TITLE}</Text>
                        <Text style={styles.mediaMeta}>{media?.size || STRINGS.UPLOAD.DEFAULT_SIZE}</Text>
                    </View>

                    <View style={styles.statusSection}>
                        {status === 'uploading' && (
                            <View style={styles.uploadInfo}>
                                <View style={styles.progressTextContainer}>
                                    <Text style={[
                                        styles.percentText,
                                        {
                                            fontSize: width * 0.18,
                                            lineHeight: width * 0.18
                                        }
                                    ]}>{progress}%</Text>
                                    <Text style={styles.uploadingLabel}>{STRINGS.UPLOAD.PROGRESS}</Text>
                                </View>
                                <View style={styles.barContainer}>
                                    <View style={[
                                        styles.barFill,
                                        {
                                            width: `${progress}%`,
                                            backgroundColor: getStatusColor()
                                        }
                                    ]} />
                                </View>
                            </View>
                        )}

                        {status === 'success' && (
                            <View style={styles.statusMessage}>
                                <CheckCircle size={width * 0.15} color={COLORS.SUCCESS} style={styles.statusIcon} />
                                <Text style={styles.statusTitleSuccess}>{STRINGS.UPLOAD.SUCCESS}</Text>
                                <Text style={styles.statusDesc} numberOfLines={2}>{STRINGS.UPLOAD.SUCCESS_SUB}</Text>
                            </View>
                        )}

                        {status === 'error' && (
                            <View style={styles.statusMessage}>
                                <AlertCircle size={width * 0.15} color={COLORS.ERROR} style={styles.statusIcon} />
                                <Text style={styles.statusTitleError}>{STRINGS.UPLOAD.FAILURE_TITLE}</Text>
                                <Text style={styles.statusDesc} numberOfLines={2}>{STRINGS.UPLOAD.FAILURE}</Text>
                                <CustomButton
                                    title={STRINGS.UPLOAD.BUTTON_RETRY}
                                    onPress={handleRetry}
                                    style={styles.actionButton}
                                />
                            </View>
                        )}

                        {status === 'cancelled' && (
                            <View style={styles.statusMessage}>
                                <XCircle size={width * 0.15} color={COLORS.WARNING} style={styles.statusIcon} />
                                <Text style={styles.statusTitleWarning}>{STRINGS.UPLOAD.CANCELLED_TITLE}</Text>
                                <Text style={styles.statusDesc} numberOfLines={2}>{STRINGS.UPLOAD.CANCELLED_SUB}</Text>
                                <CustomButton
                                    title={STRINGS.UPLOAD.RESUME}
                                    onPress={handleRetry}
                                    style={styles.actionButton}
                                />
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
                    {status === 'uploading' && (
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
                            <Text style={styles.secondaryButtonText}>{STRINGS.UPLOAD.BUTTON_CANCEL}</Text>
                        </TouchableOpacity>
                    )}
                    {status === 'success' && (
                        <CustomButton
                            title={STRINGS.NAV.DONE}
                            onPress={handleNavigateToList}
                            style={styles.fullWidthButton}
                        />
                    )}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SURFACE,
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },

    mainLayout: {
        flex: 1,
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    mediaHero: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    glowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    previewWrapper: {
        borderWidth: 6,
        overflow: 'hidden',
        backgroundColor: COLORS.SURFACE,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },
    heroThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaTitle: {
        ...FONTS.BOLD,
        fontSize: 20,
        color: COLORS.TEXT_PRIMARY,
        textAlign: 'center',
        letterSpacing: 0.3,
        paddingHorizontal: 10,
    },
    mediaMeta: {
        ...FONTS.MEDIUM,
        fontSize: SIZES.body2,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 4,
        opacity: 0.8,
    },
    statusSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    uploadInfo: {
        alignItems: 'center',
    },
    progressTextContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    percentText: {
        ...FONTS.BOLD,
        color: COLORS.PRIMARY,
    },
    uploadingLabel: {
        ...FONTS.MEDIUM,
        fontSize: SIZES.body1,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 0,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    barContainer: {
        width: '100%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 7,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    barFill: {
        height: '100%',
        borderRadius: 7,
    },
    statusMessage: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    statusIcon: {
        marginBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    statusTitleSuccess: {
        ...FONTS.BOLD,
        fontSize: 32,
        color: COLORS.SUCCESS,
        textAlign: 'center',
    },
    statusTitleError: {
        ...FONTS.BOLD,
        fontSize: 32,
        color: COLORS.ERROR,
        textAlign: 'center',
    },
    statusTitleWarning: {
        ...FONTS.BOLD,
        fontSize: 32,
        color: COLORS.WARNING,
        textAlign: 'center',
    },
    statusDesc: {
        ...FONTS.REGULAR,
        fontSize: SIZES.body2,
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
        maxWidth: '90%',
    },
    actionButton: {
        marginTop: 30,
        minWidth: 200,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    secondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    secondaryButtonText: {
        ...FONTS.BOLD,
        color: COLORS.GRAY,
        fontSize: SIZES.body2,
        textDecorationLine: 'underline',
        opacity: 0.7,
    },
    fullWidthButton: {
        width: '100%',
    }
});

export default UploadScreen;

