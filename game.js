const FLOOR_HEIGHT = 60;
const JUMP_FORCE = 830;
const SPEED = 480;

// initialize context
kaboom({
    background: [0, 16, 255],
});

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("cactus", "sprites/cactus.png");
loadSprite("sun", "sprites/sun_new.png");

scene("start", () => {
    add([
        text("Touch to start!"),
        pos(width() / 2, height() / 3),
        scale(1.0),
        origin("center"),
    ]);
    onKeyPress("space", () => {
        go("game");
    });
    onClick(() => {
        go("game");
    });
})

scene("game", () => {
    // define gravity
    gravity(2400);

    // add a game object to screen
    const player = add([
        // list of components
        sprite("bean"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        origin("botleft"),
        area(),
        solid(),
        color(184, 134, 11),
    ]);

    add([
        sprite("sun"),
        pos(width() - 280, 15),
        scale(0.25),
        area(),
    ])

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {

        // add tree obj
        add([
            sprite("cactus"),
            scale(rand(0.08, 0.19)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            origin("botleft"),
            move(LEFT, SPEED),
            "tree",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(0.65, 1.3), spawnTree);

    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

});

scene("lose", (score) => {

    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        origin("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        origin("center"),
    ]);
    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("start");