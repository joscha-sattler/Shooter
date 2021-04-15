var Game = {

    canvas: false,
    ctx: false,

    //-------------------------------------------------------------> 
    // Funktion, die beim Laden ausgeführt wird
    init: function () {
        Game.canvas = document.getElementById('canvas');
        Game.c = Game.canvas.getContext('2d');
        Game.resize();

        // Wird mit jedem Frame ausgeführt
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.requestAnimationFrame(callback);
                };
        })();
        
        //Bilder werden ins Asset geladen
        console.log('Lade Spiel-Elemente...');
        Game.assets.addRessource('Grafiken/ende.png');
        Game.assets.addRessource('Grafiken/Hauptmenue3.png');
        Game.assets.addRessource('Grafiken/start.png');
        Game.assets.addRessource('Grafiken/zurück.png');
        Game.assets.addRessource('Grafiken/weltall.jpg');
        Game.assets.addRessource('Grafiken/rakete60x60.png');
        Game.assets.addRessource('Grafiken/rakete80x80.png');
        Game.assets.addRessource('Grafiken/rakete100x100.png');
        Game.assets.addRessource('Grafiken/alien35x35.png');
        Game.assets.addRessource('Grafiken/alien50x50.png');
        Game.assets.addRessource('Grafiken/alien75x75.png');
        Game.assets.addRessource('Grafiken/alien100x100.png');
        Game.assets.addRessource('Grafiken/Asteroid25x25.png');
        Game.assets.addRessource('Grafiken/Asteroid50x50.png');
        Game.assets.addRessource('Grafiken/Asteroid75x75.png');
        Game.assets.addRessource('Grafiken/Asteroid100x100.png');
        //Bilder werden gedownloaded ins Array
        Game.assets.download();
        //Spiel starten
        Game.loop();
    },
    //------------------------------------------------------------->        
    //Anpassung an Bildschrimgröße
    resize: function () {
        Game.canvas.width = window.innerWidth;
        Game.canvas.height = window.innerHeight;
    },
    //------------------------------------------------------------->
    
    //Mauserkennung / Klickfunktion
    input: {
        x: 0,
        y: 0,
        radius: 10,

        clicked: false,

        click: function (e) {
            e.preventDefault();
            Game.input.x = e.x;
            Game.input.y = e.y;
            Game.input.clicked = true;
        }
    },
    //------------------------------------------------------------->
    //Game-loop
    loop: function () {
        Game.update();

        Game.render();

        requestAnimationFrame(Game.loop);
    },
    //------------------------------------------------------------->  
    // Funktion zur Gestaltung der Szene / Bildschirms (was wird wann auf Canvas gezeichnet))
    render: function () {
                
        Game.draw.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
        Game.draw.drawImage(Game.assets.getAsset('Grafiken/weltall.jpg'), 0, 0);
        
        if (Game.scenes.current == 'loading') {
            Game.scenes.loading.render();
        }

        if (Game.scenes.current == 'mainMenu') {
            Game.scenes.mainMenu.render();
        }

        if (Game.scenes.current == 'game') {
            Game.scenes.game.render();
        }

        if (Game.scenes.current == 'gameover') {
            Game.scenes.gameover.render();
        }

    },
    //-------------------------------------------------------------> 
    //Aktualisierung des Spiels in der jeweiligen Szene
    update: function () {
        if (Game.scenes.current == 'loading') {
            Game.scenes.loading.update();
        }

        if (Game.scenes.current == 'mainMenu') {
            Game.scenes.mainMenu.update();
        }

        if (Game.scenes.current == 'game') {
            Game.scenes.game.update();
        }
        
        if(Game.scenes.current == 'gameover') {
            Game.scenes.gameover.update();
        }
    },
    //------------------------------------------------------------->    
    //Funktionen zum Zeichnen
    draw: {

        fillRect: function (x, y, width, height) {
            Game.c.fillRect(x, y, width, height);
        },

        fillGradient: function (color1, color2) {
            var gradient = Game.c.createLinearGradient(10, 30, 20, 170);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            Game.c.fillStyle = gradient;
        },

        drawImage: function (img, x, y) {
            Game.c.drawImage(img, x, y);
        },

        text: function (text, x, y, size, color) {
            Game.c.fillStyle = color;
            Game.c.font = size + 'px Verdana';
            Game.c.fillText(text, x, y);
        }
    },
    //------------------------------------------------------------->
    // die einzelnen Szenen und deren Zeichnungen / Spiel-Logiken
    scenes: {
        current: 'loading',
        loading: {
            render: function () {
                Game.draw.drawImage(document.getElementById('lade'), (Game.canvas.width - 400) / 2, (Game.canvas.height - 41) / 2);
            },
            update: function () {
                if (Game.assets.isDone() == true) {
                    console.log('Alle Elemente fertig geladen');
                    Game.scenes.current = 'mainMenu';
                }
            }
        },
        mainMenu: {
            render: function () {
                Game.draw.drawImage(Game.assets.getAsset('Grafiken/start.png'), (Game.canvas.width - 400) / 2, 200);
                
                 Game.draw.drawImage(Game.assets.getAsset('Grafiken/zurück.png'), (Game.canvas.width -1800), 30);
            },
            update: function () {
                if (Game.input.clicked == true) {
                    if (Game.collision(Game.input, {
                            x: (Game.canvas.width - 400) / 2 + 200,
                            y: 404,
                            radius: 204
                        })) {
                        Game.scenes.current = 'game';
                    }
                    else  if (Game.collision(Game.input, {
                            x: Game.canvas.width - 1800+ 100,
                            y: 100,
                            radius: 100
                        })) {
                        location.href="../Hauptmenue/Levelauswahl.html";
                    }
                    Game.input.clicked = false;
                }
            }
        },
        game: {
            render: function () {
                for (var i = 0; i < Game.entities.entities.length - 1; i++) {
                    var ent = Game.entities.entities[i];
                    Game.draw.drawImage(Game.assets.getAsset(ent.asset), ent.x - ent.radius, ent.y - ent.radius);
                }
               var score = 'Score:' + Game.entities.score;
                Game.draw.text(score, 36, 36, 32, '#fff');

                var life = 'Life:' + Game.entities.life;
                Game.draw.text(life, 300, 36, 32, '#fff');
            },
            update: function () {
                for (var i = 0; i < Game.entities.entities.length; i++) {
                    Game.entities.entities[i].update();


                    if (Game.input.clicked == true) {
                        for (var j = 0; j < Game.entities.entities.length; j++) {

                        
                        if (Game.collision(Game.input, Game.entities.entities[j])) {
                            Game.entities.entities[j].remove = true;
                            Game.entities.score += 100;
                            var laser = new Audio();
                            laser.src="SoundA/laser.mp3";
                            laser.volume = 0.8;
                            laser.play();
                        }}
                        Game.input.clicked = false;
                    }

                    if (Game.entities.entities[i].remove == true) {
                        Game.entities.entities.splice(i, 1);
                        Game.entities.onScreen -= 1;
                    }

                }

                if (Game.entities.onScreen <= Game.entities.maxOnScreen && Game.entities.ticks >= 90) {
                    Game.entities.add();
                    Game.entities.ticks = 0;
                }

                Game.entities.ticks += 0.8;

               if(Game.entities.score > 1500 && Game.entities.score < 3000) {
                    Game.entities.ticks += 0.9;
                }
               else if(Game.entities.score > 3000 && Game.entities.score < 5000) {
                    Game.entities.ticks += 1.1;
                }
                else if(Game.entities.score > 5000 && Game.entities.score <12000) {
                    Game.entities.ticks += 1.2;
                }
                 else if(Game.entities.score > 12000 && Game.entities.score < 15000){
                    Game.entities.ticks += 1.3;
                }
                 else if(Game.entities.score > 15000 && Game.entities.score < 20000){
                    Game.entities.ticks += 1.6;
                }
                 else if(Game.entities.score > 20000){
                    Game.entities.ticks += 2;
                }
                 
                
                
                if (Game.entities.life == 0) {
                    Game.scenes.current = 'gameover';
                    var over = new Audio();
                    over.src = "SoundA/gameover.mp3";
                    over.play();
                }

            }

        },

        gameover: {
            render: function () {
                Game.draw.drawImage(Game.assets.getAsset('Grafiken/ende.png'), (Game.canvas.width - 400) / 2, 150);

               Game.draw.drawImage(Game.assets.getAsset('Grafiken/Hauptmenue3.png'), (Game.canvas.width -1800), 30);
                
                
                var score = 'Dein Score beträgt:' + Game.entities.score;
                 Game.draw.text(score, (Game.canvas.width - 500) / 2, 600, 40, '#fff');
            },
            update: function () {
                
                   if (Game.input.clicked == true) {
                            if (Game.collision(Game.input, {
                            x: Game.canvas.width - 1800+ 100,
                            y: 100,
                            radius: 100
                        })) {
                        location.href="../Hauptmenue/Menue.html";
                    }
                    Game.input.clicked = false;
                }
                
                

            }
                
            } 
            
    },
   
    //------------------------------------------------------------->   
    // Objekt Asteroid mit Array und Variablen für Score/ Leben / Anzahl der Objekte aufm Bildschrim
    entities: {
        ticks: 0,
        score: 0,
        life: 10,
        entities: new Array(),
        maxOnScreen: 20,
        onScreen: 0,

        add: function () {
            var object = {};
            var typ = Math.floor((Math.random() *11) + 1);

            
    //WPer Zufall ein Bild erscheinen lassen        
                if (typ == 1) {
                object.radius = 12;
                object.asset = 'Grafiken/Asteroid25x25.png';
            }

            if (typ == 2) {
                object.radius = 25;
                object.asset = 'Grafiken/Asteroid50x50.png';
            }

            if (typ == 3) {
                object.radius = 37;
                object.asset = 'Grafiken/Asteroid75x75.png';
            }

            if (typ == 4) {
                object.radius = 50;
                object.asset = 'Grafiken/Asteroid100x100.png';
            }
            
             if (typ == 5) {
                object.radius = 17;
                object.asset = 'Grafiken/alien35x35.png';
            }
             if (typ == 6) {
                object.radius = 25;
                object.asset = 'Grafiken/alien50x50.png';
            }
             if (typ == 7) {
                object.radius = 37;
                object.asset ='Grafiken/alien75x75.png';
            }
             if (typ == 8) {
                object.radius = 50;
                object.asset = 'Grafiken/alien100x100.png';
            }
            if (typ == 9) {
                object.radius = 30;
                object.asset = 'Grafiken/rakete60x60.png';
            }
            if (typ == 10) {
                object.radius = 40;
                object.asset = 'Grafiken/rakete80x80.png';
            }
            if (typ == 11) {
                object.radius = 50;
                object.asset = 'Grafiken/rakete100x100.png';
            }
            
            
            
            
            
            
            object.y = Math.floor((Math.random() * (Game.canvas.height - 100)) + 1) + 50;
            object.x = -650;
            
            if(Game.entities.score > 5000) {
                object.x = -800;
            }
            else if(Game.entities.score > 12000) {
                object.x = -1000;
            }
            
  
            
            
// Geschwindigkeit abhängig von der Punktzahl erhöhen
            
            object.dx =  Math.floor(Math.random() * (3 - 1)) + 1;

            if(Game.entities.score > 2000 && Game.entities.score < 4000) {
                object.dx =  Math.floor(Math.random() * (4 -2)) + 2;
            } 
            else if(Game.entities.score > 4000 && Game.entities.score < 5000) {
                object.dx = Math.floor(Math.random() * (5 - 3)) + 3;
            }
            else if(Game.entities.score > 5000 && Game.entities.score < 7000) {
                object.dx = Math.floor(Math.random() * (7 - 4)) +4;
            }
           else if(Game.entities.score > 7000 && Game.entities.score < 9000) {
                object.dx = Math.floor(Math.random() * (8 - 5)) +5;
            }
            else if(Game.entities.score > 9000 && Game.entities.score < 12000) {
                object.dx = Math.floor(Math.random() * (10 - 6)) +6;
            }
            else if(Game.entities.score > 12000 && Game.entities.score < 15000) {
                object.dx = Math.floor(Math.random() * (12-7)) +7;
            }
            else if(Game.entities.score > 15000) {
                object.dx = Math.floor(Math.random() * (13-10)) +10;
            }
            
            

            object.remove = false;

            object.update = function () {
                this.x += this.dx;

                
                
                
                if (this.x > Game.canvas.width + 50) {
                    this.remove = true;
                    Game.entities.life -= 1;
                    var minusleben = new Audio();
                    minusleben.src ="SoundA/loselife.mp3";
                    minusleben.play();
                }

            };
            object.index = Game.entities.entities.length;
            Game.entities.onScreen += 1;
            Game.entities.entities.push(object);
        }
    },
    //------------------------------------------------------------->   
    // Array und Funktionen, wie und wo Bilder geladen werden und wann alles fertig geladen ist
    assets: {
        list: new Array(),
        cache: new Array(),
        done: 0,

        addRessource: function (url) {
            Game.assets.list.push(url);
        },

        download: function () {
            for (var i = 0; i <= Game.assets.list.length - 1; i++) {
                var img = new Image();
                img.addEventListener('load', function () {
                    Game.assets.done++;
                }, false);

                var url = Game.assets.list[i];
                img.src = url;
                Game.assets.cache[url] = img;
            }
        },

        isDone: function () {
            if (Game.assets.done == Game.assets.list.length) {
                return true;
            }
            return false;
        },

        getAsset: function (url) {
            return Game.assets.cache[url];
        }
    },
    //------------------------------------------------------------->
    //Funktion zur Erkennung von einem Kreis-Objekt z.b. ->(a) und der Maus z.b. -> (b) 
    collision: function (a, b) {
        var distance_squared = (((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
        var radii_squared = (a.radius + b.radius) * (a.radius + b.radius);
        if (distance_squared < radii_squared) {
            return true;
        } else {
            return false;
        }
    }



    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    // Ende von var Game!!    
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

//EventListener
window.addEventListener('load', Game.init, false);
window.addEventListener('resize', Game.resize, false);
window.addEventListener('mousedown', Game.input.click, false);
