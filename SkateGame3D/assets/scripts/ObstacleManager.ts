import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("ObstacleManager")
export class ObstacleManager extends Component {
  @property(GameManager) gameManager: GameManager = null;

  @property(Prefab) obsPrefab: Prefab = null;
  @property(Number) obsXMax: number = 12;
  @property(Number) obsXmin: number = -12;
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
    for (let i = 0; i < 150; i++) {
      const obstacle = this.getObstacleFromPool();
      obstacle.active = true;
      obstacle.setPosition(
        new Vec3(
          this.getRandomInRange(this.obsXMax, this.obsXmin),
          this.spawnPosY,
          this.getRandomInRange(150, 9)
        )
      );
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
          this.getRandomInRange(this.obsXMax, this.obsXmin),
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
        const spawnX = this.getRandomInRange(this.obsXmin, this.obsXMax);
        obstacle.setPosition(new Vec3(spawnX, this.spawnPosY, 22));
      }
    });
  }

  protected update(dt: number): void {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    this.verticalMove(dt);
  }
}
