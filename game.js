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
    if (!(actor instanceof Actor) || actor === undefined) {
      throw new Error('actor NOT ACTOR');
    }
    if ((actor === this) || (actor.left >= this.right) || (actor.right <= this.left) || (actor.top >= this.bottom) || (actor.bottom <= this.top)) {
      return false;
    }
      return true;
  }
}
class Level {
  constructor (grid, actors) {
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
  actorAt(actor) {
    if (actor === undefined || !(actor instanceof Actor)) {
      throw new Error(`actor NOT from Actors`);
    }
    else {
      if (this.length === 0) {
        return undefined;
      }
    }
  }
}