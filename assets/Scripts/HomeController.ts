import { _decorator, Button, Component, director, JsonAsset, Label, Node, Sprite, sys } from 'cc';
import { GameConfig, StaticData } from './StaticData';
import { Constant } from './Constant';
import AudioManager from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('HomeController')
export class HomeController extends Component {
    @property([Button])
    levels: Button[] = [];
    @property(JsonAsset)
    config: JsonAsset = null;
    @property(Label)
    title: Label = null;

    private numbers: Node[] = [];
    private locks: Node[] = [];

    //#region Public methods

    public onLevelClick(event: Event, data: string) {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            let id = Number(data);
            StaticData.CurrentLevel = id;
            director.loadScene("Game");
        }, 0.2);
    }

    public onTopicClick(event: Event, data: string) {
        AudioManager.instance.playClickButton();
        this.loadLevel(Number(data));
    }

    //#endregion

    //#region Life cycle callbacks

    start() {
        StaticData.GameConfig = this.config.json as GameConfig;
        StaticData.CurrentLevel = 0;
        StaticData.CurrentTopic = 0;
        this.initLevel();
        this.loadLevel(0);
    }

    //#endregion

    //#region Private methods

    private initLevel() {
        for (let i = 0; i < this.levels.length; i++) {
            let lable = this.levels[i].getComponentInChildren(Label);
            lable.string = (i + 1).toString();
            this.numbers.push(lable.node);
            let spr = this.levels[i].getComponentInChildren(Sprite);
            this.locks.push(spr.node);
        }
    }

    private loadLevel(id: number) {
        StaticData.CurrentTopic = id;
        let sysValue: string = "";
        let topic: string = "";

        if (id == 0) {
            sysValue = Constant.LEVEL_FOOD;
            topic = "Food";
        }
        else if (id == 1) {
            sysValue = Constant.LEVEL_ANIMAL;
            topic = "Animal";
        }
        else {
            sysValue = Constant.LEVEL_NUMBER;
            topic = "Number";
        }

        this.title.string = topic;
        let savedLevel = Number(sys.localStorage.getItem(sysValue)) | 0;

        for (let i = 0; i < this.levels.length; i++) {
            let finished = i <= savedLevel;
            this.locks[i].active = !finished;
            this.numbers[i].active = finished;
            this.levels[i].interactable = finished;
        }
    }

    //#endregion
}

