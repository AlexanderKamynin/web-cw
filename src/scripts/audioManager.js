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
    }

    playBackground()
    {
        this.background.play();
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
}