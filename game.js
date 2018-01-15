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
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
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
      throw new Error('Pos not Vector');
    }
    if (size instanceof Vector) {
    this.size = size;
    }
    else {
      throw new Error('size not Vector');
    }
    if (speed instanceof Vector) {
    this.speed = speed;
    }
    else {
      throw new Error('speed not Vector');
    }
  }
  act(){};
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
    return this.actors.find(el => el.isIntersect(actor));
  }
  obstacleAt(pos, size){
    if (!(pos instanceof Vector) || !(size instanceof Vector)) {
      throw new Error('arguments error');
    }
    let startX = Math.floor(pos.x);
    let endX   = Math.ceil(pos.x + size.x);
    let startY = Math.floor(pos.y);
    let endY   = Math.ceil(pos.y + size.y);
    if (startX < 0 || endX > this.width || startY < 0) {
      return 'wall';
    }
    if (endY > this.height) {
      return 'lava';
    }
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (this.grid[y][x]) {
          return this.grid[y][x];
        }
      }
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
  createGrid (plan) {
    return plan.map(lowerString => {
      return lowerString.split('').map(symbol => this.obstacleFromSymbol(symbol));
    });
  }
  createActors(plan){
    let actors = [];
    let splittedArr = plan.map(el => el.split(''));
    splittedArr.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (this.dictionary && this.dictionary[cell] && typeof this.dictionary[cell] === 'function') {
          let actor = new this.dictionary[cell] (new Vector(x, y));
          if (actor instanceof Actor) {
            actors.push(actor);
          }
        }
      });
    });
    return actors;
  }
  parse (plan) {
    return new Level (this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor (pos, speed) {
    super(pos);
    this.size = new Vector(1, 1);
    this.speed = speed;
  }
  get type () {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    return this.pos.plus(this.speed.times(time));
  }
  handleObstacle() {
    this.speed = this.speed.times(-1);
  }
  act(time, level){
    let nextPos = this.getNextPosition(time);
    if (level.obstacleAt(nextPos, this.size)){
      this.handleObstacle();
    } 
    else {
      this.pos = nextPos;
    }
  }
}

class HorizontalFireball extends Fireball{
  constructor(pos){
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball{
  constructor(pos){
    super(pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball{
  constructor(pos){
    super(pos,new Vector(0, 3));
    this.startPos = pos;
  }
  handleObstacle(){
    this.pos = this.startPos;
  }
}

class Coin extends Actor{
  constructor(pos = new Vector(0,0)){
    super(pos.plus(new Vector(0.2,0.1)), new Vector(0.6,0.6));
    this.post = this.pos;
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random()*(2*Math.PI);
  }

  get type(){
    return'coin';
  }

  updateSpring(time = 1){
    this.spring = this.spring + this.springSpeed * time;
  }

  getSpringVector(){
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1){
    this.updateSpring(time);
    return this.post.plus(this.getSpringVector());
  }

  act(time){
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor{
  constructor(pos = new Vector(0,0)){
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
  }

  get type(){
    return 'player';
  }
}

const actorDict = {
  '@': Player,
  'v': FireRain,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'o': Coin
};

const parser = new LevelParser(actorDict);

const schemas = [
  [
    '         ',
    '         ',
    '    =    ',
    '       o ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];

runGame(schemas, parser, DOMDisplay)
.then(() => console.log('Вы выиграли приз!'));


