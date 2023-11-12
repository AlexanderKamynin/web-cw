import { POSITIONS } from "./const";

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
}


export class Player extends IGameObject 
{
    constructor(x, y, health, damage, direction=POSITIONS.DOWN, speed=1)
    {
        super(x,y);
        this.health = health;
        this.damage = damage;
        this.direction = direction;
        this.speed = speed;
    }

    makeHeal(healEffect)
    {
        this.health += healEffect;
    }
}


export class Enemy extends IGameObject
{
    constructor(x, y, health, damage, direction=POSITIONS.DOWN, speed=1)
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