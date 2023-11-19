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
    constructor(x, y, health, damage, direction=SPRITE_DIRECTIONS.DOWN_TWO, speed=4)
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

    getHealth()
    {
        return this.health;
    }

    getDamage()
    {
        return this.damage;
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

    underHit(enemyDamage)
    {
        this.health -= enemyDamage;
    }
}


export class Enemy extends IGameObject
{
    constructor(x, y, health, damage, speed=2, direction=SPRITE_DIRECTIONS.DOWN_TWO)
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

    getDamage()
    {
        return this.damage;
    }

    getHealth()
    {
        return this.health;
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

    underHit(playerDamage)
    {
        this.health -= playerDamage;
    }
}


export class HealObject extends IGameObject
{
    constructor(x, y, healEffect=10)
    {
        super(x,y);
        this.healEffect = healEffect;
        this.shouldDestroy = false;
    }

    getHealEffect()
    {
        this.shouldDestroy = true;
        return this.healEffect;
    }

    isShouldDestroy()
    {
        return this.shouldDestroy;
    }
}

export class ScoreObject extends IGameObject
{
    constructor(x, y, score=10)
    {
        super(x,y);
        this.score = score;
        this.shouldDestroy = false;
    }

    getScore()
    {
        this.shouldDestroy = true;
        return this.score;
    }

    isShouldDestroy()
    {
        return this.shouldDestroy;
    }
}

export class FinishObject extends IGameObject
{
    constructor(x, y)
    {
        super(x, y);
    }
}