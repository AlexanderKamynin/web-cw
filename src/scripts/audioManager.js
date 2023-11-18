import { AUDIO_PATH } from "./const";

export class AudioManager
{
    static SOUND_EFFECTS = {
        HEAL: "heal",
        SCORE: "score",
        ENEMY_DEATH: "enemyDeath"
    }

    constructor()
    {
        this.background = new Audio(AUDIO_PATH + "background.mp3");
        this.background.volume = 0.4;
        this.healTakenEffect = new Audio(AUDIO_PATH + "chips.wav");
        this.healTakenEffect.volume = 0.5;
        this.scoreTakenEffect = new Audio(AUDIO_PATH + "gift.mp3");
        this.scoreTakenEffect.volume = 0.5;
        this.enemyDeathEffect = new Audio(AUDIO_PATH + "enemy_death.mp3");

        this.gameOver = new Audio(AUDIO_PATH + "game_over.mp3");
    }

    playBackground()
    {
        this.background.play();
    }

    playGameOver()
    {
        this.gameOver.play();
    }

    playSoundEffect(soundEffect)
    {
        switch(soundEffect)
        {
            case "heal":
                this.healTakenEffect.play();
                break;
            case "score":
                this.scoreTakenEffect.play();
                break;
            case "enemyDeath":
                this.enemyDeathEffect.play();
                break;
            default:
                break;
        }
    }

    stopBackground()
    {
        this.background.currentTime = 0;
        this.background.pause();
    }
}