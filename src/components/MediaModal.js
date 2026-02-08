import React, { useState, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { X, Play, Pause, RotateCcw, RotateCw, Maximize2 } from 'lucide-react-native';
import { Video } from 'react-native-video';
import { COLORS } from '../common/colors';
import { FONTS } from '../common/fonts';

const { width, height } = Dimensions.get('window');

const MediaModal = ({ visible, item, onClose }) => {
    const [showControls, setShowControls] = useState(false);
    const [paused, setPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);

    if (!item) return null;

    const handleSeek = (offset) => {
        if (videoRef.current) {
            videoRef.current.seek(currentTime + offset);
        }
    };

    const onError = () => {
        setIsLoading(false);
    };

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color={COLORS.WHITE} size={32} />
                </TouchableOpacity>

                <View style={styles.content}>
                    {item.type === 'photo' ? (
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.videoContainer}>
                            <Video
                                ref={videoRef}
                                source={{ uri: item.uri }}
                                style={styles.fullVideo}
                                resizeMode="contain"
                                paused={paused}
                                repeat={true}
                                onLoad={() => setIsLoading(false)}
                                onError={onError}
                                onProgress={(data) => {
                                    setCurrentTime(data.currentTime);
                                }}
                            />

                            {isLoading && (
                                <View style={styles.loadingOverlay}>
                                    <Text style={styles.loadingText}>Loading Video...</Text>
                                </View>
                            )}

                            {!showControls && !isLoading && (
                                <TouchableOpacity
                                    style={styles.previewButton}
                                    onPress={() => setShowControls(true)}
                                >
                                    <View style={styles.miniPreviewContainer}>
                                        <Image
                                            source={{ uri: item.thumbnailUri || item.uri }}
                                            style={styles.miniPreview}
                                        />
                                        <View style={styles.miniPreviewOverlay}>
                                            <Play color={COLORS.WHITE} size={16} fill={COLORS.WHITE} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                {item.type === 'video' && showControls && (
                    <View style={styles.controlsOverlay}>
                        <View style={styles.controlsRow}>
                            <TouchableOpacity onPress={() => handleSeek(-10)}>
                                <RotateCcw color={COLORS.WHITE} size={32} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.playPauseButton} onPress={() => setPaused(!paused)}>
                                {paused ? <Play color={COLORS.WHITE} size={48} fill={COLORS.WHITE} /> : <Pause color={COLORS.WHITE} size={48} fill={COLORS.WHITE} />}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleSeek(10)}>
                                <RotateCw color={COLORS.WHITE} size={32} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.hideControlsButton} onPress={() => setShowControls(false)}>
                            <Text style={styles.hideControlsText}>Hide Controls</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BLACK,
    },
    closeButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: width,
        height: height,
    },
    videoContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullVideo: {
        width: width,
        height: '100%',
    },
    previewButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: COLORS.BLACK,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    miniPreviewContainer: {
        width: 100,
        height: 60,
    },
    miniPreview: {
        width: '100%',
        height: '100%',
    },
    miniPreviewOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
    },
    playPauseButton: {
        padding: 10,
    },
    hideControlsButton: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    hideControlsText: {
        color: COLORS.WHITE,
        ...FONTS.MEDIUM,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.BLACK,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: COLORS.WHITE,
        ...FONTS.MEDIUM,
        fontSize: 16,
    }
});

export default MediaModal;
