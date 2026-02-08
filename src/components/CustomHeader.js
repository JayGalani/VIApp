import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';

const CustomHeader = ({ title, showBack, onBackPress, style, titleStyle, RightComponent }) => {
    return (
        <View style={[styles.header, style]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                        <ChevronLeft color={COLORS.PRIMARY} size={28} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
            <View style={styles.rightContainer}>
                {RightComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        backgroundColor: COLORS.SURFACE,
    },
    headerTitle: {
        ...FONTS.BOLD,
        fontSize: SIZES.h3,
        color: COLORS.TEXT_PRIMARY,
        textAlign: 'center',
        flex: 1,
    },
    leftContainer: {
        width: 44,
        alignItems: 'flex-start',
    },
    rightContainer: {
        width: 44,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 5,
    },
});

export default CustomHeader;
