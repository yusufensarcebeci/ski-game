import { _decorator, clamp, Component, math, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("Camera")
export class Camera extends Component {
    @property(Node) target: Node = null;  
    @property(Number) xMin: number = -8;  // minimum sınır
    @property(Number) xMax: number = 8;   // maksimum sınır
    @property(Number) smoothTime: number = 0.05;  
  
    tempPosition: Vec3 = new Vec3();
  
    private smoothFollow(offsetY: number, offsetZ: number, deltaTime: number) {
      const targetX = this.target.position.x;  
      const targetY = this.target.position.y + offsetY;
      const targetZ = this.target.position.z + offsetZ;
  
      const currentX = this.node.position.x;
      const currentY = this.node.position.y;
      const currentZ = this.node.position.z;
  
      // X ekseninde smooth takip ve sınırlandırma
      let smoothX = math.lerp(currentX, targetX, this.smoothTime / 5);
      smoothX = clamp(smoothX, this.xMin, this.xMax);  
  
      // Y ve Z eksenlerinde smooth takip
      const smoothY = math.lerp(currentY, targetY, this.smoothTime);
      const smoothZ = math.lerp(currentZ, targetZ, this.smoothTime);
  
      this.node.setPosition(smoothX, smoothY, smoothZ);
    }
  
    protected update(deltaTime: number) {
      if (this.target) {
        this.smoothFollow(15, 14, deltaTime);
      }
    }
}


