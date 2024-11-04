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

  const vertices = new Float32Array([
    // Triangle RED
    //x  y      depth   r    g    b    a
    0.0, 0.5,   0.5,    1.0, 0.0, 0.0, 0.5,
    -.5, -.5,   0.5,    1.0, 0.0, 0.0, 0.5,
    0.5, -.5,   0.5,    1.0, 0.0, 0.0, 0.5,

    // Triangle GREEN
    //x  y      depth   r    g    b    a
    -.3, 0.3,   0.0,    0.0, 1.0, 0.0, 0.5, 
    -.3, -.3,   0.0,    0.0, 1.0, 0.0, 0.5,
    0.3, -.3,   0.0,    0.0, 1.0, 0.0, 0.5,

    // Triangle BLUE
    //x  y      depth   r    g    b    a
    0.0, 0.4,   -.5,    0.0, 0.0, 1.0, 0.5, 
    -.4, 0.1,   -.5,    0.0, 0.0, 1.0, 0.5,
    0.4, 0.1,   -.5,    0.0, 0.0, 1.0, 0.5,
  ]);

  // Create and bind buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const colorLocation = gl.getAttribLocation(program, "aColor");

  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(
    colorLocation,
    4,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(colorLocation);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // NOTE: when blending is enabled and transparency is involved then triangles need to be drawn from back to front
  gl.drawArrays(gl.TRIANGLES, 0, 3); // RED
  gl.drawArrays(gl.TRIANGLES, 3, 6); // GREEN
  gl.drawArrays(gl.TRIANGLES, 6, 9); // BLUE
};

main();
