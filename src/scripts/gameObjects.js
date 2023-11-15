import { SPRITE_DIRECTIONS, DIRECTIONS } from "./const";

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
    constructor(x, y, health, damage, direction=SPRITE_DIRECTIONS.DOWN_TWO, speed=2)
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

    getDirection()
    {
        return this.direction;
    }

    setDirection(direction)
    {
        let allDirections = Object.values(SPRITE_DIRECTIONS);

        //определяем, меняем ли мы направление
        if(direction.sprite_directions.includes(this.direction))
        {
            const row = Math.floor(allDirections.indexOf(this.direction) / 3);
            const column = allDirections.indexOf(this.direction) % 3;

            const newDirectionIdx = Math.floor((allDirections.indexOf(this.direction) + 1) / 3) === row ? 3 * row + (column + 1) : row * 3;
            this.direction = allDirections[newDirectionIdx];
        }
        else {
            this.direction = direction.sprite_directions[Math.floor(direction.sprite_directions.length / 2)]; // получаем центральный спрайт в данном направлении как начальный
        }
    }

    makeHeal(healEffect)
    {
        this.health += healEffect;
    }
}


export class Enemy extends IGameObject
{
    constructor(x, y, health, damage, direction=SPRITE_DIRECTIONS.DOWN_TWO, speed=1)
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