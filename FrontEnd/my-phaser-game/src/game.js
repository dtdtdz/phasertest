import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';

function Game() {
    const [game, setGame] = useState(null); // Phaser 게임 인스턴스를 상태로 관리
    const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리


  useEffect(() => {
    // 웹소켓 연결 설정
    const websocket = new WebSocket("ws://localhost:8080/ws");
    setWs(websocket);

    let pos = [0,0];
    let isChanged = false;
    websocket.onopen = () => {
      console.log('WebSocket 연결 성공');
      
      const buffer = new ArrayBuffer(100); // 예를 들어, 4바이트 크기의 ArrayBuffer
      const uint8View = new Uint8Array(buffer);
      uint8View[0] = 1;
      websocket.send(buffer);
    };

    websocket.onmessage = (event) => {
      // 서버로부터 메시지 수신 시 로직
      console.log('서버로부터 메시지 수신:', event.data);
      pos = event.data.split(',');
      isChanged = true;
    };

    websocket.onerror = (error) => {
      console.error('WebSocket 오류 발생:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    if (!game) { 
    let player;
    let cursors;

    const moveto = (sprite, targetX, targetY, duration = 10) => {
      sprite.scene.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        ease: 'Power1',
        duration: duration,
        onComplete: function () { console.log('Movement completed!'); }
    });
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: function() {
          this.load.image('sky', 'assets/sky.png');
          this.load.image('ground', 'assets/platform.png');
          this.load.image('star', 'assets/star.png');
          this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        },
        create: function() {
          this.add.image(400, 300, 'sky');
          const platforms = this.physics.add.staticGroup();
          platforms.create(400, 568, 'ground').setScale(2).refreshBody();
          platforms.create(600, 400, 'ground');
          platforms.create(50, 250, 'ground');
          platforms.create(750, 220, 'ground');

          player = this.physics.add.sprite(100, 450, 'dude');
        //   player.setBounce(0.2);
        //   player.setCollideWorldBounds(true);

          this.physics.add.collider(player, platforms);

          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          });

          this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
          });

          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
          });

          cursors = this.input.keyboard.createCursorKeys();
        },
        update: function() {

          if (isChanged){
            moveto(player, pos[0], pos[1]);
            isChanged = false;
          }
          // player.setPosition(pos[0], pos[1]);
            // console.log(`Player position - x: ${player.x}, y: ${player.y}`);
            if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
            if (websocket.readyState === WebSocket.OPEN) {
              websocket.send('left'+pos[0]);
            }
          } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
          } else {
            player.setVelocityX(0);
            player.anims.play('turn');
          }

          if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
          }
        }
      }
    };
    const newGame = new Phaser.Game(config);
    setGame(newGame);

    
        return () => {
          newGame.destroy(true);
        //   setGame(null)
        };
    }
  }, []);

  return <div id="game-container"></div>;
}

export default Game;
