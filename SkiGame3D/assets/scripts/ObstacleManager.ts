import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("ObstacleManager")
export class ObstacleManager extends Component {
  @property(GameManager) gameManager: GameManager = null;

  @property(Prefab) obsPrefab: Prefab = null;
  @property(Number) obsPosXMax: number = 12;
  @property(Number) obsPosXmin: number = -12;
  @property(Number) obsScaleMax: number = 1.3;
  @property(Number) obsScaleMin: number = 0.9;

  @property(Number) poolSize: number = 500;

  private obsPool: Node[] = [];
  private spawnPosY: number = 0.5;

  protected onLoad(): void {
    this.initializeObstaclePool();
  }

  protected start(): void {
    this.initializeScene();
  }

  public initializeScene() {
    for (let i = 0; i < 250; i++) {
      const obstacle = this.getObstacleFromPool();
      obstacle.active = true;
      obstacle.setPosition(
        new Vec3(
          this.getRandomInRange(this.obsPosXMax, this.obsPosXmin),
          this.spawnPosY,
          this.getRandomInRange(150, 8)
        )
      );
      const scale = this.getRandomInRange(this.obsScaleMin,this.obsScaleMax)
      obstacle.setScale(new Vec3(scale, scale, scale))
    }
  }

  private getObstacleFromPool(): Node {
    const obstacle = this.obsPool.pop();
    if (obstacle) {
      return obstacle;
    } else {
      console.log("error: no obstacle");
    }
  }

  private initializeObstaclePool() {
    for (let i = 0; i < this.poolSize; i++) {
      let obstacle = instantiate(this.obsPrefab);
      obstacle.setParent(this.node);
      obstacle.setPosition(
        new Vec3(
          this.getRandomInRange(this.obsPosXMax, this.obsPosXmin),
          this.spawnPosY,
          this.getRandomInRange(15, 5)
        )
      );
      obstacle.active = false;
      this.obsPool.push(obstacle);
    }
  }

  private getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private verticalMove(dt: number) {
    this.node.children.forEach((obstacle: Node) => {
      const obstaclePos = obstacle.getPosition();
      const newZ = obstaclePos.z - this.gameManager.gameSpeed * dt;

      obstacle.setPosition(new Vec3(obstaclePos.x, obstaclePos.y, newZ));

      if (newZ < -40) {
        const spawnX = this.getRandomInRange(this.obsPosXmin, this.obsPosXMax);
        const scale = this.getRandomInRange(this.obsScaleMin, this.obsScaleMax);
        obstacle.setPosition(new Vec3(spawnX, this.spawnPosY, 22));
        obstacle.setScale(new Vec3(scale, scale, scale));
      }
    });
  }

  protected update(dt: number): void {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    this.verticalMove(dt);
  }
}
