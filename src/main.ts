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

  // const locPosition = gl.getAttribLocation(program, 'aPosition') 
  // might be another way to get the location of the attributes
  // in that case we don't specify the layout(location = x) in the vertex shader
  
  // but for now
  // attribute locations specified here are the same as in the vertex shader
  const locPosition = 0;
  const locPointSize = 1;
  const locColor = 2;
  
  // also there is a way to set the attribute locations manually with
  // gl.bindAttribLocation(program, locPosition, 'aPosition')
  // BUT in that case binding needs to happen before the linking of the webGl program
  
  // enable the attributes
  gl.enableVertexAttribArray(locPosition);
  gl.enableVertexAttribArray(locPointSize);
  gl.enableVertexAttribArray(locColor);

  // setting up the buffer data
  const bufferData = new Float32Array([
    0.0, 1.0,      100,   1, 0, 0,
    -1.0, -1.0,     50,   0, 1, 0,
    1.0, -1.0,       75,  0, 0, 1
  ]);
  const FLOAT_SIZE_IN_BYTE = 4;
  const NUM_ELEMENTS_PER_VERTEX = 6;
  // stride value must be given in bytes
  // we use Float32Array so a single float is 4 bytes
  const STRIDE = FLOAT_SIZE_IN_BYTE * NUM_ELEMENTS_PER_VERTEX;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  // vertexAttribPointer specifies which part of the bufferData is used for attribute
  gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, STRIDE, 0);
  gl.vertexAttribPointer(locPointSize, 1, gl.FLOAT, false, STRIDE, 2 * FLOAT_SIZE_IN_BYTE);
  gl.vertexAttribPointer(locColor, 3, gl.FLOAT, false, STRIDE, 3 * FLOAT_SIZE_IN_BYTE);

  // we can experiment with the draw mode here
  // gl.drawArrays(gl.POINTS, 0, 3);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
