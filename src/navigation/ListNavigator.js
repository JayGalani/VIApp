import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Video, Camera, Home } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../common/colors';

import { STRINGS } from '../common/strings';
import { TabItem, MediaListComponent } from '../components';

const ListScreenContainer = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const tabBarPadBottom = Math.max(insets.bottom, 10);
    const tabBarHeight = 60 + tabBarPadBottom;

    const tabBarStyle = [
        styles.tabBar,
        { height: tabBarHeight, paddingBottom: tabBarPadBottom }
    ];

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate(STRINGS.SCREEN_NAMES.DASHBOARD);
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [navigation])
    );

    const handleHomePress = () => navigation.navigate(STRINGS.SCREEN_NAMES.DASHBOARD);
    const handleAddVideoPress = () => navigation.navigate(STRINGS.SCREEN_NAMES.ADD_VIDEO);
    const handleAddPhotoPress = () => navigation.navigate(STRINGS.SCREEN_NAMES.ADD_PHOTO);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <MediaListComponent navigation={navigation} />
            </View>

            <View style={tabBarStyle}>
                <TabItem
                    onPress={handleHomePress}
                    Icon={Home}
                    label={STRINGS.NAV.HOME}
                />

                <View style={styles.divider} />

                <TabItem
                    onPress={handleAddVideoPress}
                    Icon={Video}
                    label={STRINGS.NAV.ADD_VIDEO}
                />

                <View style={styles.divider} />

                <TabItem
                    onPress={handleAddPhotoPress}
                    Icon={Camera}
                    label={STRINGS.NAV.ADD_IMAGE}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    content: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.SURFACE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },

    divider: {
        width: 1,
        height: '40%',
        backgroundColor: COLORS.BORDER,
        marginTop: 10,
    }
});

export default ListScreenContainer;
