const main = () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  if (!gl) {
    console.error("Could not initialize WebGL2");
    return;
  }
};

main();
