import { Platform, PermissionsAndroid } from 'react-native';
import { STRINGS } from '../common/strings';

export const requestMediaPermissions = async (sourceType, mediaType) => {
    if (Platform.OS !== 'android') return true;

    try {
        if (sourceType === 'camera') {
            const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];
            if (mediaType === 'video') {
                permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            }

            if (permissions.length === 1) {
                const granted = await PermissionsAndroid.request(
                    permissions[0],
                    {
                        title: STRINGS.PERMISSIONS.CAMERA_TITLE,
                        message: STRINGS.PERMISSIONS.CAMERA_MSG,
                        buttonNeutral: STRINGS.COMMON.ASK_ME_LATER,
                        buttonNegative: STRINGS.COMMON.CANCEL,
                        buttonPositive: STRINGS.COMMON.OK,
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                return Object.values(granted).every(
                    (result) => result === PermissionsAndroid.RESULTS.GRANTED
                );
            }
        } else {
            if (Platform.Version >= 33) {
                const permission = mediaType === 'video'
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
                    : PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;

                const title = mediaType === 'video' ? STRINGS.PERMISSIONS.VIDEO_TITLE : STRINGS.PERMISSIONS.PHOTO_TITLE;
                const msg = mediaType === 'video' ? STRINGS.PERMISSIONS.VIDEO_MSG : STRINGS.PERMISSIONS.PHOTO_MSG;

                const granted = await PermissionsAndroid.request(permission, {
                    title: title,
                    message: msg,
                    buttonNeutral: STRINGS.COMMON.ASK_ME_LATER,
                    buttonNegative: STRINGS.COMMON.CANCEL,
                    buttonPositive: STRINGS.COMMON.OK,
                });
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: STRINGS.PERMISSIONS.STORAGE_TITLE,
                        message: STRINGS.PERMISSIONS.STORAGE_MSG,
                        buttonNeutral: STRINGS.COMMON.ASK_ME_LATER,
                        buttonNegative: STRINGS.COMMON.CANCEL,
                        buttonPositive: STRINGS.COMMON.OK,
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
    } catch (err) {
        return false;
    }
};
