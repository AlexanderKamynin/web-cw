import { DIRECTIONS } from "./const";

export class IGameObject
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getPosition()
    {
        return {
            x: this.x,
            y: this.y
        };
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
    }
}


export class Player extends IGameObject 
{
    constructor(x, y, health, damage, direction=DIRECTIONS.DOWN_TWO, speed=1)
    {
        super(x,y);
        this.health = health;
        this.damage = damage;
        this.direction = direction;
        this.speed = speed;
    }

    getSpeed()
    {
        return this.speed;
    }

    makeHeal(healEffect)
    {
        this.health += healEffect;
    }
}


export class Enemy extends IGameObject
{
    constructor(x, y, health, damage, direction=DIRECTIONS.DOWN_TWO, speed=1)
    {
        super(x,y);
        this.health = health;
        this.damage = damage;
        this.direction = direction;
        this.speed = speed;
    }
}


export class HealObject extends IGameObject
{
    constructor(x, y, healEffect=10)
    {
        super(x,y);
        this.healEffect = healEffect;
    }
}