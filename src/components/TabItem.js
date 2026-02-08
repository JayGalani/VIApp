import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';

const TabItem = ({ onPress, Icon, label }) => {
    return (
        <TouchableOpacity 
            style={styles.tabItem} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Icon color={COLORS.GRAY} size={24} />
            <Text style={styles.tabLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        ...FONTS.MEDIUM,
        fontSize: SIZES.caption,
        marginTop: 4,
        color: COLORS.GRAY,
    },
});

export default TabItem;
