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
        this.actionKeys = {
            70: {key: "f", isPressed: false}
        };

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
            case "f": return 70;
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
        action = this.actionKeys[event.keyCode];
        if(action)
        {
            switch(action.key)
            {
                case "f":
                    action.isPressed = true;
                    return;
                default:
                    return;
            }
        }
    }

    onKeyUp(event)
    {
        let action = this.moveKeys[event.keyCode];
        if(action)
        {
            this.moveKeys[event.keyCode].isPressed = false;
            return;
        }
        action = this.actionKeys[event.keyCode];
        if(action)
        {
            this.actionKeys[event.keyCode].isPressed = false;
            return;
        }
    }


}