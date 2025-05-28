import { _decorator, Component, Node } from 'cc';
// import { GameConfig } from './GameConfig';
const { ccclass } = _decorator;

@ccclass('StaticData')
export class StaticData {
    public static CurrentTopic: number = 0; // 0: Foods, 1: Animals, 2: Numbers
    public static CurrentLevel: number = 0;
    public static GameConfig: GameConfig = null;
}

export class GameConfig {
    public levels: Level[] = null; // Array of levels, each level has row, column and total cards
}

export class Level {
    row: number;
    column: number;
    total: number;
}
