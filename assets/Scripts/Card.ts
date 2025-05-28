import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

enum CardState {
    None,
    Open,
    Opening,
    Close,
    Closing
}

@ccclass('Card')
export class Card extends Component {
    @property(Sprite)
    img: Sprite = null;
    @property(Number)
    id: number = 0;

    private open: boolean = false;
    private nextState: CardState = CardState.Close;
    private curState: CardState = CardState.Close;

    //#region Public methods

    public initCard(id: number, img: SpriteFrame) {
        this.nextState = CardState.Open;
        this.id = id;
        this.img.spriteFrame = img;
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
}

