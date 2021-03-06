export class PlatformService {
    private _isMobile: boolean;
    private _isDesktop: boolean;
    private _isWeb: boolean;
    private _iOS: boolean;
    private _isAndroid: boolean;

    public get isMobile(): boolean {
        return this._isMobile;
    }

    public get isDesktop(): boolean {
        return this._isDesktop;
    }

    public get isWeb(): boolean {
        return this._isWeb;
    }

    public get isIOS(): boolean {
        return this._iOS;
    }

    public get isAndroid(): boolean {
        return this._isAndroid;
    }

    public static get isMobile(): boolean {
        return !!window.cordova;
    }

    constructor() {
        this.guessPlatform();
    }

    private guessPlatform(): void {
        this._isMobile = !!window.cordova;
        this._isDesktop = !!window.navigator.userAgent.match(/Electron/);
        this._isWeb = !(this._isMobile || this._isDesktop);

        this._iOS = window.device && !!window.device.platform.match(/ios/gi);
        this._isAndroid = window.device && !!window.device.platform.match(/android/gi);
    }
}
