import { _decorator, Button, color, Component, Size, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Constant } from './Constant';
import AudioManager from './AudioManager';
const { ccclass, property } = _decorator;

enum CardState {
    None,
    Open,
    Closing,
    Close,
    Done
}

@ccclass('Card')
export class Card extends Component {
    private readonly SIZE_CARD = 150;
    private readonly SIZE_ICON = 100;

    @property(Sprite)
    icon: Sprite = null;
    @property(SpriteFrame)
    openSprite: SpriteFrame = null;
    @property(SpriteFrame)
    closeSprite: SpriteFrame = null;

    private id: number = 0;
    private nextState: CardState = CardState.None;
    private curState: CardState = CardState.None;
    private card: Sprite = null;
    private button: Button = null;

    //#region Properties

    public get Id(): number {
        return this.id;
    }

    //#endregion

    //#region Public methods

    public init(id: number, img: SpriteFrame, size: number) {
        this.card = this.getComponent(Sprite);
        this.id = id;
        this.icon.spriteFrame = img;
        this.setDinamicTexture(size);
        this.card.spriteFrame = this.openSprite;
        this.scheduleOnce(() => {
            this.nextState = CardState.Closing;
        }, 2);
    }

    public onCardClick() {
        if (this.curState == CardState.Close) {
            AudioManager.instance.playClickButton();
            GameManager.instance.onCardSelected(this);
            this.nextState = CardState.Open;
        }
    }

    public incorrectCard() {
        this.nextState = CardState.Closing;
    }

    public correctCard() {
        let curColor = this.card.color.clone();
        tween(curColor).to(Constant.HIDE_TIME,
            {
                a: 0
            },
            {
                onUpdate: () => {
                    this.card.color = curColor;
                },
                onComplete: () => {
                    this.nextState = CardState.Done;
                }
            }
        ).start();
    }

    //#endregion

    //#region Lifecycle methods

    onLoad(): void {
        this.button = this.getComponent(Button);
    }

    update(deltaTime: number) {
        switch (this.nextState) {
            case CardState.Open:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                this.handleOpenCard();
                break;
            case CardState.Close:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                break;
            case CardState.Closing:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                this.handleCardClosing();
                break;
            case CardState.Done:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                this.button.interactable = false;
                break;
        }
    }

    //#endregion

    //#region Private methods

    private setDinamicTexture(size: number) {
        const iconUI = this.icon.getComponent(UITransform);
        let compareSize = iconUI.contentSize.x > iconUI.contentSize.y ? iconUI.contentSize.x : iconUI.contentSize.y;
        let iconFit = compareSize / this.SIZE_ICON;
        iconUI.setContentSize(new Size(iconUI.contentSize.x / iconFit, iconUI.contentSize.y / iconFit));
        let scale = size / this.SIZE_CARD;
        this.icon.node.setScale(scale, scale, scale);
    }

    private handleOpenCard() {
        tween(this.node).to(Constant.FLIP_TIME, {
            scale: new Vec3(1, 1, 1)
        }, {
            onUpdate: () => {
                if (this.node.scale.x >= 0 && !this.icon.node.active) {
                    this.icon.node.active = true;
                    this.card.spriteFrame = this.openSprite;
                }
            }
        }).start();
    }

    private handleCardClosing() {
        tween(this.node).to(Constant.FLIP_TIME, {
            scale: new Vec3(-1, 1, 1)
        }, {
            onUpdate: () => {
                if (this.node.scale.x <= 0 && this.icon.node.active) {
                    this.icon.node.active = false;
                    this.card.spriteFrame = this.closeSprite;
                }
            },
            onComplete: () => {
                this.nextState = CardState.Close;
            }
        },).start();
    }

    //#endregion
}

