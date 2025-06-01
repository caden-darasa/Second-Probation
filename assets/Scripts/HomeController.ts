import { _decorator, Button, Component, director, Node, Scene, sys } from 'cc';
import { StaticData } from './StaticData';
import { Constant } from './Constant';
import AudioManager from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('HomeController')
export class HomeController extends Component {
    @property([Button])
    levels: Button[] = [];

    //#region Public methods

    public onLevelClick(event: Event, data: string) {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            let id = Number(data);
            StaticData.CurrentLevel = id;
            director.loadScene("Game");
        }, 0.2);
    }

    //#endregion

    //#region Life cycle callbacks

    start() {
        let savedLevel = Number(sys.localStorage.getItem(Constant.LEVEL_SYS)) | 0;

        if (savedLevel < this.levels.length - 1) {
            for (let i = savedLevel + 1; i < savedLevel; i++) {
                this.levels[i].interactable = false;
            }
        }

        StaticData.CurrentLevel = 0;
    }

    //#endregion
}

