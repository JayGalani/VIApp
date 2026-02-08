import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { FileVideo, PlayCircle, Image as ImageIcon } from 'lucide-react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';
import { STRINGS } from '../common/strings';

const MediaPreview = ({
    type = 'photo',
    uri,
    thumbnailUri,
    fileName,
    fileSize,
    isProcessing = false
}) => {

    const renderContent = () => {
        if (!uri) {
            return (
                <View style={styles.placeholder}>
                    {type === 'video' ? (
                        <PlayCircle color={COLORS.TEXT_SECONDARY} size={48} />
                    ) : (
                        <ImageIcon color={COLORS.TEXT_SECONDARY} size={48} />
                    )}
                    <Text style={styles.placeholderText}>
                        {type === 'video' ? STRINGS.ADD_VIDEO.NO_VIDEO : STRINGS.ADD_PHOTO.NO_PHOTO}
                    </Text>
                </View>
            );
        }

        if (type === 'photo') {
            return <Image source={{ uri }} style={styles.previewImage} />;
        }

        return (
            <View style={styles.videoPlaceholder}>
                {thumbnailUri ? (
                    <Image source={{ uri: thumbnailUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.videoPlaceholderGray}>
                        <FileVideo color={COLORS.TEXT_SECONDARY} size={64} style={styles.videoIcon} />
                        <View style={styles.playOverlay}>
                            <PlayCircle color={COLORS.PRIMARY} size={48} fill={COLORS.WHITE} />
                        </View>
                        <Text style={styles.videoNameMargin}>{fileName || STRINGS.ADD_VIDEO.DEFAULT_FILENAME}</Text>
                        <Text style={styles.videoSize}>
                            {fileSize ? (fileSize / 1024 / 1024).toFixed(2) + STRINGS.ADD_VIDEO.MB : STRINGS.ADD_VIDEO.SIZE_UNKNOWN}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.previewContainer}>
            {renderContent()}
            {isProcessing && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        marginTop: 20,
        marginBottom: 30,
        width: '100%',
        height: 300,
        backgroundColor: COLORS.LIGHT_GRAY,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        ...FONTS.REGULAR,
        color: COLORS.TEXT_SECONDARY,
        fontSize: SIZES.body1,
        marginTop: 10,
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlaceholderGray: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    videoIcon: {
        opacity: 0.5,
    },
    videoNameMargin: {
        ...FONTS.REGULAR,
        color: COLORS.TEXT_SECONDARY,
        fontSize: SIZES.body2,
        marginBottom: 5,
        marginTop: 15,
    },
    videoSize: {
        ...FONTS.REGULAR,
        color: COLORS.GRAY,
        fontSize: SIZES.caption,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingBox: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default MediaPreview;
