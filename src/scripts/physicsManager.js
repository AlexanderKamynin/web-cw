import { MapManager } from "./mapManager";
import { EventManager } from "./eventManager";
import { DIRECTIONS } from "./const";


export class PhysicsManager 
{
    constructor(mapManager, eventManager, gameManager)
    {
        this.mapManager = mapManager;
        this.gameManager = gameManager;
        this.eventManager = eventManager;
        this.movementChecker = setInterval(
            () => {
                if(this.eventManager.moveKeys[EventManager.keyToNumber("w")].isPressed)
                {
                    this.movePlayer(this.gameManager.getObjectByName("player", "w"));
                }
                else if(this.eventManager.moveKeys[EventManager.keyToNumber("a")].isPressed)
                {
                    this.movePlayer(this.gameManager.getObjectByName("player", "a"));
                }
                else if(this.eventManager.moveKeys[EventManager.keyToNumber("s")].isPressed)
                {
                    this.movePlayer(this.gameManager.getObjectByName("player", "s"));
                }
                else (this.eventManager.moveKeys[EventManager.keyToNumber("d")].isPressed)
                {
                    this.movePlayer(this.gameManager.getObjectByName("player", "d"));
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
                //TODO: менять номер колонки в направлении
                player.direction = DIRECTIONS.UP_ONE;
            case "a":
                player.direction = DIRECTIONS.LEFT_ONE;
            case "s":
                player.direction = DIRECTIONS.DOWN_ONE;
            case "d":
                player.direction = DIRECTIONS.RIGHT_ONE;
        }

        let newX = player.getPosition().x;
        let newY = player.getPosition().y;
        if(moveKey === "a" || moveKey === "d")
        {
            newX = moveKey === "a" ? newX - player.getSpeed() : newX + player.getSpeed();
        }
        if(moveKey === "s" || moveKey === "w")
        {
            newY = moveKey === "a" ? newY - player.getSpeed() : newY + player.getSpeed();
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
        if(this.isCollision(newX + this.mapManager.getTileSize().x, newY)){
            return false;
        }        
        //left down
        if(this.isCollision(newX, newY + this.mapManager.getTileSize().y))
        {
            return false;
        }

        //right down
        if(this.isCollision(newX + this.mapManager.getTileSize().x, newY + this.mapManager.getTileSize().y))
        {
            return false;
        }

        return true;
    }

    isCollision(newX, newY)
    {

    }
}