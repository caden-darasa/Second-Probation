import { _decorator, Component, director, Node, sys, tween, Vec3 } from 'cc';
import AudioManager from './AudioManager';
import { StaticData } from './StaticData';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('EndGamePopup')
export class EndGamePopup extends Component {
    private readonly MAX_LEVEL: number = 8;

    @property(Node)
    popup: Node = null;

    public onNextClick() {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            if (StaticData.CurrentLevel < this.MAX_LEVEL) {
                StaticData.CurrentLevel++;
                let save: string = "";

                if (StaticData.CurrentTopic == 0)
                    save = Constant.LEVEL_FOOD;
                else if (StaticData.CurrentTopic == 1)
                    save = Constant.LEVEL_ANIMAL;
                else
                    save = Constant.LEVEL_NUMBER;

                let highestLevel = Number(sys.localStorage.getItem(save));
                if (StaticData.CurrentLevel > highestLevel)
                    sys.localStorage.setItem(save, StaticData.CurrentLevel.toString());

                director.loadScene("Game");
            }
            else {
                director.loadScene("Home");
            }
        }, 0.2);
    }

    protected onLoad(): void {
        this.popup.scale = Vec3.ZERO;
        tween(this.popup).to(0.5,
            {
                scale: Vec3.ONE
            }, {
            easing: "backOut"
        }
        ).start();
    }

}

