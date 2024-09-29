import { createWebGlProgram } from "./program";
import fragmentSource from "./shaders/fragmentShader.frag";
import vertexSource from "./shaders/vertexShader.vert";

const main = () => {
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

  // setting up the buffer data
  const bufferData = new Float32Array([0.0, 1.0, -1.0, -1.0, 1.0, -1.0]);
  // texture coordinates
  const texCoordBufferData = new Float32Array([0.5, 1, 0, 0, 1, 0]);
  // Pixels for a 3x3 texture, where each pixel has 3 components (R, G, B)
  const pixels = new Uint8Array([
    255, 0, 0,   // red
    0, 255, 0,   // green
    0, 0, 255,   // blue
    128, 128, 0, // olive
    255, 255, 0, // yellow
    255, 128, 0, // orange
    0, 255, 255, // cyan    <= won't show because the triangle shape does not cover it
    255, 0, 255, // magenta
    0, 0, 0      // black   <= won't show because the triangle shape does not cover it
  ]);
  // NOTE:
  // [0,0] u,v coordinates of the texture is the bottom left corner [1,1] is the top right

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

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // This changes the alignment so that WebGL doesn't expect the rows to be aligned to 4 bytes.
  // Instead, each row can now be aligned to 1 byte, allowing you to use gl.RGB with 3-byte pixels.
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,                // base image level (mipmap related)
    gl.RGB,           // Internal format (RGB)
    3,                // Width (3 pixels)
    3,                // Height (3 pixels)
    0,                // Border (must be 0)
    gl.RGB,           // Format (RGB)
    gl.UNSIGNED_BYTE, // Type (unsigned byte for pixel data)
    pixels,           // The Uint8Array holding the pixel data
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
