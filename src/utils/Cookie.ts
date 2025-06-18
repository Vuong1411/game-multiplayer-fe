/**
 * Khởi tạo và quản lý cookie trong trình duyệt
 * @param name Tên của cookie
 * @param value Giá trị của cookie
 * @param days Số ngày cookie tồn tại (mặc định: 1 ngày)
 */
export const setCookie = (name: string, value: string, days: number = 1): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const secure = window.location.protocol === 'https:';
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure ? ';Secure' : ''}`;
    
    document.cookie = cookieString;
};

/**
 * Lấy giá trị cookie theo tên
 * @param name Tên cookie cần lấy
 * @returns Giá trị cookie hoặc null nếu không tìm thấy
 */
export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
};

/**
 * Xóa cookie theo tên
 * @param name Tên cookie cần xóa
 */
export const deleteCookie = (name: string): void => {
    const secure = window.location.protocol === 'https:';
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict${secure ? ';Secure' : ''}`;
};

/**
 * Kiểm tra cookie có tồn tại hay không
 * @param name Tên cookie cần kiểm tra
 * @returns true nếu cookie tồn tại, false nếu không
 */
export const checkCookie = (name: string): boolean => {
    return getCookie(name) !== null;
};