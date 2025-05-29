import { _decorator, Component, EventTouch, Node, NodeEventType } from 'cc';
import { Card } from './Card';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private readonly DELAY_HANDLE: number = 0.5;

    private firstCard: Card;
    private secCard: Card;

    //#region Public methods

    public handleCardSelected(card: Card) {
        if (this.firstCard == null)
            this.firstCard = card;
        else
            this.secCard = card;

        this.compareCard();
    }

    //#endregion

    //#region Life cycle callbacks

    start() {

    }

    update(deltaTime: number) {

    }

    //#endregion

    //#region Private methods

    private compareCard() {
        if (this.secCard != null) {
            // compare here
            // GameManager.instance.checkCard(this.firstCard.Id == this.secCard.Id);

            let firC = this.firstCard;
            let secC = this.secCard;
            if (this.firstCard.Id == this.secCard.Id) {
                this.scheduleOnce(() => {
                    this.delayCorrectCard(firC, secC);
                }, this.DELAY_HANDLE);
            }
            else {
                this.scheduleOnce(() => {
                    this.delayIncorrectCard(firC, secC);
                }, 0.5);
            }

            // reset for next turn
            this.firstCard = null;
            this.secCard = null;
        }
    }

    private delayCorrectCard(fir: Card, sec: Card) {

    }

    private delayIncorrectCard(fir: Card, sec: Card) {
        fir.closeCard();
        sec.closeCard();
    }

    //#endregion
}

