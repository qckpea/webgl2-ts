#version 300 es

in mediump vec2 vTexCoord;


uniform sampler2D uPixelSampler;
uniform sampler2D uKittenSampler;

out mediump vec4 fragColor;

void main() {
    fragColor = texture(uPixelSampler, vTexCoord) * texture(uKittenSampler, vTexCoord);
}