import { _decorator, Component, Node } from 'cc';
import { GameState } from '../enums/GameState';
const { ccclass, property } = _decorator;

export class GameStateManager {
    private static currentState: GameState = GameState.INIT;
  
    static getCurrentState(): GameState {
      return this.currentState;
    }
  
    static setCurrentState(state: GameState): void {
      this.currentState = state;
      console.log(`Game State Updated: ${state}`);
    }
  }


