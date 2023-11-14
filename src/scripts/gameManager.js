import { Player, HealObject } from "./gameObjects";
import { EventManager } from "./eventManager";
import { PhysicsManager } from "./physicsManager";
import { MapManager } from "./mapManager";
import { SpriteManager } from "./spriteManager";


export class GameManager
{
    constructor()
    {
        //managers
        this.eventManager = new EventManager();
        this.spriteManager = new SpriteManager();
        this.mapManager = new MapManager(this.spriteManager);

        //objects
        this.gameObjects = {};

        this.level = 1;
        this.isGameOver = false;

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

        //manipulation with canvas
        this.canvas.width = this.mapManager.getMapSize().x;
        this.canvas.height = this.mapManager.getMapSize().y;

        //первоначальная отрисовка
        this.render();
    }

    async startGame()
    {
        //for logs
        console.log('start game');

        this.isGameOver = false;
        this.gameCycle = setInterval(() => {
            //проверка, что все изображение стирается
            //this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }, 30);
    }

    render()
    {
        //стираем все, что было отрисовано до
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //рисуем в следующей последовательности: floor -> interior -> object and entities
        this.mapManager.drawFloor(this.canvas_context);
        this.mapManager.drawInterior(this.canvas_context);
        this.mapManager.drawObjects(this.gameObjects, this.canvas_context);
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
                this.gameObjects[gameObjects[objIdx].name] = newObject;
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

    getObjectByXY(x, y)
    {
        for(let objTypeIdx = 0; objTypeIdx < this.gameObjects.length; objTypeIdx++)
        {
            for(let idx = 0; idx < this.gameObjects[objTypeIdx].length; idx++)
            {
                //TODO: start, but didn't done
                //if()
            }
        }
    }

    getObjectByName(objName)
    {
        if(this.gameObjects[objName])
        {
            return this.gameObjects[objName];
        }
        else
        {
            throw `No such gameObject type ${objName}`;
        }
    }
}