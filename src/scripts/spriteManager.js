import smartcrop from "smartcrop";
import { IMG_PATH } from "./const";


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
        this.sprites['heal'].src = this.spritesSrc.heal;
        
        // this.sprites['playerDownOne'] = 
        // this.sprites['playerDownTwo']
        // this.sprites['playerDownThree']

        // this.sprites['playerLeftOne']
        // this.sprites['playerLeftTwo']
        // this.sprites['playerLeftThree']

        // this.sprites['playerRightOne']
        // this.sprites['playerRightTwo']
        // this.sprites['playerRightThree']

        // this.sprites['playerUpOne']
        // this.sprites['playerUpTwo']
        // this.sprites['playerUpThree']
    }

    getSprite(spriteName)
    {
        if(spriteName in this.sprites)
        {
            return this.sprites[spriteName];
        }
        else {
            throw `Cannot find sprite with name ${spriteName}`;
        }
    }
}