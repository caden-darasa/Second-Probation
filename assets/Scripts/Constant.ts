import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('Constant')
export class Constant {
    public static readonly FLIP_TIME: number = 0.5;
    public static readonly HIDE_TIME: number = 0.5;
    public static readonly LEVEL_SYS: string = "level_sys";
}

