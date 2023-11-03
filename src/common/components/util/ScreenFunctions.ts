import {IScreenParams} from "@/common/type/IScreenParams";

export function getScreenSize(screenSize: string | undefined, screenParams: IScreenParams) {
    if (typeof screenSize === 'undefined') {
        return '35vw';
    }

    return screenParams[screenSize];
}
