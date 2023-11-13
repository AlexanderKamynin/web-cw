import { Player, HealObject } from "./gameObjects";
import { EventManager } from "./eventManager";
import { PhysicsManager } from "./physicsManager";


export class GameManager
{
    constructor()
    {
        this.gameObjects = {};
        this.eventManager = new EventManager();
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
                if()
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