import { _decorator, Component, Label, Node } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("ScoreHandler")
export class ScoreHandler extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(Node) scoreLabel: Node = null;
  @property(Node) gameOverScoreLabel: Node = null;
  @property(Number) incrementInterval: number = 0.1;

  public score: number = 0;
  private elapsedTime: number = 0;

  public getScore() {
    return this.score;
  }

  public resetScore() {
    this.score = 0;
    return this.score;
  }

  protected update(dt: number) {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;

    this.elapsedTime += dt;
    if (this.elapsedTime >= this.incrementInterval) {
      this.elapsedTime -= this.incrementInterval;
      this.incrementScore();
      this.updateScoreLabel();
      this.updategameOverScoreLabel();
    }
  }

  private incrementScore() {
    this.score += 1;
  }

  private updateScoreLabel() {
    if (this.scoreLabel) {
      const label = this.scoreLabel.getComponent(Label);
      if (label) {
        label.string = `${this.score}`;
      }
    }
  }

  public updategameOverScoreLabel() {
    if (this.gameOverScoreLabel) {
      const label = this.gameOverScoreLabel.getComponent(Label);
      if (label) {
        label.string = `Your Score: ${this.score}`;
      }
    }
  }
}
