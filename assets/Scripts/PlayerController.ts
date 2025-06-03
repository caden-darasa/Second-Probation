import { _decorator, AudioClip, Component, EventTouch, Node, NodeEventType } from 'cc';
import { Card } from './Card';
import { GameManager } from './GameManager';
import AudioManager from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private readonly DELAY_HANDLE: number = 1.5;

    @property(AudioClip)
    correctAudio: AudioClip = null;
    @property(AudioClip)
    incorrectAudio: AudioClip = null;

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
            let firC = this.firstCard;
            let secC = this.secCard;
            if (this.firstCard.Id == this.secCard.Id) {
                this.delayCorrectCard(firC, secC);

            }
            else {
                this.delayIncorrectCard(firC, secC);

            }

            // reset for next turn
            this.firstCard = null;
            this.secCard = null;
        }
    }

    private delayCorrectCard(fir: Card, sec: Card) {
        GameManager.instance.onCorrectCard();
        this.scheduleOnce(() => {
            AudioManager.instance.playSfx(this.correctAudio);
            fir.correctCard();
            sec.correctCard();
        }, this.DELAY_HANDLE);
    }

    private delayIncorrectCard(fir: Card, sec: Card) {
        this.scheduleOnce(() => {
            AudioManager.instance.playSfx(this.incorrectAudio);
            fir.incorrectCard();
            sec.incorrectCard();
        }, this.DELAY_HANDLE);
    }

    //#endregion
}

