import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react-native';
import { COLORS } from '../common/colors';
import { FONTS, SIZES } from '../common/fonts';
import CustomButton from './CustomButton';

const StatusFeedback = ({
    status,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
    cancelledTitle,
    cancelledMessage,
    onRetry,
    onResume,
    iconSize = 60
}) => {
    if (status === 'success') {
        return (
            <View style={styles.statusMessage}>
                <CheckCircle size={iconSize} color={COLORS.SUCCESS} style={styles.statusIcon} />
                <Text style={styles.statusTitleSuccess}>{successTitle}</Text>
                <Text style={styles.statusDesc} numberOfLines={2}>{successMessage}</Text>
            </View>
        );
    }

    if (status === 'error') {
        return (
            <View style={styles.statusMessage}>
                <AlertCircle size={iconSize} color={COLORS.ERROR} style={styles.statusIcon} />
                <Text style={styles.statusTitleError}>{errorTitle}</Text>
                <Text style={styles.statusDesc} numberOfLines={2}>{errorMessage}</Text>
                {onRetry && (
                    <CustomButton
                        title="Retry"
                        onPress={onRetry}
                        style={styles.actionButton}
                    />
                )}
            </View>
        );
    }

    if (status === 'cancelled') {
        return (
            <View style={styles.statusMessage}>
                <XCircle size={iconSize} color={COLORS.WARNING} style={styles.statusIcon} />
                <Text style={styles.statusTitleWarning}>{cancelledTitle}</Text>
                <Text style={styles.statusDesc} numberOfLines={2}>{cancelledMessage}</Text>
                {onResume && (
                    <CustomButton
                        title="Resume"
                        onPress={onResume}
                        style={styles.actionButton}
                    />
                )}
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
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
});

export default StatusFeedback;
