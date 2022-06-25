export const screenshot = (node: cc.Node) => {
  let nodeCamera = new cc.Node();
  nodeCamera.parent = cc.find("Canvas");
  let camera = nodeCamera.addComponent(cc.Camera);

  let position = node.getPosition();
  let width = node.width;
  let height = node.height;

  // 当 alignWithScreen 为 true 的时候，摄像机会自动将视窗大小调整为整个屏幕的大小。如果想要完全自由地控制摄像机，则需要将 alignWithScreen 设置为 false。（v2.2.1 新增）
  camera.alignWithScreen = false;
  // 设置摄像机的投影模式是正交（true）还是透视（false）模式
  camera.ortho = true;
  // 摄像机在正交投影模式下的视窗大小。该属性在 alignWithScreen 设置为 false 时生效。
  camera.orthoSize = height / 2;

  let texture = new cc.RenderTexture();
  // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
  texture.initWithSize(width, height, cc.game["_renderContext"].STENCIL_INDEX8);

  // 如果设置了 targetTexture，那么摄像机渲染的内容不会输出到屏幕上，而是会渲染到 targetTexture 上。
  camera.targetTexture = texture;

  node.setPosition(cc.Vec2.ZERO);
  // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
  camera.render(node);
  node.setPosition(position);

  // 从 render texture 读取像素数据，数据类型为 RGBA 格式的 Uint8Array 数组。
  // 默认每次调用此函数会生成一个大小为 （长 x 高 x 4） 的 Uint8Array。
  let data = texture.readPixels();

  // 创建画布
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  // write the render data
  // 1 像素 = 32 bit（RGBA），1 byte = 8 bit，所以 1 像素 = 4 byte
  // 每行 width 像素，即 width * 4 字节
  let rowBytes = width * 4;
  for (let row = 0; row < height; row++) {
    // RenderTexture 得到的纹理是上下翻转的
    let srow = height - 1 - row;
    let imageData = ctx.createImageData(width, 1);
    let start = srow * width * 4;
    for (let i = 0; i < rowBytes; i++) {
      imageData.data[i] = data[start + i];
    }

    ctx.putImageData(imageData, 0, row);
  }

  let dataURL = canvas.toDataURL("image/jpeg");
  nodeCamera.destroy();

  return dataURL;
};

export const showTexture = (node: cc.Node): Promise<cc.SpriteFrame> => {
  const dataUrl = screenshot(node);
  let img = document.createElement("img");
  img.src = dataUrl;
  img.width = node.width;
  img.height = node.height;

  return new Promise((resolve) => {
    img.onload = () => {
      let texture2 = new cc.Texture2D();
      texture2.initWithElement(img);

      let sf = new cc.SpriteFrame();
      sf.setTexture(texture2);
      // nativeConsole.log(sf);
      resolve(sf);
    };
  });
};

export const downloadImg = (node: cc.Node) => {
  const dataUrl = screenshot(node);
  let a = document.createElement("a");
  a.href = dataUrl;
  a.download = "Image.png";
  a.click();
};
