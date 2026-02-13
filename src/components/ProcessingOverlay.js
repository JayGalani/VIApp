import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../common/colors';
import { FONTS } from '../common/fonts';
import { STRINGS } from '../common/strings';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProcessingOverlay = ({ isVisible, progress }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const prevProgress = useRef(progress);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (!isVisible) return;

        if (progress === 0 && prevProgress.current > 0) {
            progressAnim.setValue(0);
            prevProgress.current = 0;
        } else {
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 400,
                useNativeDriver: true,
            }).start();
            prevProgress.current = progress;
        }
    }, [progress, isVisible, progressAnim]);

    if (!isVisible) return null;

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.loadingOverlay}>
            <View style={styles.progressContainer}>
                <Svg width={120} height={120} style={styles.svgContainer}>
                    <Circle
                        cx={60}
                        cy={60}
                        r={radius}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={8}
                        fill="none"
                    />
                    <AnimatedCircle
                        cx={60}
                        cy={60}
                        r={radius}
                        stroke={COLORS.PRIMARY}
                        strokeWidth={8}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="60, 60"
                    />
                </Svg>
                <View style={styles.progressInner}>
                    <Text style={styles.percentText}>{Math.round(progress)}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 10, // Match typical container radius if overlaying inside a rounded view
    },
    progressContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    svgContainer: {
        position: 'absolute',
    },
    progressInner: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    percentText: {
        ...FONTS.BOLD,
        fontSize: 26,
        color: COLORS.PRIMARY,
        marginBottom: 0,
    },
    processingText: {
        ...FONTS.REGULAR,
        fontSize: 10,
        color: COLORS.TEXT_SECONDARY,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default ProcessingOverlay;
