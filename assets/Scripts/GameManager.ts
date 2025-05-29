import { _decorator, Component, JsonAsset, Node, TextAsset } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameConfig, StaticData } from './StaticData';
import { PlayerController } from './PlayerController';
import { Card } from './Card';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(GameModel)
    model: GameModel = null;
    @property(GameView)
    view: GameView = null;
    @property(PlayerController)
    controller: PlayerController = null;
    @property(JsonAsset)
    config: JsonAsset = null;

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    //#region Public methods

    public onCardSelected(card: Card) {
        this.controller.handleCardSelected(card);
    }

    public checkCard(isCorrect: boolean) {

    }

    //#endregion

    //#region Lifecycle methods

    onLoad() {
        GameManager._instance = this;
        StaticData.GameConfig = this.config.json as GameConfig;
        // let level = StaticData.GameConfig.levels[4];
        let level = StaticData.GameConfig.levels[StaticData.CurrentLevel];
        let sprites = this.model.getTopic(StaticData.CurrentTopic);
        let decks = this.model.suffle(level);
        this.view.initView(level, decks, sprites);
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

