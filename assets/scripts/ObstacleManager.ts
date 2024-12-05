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
  @property(Number) poolSize: number = 200;
  @property(Number) duration: number = 5;

  private obsPool: Node[] = [];
  private spawnPosY: number = 0.5;
  private spawnTimer: number = 0;

  protected onLoad(): void {
    this.initializeObstaclePool();
  }

  protected start(): void {
    this.initializeScene();
  }

  public initializeScene() {
    for (let i = 0; i < this.poolSize / 5; i++) {
      const obstacle = this.getObstacleFromPool();
      obstacle.active = true;
      obstacle.setPosition(
        new Vec3(
          this.getRandomInRange(this.obsPosXMax, this.obsPosXmin),
          this.spawnPosY,
          this.getRandomInRange(100, 6)
        )
      );
      const scale = this.getRandomInRange(this.obsScaleMin, this.obsScaleMax);
      obstacle.setScale(new Vec3(scale, scale, scale));
    }
  }

  private getObstacleFromPool(): Node {
    const obstacle = this.obsPool.pop();
    if (obstacle) {
      return obstacle;
    } else {
      // console.log("error: no obstacle");
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
          this.getRandomInRange(120, 7)
        )
      );
      obstacle.active = false;
      this.obsPool.push(obstacle);
    }
  }

  private getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private spawnObstacle() {
    const obstacle = this.getObstacleFromPool();
    if (!obstacle) return;
    obstacle.active = true;
    obstacle.setPosition(
      new Vec3(
        this.getRandomInRange(this.obsPosXMax, this.obsPosXmin),
        this.spawnPosY,
        this.getRandomInRange(30, 22)
      )
    );
    const scale = this.getRandomInRange(this.obsScaleMin, this.obsScaleMax);
    obstacle.setScale(new Vec3(scale, scale, scale));
  }

  private verticalMove(dt: number) {
    this.node.children.forEach((obstacle: Node) => {
      const obstaclePos = obstacle.getPosition();
      const newZ = obstaclePos.z - this.gameManager.gameSpeed * dt;

      obstacle.setPosition(new Vec3(obstaclePos.x, obstaclePos.y, newZ));

      if (newZ < -40) {
        const spawnX = this.getRandomInRange(this.obsPosXmin, this.obsPosXMax);
        const scale = this.getRandomInRange(this.obsScaleMin, this.obsScaleMax);
        obstacle.setPosition(
          new Vec3(spawnX, this.spawnPosY, this.getRandomInRange(30, 22))
        );
        obstacle.setScale(new Vec3(scale, scale, scale));
      }
    });
  }

  private updateSpawnTimer(dt: number) {
    this.spawnTimer += dt;
    if (this.spawnTimer > this.duration) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }
  }

  protected update(dt: number): void {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    this.verticalMove(dt);
    this.updateSpawnTimer(dt);
  }

  private resetObstacles() {
    this.node.children.forEach((obstacle: Node) => {
      obstacle.active = false;
      this.obsPool.push(obstacle);
    });

    for (let i = 0; i < this.poolSize / 5; i++) {
      const obstacle = this.getObstacleFromPool();
      if (obstacle) {
        obstacle.active = true;
        obstacle.setPosition(
          new Vec3(
            this.getRandomInRange(this.obsPosXMax, this.obsPosXmin),
            this.spawnPosY,
            this.getRandomInRange(120, 7)
          )
        );
        const scale = this.getRandomInRange(this.obsScaleMin, this.obsScaleMax);
        obstacle.setScale(new Vec3(scale, scale, scale));
      }
    }
  }
}
