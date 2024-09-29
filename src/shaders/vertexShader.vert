#version 300 es

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aTextCoord;

out mediump vec2 vTexCoord;

void main() {
    vTexCoord = aTextCoord;
    gl_Position = vec4(aPosition, 0.0f, 1);
}
