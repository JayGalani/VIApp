import { STRINGS } from '../common/strings';

const PHOTO_MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const VIDEO_MAX_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

export const validatePhoto = (photo) => {
    if (!photo) return { isValid: false, error: STRINGS.COMMON.ERROR };

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'heic', 'heif'];

    const fileExt = photo.uri?.split('.').pop().toLowerCase();
    const isAllowedType = photo.type && allowedTypes.includes(photo.type.toLowerCase());
    const isAllowedExt = allowedExts.includes(fileExt);

    if (!isAllowedType && !isAllowedExt) {
        return { isValid: false, error: STRINGS.ADD_PHOTO.FORMAT_ERROR };
    }

    if (photo.fileSize && photo.fileSize > PHOTO_MAX_SIZE_BYTES) {
        return { isValid: false, error: STRINGS.ADD_PHOTO.SIZE_ERROR };
    }

    return { isValid: true };
};

export const validateVideo = (video) => {
    if (!video) return { isValid: false, error: 'Video data is missing' };
    if (!video.uri) return { isValid: false, error: 'Video URI is missing' };

    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/mpeg', 'video/avi', 'video/webm'];
    const allowedExts = ['mp4', 'mov', 'mkv', 'mpeg', 'mpg', 'avi', 'webm'];

    const fileName = video.fileName || '';
    const fileExt = (fileName || video.uri).split('.').pop().toLowerCase();

    const isAllowedType = video.type && allowedTypes.includes(video.type.toLowerCase());
    const isAllowedExt = allowedExts.includes(fileExt);

    if (!isAllowedType && !isAllowedExt) {
        return { isValid: false, error: STRINGS.ADD_VIDEO.FORMAT_ERROR };
    }

    if (video.fileSize && video.fileSize > VIDEO_MAX_SIZE_BYTES) {
        return { isValid: false, error: STRINGS.ADD_VIDEO.SIZE_ERROR };
    }

    return { isValid: true };
};

export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};
