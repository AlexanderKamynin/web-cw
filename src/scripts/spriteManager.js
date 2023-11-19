import { IMG_PATH, SPRITE_DIRECTIONS } from "./const";


export class SpriteManager
{
    constructor()
    {
        this.spritesSrc = {
            heal: IMG_PATH + "img/heal.png",
            player: IMG_PATH + "img/player.png",
            enemy: IMG_PATH + "img/enemy.png",
            playerDefeat: IMG_PATH + "img/player_defeat.png",
            playerHit: IMG_PATH + "img/player_hit.png",
            score: IMG_PATH + "img/score.png",
            finish: IMG_PATH + "img/finish.png"
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

        this.sprites['enemy'] = new Image();
        this.sprites['enemy'].src = this.spritesSrc['enemy'];
        this.sprites['heal'].onload = function() {
            console.log("Enemy sprite загружен");
        }

        this.sprites['playerDefeat'] = new Image();
        this.sprites['playerDefeat'].src = this.spritesSrc['playerDefeat'];
        this.sprites['playerDefeat'].onload = function() {
            console.log("Player-defeat sprite загружен");
        }

        this.sprites['playerHit'] = new Image();
        this.sprites['playerHit'].src = this.spritesSrc['playerHit'];
        this.sprites['playerHit'].onload = function() {
            console.log("playerHit sprite загружен");
        }

        this.sprites['score'] = new Image();
        this.sprites['score'].src = this.spritesSrc['score'];
        this.sprites['score'].onload = function() {
            console.log("score sprite загружен");
        }

        this.sprites['finish'] = new Image();
        this.sprites['finish'].src = this.spritesSrc['finish'];
        this.sprites['finish'].onload = function() {
            console.log("finish sprite загружен");
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
        for(let idx = 0; idx < Object.values(SPRITE_DIRECTIONS).length; idx++)
        {
            if(Object.values(SPRITE_DIRECTIONS)[idx] === String(direction))
            {
                return {
                    row: Math.floor(idx / 3), 
                    column: idx % 3
                }
            }
        }
        
    };
}