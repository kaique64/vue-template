import {FileStore} from "@/common/store/file/FileStore";

export const FileService = () => {
    const fileStore = FileStore();

    const toBase64 = (file: any) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    return {toBase64};

};