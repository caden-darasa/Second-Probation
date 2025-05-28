import { _decorator, Component, Node } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { StaticData } from './StaticData';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(GameModel)
    model: GameModel = null;
    @property(GameView)
    view: GameView = null;

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    //#region Lifecycle methods

    onLoad() {
        GameManager._instance = this;
        let level = StaticData.GameConfig.levels[StaticData.CurrentLevel];
        this.view.initView(level);
        this.model.suffle(level);
    }

    start() {
        this.init();
    }

    update(deltaTime: number) {

    }

    //#endregion

    //#region Private methods

    private init() {

    }

    //#endregion
}

