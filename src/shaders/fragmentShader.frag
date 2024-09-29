#version 300 es

in mediump vec2 vTexCoord;

// NOTE: we are not setting this uniform value in JS code
// it still gets a default value
uniform sampler2D uSampler;

out mediump vec4 fragColor;

void main() {
    fragColor = texture(uSampler, vTexCoord);
}