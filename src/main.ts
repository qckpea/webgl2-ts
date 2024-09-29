import { createWebGlProgram } from "./program";
import fragmentSource from "./shaders/fragmentShader.frag";
import vertexSource from "./shaders/vertexShader.vert";

const loadImage = (imageUrl: string): Promise<HTMLImageElement> => new Promise(resolve => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.src = imageUrl;
})

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

  const bufferData = new Float32Array([0.0, 1.0, -1.0, -1.0, 1.0, -1.0]);
  const texCoordBufferData = new Float32Array([0.5, 1, 0, 0, 1, 0]);
  const pixels = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
    128, 128, 0,
    255, 255, 0,
    255, 128, 0,
    0, 255, 255,
    255, 0, 255,
    0, 0, 0 
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    locPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    texPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  
  // set the value of the uniform samplers in the fragment shader
  const pixelTextureUnit = 0;
  const kittenTextureUnit = 31; // webgl2 allows 32 texture units per shader
  gl.uniform1i(gl.getUniformLocation(program, 'uPixelSampler'), pixelTextureUnit);
  gl.uniform1i(gl.getUniformLocation(program, 'uKittenSampler'), kittenTextureUnit); 

  // setting up texture unit for pixels
  const pixelTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + pixelTextureUnit);
  gl.bindTexture(gl.TEXTURE_2D, pixelTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    3,
    3,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    pixels,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
  // setting up texture unit for image
  const image = await loadImage('kitten.png');
  const kittenTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + kittenTextureUnit);
  gl.bindTexture(gl.TEXTURE_2D, kittenTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    900,
    900,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
