const loadShader = (
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const shaderParams = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!shaderParams) {
    console.error("Could not compile shader ", shader);
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export { loadShader };
