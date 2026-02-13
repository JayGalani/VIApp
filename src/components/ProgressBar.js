import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';

const ProgressBar = ({ progress, label, height = 14, color = COLORS.PRIMARY, showPercentage = true }) => {
    return (
        <View style={styles.container}>
            {showPercentage && (
                <View style={styles.textContainer}>
                    <Text style={[styles.percentText, { color }]}>{Math.round(progress)}%</Text>
                    {label && <Text style={styles.label}>{label}</Text>}
                </View>
            )}
            <View style={[styles.barContainer, { height }]}>
                <View style={[
                    styles.barFill,
                    {
                        width: `${progress}%`,
                        backgroundColor: color
                    }
                ]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    percentText: {
        ...FONTS.BOLD,
        fontSize: 60,
    },
    label: {
        ...FONTS.MEDIUM,
        fontSize: SIZES.body1,
        color: COLORS.TEXT_SECONDARY,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    barContainer: {
        width: '100%',
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
});

export default ProgressBar;
