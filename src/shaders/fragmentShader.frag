#version 300 es

uniform int uColorIndex;
uniform mediump vec4 uColors[3];
out mediump vec4 fragColor;

void main() {
    fragColor = uColors[uColorIndex];
}