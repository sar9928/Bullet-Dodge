// properties
var player;
var enemy;
var bullet;
var ebullet;
var laser;
var shooting;
var health_amount;
var enemy_health;

//sounds
var bgAudio = undefined;
let shootSound;
let hurtSound;
let laserSound;

    function stopBGAudio() {
        bgAudio.pause();
        bgAudio.currentTime = 0;
    }

    function playBGAudio() {
        bgAudio.play();
    }

function startGame() {
    Arena.start();
    playBGAudio();
    player = new component(30, 80, "blue", 40, 40);
    enemy = new component(30, 80, "red", 1210, 603);
    bullet = new component(50, 2, "yellow", -120, 73, 0);
    ebullet = new component(50, 2, "yellow", -120, 612, 0);
    laser = new component(20, 660,"rgba(0,255,0,0.4)", 630, 30);
    // Walls
    b_wall = new component(1224, 8,"rgba(255,0,0,0)", 28, 22);
    f_wall = new component(1224, 8,"rgba(255,0,0,0)", 28, 608);
    l_wall = new component(8, 674,"rgba(255,0,0,0)", 28, 22);
    r_wall = new component(8, 674,"rgba(255,0,0,0)", 1214, 22);
}

var Arena = {
    canvas : document.createElement("canvas"),
    start : function() {
        health_amount = 100;
        enemy_health = 100;
        shooting = 1;
        bgAudio = document.querySelector("#bgAudio");
        bgAudio.volume = 0.50;
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.canvas.setAttribute('style', "position: absolute; left: 50%; margin-left: -650px; top: 50%; margin-top: -320px; border: 2px solid black");
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArena, 20);
        window.addEventListener('keydown', function (e) {
            Arena.keys = (Arena.keys || []);
            Arena.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            Arena.keys[e.keyCode] = (e.type == "keydown");            
        })

	   // Load Sounds
    shootSound = new Howl({
	        src: ['media/bullet_fire.mp3']
});

    hurtSound = new Howl({
	        src: ['media/hurt.mp3']
});

    laserSound = new Howl({
	        src: ['media/laser.mp3']
});

    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, distance) {
        this.gamearea = Arena;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.distance = 0;
    this.update = function() {
        ctx = Arena.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function playerDie()
{
    health_amount = 100;
    player.x = 40;
    player.y = 40;
}

function enemyDie()
{
    enemy_health = 100;
    enemy.x = 1210;
    enemy.y = 603;
}

function setBoundaries(){
    // front wall
    if (player.x > f_wall.x && player.x < (f_wall.x + 1224) && player.y > f_wall.y && player.y < (f_wall.y + 8)) {
        player.y = player.y - 4;
    }
    if (enemy.x > f_wall.x && enemy.x < (f_wall.x + 1224) && enemy.y > f_wall.y && enemy.y < (f_wall.y + 8)) {
        enemy.y = enemy.y - 4;
    }

    // back wall
    if (player.x > b_wall.x && player.x < (b_wall.x + 1224) && player.y > b_wall.y && player.y < (b_wall.y + 8)) {
        player.y = player.y + 4;
    }
    if (enemy.x > b_wall.x && enemy.x < (b_wall.x + 1224) && enemy.y > b_wall.y && enemy.y < (b_wall.y + 8)) {
        enemy.y = enemy.y + 4;
    }

    // left wall
    if (player.x > l_wall.x && player.x < (l_wall.x + 8) && player.y > l_wall.y && player.y < (l_wall.y + 674)) {
        player.x = player.x + 4;
    }
    if (enemy.x > l_wall.x && enemy.x < (l_wall.x + 8) && enemy.y > l_wall.y && enemy.y < (l_wall.y + 674)) {
        enemy.x = enemy.x + 4;
    }

    // right wall
    if (player.x > r_wall.x && player.x < (r_wall.x + 8) && player.y > r_wall.y && player.y < (r_wall.y + 674)) {
        player.x = player.x - 4;
    }
    if (enemy.x > r_wall.x && enemy.x < (r_wall.x + 8) && enemy.y > r_wall.y && enemy.y < (r_wall.y + 674)) {
        enemy.x = enemy.x - 4;
    }

    // Laser Death! 
    if (player.x > laser.x && player.x < (laser.x + 8) && player.y > laser.y && player.y < (laser.y + 660)) {
        // play laser sound
        laserSound.play();
        // player dies
        playerDie();
    }
    if (enemy.x > laser.x && enemy.x < (laser.x + 8) && enemy.y > laser.y && enemy.y < (laser.y + 660)) {
        // play laser sound
        laserSound.play();
        // enemy dies
        enemyDie();
    }
}

function hitDetection (){
    // enemy damage
    if (bullet.x > enemy.x && bullet.x < (enemy.x + 30) && bullet.y > enemy.y && bullet.y < (enemy.y + 80)) {
        hurtSound.play();
        enemy_health = enemy_health - 5;
        document.getElementById("ehealth").value = enemy_health;
    }
    // player damage
    if (ebullet.x > player.x && ebullet.x < (player.x + 30) && ebullet.y > player.y && ebullet.y < (player.y + 80)) {
        hurtSound.play();
        health_amount = health_amount - 5;
        document.getElementById("health").value = health_amount;
    }
}

function updatePositions(){
    bullet.x += 200;
    ebullet.x -= 200;
}

function updateGameArena() {
    Arena.clear();
    setBoundaries();
    updatePositions();
    hitDetection();
    player.speedX = 0;
    player.speedY = 0;
    enemy.speedX = 0;
    enemy.speedY = 0;
    bullet.speedX = 0;
    bullet.speedY = 0;
    ebullet.speedX = 0;
    ebullet.speedY = 0;

    // controls for player
    // Uses WASD for movement and space for fire
    if (Arena.keys && Arena.keys[65]) {player.speedX = -4; bullet.speedX = -4;}
    if (Arena.keys && Arena.keys[68]) {player.speedX = 4; bullet.speedX = 4;}
    if (Arena.keys && Arena.keys[87]) {player.speedY = -4; bullet.speedY = -4;}
    if (Arena.keys && Arena.keys[83]) {player.speedY = 4; bullet.speedY = 4;}
    if (Arena.keys && Arena.keys[32] && bullet.distance == 0 && shooting == 1) {bullet.y = player.y; bullet.x = player.x; shootSound.play();}

    if (bullet.x != -80000) // super unnecessary number X)
        {
            bullet.distance -= 100;
            if(bullet.distance == -900)
                {
                    bullet.distance = 0;
                }
        }

    // controls for foe
    // Uses numpad 8456 for movement and down arrow for fire
    if (Arena.keys && Arena.keys[100]) {enemy.speedX = -4; ebullet.speedX = -4;}
    if (Arena.keys && Arena.keys[102]) {enemy.speedX = 4; ebullet.speedX = 4;}
    if (Arena.keys && Arena.keys[104]) {enemy.speedY = -4; ebullet.speedY = -4;}
    if (Arena.keys && Arena.keys[101]) {enemy.speedY = 4; ebullet.speedY = 4;}
    if (Arena.keys && Arena.keys[40] && ebullet.distance == 0 && shooting == 1) {ebullet.y = enemy.y; ebullet.x = enemy.x; shootSound.play();}


    if (ebullet.x != -80000) // super unnecessary number X)
        {
            ebullet.distance -= 100;
            if(ebullet.distance == -900)
                {
                    ebullet.distance = 0;
                }
        }

    // update positions
    player.newPos();
    enemy.newPos();
    bullet.newPos();
    ebullet.newPos();
    laser.newPos();
    enemy.update();
    player.update();
    bullet.update();
    ebullet.update();
    laser.update();

    // Wall new positions and updates
    f_wall.newPos();
    f_wall.update();
    b_wall.newPos();
    b_wall.update();
    l_wall.newPos();
    l_wall.update();
    r_wall.newPos();
    r_wall.update();
}