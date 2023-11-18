import { Player, HealObject, Enemy, ScoreObject } from "./gameObjects";
import { EventManager } from "./eventManager";
import { PhysicsManager } from "./physicsManager";
import { MapManager } from "./mapManager";
import { SpriteManager } from "./spriteManager";
import { AudioManager } from "./audioManager";
import { GameStorage } from "./storage";
import { IMG_PATH } from "./const";


export class GameManager
{
    constructor()
    {
        //managers
        this.eventManager = new EventManager();
        this.spriteManager = new SpriteManager();
        this.audioManager = new AudioManager();
        this.mapManager = new MapManager(this.spriteManager);
        this.background = new Image();
        this.background.src = IMG_PATH + 'img/level1.png';
        this.physicsManager = null; //initialize with game starting

        this.gameStorage = new GameStorage();

        //objects
        this.gameObjects = {};
        this.player = null;
        this.scores = 0;
        this.enemies = [];

        this.level = 1;
        this.isGameOver = false;
        this.isMapInit = false;

        //simple printers for html
        this.healthPrint = (health) => {
            document.querySelector('.health').innerText = `${health}`;
        };
        this.scoresPrint = (scores) => {
            document.querySelector('.scores').innerHTML = `${scores}`;
        };

        //draw settings
        this.canvas = document.querySelector(".playground_map");
        this.canvas_context = this.canvas.getContext("2d");
    }

    async init()
    {
        await this.mapManager.init();
        this.initGameObjects(this.mapManager.parseGameObjects());
        this.healthPrint(this.player.getHealth());

        //check that all okey
        console.log(this.mapManager);
        console.log(this.gameObjects);
        console.log(this.player);
        console.log(this.enemies);

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

        this.physicsManager = new PhysicsManager(this.canvas_context, this.mapManager.getMapSize(), this.mapManager.getTileSize(),
            this.eventManager, this.audioManager,
            this.gameObjects, this.player, this.enemies,
            this.healthPrint, this.scoresPrint);

        console.log(this.physicsManager);

        this.isGameOver = false;
        this.gameCycle = setInterval(() => {
            this.finishGameChecks();
            this.physicsManager.moveEnemies();
            this.render();
        }, 1000/60);
        
        this.audioManager.playBackground();
    }

    finishGameChecks()
    {
        //check that player is live
        if(this.player.health <= 0)
        {
            this.finishGame();
        }
    }

    finishGame()
    {
        this.isGameOver = true;

        //убираем все интервалы
        clearInterval(this.gameCycle);
        clearInterval(this.physicsManager.enemiesAttackCycle);
        clearInterval(this.physicsManager.movementChecker);
        clearInterval(this.physicsManager.playerAttackChecker);
        clearInterval(this.isPlayerAttack);

        //отрисовываем background
        let columnInSprite = 0;
        //отрисуем смэрть игрока
        const defeatAnimation = setInterval(() => {
            this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas_context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
            this.mapManager.drawObjects(this.gameObjects, this.canvas_context);
            this.mapManager.drawEnemies(this.enemies, this.canvas_context);
            this.mapManager.drawPlayerDefeat(columnInSprite, this.player, this.canvas_context);
            columnInSprite++;
            if(columnInSprite > 2){
                clearInterval(defeatAnimation);
            }
        }, 250);

        //останавливаем фоновую музыку, включаем звук конца =(
        this.audioManager.stopBackground();
        this.audioManager.playGameOver();
        console.log('game over');

        //результат загружаем в таблицу
        this.gameStorage.setScore(this.physicsManager.currentScore);
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
        this.mapManager.drawEnemies(this.enemies, this.canvas_context);

        if(this.isMapInit){
            this.isPlayerAttack = setInterval(
                () => {
                    if(this.eventManager.actionKeys[EventManager.keyToNumber("f")].isPressed)
                    {
                        this.mapManager.drawPlayerHit(this.player, this.canvas_context);
                    }
                }, 250
            );
        }
    }

    initGameObjects(gameObjects)
    {
        console.log(gameObjects);
        for(let objIdx = 0; objIdx < gameObjects.length; objIdx++)
        {
            let newObject = gameObjects[objIdx];
            switch(gameObjects[objIdx].name)
            {
                case 'heal':
                    {
                        newObject = new HealObject(gameObjects[objIdx].x, gameObjects[objIdx].y);
                        break;
                    }
                case 'score':
                    {
                        newObject = new ScoreObject(gameObjects[objIdx].x, gameObjects[objIdx].y);
                        break;
                    }
                case 'player':
                    {
                        newObject = new Player(gameObjects[objIdx].x, gameObjects[objIdx].y, 100, 10);
                        break;
                    }
                case 'enemy':
                    {
                        newObject = new Enemy(gameObjects[objIdx].x, gameObjects[objIdx].y, 20, 1);
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

            if(gameObjects[objIdx].name === 'enemy')
            {
                this.enemies.push(newObject);
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