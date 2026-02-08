import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { FileVideo, Image as ImageIcon, Trash2, PlayCircle } from 'lucide-react-native';
import { COLORS } from '../common/colors';
import { FONTS } from '../common/fonts';
import { STRINGS } from '../common/strings';
import MediaModal from './MediaModal';

const MediaItem = React.memo(({ item, onDelete }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeletePress = () => {
        Alert.alert(
            STRINGS.LIST.DELETE.TITLE,
            STRINGS.LIST.DELETE.MESSAGE,
            [
                {
                    text: STRINGS.COMMON.CANCEL,
                    style: 'cancel',
                },
                {
                    text: STRINGS.LIST.DELETE.CONFIRM,
                    onPress: () => onDelete(item.id),
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <View style={styles.itemContainer}>
            <View style={styles.contentContainer}>
                <TouchableOpacity
                    style={styles.mediaWrapper}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    {item.type === 'photo' ? (
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.thumbnail}
                        />
                    ) : item.type === 'video' && item.thumbnailUri ? (
                        <View style={styles.thumbnailContainer}>
                            <Image
                                source={{ uri: item.thumbnailUri }}
                                style={styles.thumbnail}
                            />
                            <View style={styles.playIconOverlay}>
                                <PlayCircle size={28} color={COLORS.WHITE} fill="rgba(0,0,0,0.1)" />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.placeholderIcon}>
                            {item.type === 'photo' ? (
                                <ImageIcon size={32} color={COLORS.TEXT_SECONDARY} />
                            ) : (
                                <PlayCircle size={32} color={COLORS.TEXT_SECONDARY} />
                            )}
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.itemMeta}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.metadataRow}>
                        <Text style={styles.itemDate}>{item.date}</Text>
                        <View style={styles.dotSeparator} />
                        <Text style={styles.itemSize}>{item.size}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
                <Trash2 size={24} color={COLORS.ERROR} />
            </TouchableOpacity>

            <MediaModal
                visible={modalVisible}
                item={item}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.SURFACE,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
    mediaWrapper: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.LIGHT_GRAY,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
        overflow: 'hidden',
    },
    thumbnailContainer: {
        width: '100%',
        height: '100%',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playIconOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    placeholderIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemMeta: {
        flex: 1,
    },
    itemTitle: {
        ...FONTS.BOLD,
        fontSize: 18,
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 8,
        lineHeight: 24,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemDate: {
        ...FONTS.MEDIUM,
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.GRAY,
        marginHorizontal: 8,
        opacity: 0.5,
    },
    itemSize: {
        ...FONTS.MEDIUM,
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
    },
});

export default MediaItem;
