import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('Constant')
export class Constant {
    public static readonly FLIP_TIME: number = 0.5;
    public static readonly HIDE_TIME: number = 0.5;
    public static readonly LEVEL_FOOD: string = "level_food";
    public static readonly LEVEL_ANIMAL: string = "level_animal";
    public static readonly LEVEL_NUMBER: string = "level_number";
}

