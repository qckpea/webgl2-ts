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
  const locColor = 1;
  
  gl.enableVertexAttribArray(locPosition);
  gl.enableVertexAttribArray(locColor);
  // fallback color for debug
  gl.vertexAttrib4f(locColor, 1.0, 0.0, 0.0, 1.0);

  // Hexagon vertices (center at origin)
  const vertices = new Float32Array([
  // X      Y        R, G, B, A
     0.0,   0.0,     1, 1, 1, 1,  // Center (0)
     0.5,   0.866,   1, 0, 0, 1,  // Vertex 1
     1.0,   0.0,     0, 1, 0, 1,  // Vertex 2
     0.5,  -0.866,   0, 0, 1, 1,  // Vertex 3
    -0.5,  -0.866,   1, 1, 0, 1,  // Vertex 4
    -1.0,   0.0,     0, 1, 1, 1,  // Vertex 5
    -0.5,   0.866,   1, 0, 1, 1   // Vertex 6
  ]);

  // Indices for hexagon (center vertex reused)
  // note: we are not reusing the color attributes here
  const indices = new Uint16Array([
      0, 1, 2,   // Triangle 1
      0, 2, 3,   // Triangle 2
      0, 3, 4,   // Triangle 3
      0, 4, 5,   // Triangle 4
      0, 5, 6,   // Triangle 5
      0, 6, 1    // Triangle 6
  ]);

  // Create buffers
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  // note: the target is ELEMENT_ARRAY_BUFFER for indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // note: you can specify bytes for floats as Float32Array.BYTES_PER_ELEMENT
  gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(locColor, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

main();
