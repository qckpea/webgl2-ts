import { createWebGlProgram } from "./program";
import fragmentSource from "./shaders/fragmentShader.frag";
import vertexSource from "./shaders/vertexShader.vert";

const loadImage = (imageUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = imageUrl;
  });

const getImageData = (
  image: HTMLImageElement
): Uint8ClampedArray | undefined => {
  const { width, height } = image;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0);
  return ctx?.getImageData(0, 0, width, height).data;
};

const draw = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  depthLocation: number,
  now: number
) => {
  gl.vertexAttrib1f(depthLocation, now % 132);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  now = Date.now() / 100;
  requestAnimationFrame(() => draw(gl, program, depthLocation, now));
};

const main = async () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  if (!gl) {
    console.error("Could not initialize WebGL2");
    return;
  }

  const program = createWebGlProgram(gl, vertexSource, fragmentSource);
  if (!program) {
    console.error("Could not initialize WebGlProgram!");
    return;
  }
  gl.useProgram(program!);
  const locPosition = 0;
  const texPosition = 1;
  gl.enableVertexAttribArray(locPosition);
  gl.enableVertexAttribArray(texPosition);

  const vertexBufferData = new Float32Array([
    -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
  ]);
  const texCoordBufferData = new Float32Array([
    0.0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1,
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(texPosition, 2, gl.FLOAT, false, 0, 0);

  const image = await loadImage("tilemap_packed.png");
  const imageData = getImageData(image);

  const pbo = gl.createBuffer();
  gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
  gl.bufferData(gl.PIXEL_UNPACK_BUFFER, imageData!, gl.STATIC_DRAW);
  gl.pixelStorei(gl.UNPACK_ROW_LENGTH, image.width);
  gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, image.height);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);

  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 16, 16, 132);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  let now = Date.now();
  for (let i = 0; i < 132; i++) {
    const row = Math.floor(i / 12) * 16;
    const col = (i % 11) * 16;
    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, col);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, row);
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      i,
      16,
      16,
      1, // depth
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      0
    );
  }
  // texSubImage3D can be called by passing the texture atlas every call but it creates overhead
  // by uploading texture image every time we create a sub texture from it
  // to avoid that we upload the texture atlas once by using canvas context 2d
  // then we get the image data as Uint8ClampedArray
  // and we can use that data in a pixel buffer object
  // and set the row and col dimensions by using
  // gl.pixelStorei(gl.UNPACK_ROW_LENGTH, image.width);
  // gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, image.height);

  // takes very little time to upload the texture atlas and creating 3D textures array from it
  // using gl.texStorage3D
  // this case creating 132 layer of 16x16 textures under 1-2ms (depending on your system ofc.)
  console.log(`${Date.now() - now} ms`);

  const depthLocation = gl.getAttribLocation(program, "aDepth");
  // animating through the textureArray
  draw(gl, program, depthLocation, now);
};

main();
