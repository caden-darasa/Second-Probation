import { _decorator, SpriteFrame } from 'cc';
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

    public suffle(level: Level): number[] {
        let finalDecks: number[] = [];
        const maxDeck = this.foods.length;
        let totalSquare = level.row * level.column;
        let totalDeck = level.total * 2;
        let ids: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let curDecks: number[] = [];

        // Random decks
        for (let i = 0; i < level.total; i++) {
            let index = this.randomIndex(ids);
            curDecks.push(ids[index]);
            curDecks.push(ids[index]);
            ids.splice(index, 1);
        }
        let duplicate = totalSquare / totalDeck - 1;
        for (let i = 0; i < duplicate; i++) {
            finalDecks.push(...curDecks);
        }
        let missSquare = totalSquare - finalDecks.length;
        if (missSquare > 0) {
            finalDecks.push(...curDecks.slice(0, missSquare));
        }

        // Suffle
        const length = finalDecks.length;
        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalDecks[i], finalDecks[j]] = [finalDecks[j], finalDecks[i]];
        }

        return finalDecks;
    }

    //#endregion

    //#region Private methods

    private randomIndex(ids: number[]): number {
        return Math.floor(Math.random() * ids.length);
    }

    //#endregion
}

