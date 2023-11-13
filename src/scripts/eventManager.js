import { add } from "kio-tools";

export class EventManager
{
    constructor()
    {
        this.moveKeys = {
            87: { key: "w", isPressed: false},
            65: { key: "a", isPressed: false},
            83: { key: "s", isPressed: false},
            68: { key: "d", isPressed: false}
        }

        document.body.addEventListener("keydown", this.onKeyPressed.bind(this));
        document.body.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    static keyToNumber(key)
    {
        switch(key)
        {
            case "w": return 87;
            case "a": return 65;
            case "s": return 83;
            case "d": return 68;
        }
    }

    onKeyPressed(event)
    {
        let action = this.moveKeys[event.keyCode];
        if(action)
        {
            action.isPressed = true;
            return;
        }
    }

    onKeyUp(event)
    {
        const action = this.moveKeys[event.keyCode];
        if(action)
        {
            this.moveKeys[event.keyCode].isPressed = false;
            return;
        }
    }


}