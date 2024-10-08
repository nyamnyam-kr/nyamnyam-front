// src/app/service/user.service.ts
import { User } from "src/app/model/user.model";
import { UserApi } from "src/app/api/user/user.api";

export const checkUserExists = async (id: string): Promise<boolean> => {
    return await UserApi.fetchUserExists(id);
};

export const getUserById = async (id: string): Promise<User> => {
    return await UserApi.fetchUserById(id);
};

export const getAllUsers = async (): Promise<User[]> => {
    return await UserApi.fetchAllUsers();
};

export const getUserCount = async (): Promise<number> => {
    return await UserApi.fetchUserCount();
};

export const removeUserById = async (id: string): Promise<void> => {
    await UserApi.deleteUserById(id);
};

export const modifyUser = async (user: User): Promise<User> => {
    return await UserApi.updateUser(user);
};

export const addUser = async (
    username: string,
    password: string,
    nickname: string,
    name: string,
    age: number | string,
    tel: string,
    gender: string,
    thumbnails: File[]
): Promise<User> => {
    const user: User = {
        id: '',
        username,
        password,
        nickname,
        name,
        age: typeof age === 'string' ? parseInt(age) : age,
        tel,
        gender,
        enabled: true,
        role: 'user',
        imgId: null,
    };

    thumbnails.length > 0 &&
    (await UserApi.uploadThumbnailApi(thumbnails)
        .then(imgIds => {
            user.imgId = imgIds.length > 0 ? imgIds[0].toString() : null;
        })
        .catch(error => {
            console.error('Thumbnail upload failed:', error);
        }));

    return await UserApi.registerUser(user, thumbnails);
};


export const authenticateUser = async (username: string, password: string): Promise<string> => {
    return await UserApi.loginUser(username, password);
};

export const refreshUserToken = async (oldToken: string): Promise<string> => {
    return await UserApi.refreshTokenApi(oldToken);
};

export const logoutUser = async (): Promise<void> => {
    await UserApi.logoutApi();
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
    return await UserApi.checkUsernameExists(username);
};

