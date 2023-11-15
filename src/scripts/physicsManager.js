import { MapManager } from "./mapManager";
import { EventManager } from "./eventManager";
import { DIRECTIONS } from "./const";


export class PhysicsManager 
{
    constructor(tileSize, eventManager, gameObjects, player)
    {
        this.tileSize = tileSize;

        this.gameObjects = gameObjects;
        this.player = player;

        this.eventManager = eventManager;
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

    update()
    {

    }

    objectAtPosition(object)
    {

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
        if(this.isCollision(newX, newY, newXDown, newYDown)){
            return false;
        }
        return true;
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
                    return true;
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
}