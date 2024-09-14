import { _decorator, Component, Enum, Node } from "cc";
const { ccclass, property } = _decorator;
export enum GameState {
  LOADING,
  INIT,
  GAME_RUNNING,
  GAME_OVER,
}
@ccclass("GameManager")
export class GameManager extends Component {
  @property(Number) gameSpeed: number = 1;
  @property({ type: Enum(GameState) })
  public currentState: GameState = GameState.LOADING;

  public setState(newState: GameState) {
    this.currentState = newState;
    console.warn("Current Game State: ", GameState[this.currentState]);
  }

  public getState() {
    return this.currentState;
  }
}
