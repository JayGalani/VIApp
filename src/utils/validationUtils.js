

const getFileExtension = (file) => {
    const name = file.fileName || file.uri || '';
    return name.split('?')[0].split('.').pop()?.toLowerCase();
};


export const validatePhoto = (photo) => {
    if (!photo) return { isValid: false, error: "Invalid file" };

    const allowedExts = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/heic', 'image/heif',
        'image/webp', 'image/jpg'
    ];

    const ext = getFileExtension(photo);
    const mime = photo.type?.toLowerCase();

    if (mime && allowedMimes.includes(mime)) {
        return { isValid: true };
    }

    if (mime && mime.startsWith('image/')) {
        return { isValid: true };
    }

    if (ext && allowedExts.includes(ext.toLowerCase())) {
        return { isValid: true };
    }

    return { isValid: false, error: "Unsupported image format or invalid file" };
};


export const validateVideo = (video) => {
    if (!video) return { isValid: false, error: "Invalid video" };

    const allowedExts = [
        'mp4', 'mov', 'mkv', 'avi', 'webm', 'hevc', 'm4v', 'h264', 'h265'
    ];

    const mime = video.type?.toLowerCase();
    const ext = getFileExtension(video);

    if (mime && mime.startsWith('video/')) {
        return { isValid: true };
    }

    if (ext && allowedExts.includes(ext.toLowerCase())) {
        return { isValid: true };
    }

    return { isValid: false, error: "Unsupported video format" };
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
