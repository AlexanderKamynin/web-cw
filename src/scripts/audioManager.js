import { AUDIO_PATH } from "./const";

export { SOUND_EFFECTS, AUDIO_PATH} from "./const";

export class AudioManager
{
    constructor()
    {
        this.background = new Audio(AUDIO_PATH + "background.mp3");
        this.background.volume = 0.4;
        this.healTakenEffect = new Audio(AUDIO_PATH + "chips.wav");
        this.healTakenEffect.volume = 0.5;
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