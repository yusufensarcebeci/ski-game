import { _decorator, Component, Node, UITransform, view } from 'cc';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(GameManager) gameManager: GameManager = null;
  
    @property(Node) loadingScreen: Node = null;
    @property(Node) initScreen: Node = null;
    @property(Node) gameScreen: Node = null;
    @property(Node) endScreen: Node = null;
  
    @property(Node) touchArea: Node = null;
    @property(Node) load: Node = null;
    @property(Node) loadingScreenBackground: Node = null;
  
    protected onLoad(): void {
      this.loadingScreenBackground
        .getComponent(UITransform)
        .setContentSize(
          view.getVisibleSize().width,
          view.getVisibleSize().height
        );
      this.handleLoading();
      this.scheduleOnce(() => {
        this.handleInitScreen();
      }, 2);
    }
    private onHomeButtonClicked() {
      this.scheduleOnce(() => {
        this.handleLoading();
      });
      this.scheduleOnce(() => {
        this.handleInitScreen();
      }, 2);
    }
  
    private onPlayButtonClicked() {
      this.handleGameScreen();
    }
  
    private onRetryButtonClicked() {
      this.scheduleOnce(() => {
        this.handleLoading();
      });
      this.scheduleOnce(() => {
        this.onPlayButtonClicked();
      }, 2);
    }
  
    public handleGameScreen() {
      this.hideAllScreens();
      if (this.gameScreen) {
        this.gameScreen.active = true;
        this.touchArea.active = true;
        this.gameManager.setState(GameState.GAME_RUNNING);
      }
    }
  
    public handleEndScreen() {
      this.hideAllScreens();
      this.scheduleOnce(() => {
        if (this.endScreen) {
          this.endScreen.active = true;
          this.touchArea.active = false;
          this.gameManager.setState(GameState.GAME_OVER);
        }
      }, 1);
    }
  
    public handleInitScreen() {
      this.hideAllScreens();
      if (this.initScreen) {
        this.initScreen.active = true;
        this.touchArea.active = false;
        this.gameManager.setState(GameState.INIT);
      }
    }
  
    public handleLoading() {
      this.hideAllScreens();
      if (this.loadingScreen) {
        this.loadingScreen.active = true;
        this.gameManager.setState(GameState.LOADING);
      }
    }
  
    private hideAllScreens() {
      if (this.loadingScreen) this.loadingScreen.active = false;
      if (this.initScreen) this.initScreen.active = false;
      if (this.gameScreen) this.gameScreen.active = false;
      if (this.endScreen) this.endScreen.active = false;
    }
  
    private rotateLoadSprite(dt: number) {
      if (!this.load) return;
      let rotZ = this.load.eulerAngles.z;
      this.load.setRotationFromEuler(0, 0, rotZ - dt * 200);
    }
  
    protected update(dt: number): void {
      let activity = this.loadingScreen.active;
      if (activity) {
        this.rotateLoadSprite(dt);
      }
    }
}


