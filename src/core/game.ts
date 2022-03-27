
import { Renderer } from "../renderer/renderer";
import { Btc } from "./Entities/bitcoin";
import { Earth } from "./Entities/earth";
import { allState } from "./Entities/entity";
import { UnitManager } from "./Entities/unitmanager";
import { AudioManager } from "./sound/soundManager";


const SPAWN_BTC_X = 200;
const SPAWN_BTC_Y = 200;
export const SOUNDS_MAP = {
  tk1: 'tk1.mp3',
  tk2: 'tk2.mp3',

}

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  renderer: Renderer;
  btc: Btc;
  unitManager: UnitManager;
  earth: Earth
  audio: AudioManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.earth = new Earth((canvas.width / 2), (canvas.height / 2));
    this.btc = new Btc(SPAWN_BTC_X, SPAWN_BTC_Y);
    this.unitManager = new UnitManager(this.renderer.btnRenderer.getUnitsBtnsBounding(), this.canvas, this.earth);
    this.audio = new AudioManager(SOUNDS_MAP);
  }

  async init() {
    await this.audio.init();
  }

  update(delta: number) {
    let btc_atck = false;
    // Logic
    this.btc.update(this.earth, delta);

    this.unitManager.getUnits().forEach(element => {
      if (!btc_atck && this.btc.canAttack(element))
      {
        this.btc.attack(element);
        btc_atck = true;
        console.log(element.state);
      }

      if (!element.canAttack(this.earth)) {
        element.moove(this.earth.x, this.earth.y, delta);
      }
      else
        ;// TO DO ATTACK EARTH
    });
    // Render
    this.renderer.renderBackground();
    this.renderer.renderEarth(this.earth);
    this.renderer.renderUnitBtn();
    this.renderer.renderNfts(this.unitManager.getUnits());
    this.renderer.renderBtc(this.btc)
  }
}
