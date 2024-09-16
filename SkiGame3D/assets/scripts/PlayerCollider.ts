import { _decorator, BoxCollider, Component, ICollisionEvent } from "cc";
import { UIManager } from "./UIManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerCollider")
export class PlayerCollider extends Component {
  @property(UIManager) uIManager: UIManager = null;

  public start() {
    let collider = this.node.getComponent(BoxCollider);
    collider.on("onTriggerEnter", this.onCollisionEnter, this);
  }

  private onCollisionEnter(event: ICollisionEvent) {
    this.uIManager.handleEndScreen();
  }
}
