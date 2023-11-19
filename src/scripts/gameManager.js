import { Player, HealObject, Enemy, ScoreObject, FinishObject } from "./gameObjects";
import { EventManager } from "./eventManager";
import { PhysicsManager } from "./physicsManager";
import { MapManager } from "./mapManager";
import { SpriteManager } from "./spriteManager";
import { AudioManager } from "./audioManager";
import { GameStorage } from "./storage";
import { IMG_PATH } from "./const";


export class GameManager
{
    static forNextLevelNeed = {
        1: 20,
        2: 50
    };

    static levelJsonPath = {
        1: "/src/tilesets/level1.json",
        2: "/src/tilesets/level1.json"
    }

    constructor()
    {
        //managers
        this.eventManager = new EventManager();
        this.spriteManager = new SpriteManager();
        this.audioManager = new AudioManager();
        this.mapManager = new MapManager(this.spriteManager);
        this.physicsManager = null; //initialize with game starting
        this.gameStorage = new GameStorage();

        //objects
        this.gameObjects = {};
        this.player = null;
        this.finish = null;
        this.enemies = [];

        //game information
        this.scores = [];
        this.level = 1;
        this.currentLevelPassed = false;
        this.showFinish = false;
        this.isGameWon = false;
        this.isGameOver = false;
        this.isMapInit = false;

        //simple printers for html
        this.levelPrint = (level) => {
            document.querySelector('.level').innerHTML = `${level}`;
        }
        this.healthPrint = (health) => {
            document.querySelector('.health').innerText = `${health}`;
        };
        this.scoresPrint = (scores) => {
            document.querySelector('.scores').innerHTML = `${scores}`;
        };

        //слушатель на следующий уровень
        this.goToNextLevel = async() => {
            if(this.currentLevelPassed)
            {
                this.clearAllIntervals();
                this.scores.push(this.getCurrentLevelScore());
                this.level++;
                this.audioManager.stopBackground();
                await this.init();
                document.querySelector(".start_game").style.visibility = "visible";
            }
        }

        //draw settings
        this.canvas = document.querySelector(".playground_map");
        this.canvas_context = this.canvas.getContext("2d");
    }

    async init()
    {
        console.log('Текущий уровень ' + this.level);
        //для следующего уровня
        this.resetToDefault();

        await this.mapManager.init(GameManager.levelJsonPath[this.level]);
        this.initGameObjects(this.mapManager.parseGameObjects());

        this.healthPrint(this.player.getHealth());
        this.scoresPrint(this.scores.reduce((a, b) => a + b, 0));
        this.levelPrint(this.level);

        //check that all okey
        console.log(this.mapManager);
        console.log(this.gameObjects);
        console.log(this.player);
        console.log(this.enemies);

        //manipulation with canvas
        this.canvas.width = this.mapManager.getMapSize().x;
        this.canvas.height = this.mapManager.getMapSize().y;

        //первоначальная отрисовка
        this.canvas_context.drawImage(this.mapManager.backgrounds[this.level], 0, 0, this.canvas.width, this.canvas.height);
        this.mapManager.drawPlayer(this.player, this.canvas_context);
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
        const prevLevelScores = this.scores.reduce((a, b) => a + b, 0);
        this.gameCycle = setInterval(() => {
            this.finishGameChecks();
            this.physicsManager.moveEnemies();
            this.render();
            this.scoresPrint(prevLevelScores + this.getCurrentLevelScore());
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

        if(!this.showFinish && this.getCurrentLevelScore() >= GameManager.forNextLevelNeed[this.level])
        {
            this.showFinish = true;
        }
        if(this.getCurrentLevelScore() >= GameManager.forNextLevelNeed[this.level] && PhysicsManager.getDistance(this.player.getPosition().x, this.player.getPosition().y,
            this.finish.getPosition().x, this.finish.getPosition().y) < this.mapManager.getTileSize().x) 
            {
                this.currentLevelPassed = true;
            }
        
        if(this.level !== 2 && this.currentLevelPassed)
        {
            this.goToNextLevel();
        }
        else if(this.level === 2 && this.currentLevelPassed)
        {
            this.isGameWon = true;
            this.finishGame();
        }
    }

    finishGame()
    {
        this.isGameOver = true;
        this.scores.push(this.getCurrentLevelScore());

        //убираем все интервалы
        this.clearAllIntervals();

        if(!this.isGameWon)
        {
            let columnInSprite = 0;
            //отрисуем смэрть игрока
            const defeatAnimation = setInterval(() => {
                this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.canvas_context.drawImage(this.mapManager.backgrounds[this.level], 0, 0, this.canvas.width, this.canvas.height);
                this.mapManager.drawObjects(this.gameObjects, this.canvas_context);
                this.mapManager.drawEnemies(this.enemies, this.canvas_context);
                this.mapManager.drawPlayerDefeat(columnInSprite, this.player, this.canvas_context);
                columnInSprite++;
                if(columnInSprite > 2){
                    clearInterval(defeatAnimation);
                }
            }, 250);
        }

        //останавливаем фоновую музыку, включаем звук конца =(
        this.audioManager.stopBackground();
        if(!this.isGameWon)
        {
            this.audioManager.playGameOver();
        }
        else 
        {
            this.audioManager.playGameWon();
        }
        console.log('game over');

        //результат загружаем в таблицу
        console.log('Все очки за все уровни ' + this.scores);
        this.gameStorage.setScore(this.scores.reduce((a, b) => a + b, 0));

        //добавляем кнопку для возможности переиграть уровень
        document.querySelector(".restart_game").style.visibility = "visible";
    }

    render()
    {
        //стираем все, что было отрисовано до
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //рисуем в следующей последовательности: floor -> interior -> object and entities
        //this.mapManager.drawFloor(this.canvas_context);
        //this.mapManager.drawInterior(this.canvas_context);

        //отрисовываем background
        this.canvas_context.drawImage(this.mapManager.backgrounds[this.level], 0, 0, this.canvas.width, this.canvas.height);
        this.mapManager.drawObjects(this.gameObjects, this.canvas_context);
        if(this.showFinish)
        {
            this.mapManager.drawFinish(this.finish, this.canvas_context);
        }
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
                case 'finish':
                    {
                        newObject = new FinishObject(gameObjects[objIdx].x, gameObjects[objIdx].y);
                        break;
                    }
                case 'enemy':
                    {
                        newObject = new Enemy(gameObjects[objIdx].x, gameObjects[objIdx].y, 20, 5);
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

            if(gameObjects[objIdx].name === 'finish')
            {
                this.finish = newObject;
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

    getCurrentLevelScore()
    {
        return this.physicsManager.currentScore;
    }

    clearAllIntervals()
    {
        //убираем все интервалы
        clearInterval(this.gameCycle);
        clearInterval(this.physicsManager.enemiesAttackCycle);
        clearInterval(this.physicsManager.movementChecker);
        clearInterval(this.physicsManager.playerAttackChecker);
        clearInterval(this.finishAnimation);
        clearInterval(this.isPlayerAttack);
    }

    resetToDefault()
    {
        if(this.scores.length !== 0)
        {
            if(this.isGameOver === true)
            {
                this.scores.pop();
            }
        }
        this.isGameWon = false;
        this.isGameOver = false;
        this.showFinish = false;
        this.currentLevelPassed = false;
        this.isMapInit = false;
        this.gameObjects = {};
        this.player = null;
        this.finish = null;
        this.enemies = [];
    }
}