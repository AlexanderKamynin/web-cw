
export const MAP_PATH = "/src/tilesets/level1.json";
export const IMG_PATH = "./src/tilesets/";
export const AUDIO_PATH = "./src/audio/"
export const VISIBLE_DISTANCE = 300;
export const ATTACK_DISTANCE = 30;
export const SPRITE_DIRECTIONS = {
    DOWN_ONE: 'DownOne',
    DOWN_TWO: 'DownTwo',
    DOWN_THREE: 'DownThree',

    LEFT_ONE: 'LeftOne',
    LEFT_TWO: 'LeftTwo',
    LEFT_THREE: 'LeftThree',

    RIGHT_ONE: 'RightOne',
    RIGHT_TWO: 'RightTwo',
    RIGHT_THREE: 'RightThree',

    UP_ONE: 'UpOne',
    UP_TWO: 'UpTwo',
    UP_THREE: 'UpThree',
};
export const DIRECTIONS = {
    DOWN: {
        name: "down",
        sprite_directions: [
            SPRITE_DIRECTIONS.DOWN_ONE,
            SPRITE_DIRECTIONS.DOWN_TWO,
            SPRITE_DIRECTIONS.DOWN_THREE
        ]
    },
    LEFT: {
        name: "left",
        sprite_directions: [
            SPRITE_DIRECTIONS.LEFT_ONE,
            SPRITE_DIRECTIONS.LEFT_TWO,
            SPRITE_DIRECTIONS.LEFT_THREE
        ]
    },
    RIGHT: {
        name: "right",
        sprite_directions: [
            SPRITE_DIRECTIONS.RIGHT_ONE,
            SPRITE_DIRECTIONS.RIGHT_TWO,
            SPRITE_DIRECTIONS.RIGHT_THREE
        ]
    },
    UP: {
        name: "up",
        sprite_directions: [
            SPRITE_DIRECTIONS.UP_ONE,
            SPRITE_DIRECTIONS.UP_TWO,
            SPRITE_DIRECTIONS.UP_THREE
        ]
    }
}

export const SOUND_EFFECTS = {
    HEAL: "heal"
}