import { Scene } from 'phaser';
import { Treasure } from '../lib/types';
import { FONT_NAME } from '../config';

const FONT_COLOUR = 'white';
const X_POS = 200;

export default class Score extends Scene {
    treasures: Treasure[];
    alive: boolean;
    gotHeart: boolean;

    constructor() {
        super({
            key: 'ScoreScene'
        });
    }

    init(data: ScoreParams): void {
        window['scene'] = this;
        this.treasures = data.treasures;
        this.alive = data.alive;
        this.gotHeart = Boolean(this.treasures.find(treasure => treasure.heart));
    }

    create(): void {
        let loot = 0;
        let diamondValue = 0;

        this.treasures.forEach(treasure => {
            if (!treasure.heart) {
                loot += treasure.value;
            } else {
                diamondValue = treasure.value;
            }
        });

        const totalScore = loot + diamondValue;

        // bg
        const bg = this.add.image(0, 0, 'end_bg');
        bg.setOrigin(0, 0);

        if (loot > 0) {
            this.add.image(878, 588, 'coins');
        }

        if (this.gotHeart) {
            this.add.image(600, 486, 'diamond');
        }

        this.add.image(715, 377, this.alive ? 'alive' : 'dead');
        this.add.image(260, 80, this.alive ? 'escaped' : 'death');

        const labelFontSize = '30px';
        const labelX = X_POS + 100;
        const valueX = X_POS + 120;
        const labelYStart = 250;
        const labelYyGap = 65;

        // labels

        let text = this.add.text(labelX, labelYStart, 'Loot Value:', {
            fontFamily: FONT_NAME,
            fontSize: labelFontSize,
            color: FONT_COLOUR,
            align: 'right'
        });
        text.setOrigin(1, 0.5);

        text = this.add.text(labelX, labelYStart + labelYyGap, 'Heart of the Minotaur:', {
            fontFamily: FONT_NAME,
            fontSize: labelFontSize,
            color: FONT_COLOUR,
            align: 'right'
        });
        text.setOrigin(1, 0.5);

        // values

        text = this.add.text(valueX, labelYStart, loot.toString(), {
            fontFamily: FONT_NAME,
            fontSize: labelFontSize,
            color: FONT_COLOUR,
            align: 'left'
        });
        text.setOrigin(0, 0.5);

        text = this.add.text(valueX, labelYStart + labelYyGap, this.gotHeart ? 'Claimed!' : 'Unclaimed', {
            fontFamily: FONT_NAME,
            fontSize: labelFontSize,
            color: FONT_COLOUR,
            align: 'left'
        });
        text.setOrigin(0, 0.5);

        // total score

        this.add.text(X_POS, 500, totalScore.toString(), {
            fontFamily: FONT_NAME,
            fontSize: '72px',
            color: FONT_COLOUR,
            align: 'center'
        });

        // play again btn

        const graphics = this.add.graphics();

        graphics.setInteractive(new Phaser.Geom.Rectangle(84, 606, 360, 75), Phaser.Geom.Rectangle.Contains);
        graphics.on(Phaser.Input.Events.POINTER_DOWN, () => {
            document.location.reload();
        });

        const music = this.sound.add('menu');
        music.play({
            volume: 1
        });
    }
}

export interface ScoreParams {
    treasures: Treasure[];
    alive: boolean;
}