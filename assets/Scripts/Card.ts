import { _decorator, Component, Size, Sprite, SpriteFrame, UITransform } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

enum CardState {
    None,
    Open,
    Opening,
    Close,
    Closing,
    Done
}

@ccclass('Card')
export class Card extends Component {
    private readonly SIZE_CARD = 150;
    private readonly SIZE_ICON = 100;

    @property(Sprite)
    icon: Sprite = null;

    private id: number = 0;
    private nextState: CardState = CardState.Close;
    private curState: CardState = CardState.Close;

    //#region Properties

    public get Id(): number {
        return this.id;
    }

    //#endregion

    //#region Public methods

    public setCard(id: number, img: SpriteFrame, size: number) {
        this.nextState = CardState.Open;
        this.id = id;
        this.icon.spriteFrame = img;
        this.setDinamicTexture(size);
    }

    public onCardClick() {
        GameManager.instance.onCardSelected(this);

        if (this.curState == CardState.None || this.curState == CardState.Close) {
            this.nextState = CardState.Opening;
        }
    }

    public closeCard() {

    }

    //#endregion

    //#region Lifecycle methods

    start() {

    }

    update(deltaTime: number) {
        switch (this.nextState) {
            case CardState.Open:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                break;
            case CardState.Opening:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                this.openCard();
                break;
            case CardState.Close:
                this.curState = this.nextState;
                this.nextState = CardState.None;
                break;
            case CardState.Closing:
                this.curState = this.nextState;
                this.nextState = CardState.None;
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

    private openCard() {

    }

    //#endregion
}

