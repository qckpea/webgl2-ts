import { loadShader } from "./shader";

const createWebGlProgram = (
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
) => {
  const program = gl.createProgram();
  if (!program) {
    console.error("Could not create shader program");
    return null;
  }

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource)!;
  gl.attachShader(program, vertexShader);

  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource)!;
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const programParam = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!programParam) {
    console.error("Could not link shader program!");
    console.error(gl.getProgramInfoLog(program));
    return null;
  }

  return program;
};

export { createWebGlProgram };
