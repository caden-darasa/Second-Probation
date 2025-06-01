import { _decorator, Component, instantiate, Layout, Prefab, Size, SpriteFrame, UITransform } from 'cc';
import { Level } from './StaticData';
import { Card } from './Card';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    private readonly PADDING: number = 50;
    private readonly SPACING: number = 40;

    @property(Layout)
    grid: Layout = null; // Reference to the grid layout component
    @property(Prefab)
    cardPref: Prefab = null;

    private width: number = 0; // Width of the grid
    private height: number = 0; // Height of the grid    
    private cardSpawns: Card[] = [];

    //#region Public methods

    public initView(level: Level, decks: number[], sprites: SpriteFrame[]) {
        this.width = this.grid.getComponent(UITransform).contentSize.width;
        this.height = this.grid.getComponent(UITransform).contentSize.height;
        let cellSize = this.calculateGridSize(level.row, level.column);
        this.spawnItem(decks, sprites, cellSize);
    }

    //#endregion

    //#region Prrivate methods

    private calculateGridSize(row: number, col: number): number {
        this.grid.constraintNum = col;
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
        this.grid.cellSize = new Size(size, size);
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

        return size;
    }

    private spawnItem(decks: number[], sprites: SpriteFrame[], cellSize: number) {
        for (let i = 0; i < decks.length; i++) {
            let item = instantiate(this.cardPref);
            this.grid.node.addChild(item);
            let card = item.getComponent(Card);
            this.cardSpawns.push(card);
            card.init(decks[i], sprites[decks[i]], cellSize);
        }
    }

    //#endregion
}

