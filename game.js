'use strict';
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (vector instanceof Vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }
    else {
      throw Error('Можно прибавлять к вектору только вектор типа Vector');
    }
  }
  times(multiplier) {
    return new Vector(this.x*multiplier, this.y*multiplier);
  }
}

class Actor {
  constructor(pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
    if (pos instanceof Vector) {
    this.pos = pos;
    }
    else {
    throw Error('Pos not Vector');
    }
    if (size instanceof Vector) {
    this.size = size;
    }
    else {
      throw Error('size not Vector');
    }
    if (speed instanceof Vector) {
    this.speed = speed;
    }
    else {
      throw Error('speed not Vector');
    }
    this.act = function act(){};
  }
  get type() {
    return 'actor';
  }
  get left() {
    return this.pos.x;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get top() {
    return this.pos.y;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
  isIntersect(actor) {
    if (!(actor instanceof Actor)) {
      throw new Error('actor NOT ACTOR');
    }
    if ((actor === this) || (actor.left >= this.right) || (actor.right <= this.left) || (actor.top >= this.bottom) || (actor.bottom <= this.top)) {
      return false;
    }
      return true;
  }
}
class Level {
  constructor (grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    if (grid === undefined) {
      this.height = 0;
      this.width = 0;
    } else {
      this.height = grid.length;
      this.width = Math.max(0, ...this.grid.map(element => element.length));
    }
    this.status = null;
    this.finishDelay = 1;
  }
  get player() {
    return this.actors.find(actor => actor.type === 'player');
  }
  isFinished() {
    if (this.status !== null && this.finishDelay < 0) {
      return true;
    }
    else {
      return false;
    }
  }
  actorAt(actor){
    if (!(actor instanceof Actor)) {
      throw new Error('arguments error');
    }
    if (this.actors.length <= 1) {
        return undefined;
    }
    else {
      for (let i = 0; i < this.actors.length; i++) {
        if (this.actors[i].isIntersect !== undefined) {
          if (this.actors[i].isIntersect(actor) === true) {
            return this.actors[i];
          }
        }
      }  
    }
  }
  obstacleAt(newPos, size) {
    if ((newPos.y < 0) || (newPos.x < 0) || ((newPos.x + size.x) > this.width))  {
      return 'wall';
    }
    else if ((newPos.y + size.y) > (this.height)) {
      return 'lava';
    }
    let topLeft = new Vector(Math.floor(newPos.x), Math.floor(newPos.y)),
        topRight = new Vector(Math.ceil(newPos.x + size.x - 1), Math.floor(newPos.y)),
        bottomLeft = new Vector(Math.floor(newPos.x), Math.ceil(newPos.y + size.y - 1)),
        bottomRight = new Vector(Math.ceil(newPos.x + size.x -1), Math.ceil(newPos.y + size.y -1)),
        dots = [],
        horDots = topRight.x - topLeft.x,
        vertDots = bottomLeft.y - topLeft.y;
    for (let i = topLeft.y; (i <= vertDots + topLeft.y); i++) {
        for (let j = topLeft.x; (j <= horDots + topLeft.x); j++) {
          dots.push(this.grid[i][j]);
        }
    }
    if (dots.includes('lava')) {
      return 'lava';
    }
    if (dots.includes('wall')) {
      return 'wall';
    }
  }
  removeActor(actor) {
    this.actors = this.actors.filter(el => el !== actor);
  }
  noMoreActors(typeString) {
    if (this.actors.length === 0) {
      return true;
    }
    if  (this.actors.find(el => el.type === typeString) === undefined) {
      return true;
    }
    else {
      return false;
    }
  }
  playerTouched(typeString, actor) {
    if ((typeString == 'lava') || (typeString == 'fireball')) {
      this.status = 'lost';
    }
    if ((typeString == 'coin') && (actor.type == 'coin')) {
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}
class LevelParser {
  constructor (dictionary) {
    this.dictionary = dictionary;
  }
  actorFromSymbol (dictionarySymbol) {
    if (dictionarySymbol === undefined) {
      return undefined;
    }
    else {
      return this.dictionary[dictionarySymbol];
    }
  }
    obstacleFromSymbol (symbol) { 
      switch (symbol) {
        case 'x' :
          return 'wall';
        case '!' :
          return 'lava';
        default :
          return undefined;
      }
    }
    createGrid (levelString) {
      if ((levelString === undefined) || (levelString == []) ) {
        return [];
      }
      
      let newLevelString = levelString.map(function(lowerString) {
        let symbolArray = lowerString.split('');
        for (let i = 0; i < symbolArray.length; i++) {
          symbolArray[i] = this.obstacleFromSymbol(symbolArray[i]);
        }
        return symbolArray;
      });
      return newLevelString;  
    });
  }
}
