"use strict";
import { Sprite } from "pixi.js";

export class GameTile {
  tileSprite: Sprite;
  tileRow: number = -1;
  tileColumn: number = -1;
  isAccessible: boolean = false;

  constructor(sprite: Sprite, row: number, column: number) {
    this.tileSprite = sprite;
    this.tileRow = row;
    this.tileColumn = column;
  }
}
