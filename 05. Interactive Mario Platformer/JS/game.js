let config = {
    type: Phaser.AUTO, // what rendering type is best for browser
    
    scale: {
        mode: Phaser.Scale.FIT, //fit game in screen
        width: 800,
        height: 600
    },

    backgroundColor: 0xffffcc,

    scene: {
        preload: preload, //runs one time
        create: create, //runs one time
        update: update // runs automatically again
    },

    physics: {
        default: "arcade", //physics engine for laws of motion
        arcade: {
            gravity: {
                y: 1000, // given gravity along y action
            },
            debug: false, // true -> shows bounding boxes around objects(green->directions,blue->static,pink->dynamic bodies)
        }
    }
};

// Player skills
let player_config = {
    player_speed: 300,
    player_jumpspeed: -650,
}

let game = new Phaser.Game(config);

function preload(){
    this.load.image("ground", "../Assets/grass.png");
    this.load.image("sky", "../Assets/background.png");
    this.load.image("apple", "../Assets/apple.png");
    this.load.image("ray", "../Assets/ray.png");   
    // spritesheet add                           // width , height of each frame
    this.load.spritesheet("dude", "../Assets/dude.png", {frameWidth: 32, frameHeight: 48});
}

function create(){
    W = game.config.width;
    H = game.config.height;

    //To create a background
    let background = this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth = W; // To update Width of background
    background.displayHeight = H; // To update Height of background
    background.depth = -2;
    
    //add image like tiles                      
    let ground = this.add.tileSprite(0, H-128, W, 128, "ground");
    ground.setOrigin(0, 0);
    //already created(existing)->true-static body
    this.physics.add.existing(ground, true); // add physics property

    // Create rays on top of the Background
    let rays = [];

    for (let i = -10; i <= 10; i++){
        let ray = this.add.sprite(W/2, H-100, "ray");
        ray.displayHeight = 1.2*H;
        ray.setOrigin(0.5, 1);
        ray.alpha = 0.2; // transperancy
        ray.angle = i*20; //rotate
        ray.depth = -1; 
        rays.push(ray); 
    }

    // Sunlight Effect Tween
    this.tweens.add({
        targets: rays,
        props: {
            angle: {
                value : "+= 200", //change angle
            },
        },
        duration: 8000, // repeat after 8 secs
        repeat: -1, // infinite
    });

    //Add the fruits
    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 8, // how many items?
        setScale: {x: 0.2, y: 0.2}, // size reduce
        setXY: {x: 10, y: 0, stepX: 100}, //start from 10,0 and other apple will be 100 from each other
    })

    // Add our player with Physics concepts (physics.add) // 4th image from spritesheet
    this.player = this.physics.add.sprite(100, 100, "dude", 4);
  
    this.player.setCollideWorldBounds(true); // collides with world(screen k bhr na jae)
    
    // Add the platforms and include "ground" in platforms container
    let platforms = this.physics.add.staticGroup(); // agroup pf static objects
    platforms.create(500, 400, "ground").setScale(2, 0.5).refreshBody(); // refresh body changes shape (scale is changed but shape remains same(see through debug = true))
    platforms.create(700, 200, "ground").setScale(2, 0.5).refreshBody();
    platforms.create(150, 200, "ground").setScale(2, 0.5).refreshBody();
    platforms.add(ground); // added ground to group

    // Handling all Collisions once collides move together
    this.physics.add.collider(platforms, fruits);
    this.physics.add.collider(platforms, this.player);

    // Adding Bouncing Effect on PLayer and Apples
    this.player.setBounce(0.2); // e = 0.2

    fruits.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    })

    // Player Animation and Player Movements
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),//select 0,1,2,3 frames
        frameRate: 10, // how many frames/sec
        repeat: -1, //-1 repeat infitely
    });
    this.anims.create({
        key: "center",
        frames: this.anims.generateFrameNumbers("dude", {start: 4, end: 4}),
        frameRate: 10,
        repeat: -1,
    });
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1,
    });

    // cursor obj will store which key is pressed,
    // and then in update function we'll check which key is pressed,
    // and the move in the resp. direction
    this.cursor = this.input.keyboard.createCursorKeys();// sandard func can check in update func()

    // OVERLAP: When player eats/overlaps the fruits  
                            // btw        btw    call functn , process call back, callback context
    this.physics.add.overlap(this.player, fruits, eatFruit, null, this);

    // Create Camera: To just focus a part on our frame. And that part moves with our player
    this.cameras.main.setBounds(0, 0, W, H); // region where camera is active
    this.physics.world.setBounds(0, 0, W, H); // world size

    this.cameras.main.startFollow(this.player, true, true); // camera focus
    this.cameras.main.setZoom(1.5); // zoom level
}

function update(){
    // When pressed left, righ or up key do player movement in resp. directions
    if (this.cursor.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play("left", true);
    }
    else if (this.cursor.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play("right", true); //play anims
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play("center", true);
    }
   ///                                 not jump in air
    if (this.cursor.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jumpspeed);
    }
}

function eatFruit(player, fruit) {
                    // deactivate,hide
    fruit.disableBody(true, true);//works on dynamic bodies
}