import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../common/colors';
import { FONTS } from '../common/fonts';

const EmptyState = ({ message, IconComponent }) => {
    return (
        <View style={styles.emptyContainer}>
            {IconComponent && <IconComponent />}
            <Text style={styles.emptyText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        ...FONTS.MEDIUM,
        textAlign: 'center',
        color: COLORS.TEXT_SECONDARY,
        fontSize: 18,
        opacity: 0.6,
        marginTop: 10,
    }
});

export default EmptyState;
