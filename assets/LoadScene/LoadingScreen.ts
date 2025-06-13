// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, log, macro, native, sys, view } from 'cc';
const {ccclass, property} = _decorator;

//0 = portrait
//1 = landscape right
//2 = upside down
//3 = landscape right

@ccclass
export default class LoadingScreen {

    //4 all orientation
    //0, 2 portrait
    //1, 3 landscape
    static changeOrientation(value) {
        // let isSupportOrientation = null;
        let isRotate = false;
        if (sys.isNative) {
            if (sys.os === sys.OS.IOS) {            
                // isSupportOrientation = native.reflection.callStaticMethod("ViewController", "isSupportOrientation");

                    try {
                        native.reflection.callStaticMethod("ViewController", "rotateScreen:", value);
                        isRotate = true;
                    } catch (e) {
                        //log("changeOrientation e: " + JSON.stringify(e));
                    }
            } else if (sys.os === sys.OS.ANDROID) {
                if (native) {
                    try {
                        let className = "com/cocos/game/AppActivity";
                        let methodName = "setOrientation";
                        let methodSignature = "(I)V";

                        if (native) {
                            // isSupportOrientation = native.reflection.callStaticMethod(className, "isSupportOrientation", "()Z");
                            native.reflection.callStaticMethod(className, methodName, methodSignature, value);
                            isRotate = true;
                        }
                    } catch (e) {
                        //log("changeOrientation e: " + JSON.stringify(e));
                     }
                }
            }
        }

        // //log("isSupportOrientation: " + isSupportOrientation);
        
        if (isRotate) {
            if (value == 0 || value == 2) {
                view.setOrientation(macro.ORIENTATION_PORTRAIT);
            } else if (value == 1 || value == 3) {
                view.setOrientation(macro.ORIENTATION_LANDSCAPE);
            } else {
                view.setOrientation(macro.ORIENTATION_AUTO);
            }
        }
    }

    // update (dt) {}
}
