import { HIT_IMG_SIZE, IMG_PATH } from "./const";
import { SpriteManager } from "./spriteManager";

//
export class MapManager 
{
    constructor(spriteManager) 
    {
        this.mapJsonData = null;
        this.spriteManager = spriteManager;

        this.mapData = null;
        this.tileLayers = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tileSize = {x: 0, y: 0};
        this.mapSize = {x: 0, y: 0};
        this.tilesets = new Array();

        this.jsonLoaded = false;

        this.backgrounds = {
            1: new Image(),
            2: new Image()
        }
        this.backgrounds[1].src = IMG_PATH + 'img/level1.png';
        this.backgrounds[2].src = IMG_PATH + 'img/level2.png';
    }

    async init(levelJsonPath)
    {
        let response = await fetch(levelJsonPath);
        this.mapJsonData = await response.json();
        this.parseMap(this.mapJsonData);

        //checks that all ok
        //console.log(this.mapJsonData);
        //console.log(this.mapData, this.jsonLoaded);
    }


    getTileSize(){
        return this.tileSize;
    }

    getMapSize(){
        return this.mapSize;
    }

    parseGameObjects(tilesParsedJSON = null)
    {
        let gameObjects = [];

        for(let idx = 0; idx < this.tileLayers.length; idx++)
        {
            if(this.tileLayers[idx].name === 'objects')
            {
                for(let subLayerIdx = 0; subLayerIdx < this.tileLayers[idx].layers.length; subLayerIdx++)
                {
                    for(let pixel_number = 0; pixel_number < this.tileLayers[idx].layers[subLayerIdx].data.length; pixel_number++)
                    {
                        let tileIdx = this.tileLayers[idx].layers[subLayerIdx].data[pixel_number];
                        if(tileIdx !== 0)
                        {
                            let objX = (pixel_number % this.xCount) * this.tileSize.x;
                            let objY = Math.floor(pixel_number / this.xCount) * this.tileSize.y;

                            let gameObj = {
                                name: this.tileLayers[idx].layers[subLayerIdx].name,
                                x: objX,
                                y: objY,
                                tileIdx: tileIdx
                            }

                            gameObjects.push(gameObj);
                        }
                    }
                }
            }
        }

        return gameObjects;
    }

    parseMap(tilesParsedJSON)
    {
        // достаем общие сведения об карте из Object
        this.mapData = tilesParsedJSON;
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height; 
        this.tileSize.x = this.mapData.tilewidth; 
        this.tileSize.y = this.mapData.tileheight; 
        this.mapSize.x = this.xCount * this.tileSize.x;
        this.mapSize.y = this.yCount * this.tileSize.y;

        // получаем информацию об каждом слое
        this.tileLayers = this.mapData.layers;

        // получаем тайлсеты
        for (let i = 0; i < this.mapData.tilesets.length; i++) 
        {
            let img = new Image();
            img.src = IMG_PATH + this.mapData.tilesets[i].image; // задание пути к изображению
            
            let t = this.mapData.tilesets[i]; //забираем tileset из карты

            let ts = { // создаем свой объект tileset
                firstgid: t.firstgid, // с него начинается нумерация в data
                image: img,
                name: t.name, // имя элемента рисунка
                xCount: Math.floor(t.imagewidth / this.tileSize.x), // горизонталь
                yCount: Math.floor(t.imageheight / this.tileSize.y) // вертикаль
            };

            this.tilesets.push(ts); // сохраняем tileset в массив
        }

        this.jsonLoaded = true; // когда разобран весь json
    }

    drawFloor(context)
    {
        if(!this.jsonLoaded)
        {
            setTimeout(function() {this.drawFloor(context);}, 100);
        }
        else 
        {
            // проходимся по всем слоям
            for(let idx = 0; idx < this.tileLayers.length; idx++)
            {
                if(this.tileLayers[idx].name === 'floor') // отрисуем первый слой floor, а также слой interior
                {
                    for(let pixel_number = 0; pixel_number < this.tileLayers[idx].data.length; pixel_number++)
                    {
                        if(this.tileLayers[idx].data[pixel_number] !== 0) // если хоть что-то записано
                        {
                            let tile = this.getTile(this.tileLayers[idx].data[pixel_number]);

                            let currentX = (pixel_number % this.xCount) * this.tileSize.x;
                            let currentY = Math.floor(pixel_number / this.xCount) * this.tileSize.y;
                            
                            let tsx = this.tileSize.x;
                            let tsy = this.tileSize.y;
                            tile.img.addEventListener("load", function() {
                                context.drawImage(tile.img, tile.x, tile.y, tsx, tsy,
                                    currentX, currentY, tsx, tsy);
                            });
                        }
                    }
                }
            }

        }
    }

    drawInterior(context)
    {
        if(!this.jsonLoaded)
        {
            setTimeout(function() {this.drawInterior(context);}, 100);
        }
        else
        {
            for(let idx = 0; idx < this.tileLayers.length; idx++)
            {
                if(this.tileLayers[idx].name === 'objects')
                {
                    for(let subLayerIdx = 0; subLayerIdx < this.tileLayers[idx].layers.length; subLayerIdx++)
                    {
                        if(this.tileLayers[idx].layers[subLayerIdx].name === 'interior')
                        {
                            for(let pixel_number = 0; pixel_number < this.tileLayers[idx].layers[subLayerIdx].data.length; pixel_number++)
                            {
                                let tileIdx = this.tileLayers[idx].layers[subLayerIdx].data[pixel_number];
                                if(tileIdx !== 0)
                                {
                                    let tile = this.getTile(tileIdx);

                                    let currentX = (pixel_number % this.xCount) * this.tileSize.x;
                                    let currentY = Math.floor(pixel_number / this.xCount) * this.tileSize.y;
                                    
                                    let tsx = this.tileSize.x;
                                    let tsy = this.tileSize.y;
                                    tile.img.addEventListener("load", function() {
                                        context.drawImage(tile.img, tile.x, tile.y, tsx, tsy,
                                            currentX, currentY, tsx, tsy);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    drawObjects(gameObjects, context)
    {
        if(!this.jsonLoaded)
        {
            setTimeout(this.drawObjects(context), 100);
        }
        else 
        {
            if(gameObjects.heal)
            {
                gameObjects.heal.forEach((healObj) => {
                    let sprite = this.spriteManager.getSprite('heal');
                    let tsx = this.tileSize.x;
                    let tsy = this.tileSize.y;

                    // sprite.addEventListener("load", function() {
                    //     context.drawImage(sprite, healObj.x, healObj.y, tsx, tsy);
                    // });
                    context.drawImage(sprite, healObj.x, healObj.y, tsx, tsy);
                })
            }
            if(gameObjects.score)
            {
                gameObjects.score.forEach((scoreObj) => {
                    let sprite = this.spriteManager.getSprite('score');
                    let tsx = this.tileSize.x;
                    let tsy = this.tileSize.y;

                    context.drawImage(sprite, scoreObj.x, scoreObj.y, tsx, tsy);
                })
            }
        }
    }

    drawPlayer(player, context)
    {
        if(player)
        {
            let sprite = this.spriteManager.getSprite('player');
            let tsx = this.tileSize.x;
            let tsy = this.tileSize.y;

            let spritePos = this.spriteManager.defineDirectionInSprite(player.getDirection());
            let playerPos = player.getPosition();

            // sprite.addEventListener("load", function() {
            //     context.drawImage(sprite, spritePos.column * tsx, spritePos.row * tsx, tsx, tsy,
            //         playerPos.x, playerPos.y, tsx, tsy);
            // })
            context.drawImage(sprite, spritePos.column * tsx, spritePos.row * tsx, tsx, tsy,
                playerPos.x, playerPos.y, tsx, tsy);
        }
    }

    drawPlayerDefeat(columnInSprite, player, context)
    {
            let sprite = this.spriteManager.getSprite('playerDefeat');
            let tsx = this.tileSize.x;
            let tsy = this.tileSize.y;

            let playerPos = player.getPosition();

            context.drawImage(sprite, columnInSprite * tsx, 0, tsx, tsy,
                playerPos.x, playerPos.y, tsx, tsy);
    }

    drawFinish(finish, context)
    {
        let sprite = this.spriteManager.getSprite('finish');
        let tsx = this.tileSize.x;
        let tsy = this.tileSize.y;

        let finishPos = finish.getPosition();

        context.drawImage(sprite, finishPos.x, finishPos.y, tsx, tsy);
    }

    drawPlayerHit(player, context)
    {
        let sprite = this.spriteManager.getSprite('playerHit');
        let tsx = this.tileSize.x;
        let tsy = this.tileSize.y;

        let PlayerPos = player.getPosition();

        context.drawImage(sprite, PlayerPos.x + tsx / 2, PlayerPos.y + tsy / 2, HIT_IMG_SIZE.x, HIT_IMG_SIZE.y);
    }

    drawEnemies(enemies, context)
    {
        if(enemies)
        {
            let sprite = this.spriteManager.getSprite('enemy');
            let tsx = this.tileSize.x;
            let tsy = this.tileSize.y;
            for(let idx = 0; idx < enemies.length; idx++)
            {
                const enemy = enemies[idx];
                let spritePos = this.spriteManager.defineDirectionInSprite(enemy.getDirection());
                let enemyPos = enemy.getPosition();

                context.drawImage(sprite, spritePos.column * tsx, spritePos.row * tsx, tsx, tsy,
                    enemyPos.x, enemyPos.y, tsx, tsy);
            }
        }
    }

    getTile(tileIdx)
    {
        let tile = {
            img: null,
            x: 0,
            y: 0
        }

        let tileset = this.getTileset(tileIdx);
        tile.img = tileset.image;

        let id = tileIdx - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);

        tile.x = x * this.tileSize.x;
        tile.y = y * this.tileSize.y;

        return tile;
    }

    getTileset(tileIdx)
    {
        for(let idx = this.tilesets.length - 1; idx >= 0; idx--)
        {
            if(this.tilesets[idx].firstgid <= tileIdx)
            {
                return this.tilesets[idx];
            }
        }
        return null;
    }
}