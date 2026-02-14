import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FileVideo, PlayCircle, Image as ImageIcon } from 'lucide-react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';
import { STRINGS } from '../common/strings';
import ProcessingOverlay from './ProcessingOverlay';

const MediaPreview = ({
    type = 'photo',
    uri,
    thumbnailUri,
    fileName,
    fileSize,
    isProcessing = false,
    progress = 0
}) => {

    const [imageError, setImageError] = React.useState(false);

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
            if (imageError) {
                return (
                    <View style={styles.placeholder}>
                        <ImageIcon color={COLORS.error} size={48} />
                        <Text style={[styles.placeholderText, { color: COLORS.error }]}>
                            Failed to load image
                        </Text>
                        <Text style={styles.errorSubText}>
                            (Preview may not be supported on this Simulator)
                        </Text>
                    </View>
                );
            }
            return (
                <Image
                    source={{ uri }}
                    style={styles.previewImage}
                    onError={() => setImageError(true)}
                />
            );
        }

        return (
            <View style={styles.videoPlaceholder}>
                {thumbnailUri && !imageError ? (
                    <Image
                        source={{ uri: thumbnailUri }}
                        style={styles.previewImage}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={styles.videoPlaceholderGray}>
                        <FileVideo color={COLORS.TEXT_SECONDARY} size={64} style={styles.videoIcon} />
                        <View style={styles.playOverlay}>
                            <PlayCircle color={COLORS.PRIMARY} size={48} fill={COLORS.WHITE} />
                        </View>
                        <Text style={styles.videoNameMargin}>{fileName || STRINGS.ADD_VIDEO.DEFAULT_FILENAME}</Text>
                        <Text style={styles.videoSize}>
                            {fileSize ? (fileSize / 1024 / 1024).toFixed(2) + ' MB' : STRINGS.ADD_VIDEO.SIZE_UNKNOWN}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.previewContainer}>
            {renderContent()}
            <ProcessingOverlay isVisible={isProcessing} progress={progress} />
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        marginTop: 20,
        marginBottom: 30,
        width: '100%',
        height: 300,
        backgroundColor: COLORS.BLACK,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    placeholder: {
        alignItems: 'center',
        padding: 20,
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
    errorSubText: {
        ...FONTS.REGULAR,
        color: COLORS.error,
        fontSize: SIZES.caption,
        textAlign: 'center',
        marginTop: 4,
    },
    simWarning: {
        ...FONTS.REGULAR,
        color: COLORS.orange || '#FFA500',
        fontSize: SIZES.caption,
        marginTop: 8,
    }
});

export default memo(MediaPreview);
