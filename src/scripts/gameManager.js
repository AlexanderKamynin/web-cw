import { Player, HealObject } from "./gameObjects";

export class GameManager
{
    constructor()
    {
        this.gameObjects = {};
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
}