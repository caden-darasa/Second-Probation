import { _decorator, Button, Component, director, JsonAsset, Node, Sprite, SpriteFrame, TextAsset } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameConfig, StaticData } from './StaticData';
import { PlayerController } from './PlayerController';
import { Card } from './Card';
import AudioManager from './AudioManager';
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
    @property(SpriteFrame)
    audioOn: SpriteFrame = null;
    @property(SpriteFrame)
    audioOff: SpriteFrame = null;
    @property(Sprite)
    audio: Sprite;

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    private score: number = 0;
    private total: number = 0;

    //#region Properties

    private _isPlaying: boolean = false;
    public get IsPlaying() {
        return this._isPlaying;
    }

    //#endregion

    //#region Public methods

    public onCardSelected(card: Card) {
        this.controller.handleCardSelected(card);
    }

    public onCorrectCard() {
        // show effect or score
        if (this.score >= this.total) {
            // end game
            this._isPlaying = false;
        }
    }

    public onAudioClick() {
        AudioManager.instance.playClickButton();
        let enable = AudioManager.instance.getBgmVolume() > 0 ? true : false;
        enable = !enable;
        AudioManager.instance.setBgmVolume(enable ? 1 : 0);
        AudioManager.instance.setSfxVolume(enable ? 1 : 0);
        this.audio.spriteFrame = enable ? this.audioOn : this.audioOff;
    }

    public onBackClick() {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            director.loadScene("Home");
        }, 0.2);
    }

    //#endregion

    //#region Lifecycle methods

    onLoad() {
        GameManager._instance = this;
        StaticData.GameConfig = this.config.json as GameConfig;
        let level = StaticData.GameConfig.levels[StaticData.CurrentLevel];
        let sprites = this.model.getTopic(StaticData.CurrentTopic);
        let decks = this.model.shuffle(level);
        this.view.initView(level, decks, sprites);
        this.total = level.row * level.column / 2;

        // Audio
        let enable = AudioManager.instance.getBgmVolume() > 0 ? true : false;
        this.audio.spriteFrame = enable ? this.audioOn : this.audioOff;
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

