"use strict";
import { Sprite } from "pixi.js";
export class Player {
  //icon: Sprite;
  sprite: Sprite;
  color: string = "0xffffff";
  id: number;
  x: number;
  y: number;
  constructor(
    playerID: number,
    playerColor: string,
    playerSprite: Sprite,
    startX: number,
    startY: number
  ) {
    this.id = playerID;
    this.color = playerColor;
    this.sprite = playerSprite;
    this.x = startX;
    this.y = startY;
  }
}
