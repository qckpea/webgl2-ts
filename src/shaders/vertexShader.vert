#version 300 es

uniform vec2 uPosition;
uniform float uPointSize;

void main() {
    gl_Position = vec4(uPosition, 0.0f, 1);
    gl_PointSize = uPointSize;
}
