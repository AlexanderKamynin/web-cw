import { MapManager } from "./mapManager";
import { EventManager } from "./eventManager";
import { DIRECTIONS } from "./const";


export class PhysicsManager 
{
    constructor(tileSize, eventManager, gameObjects)
    {
        this.tileSize = tileSize;
        this.gameObjects = gameObjects;
        this.eventManager = eventManager;
        this.movementChecker = setInterval(
            () => {
                if(this.eventManager.moveKeys[EventManager.keyToNumber("w")].isPressed)
                {
                    this.movePlayer(this.getObjectByName("player"), "w");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("a")].isPressed)
                {
                    this.movePlayer(this.getObjectByName("player"), "a");
                }
                if(this.eventManager.moveKeys[EventManager.keyToNumber("s")].isPressed)
                {
                    this.movePlayer(this.getObjectByName("player"), "s");
                }
                if (this.eventManager.moveKeys[EventManager.keyToNumber("d")].isPressed)
                {
                    this.movePlayer(this.getObjectByName("player"), "d");
                }
            }, 30
        );
    }

    update()
    {

    }

    objectAtPosition(object)
    {

    }

    movePlayer(player, moveKey)
    {
        //поменяли направление главного героя
        switch(moveKey)
        {
            case "w":
                player.setDirection(DIRECTIONS.UP);
                break;
            case "a":
                player.setDirection(DIRECTIONS.LEFT);
                break;
            case "s":
                player.setDirection(DIRECTIONS.DOWN);
                break;
            case "d":
                player.setDirection(DIRECTIONS.RIGHT);
                break;
            default:
                break;
        }

        let newX = player.getPosition().x;
        let newY = player.getPosition().y;
        if(moveKey === "a" || moveKey === "d")
        {
            newX = moveKey === "a" ? newX - player.getSpeed() : newX + player.getSpeed();
        }
        if(moveKey === "s" || moveKey === "w")
        {
            newY = moveKey === "w" ? newY - player.getSpeed() : newY + player.getSpeed();
        }

        if(this.checkMove(newX, newY))
        {
            player.setPosition(newX, newY);
        }
    }

    checkMove(newX, newY)
    {

        //left up
        if(this.isCollision(newX, newY)){
            return false;
        }

        //right up
        if(this.isCollision(newX + this.tileSize.x, newY)){
            return false;
        }        
        //left down
        if(this.isCollision(newX, newY + this.tileSize.y))
        {
            return false;
        }

        //right down
        if(this.isCollision(newX + this.tileSize.x, newY + this.tileSize.y))
        {
            return false;
        }

        return true;
    }

    isCollision(newX, newY)
    {

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