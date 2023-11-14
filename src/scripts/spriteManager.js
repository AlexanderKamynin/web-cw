import smartcrop from "smartcrop";
import { IMG_PATH, DIRECTIONS } from "./const";


export class SpriteManager
{
    constructor()
    {
        this.spritesSrc = {
            heal: IMG_PATH + "img/heal.png",
            player: IMG_PATH + "img/player.png"
        }

        this.sprites = {};
        this.loadAllSprites();
    }

    loadAllSprites()
    {
        this.sprites['heal'] = new Image();
        this.sprites['heal'].src = this.spritesSrc['heal'];
        this.sprites['heal'].onload = function() {
            console.log('Heal sprite загружен');
        }

        this.sprites['player'] = new Image();
        this.sprites['player'].src = this.spritesSrc['player'];
        this.sprites['player'].onload = function() {
            console.log('Player sprite загружен');
        }
    }

    getSprite(spriteName)
    {
        if(spriteName in this.sprites)
        {
            //this.sprites[spriteName].src = this.spritesSrc[spriteName];
            return this.sprites[spriteName];
        }
        else {
            throw `Cannot find sprite with name ${spriteName}`;
        }
    }

    defineDirectionInSprite(direction)
    {
        for(let idx = 0; idx < Object.values(DIRECTIONS).length; idx++)
        {
            if(Object.values(DIRECTIONS)[idx] === String(direction))
            {
                return {
                    row: Math.floor(idx / 3), 
                    column: idx % 3
                }
            }
        }
        
    };
}