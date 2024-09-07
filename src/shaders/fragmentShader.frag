#version 300 es

in mediump vec3 vColor;
out mediump vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}