import { IMG_PATH } from "./const";

//
export class MapManager 
{
    constructor(playgroundMapSelector) 
    {
        this.mapData = null;
        this.tileLayers = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tileSize = {x: 0, y: 0};
        this.mapSize = {x: 0, y: 0};
        this.tilesets = new Array();

        this.jsonLoaded = false;

        this.view = {
            x: 0,
            y: 0,
            w: 800,
            h: 600
        };

        this.map_canvas = document.querySelector('.playground_map');
    }

    render()
    {
        this.map_canvas.width = this.mapSize.x;
        this.map_canvas.height = this.mapSize.y;

        this.map_canvas.style.width = `${this.mapSize.x}px`;
        this.map_canvas.style.height = `${this.mapSize.y}px`;

        this.draw(this.map_canvas, this.map_canvas.getContext('2d'));
    }

    parseGameObjects(tilesParsedJSON = null)
    {
        if(!this.jsonLoaded)
        {
            setTimeout(function() {this.parseEntities()}, 100);
        }
        else
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
                                    y: objY
                                }

                                gameObjects.push(gameObj);
                            }
                        }
                    }
                }
            }

            return gameObjects;
        }
    }

    getPosition()
    {

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

    draw(canvas, context)
    {
        if(!this.jsonLoaded)
        {
            setTimeout(function() {this.draw(ctx);}, 100);
        }
        else 
        {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // проходимся по всем слоям
            for(let idx = 0; idx < this.tileLayers.length; idx++)
            {
                if(this.tileLayers[idx].name === 'floor') // отрисуем только первый слой floor
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