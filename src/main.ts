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
  
  gl.useProgram(program!);
  gl.drawArrays(gl.POINTS, 0, 1);
};

main();
