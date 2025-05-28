import { _decorator, Component, Layout, UITransform } from 'cc';
import { Level } from './StaticData';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    private readonly PADDING: number = 50;
    private readonly SPACING: number = 40;

    @property(Layout)
    grid: Layout = null; // Reference to the grid layout component

    private width: number = 0; // Width of the grid
    private height: number = 0; // Height of the grid    

    //#region Public methods

    public initView(level: Level) {
        this.width = this.node.getComponent(UITransform).width;
        this.height = this.node.getComponent(UITransform).height;
        this.calculateGridSize(level.row, level.column);
    }

    //#endregion

    //#region Lifecycle methods

    start() {

    }

    update(deltaTime: number) {

    }

    //#endregion

    //#region Prrivate methods

    private calculateGridSize(row: number, col: number) {
        let sizeByWidth = (this.width - this.PADDING * 2 - (col - 1) * this.SPACING) / col;
        let sizeByHeight = (this.height - this.PADDING * 2 - (row - 1) * this.SPACING) / row;
        let chooseWidth: boolean = sizeByWidth <= sizeByHeight;
        let size = chooseWidth ? sizeByWidth : sizeByHeight;
        let changeSpacing: boolean = size / 10 < this.SPACING;
        let newSpacing = this.SPACING;

        if (changeSpacing)
            newSpacing = (size / 100 + 1) * 10;

        this.grid.spacingX = newSpacing;
        this.grid.spacingY = newSpacing;
        let count = chooseWidth ? row : col;
        let length = chooseWidth ? this.height : this.width;
        let newPadding = (length - count * size - (count - 1) * newSpacing) / 2;

        if (chooseWidth) {
            this.grid.paddingTop = newPadding;
            this.grid.paddingBottom = newPadding;
        }
        else {
            this.grid.paddingLeft = newPadding;
            this.grid.paddingRight = newPadding;
        }
    }
    //#endregion
}

