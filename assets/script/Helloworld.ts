const { ccclass, property } = cc._decorator;
import { downloadImg, screenshot } from "./utils";

@ccclass
export default class Helloworld extends cc.Component {
  @property(cc.Node)
  background: cc.Node = null;

  @property(cc.Node)
  public shotBtn: cc.Node = null;

  @property(cc.Node)
  public downloadBtn: cc.Node = null;

  start() {
    // init logic
    this.shotBtn.on("click", () => {
      const sprite = screenshot(this.background);
    });

    this.downloadBtn.on("click", () => {
      downloadImg(this.background);
    });
  }
}
