import { MapManager } from "./mapManager";
import { EventManager } from "./eventManager";
import { Enemy, Player } from "./gameObjects";
import { DIRECTIONS, VISIBLE_DISTANCE, ATTACK_DISTANCE, PLAYER_ATTACK_DISTANCE, ENEMY_CAN_ACROSS } from "./const";
import { AudioManager } from "./audioManager";


export class PhysicsManager 
{
    constructor(context, mapSize, tileSize,
        eventManager, audioManager,
        gameObjects, player, enemies,
        healthPrint, scoresPrint)
    {
        this.context = context;
        this.tileSize = tileSize;
        this.mapSize = mapSize;

        this.gameObjects = gameObjects;
        this.player = player;
        this.currentScore = 0;
        this.enemies = enemies;

        this.healthPrint = healthPrint;
        this.scoresPrint = scoresPrint;

        this.eventManager = eventManager;
        this.audioManager = audioManager;

        this.enemiesAttackCycle = setInterval(() => {
            this.tryEnemiesAttack();
        }, 250);
        this.movementChecker = setInterval(
            () => {
                if(this.eventManager.moveKeys[EventManager.keyToNumber("w")].isPressed)
                {
                    this.moveEntity(this.player, "w");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("a")].isPressed)
                {
                    this.moveEntity(this.player, "a");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("s")].isPressed)
                {
                    this.moveEntity(this.player, "s");
                }
                if (this.eventManager.moveKeys[EventManager.keyToNumber("d")].isPressed)
                {
                    this.moveEntity(this.player, "d");
                }
            }, 1000/60
        );
        this.playerAttackChecker = setInterval(
            () => {
                if(this.eventManager.actionKeys[EventManager.keyToNumber("f")].isPressed)
                {
                    this.playerAttack();
                }
            }, 50
        );
    }

    moveEntity(entity, moveKey)
    {
        //поменяли направление главного героя
        switch(moveKey)
        {
            case "w":
                entity.setDirection(DIRECTIONS.UP);
                break;
            case "a":
                entity.setDirection(DIRECTIONS.LEFT);
                break;
            case "s":
                entity.setDirection(DIRECTIONS.DOWN);
                break;
            case "d":
                entity.setDirection(DIRECTIONS.RIGHT);
                break;
            default:
                break;
        }

        let newX = entity.getPosition().x;
        let newY = entity.getPosition().y;
        
        if(moveKey === "a" || moveKey === "d")
        {
            newX = moveKey === "a" ? newX - entity.getSpeed() : newX + entity.getSpeed();
        }
        if(moveKey === "s" || moveKey === "w")
        {
            newY = moveKey === "w" ? newY - entity.getSpeed() : newY + entity.getSpeed();
        }

        if(this.checkMove(entity, newX, newY))
        {
            entity.setPosition(newX, newY);
        }
    }

    checkMove(entity, newX, newY)
    {
        let newXDown = newX + this.tileSize.x;
        let newYDown = newY + this.tileSize.y;
        if(this.isOutMap(newX, newY, newXDown, newYDown)){
            return false;
        }

        let objCollision = this.isCollision(newX, newY, newXDown, newYDown);
        if(objCollision){
            if(entity instanceof Player)
            {
                this.reactObjectOnPlayer(objCollision);
            }
            if(entity instanceof Enemy && ENEMY_CAN_ACROSS.includes(objCollision.name))
            {
                return true;
            }

            return false;
        }

        return true;
    }

    reactObjectOnPlayer(obj)
    {
        if(obj.name === 'interior')
        {
            return;
        }
        if(obj.name === "heal")
        {
            let healEffect = obj.obj.getHealEffect();
            this.player.makeHeal(healEffect);
            this.audioManager.playSoundEffect(AudioManager.SOUND_EFFECTS.HEAL);
            this.healthPrint(this.player.getHealth());
            if(obj.obj.isShouldDestroy()){
                this.removeGameObject(obj.obj);
            }
        }
        if(obj.name === 'score')
        {
            let score = obj.obj.getScore();
            this.currentScore += score;
            this.audioManager.playSoundEffect(AudioManager.SOUND_EFFECTS.SCORE);
            this.scoresPrint(this.currentScore);
            if(obj.obj.isShouldDestroy()){
                this.removeGameObject(obj.obj);
            }
        }
        

        return;
    }


    moveEnemies()
    {
        for(let idx = 0; idx < this.enemies.length; idx++)
        {
            let enemyX = this.enemies[idx].getPosition().x;
            let enemyY = this.enemies[idx].getPosition().y;

            let targetX = this.player.getPosition().x;
            let targetY = this.player.getPosition().y;

            
            //если игрок в некоторой зоне видимости
            if(PhysicsManager.getDistance(enemyX, enemyY, targetX, targetY) < VISIBLE_DISTANCE)
            {

                if(enemyX !== targetX || enemyY !== targetY)
                {
                    const distanceX = Math.abs(enemyX - targetX);
                    const distanceY = Math.abs(enemyY - targetY);
                    
                    // Выбираем направление в зависимости от эвристики
                    if (distanceX > distanceY) 
                    {
                        // Приоритет движения по горизонтали
                        if (enemyX < targetX) {
                            this.moveEntity(this.enemies[idx], 'd');
                        } 
                        else 
                        {
                            this.moveEntity(this.enemies[idx], 'a');
                        }
                    }
                    else 
                    {
                        // Приоритет движения по вертикали
                        if (enemyY > targetY) {
                            this.moveEntity(this.enemies[idx], 'w');
                        } 
                        else 
                        {
                            this.moveEntity(this.enemies[idx], 's');
                        }
                    }
                }
            }
        }
    }

    playerAttack()
    {
        for(let idx = 0; idx < this.enemies.length; idx++)
        {
            //получаем центр врага
            let enemyX = this.enemies[idx].getPosition().x + this.tileSize.x / 2;
            let enemyY = this.enemies[idx].getPosition().y + this.tileSize.y / 2;

            //получаем центр игрока
            let targetX = this.player.getPosition().x + this.tileSize.x / 2;
            let targetY = this.player.getPosition().y + this.tileSize.y / 2;

            if(PhysicsManager.getDistance(enemyX, enemyY, targetX, targetY) <= PLAYER_ATTACK_DISTANCE)
            {
                this.enemies[idx].underHit(this.player.getDamage());
                
                //побили врага!
                if(this.enemies[idx].getHealth() <= 0)
                {
                    this.removeEnemyByIdx(idx);
                    this.audioManager.playSoundEffect(AudioManager.SOUND_EFFECTS.ENEMY_DEATH);
                }
            }
        }
    }

    tryEnemiesAttack()
    {
        for(let idx = 0; idx < this.enemies.length; idx++)
        {
            //получаем центр врага
            let enemyX = this.enemies[idx].getPosition().x + this.tileSize.x / 2;
            let enemyY = this.enemies[idx].getPosition().y + this.tileSize.y / 2;

            //получаем центр игрока
            let targetX = this.player.getPosition().x + this.tileSize.x / 2;
            let targetY = this.player.getPosition().y + this.tileSize.y / 2;

            if(PhysicsManager.getDistance(enemyX, enemyY, targetX, targetY) <= ATTACK_DISTANCE) 
            {
                this.player.underHit(this.enemies[idx].getDamage());
                this.healthPrint(this.player.getHealth());
            }
        }
    }

    isOutMap(newX, newY, newXDown, newYDown)
    {
        if(newX < 0 || newY < 0 || newXDown >= this.mapSize.x || newYDown >= this.mapSize.y)
        {
            return true;
        }
        return false;
    }

    isCollision(x, y, newXdown, newYdown)
    {
        for(let objTypeIdx = 0; objTypeIdx < Object.keys(this.gameObjects).length; objTypeIdx++)
        {
            const objType = Object.keys(this.gameObjects)[objTypeIdx];

            for(let idx = 0; idx < this.gameObjects[objType].length; idx++)
            {
                let epsilon = 12;
                let objPosX = this.gameObjects[objType][idx].x;
                let objPosY = this.gameObjects[objType][idx].y;

                if(this.isSquareIntersection(x, y, newXdown, newYdown, objPosX + epsilon, objPosY + epsilon, objPosX + this.tileSize.x - epsilon, objPosY + this.tileSize.y - 2 * epsilon))
                {
                    return {name: objType, obj: this.gameObjects[objType][idx]};
                }
            }
        }

        return false;
    }

    isSquareIntersection(leftUpX_A, leftUpY_A, rightDownX_A, rightDownY_A, leftUpX_B, leftUpY_B, rightDownX_B, rightDownY_B) 
    {
        // Проверка по оси X
        if (rightDownX_A < leftUpX_B || rightDownX_B < leftUpX_A) {
            return false; // Проекции не пересекаются по оси X
        }

        // Проверка по оси Y
        if (rightDownY_A < leftUpY_B || rightDownY_B < leftUpY_A) {
            return false; // Проекции не пересекаются по оси Y
        }

        return true; // Проекции пересекаются по обеим осям
    }

    static getDistance(xA, yA, xB, yB)
    {
        return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
    }

    getObjectCenter(objX, objY)
    {
        return {
            x: objX + Math.floor(this.tileSize.x / 2),
            y: objY + Math.floor(this.tileSize.y / 2)
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

    removeGameObject(obj)
    {
        for(let objTypeIdx = 0; objTypeIdx < Object.keys(this.gameObjects).length; objTypeIdx++)
        {
            const objType = Object.keys(this.gameObjects)[objTypeIdx];

            for(let idx = 0; idx < this.gameObjects[objType].length; idx++)
            {
                if(this.gameObjects[objType][idx] === obj)
                {
                    this.gameObjects[objType].splice(idx, 1);
                }
            }
        }
    }

    removeEnemyByIdx(idx)
    {
        if(this.enemies)
        {
            this.enemies.splice(idx, 1);
        }
    }
}