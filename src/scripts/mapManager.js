import { IMG_PATH } from "./const";

export class MapManager 
{
    constructor() 
    {
        this.mapData = null;
        this.tileLayers = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tileSize = {x: 0, y: 0};
        this.mapSize = {x: 0, y: 0};
        this.tilesets = new Array();

        this.jsonLoaded = false;
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
}