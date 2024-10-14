#version 300 es

in mediump vec2 vTexCoord;
in mediump float vDepth;

uniform mediump sampler2DArray uSampler;

out mediump vec4 fragColor;

void main() {
    fragColor = texture(uSampler, vec3(vTexCoord, vDepth));
}