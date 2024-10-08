export const customFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    // 토큰 값 출력
    console.log('Token:', token);

    const defaultHeaders = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const modifiedOptions: RequestInit = {
        ...options,
        headers: defaultHeaders,
    };

    // 요청 전 옵션 출력
    console.log('Request Options:', modifiedOptions);

    const response = await fetch(url, modifiedOptions);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);  // 에러 메시지 출력
        throw new Error(errorText || 'Request failed');
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
};
