import { _decorator, AudioClip, Button, Component, director, instantiate, JsonAsset, Layout, Node, ParticleAsset, ParticleSystem2D, Prefab, random, sp, Sprite, SpriteFrame, sys, TextAsset, v3, Vec3 } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameConfig, StaticData } from './StaticData';
import { PlayerController } from './PlayerController';
import { Card } from './Card';
import AudioManager from './AudioManager';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(GameModel)
    model: GameModel = null;
    @property(GameView)
    view: GameView = null;
    @property(PlayerController)
    controller: PlayerController = null;
    @property(SpriteFrame)
    audioOn: SpriteFrame = null;
    @property(SpriteFrame)
    audioOff: SpriteFrame = null;
    @property(Sprite)
    audio: Sprite;
    @property(Node)
    popupEndGame: Node = null;
    @property(Sprite)
    bg: Sprite = null;
    @property(Prefab)
    firework: Prefab = null;
    @property(AudioClip)
    bump: AudioClip = null;

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
        this.score++;

        if (this.score >= this.total) {
            // end game
            this._isPlaying = false;

            this.scheduleOnce(() => {
                this.playFireWork();
            }, 3);

            this.scheduleOnce(() => {
                this.popupEndGame.active = true;
            }, 6);
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
        let level = StaticData.GameConfig.levels[StaticData.CurrentLevel];
        let sprites = this.model.getTopic(StaticData.CurrentTopic);
        let decks = this.model.shuffle(level);
        this.view.initView(level, decks, sprites);
        this.total = level.row * level.column / 2;

        // Audio
        let enable = AudioManager.instance.getBgmVolume() > 0 ? true : false;
        this.audio.spriteFrame = enable ? this.audioOn : this.audioOff;
    }

    //#endregion

    //#region Private methods

    private playFireWork() {
        let counter = 0;
        this.schedule(() => {
            if (counter % 3 == 0)
                AudioManager.instance.playSfx(this.bump);
            counter++;
            let spawn = instantiate(this.firework);
            this.bg.node.addChild(spawn);
            let ranX = Math.random() * 760 - 380;
            let ranY = Math.random() * 1200 - 600 - 200;
            spawn.setPosition(new Vec3(ranX, ranY, 0));
            this.scheduleOnce(() => {
                spawn.getComponent(ParticleSystem2D).stopSystem();
            }, 0.5);
        }, 0.1, 20, 0);
    }

    //#endregion
}

