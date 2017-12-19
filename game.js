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
      Object.defineProperty(this, 'type', {
        value : 'actor',
        writable: false,
        configurable: false
      });
      Object.defineProperty(this, 'left', {
        value : pos.x,
        writable: false,
        configurable: false
      });
      Object.defineProperty(this, 'top', {
        value : pos.y,
        writable: false,
        configurable: false
      });
      Object.defineProperty(this, 'right', {
        value : pos.x + size.x,
        writable: false,
        configurable: false
      });
      Object.defineProperty(this, 'bottom', {
        value : pos.y + size.y,
        writable: false,
        configurable: false
      });
    }
    isIntersect(actor){
        if (actor instanceof Actor) {
            if (this === actor) {
                return false;
            }
            if (this.left != actor.left && this.top != actor.top && this.right != actor.right && this.bottom != actor.bottom) {
                return false;
            }
            if (this.left == actor.left || this.top == actor.top || this.right == actor.right || this.bottom == actor.bottom) {
                return false;
            }
        }
        else {
            throw Error('NOT ACTOR');
        }
    }   
}