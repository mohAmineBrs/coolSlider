uniform sampler2D uTexture;
uniform float uDistanceFromCenter;

varying vec2 vUv;

void main() {
    vec4 myTexture = texture2D(uTexture, vUv);
    float grayScale = dot(myTexture.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = mix(vec4(vec3(grayScale), 1.), myTexture, uDistanceFromCenter);
    gl_FragColor.a = clamp(uDistanceFromCenter, 0.8, 1.0);

}
