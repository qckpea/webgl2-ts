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
  gl.enableVertexAttribArray(locPosition);

  // setting up the buffer data
  const bufferData = new Float32Array([0.0, 1.0, -1.0, -1.0, 1.0, -1.0]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    locPosition,
    2,
    gl.FLOAT,
    false,
    bufferData.BYTES_PER_ELEMENT * 2,
    0
  );

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
