"use strict";
import { Application, Sprite, Container, Graphics } from "pixi.js";
import { GameTile } from "./GameTile";
import { Player } from "./Player";

//create pixi.js application for rendering
const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  resizeTo: document.getElementById("pixi-content") as HTMLCanvasElement,
});

//create container for game elements
const conty: Container = new Container();
app.stage.addChild(conty);

//create game grid
const tileSize = 100;
const gridRowCount = 9;
const gameTiles: GameTile[][] = [];

for (let i = 0; i < gridRowCount; i++) {
  gameTiles[i] = [];
}

for (let i = 0; i < gridRowCount * gridRowCount; i++) {
  const tileColumn = i % gridRowCount;
  const tileRow = Math.floor(i / gridRowCount);

  const tile: Sprite = Sprite.from(
    "https://lh3.googleusercontent.com/61Nza9pnCkEGDH42MiFB4khcy796SpdmcMASHFZviSkGpWm7AczBVfs7lAp5pSA5WMCJSPwuWOR_pQPjeeJP"
  );
  tile.width = tileSize;
  tile.height = tileSize;
  tile.x = tileColumn * tileSize;
  tile.y = Math.floor(tileRow) * tileSize;
  tile.anchor.set(0.5);
  conty.addChild(tile);

  const gameTile: GameTile = new GameTile(tile, tileRow, tileColumn);
  gameTiles[tileColumn][tileRow] = gameTile;
  tile.interactive = false;
  tile.addEventListener("pointertap", function () {
    console.log(gameTile, gameTile.tileSprite.getBounds());
    MovePlayerTo(
      playerList[currentActivePlayerID],
      gameTile.tileColumn,
      gameTile.tileRow
    );
  });
}
//set the pivot
conty.pivot.set((gridRowCount / 2 - 0.5) * tileSize);
conty.position.set(app.screen.width / 2, 450);

//draw the pivot
const pivot: Graphics = new Graphics();
pivot.beginFill(0xff00ff);
pivot.drawCircle(conty.pivot.x, conty.pivot.y, 20);
pivot.endFill();
conty.addChild(pivot);

//implement responsive grid position
function ResizeStageContent() {
  conty.position.set(app.screen.width / 2, 500);
}

let lastWidth: number = window.innerWidth;
let lastHeight: number = window.innerHeight;
ResizeStageContent();

setInterval(() => {
  if (window.innerWidth != lastWidth || window.innerHeight != lastHeight) {
    ResizeStageContent();
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
  }
}, 150);

//instantiate Players
const playerList: Player[] = [];

const Sprite1: Sprite = Sprite.from("./png/defaultPlayer1.png");
const Sprite2: Sprite = Sprite.from("./png/defaultPlayer2.png");

let currentActivePlayerID: number = 0;
const middleTile: number = Math.floor(gridRowCount / 2);
playerList.push(new Player(1, "0x00ff00", Sprite1, middleTile, 0));
playerList.push(
  new Player(2, "0xff00f0", Sprite2, middleTile, gridRowCount - 1)
);

//set up player in-game representation
playerList.forEach((player) => {
  player.sprite.width = tileSize / 1.3;
  player.sprite.height = tileSize / 1.3;
  player.sprite.anchor.set(0.5);
  conty.addChild(player.sprite);
  player.sprite.position.set(tileSize * player.x, tileSize * player.y);
});

//movement
function MovePlayerTo(player: Player, xPos: number, yPos: number) {
  player.sprite.position.set(xPos * tileSize, yPos * tileSize);
  player.x = xPos;
  player.y = yPos;
  ProgressTurn();
}

//turn progression

function ProgressTurn() {
  currentActivePlayerID =
    playerList.length - 1 > currentActivePlayerID
      ? currentActivePlayerID + 1
      : 0;
  UpdateGrid();
}

//updating grid UI and interactivity
let playerTile: GameTile;
let elegiblePlayerMovementTiles: GameTile[] = [];

function UpdateGrid() {
  const activePlayer = playerList[currentActivePlayerID];
  elegiblePlayerMovementTiles.forEach((tile) => {
    ResetTile(tile);
  });
  if (Boolean(playerTile)) {
    ResetTile(playerTile);
  }
  elegiblePlayerMovementTiles = [];
  function ResetTile(tile: GameTile) {
    tile.tileSprite.tint = 0xffffff;
    tile.tileSprite.interactive = false;
  }
  elegiblePlayerMovementTiles.concat(
    CheckSurroundingTilesForMovementElegibility(playerTile)
  );
  elegiblePlayerMovementTiles.forEach((tile) => {
    tile.tileSprite.tint = 0xfffff;
    tile.tileSprite.interactive = true;
  });
  playerTile = gameTiles[activePlayer.x][activePlayer.y];
  playerTile.tileSprite.tint = 0x00ff00;
}
UpdateGrid();

function CheckSurroundingTilesForMovementElegibility(origin: GameTile) {
  const validTiles: GameTile[] = [];

  function IsTileValid(x: number, y: number) {
    if (x < gameTiles.length && y < gameTiles.length && x >= 0 && y >= 0) {
      validTiles.push(gameTiles[x][y]);
    }
  }
  IsTileValid(origin.tileColumn + 1, origin.tileRow);
  IsTileValid(origin.tileColumn - 1, origin.tileRow);
  IsTileValid(origin.tileColumn, origin.tileRow + 1);
  IsTileValid(origin.tileColumn, origin.tileRow - 1);

  return validTiles;
}
