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

  // getting the location of the uniform variables in the shader
  // only need to get the locations once they are the same for every draw call
  const positionLoc = gl.getUniformLocation(program, 'uPosition');
  const pointSizeLoc = gl.getUniformLocation(program, 'uPointSize');
  const colorIndexLoc = gl.getUniformLocation(program, 'uColorIndex');
  const colorsLoc = gl.getUniformLocation(program, 'uColors');
  
  // setting with the 'v' variant of uniform functions
  // we can pass an iterable object (for example array) to the uniform varible
  gl.uniform4fv(colorsLoc, [
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0  // blue
  ]);

  // setting the uniform values before draw call
  // the values are same for all vertices and fragments
  // 'uniform'
  gl.uniform2f(positionLoc, 0.0, 0.0);
  gl.uniform1f(pointSizeLoc, 50.0);
  gl.uniform1i(colorIndexLoc, 0);
  gl.drawArrays(gl.POINTS, 0, 1);

  // setting again
  gl.uniform2f(positionLoc, 0.5, 0.5);
  gl.uniform1f(pointSizeLoc, 20.0);
  gl.uniform1i(colorIndexLoc, 1);
  gl.drawArrays(gl.POINTS, 0, 1);

  // ... and again
  gl.uniform2f(positionLoc, -0.5, 0.25);
  gl.uniform1f(pointSizeLoc, 10.0);
  gl.uniform1i(colorIndexLoc, 2);
  gl.drawArrays(gl.POINTS, 0, 1);
};

main();
