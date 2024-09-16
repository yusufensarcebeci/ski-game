import {
  _decorator,
  clamp,
  Component,
  EventTouch,
  math,
  Node,
  UITransform,
  Vec3,
  view,
} from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(Number) horizontalSpeed: number = 22;
  @property(Number) verticalSpeed: number = 20;
  @property(Number) turnSpeed: number = 5;
  @property(Number) rotationSpeed: number = 5;
  @property(Node) touchArea: Node = null;

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
      this.targetDirection * this.horizontalSpeed * this.gameManager.gameSpeed,
      this.turnSpeed * dt
    );

    const currentPos = this.node.getPosition();
    const newX = clamp(currentPos.x + this.currentSpeed * dt , -14, 14);

    this.node.setPosition(new Vec3(newX, currentPos.y, currentPos.z));

    this.rotatePlayer(dt);
  }

  private rotatePlayer(dt: number) {
    const currentEuler = this.node.eulerAngles;

    const newYRotation = math.lerp(
      currentEuler.y,
      this.targetDirection * 25,
      this.rotationSpeed * dt
    );

    this.node.setRotationFromEuler(0, newYRotation, 0);
  }

  protected update(dt: number) {
    if (this.gameManager.currentState != GameState.GAME_RUNNING) return;
    this.movePlayer(dt);
  }

  private resetPlayer() {
    const vec3 = new Vec3(0, 0, 0);
    this.node.setRotationFromEuler(vec3);
    this.node.setPosition(vec3);
    this.currentSpeed = 0;
  }
}
