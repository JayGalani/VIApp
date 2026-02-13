

const getFileExtension = (file) => {
    const name = file.fileName || file.uri || '';
    return name.split('?')[0].split('.').pop()?.toLowerCase();
};


export const validatePhoto = (photo) => {
    if (!photo) return { isValid: false, error: "Invalid file" };

    const allowedExts = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];
    const allowedMimes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp', 'image/jpg'];

    const ext = getFileExtension(photo);
    const mime = photo.type;

    // Check mime type if available
    if (mime && allowedMimes.includes(mime)) {
        return { isValid: true };
    }

    // Fallback to extension check
    if (allowedExts.includes(ext)) {
        return { isValid: true };
    }

    return { isValid: false, error: "Unsupported image format" };
};



export const validateVideo = (video) => {
    if (!video) return { isValid: false, error: "Invalid video" };

    const allowedExts = [
        'mp4', 'mov', 'mkv', 'avi', 'webm', 'hevc', 'm4v', 'h264', 'h265', 'ts'
    ];

    // Some common video MIME types
    const allowedMimes = [
        'video/mp4',
        'video/quicktime',
        'video/x-matroska',
        'video/webm',
        'video/hevc',
        'video/x-m4v',
        'video/3gpp',
        'video/mp2t'
    ];

    const ext = getFileExtension(video);
    const mime = video.type;

    if (mime && mime.startsWith('video/')) {
        return { isValid: true };
    }

    if (allowedExts.includes(ext)) {
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
