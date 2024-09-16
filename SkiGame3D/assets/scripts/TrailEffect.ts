import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("TrailEffect")
export class TrailEffect extends Component {
  @property(GameManager) gameManager: GameManager;
  @property(Prefab) entityPrefab: Prefab = null;
  @property(Node) targetNode: Node = null;
  @property(Number) trailLength: number = 20;
  @property(Number) trailDelay: number = 0.1;

  entityPool: Node[] = [];
  tempVec3 = new Vec3();
  trailTimer: number = 0;

  protected onLoad(): void {
    this.initializeTrail();
  }

  protected update(deltaTime: number): void {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;

    this.trailTimer += deltaTime;

    if (this.trailTimer >= this.trailDelay) {
      this.spawnEntity();
      this.trailTimer = 0;
    }
    this.moveEntities(deltaTime);
  }

  private initializeTrail() {
    for (let i = 0; i < this.trailLength; i++) {
      const entity = instantiate(this.entityPrefab);
      entity.setParent(this.node);
      entity.setPosition(new Vec3(0, 0, 0));
      entity.active = false;
      this.entityPool.push(entity);
    }
  }

  private spawnEntity() {
    if (this.entityPool.length === 0) return;

    const entity = this.entityPool.pop();
    const pos: Vec3 = this.targetNode.getPosition();
    pos.y = -0.035;
    entity.setPosition(pos);
    entity.active = true;
    this.entityPool.unshift(entity);
  }

  private moveEntities(deltaTime: number) {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    let speed: number = this.gameManager.gameSpeed;
    for (let i = 0; i < this.entityPool.length; i++) {
      const entity = this.entityPool[i];
      if (entity.active) {
        const pos = entity.getPosition();
        pos.z -= speed * deltaTime;

        entity.setPosition(pos);
      }
    }
  }

  public resetTrail() {
    this.entityPool.forEach((entity) => {
      entity.setPosition(new Vec3(0, 0, 0));
      entity.active = false;
    });
  }
}
