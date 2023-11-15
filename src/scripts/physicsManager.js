import { MapManager } from "./mapManager";
import { EventManager } from "./eventManager";
import { DIRECTIONS, SOUND_EFFECTS } from "./const";


export class PhysicsManager 
{
    constructor(mapSize, tileSize, eventManager, audioManager, gameObjects, player, healthPrint)
    {
        this.tileSize = tileSize;
        this.mapSize = mapSize;

        this.gameObjects = gameObjects;
        this.player = player;

        this.healthPrint = healthPrint;
        this.eventManager = eventManager;
        this.audioManager = audioManager;
        this.movementChecker = setInterval(
            () => {
                if(this.eventManager.moveKeys[EventManager.keyToNumber("w")].isPressed)
                {
                    this.movePlayer("w");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("a")].isPressed)
                {
                    this.movePlayer("a");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("s")].isPressed)
                {
                    this.movePlayer("s");
                }
                if (this.eventManager.moveKeys[EventManager.keyToNumber("d")].isPressed)
                {
                    this.movePlayer("d");
                }
            }, 1000/60
        );
    }

    movePlayer(moveKey)
    {
        //поменяли направление главного героя
        switch(moveKey)
        {
            case "w":
                this.player.setDirection(DIRECTIONS.UP);
                break;
            case "a":
                this.player.setDirection(DIRECTIONS.LEFT);
                break;
            case "s":
                this.player.setDirection(DIRECTIONS.DOWN);
                break;
            case "d":
                this.player.setDirection(DIRECTIONS.RIGHT);
                break;
            default:
                break;
        }

        let newX = this.player.getPosition().x;
        let newY = this.player.getPosition().y;
        
        if(moveKey === "a" || moveKey === "d")
        {
            newX = moveKey === "a" ? newX - this.player.getSpeed() : newX + this.player.getSpeed();
        }
        if(moveKey === "s" || moveKey === "w")
        {
            newY = moveKey === "w" ? newY - this.player.getSpeed() : newY + this.player.getSpeed();
        }

        if(this.checkMove(newX, newY))
        {
            this.player.setPosition(newX, newY);
        }
    }

    checkMove(newX, newY)
    {
        let newXDown = newX + this.tileSize.x;
        let newYDown = newY + this.tileSize.y;
        if(this.isOutMap(newX, newY, newXDown, newYDown)){
            return false;
        }

        let objCollision = this.isCollision(newX, newY, newXDown, newYDown);
        if(objCollision){
            this.reactObjectOnPlayer(objCollision);
            return false;
        }

        return true;
    }

    reactObjectOnPlayer(obj)
    {
        console.log(obj);
        if(obj.name === 'interior')
        {
            return;
        }
        if(obj.name === "heal")
        {
            let healEffect = obj.obj.getHealEffect();
            this.player.makeHeal(healEffect);
            this.audioManager.playSoundEffect(SOUND_EFFECTS.HEAL);
            this.healthPrint(this.player.getHealth());
            if(obj.obj.isShouldDestroy()){
                this.removeGameObject(obj.obj);
            }
        }

        return;
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
}