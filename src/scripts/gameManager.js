import { Player, HealObject } from "./gameObjects";
import { EventManager } from "./eventManager";
import { PhysicsManager } from "./physicsManager";
import { MapManager } from "./mapManager";
import { SpriteManager } from "./spriteManager";
import { IMG_PATH } from "./const";


export class GameManager
{
    constructor()
    {
        //managers
        this.eventManager = new EventManager();
        this.spriteManager = new SpriteManager();
        this.mapManager = new MapManager(this.spriteManager);
        this.background = new Image();
        this.background.src = IMG_PATH + 'img/level1.png';
        this.physicsManager = null;

        //objects
        this.gameObjects = {};
        this.player = null;

        this.level = 1;
        this.isGameOver = false;
        this.isMapInit = false;

        //draw settings
        this.canvas = document.querySelector(".playground_map");
        this.canvas_context = this.canvas.getContext("2d");
    }

    async init()
    {
        await this.mapManager.init();
        this.initGameObjects(this.mapManager.parseGameObjects());

        //check that all okey
        console.log(this.mapManager);
        console.log(this.gameObjects);
        console.log(this.player);

        //manipulation with canvas
        this.canvas.width = this.mapManager.getMapSize().x;
        this.canvas.height = this.mapManager.getMapSize().y;

        //первоначальная отрисовка
        this.render();
        this.isMapInit = true;
    }

    async startGame()
    {
        //for logs
        console.log('start game');

        this.physicsManager = new PhysicsManager(this.mapManager.getMapSize(), this.mapManager.getTileSize(), this.eventManager, this.gameObjects, this.player);
        console.log(this.physicsManager);

        this.isGameOver = false;
        this.gameCycle = setInterval(() => {
            //проверка, что все изображение стирается
            this.render();
        }, 1000/60);
    }

    render()
    {
        //стираем все, что было отрисовано до
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //рисуем в следующей последовательности: floor -> interior -> object and entities
        //this.mapManager.drawFloor(this.canvas_context);
        //this.mapManager.drawInterior(this.canvas_context);

        //отрисовываем background
        this.canvas_context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        this.mapManager.drawObjects(this.gameObjects, this.canvas_context);
        this.mapManager.drawPlayer(this.player, this.canvas_context);
    }

    initGameObjects(gameObjects)
    {
        for(let objIdx = 0; objIdx < gameObjects.length; objIdx++)
        {
            let newObject = gameObjects[objIdx];
            switch(gameObjects[objIdx].name)
            {
                case 'heal':
                    {
                        newObject = new HealObject(gameObjects[objIdx].x, gameObjects[objIdx].y)
                        break;
                    }
                case 'player':
                    {
                        newObject = new Player(gameObjects[objIdx].x, gameObjects[objIdx].y, 100, 10);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }

            if(gameObjects[objIdx].name === 'player')
            {
                this.player = newObject;
                continue;
            }

            if(!(gameObjects[objIdx].name in this.gameObjects))
            {
                this.gameObjects[gameObjects[objIdx].name] = [newObject];
            }
            else {
                this.gameObjects[gameObjects[objIdx].name].push(newObject);
            }
        }
    }
}