import { _decorator, clamp, Component, EventTouch, math, Node, UITransform, Vec3, view } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(Number) horizontalSpeed: number = 22; // X eksenindeki hız
  @property(Number) verticalSpeed: number = 20; // Z eksenindeki hız
  @property(Number) turnSpeed: number = 5; // Dönüş hızını kontrol eder (ivme için)

  @property(Node) touchArea: Node = null;

  private direction: number = 1; // Sağ için 1, sol için -1
  private targetDirection: number = 1;
  private currentSpeed: number = 0;

  onLoad() {
    this.touchArea
      .getComponent(UITransform)
      .setContentSize(
        view.getVisibleSize().width * 2,
        view.getVisibleSize().height * 2
      );
    this.touchArea.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  private onTouchStart(event: EventTouch) {
    this.targetDirection = -this.targetDirection;
  }

  private movePlayer(dt: number) {
    this.currentSpeed = math.lerp(
      this.currentSpeed,
      this.targetDirection * this.horizontalSpeed,
      this.turnSpeed * dt
    );

    const currentPos = this.node.getPosition();
    const newX = clamp(currentPos.x + this.currentSpeed * dt, -14, 14);

    this.node.setPosition(new Vec3(newX, currentPos.y, currentPos.z));
  }

  protected update(dt: number) {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    this.movePlayer(dt);

    // Z ekseninde sürekli ileri gitme
    // const currentPos = this.node.getPosition();
    // const newZ = currentPos.z + this.verticalSpeed * dt;
    // this.node.setPosition(new Vec3(currentPos.x, currentPos.y, newZ));
  }
}
