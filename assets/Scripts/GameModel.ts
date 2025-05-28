import { _decorator, Component, math, Node, SpriteFrame } from 'cc';
import { Level } from './StaticData';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel {
    @property([SpriteFrame])
    foods: SpriteFrame[] = [];
    @property([SpriteFrame])
    animals: SpriteFrame[] = [];
    @property([SpriteFrame])
    numbers: SpriteFrame[] = [];

    private finalDecks: number[];

    //#region Public methods

    public getTopic(id: number): SpriteFrame[] {
        switch (id) {
            case 0: // Foods
                return this.foods;
            case 1: // Animals
                return this.animals;
            case 2: // Numbers
                return this.numbers;
            default:
                return [];
        }
    }

    public suffle(level: Level) {
        const maxDeck = this.foods.length;
        let totalSquare = level.row * level.column;
        let totalDeck = level.total * 2;
        let ids: number[];
        let curDecks: number[];
        for (let i = 0; i < maxDeck; i++) {
            ids.push(i);
        }

        // Random level.total in ids
        for (let i = 0; i < level.total; i++) {
            let index = this.randomIndex(ids);
            curDecks.push(ids[index]);
            ids = ids.splice(index, 1);
        }
        let duplicate = totalSquare / totalDeck;
        let count = duplicate * 2 - 1;
        for (let i = 0; i < count; i++) {
            this.finalDecks.push(...curDecks);
        }
        let missSquare = totalSquare - this.finalDecks.length;
        this.finalDecks.push(...curDecks, missSquare / 2);
        this.finalDecks.push(...curDecks, missSquare / 2);
        console.log(this.finalDecks);
    }

    //#endregion

    //#region Private methods

    private randomIndex(ids: number[]): number {
        return Math.floor(Math.random() * ids.length);
    }

    //#endregion
}

