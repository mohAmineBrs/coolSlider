uniform float uTime;
uniform float uCurviness;
uniform float uDistanceFromCenter;


varying vec2 vUv;
float PI = 3.141592653589793238;

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
    position.x = position.x + (sin(uv.y * PI) * offset.x);
    position.y = position.y + (sin(uv.x * PI) * offset.y);
    return position;
}


void main(){
  vUv = (uv - vec2(0.5)) * (0.9 - 0.15 * uDistanceFromCenter * (1.5 - uDistanceFromCenter)) + vec2(0.5);      // For textures parallax floating effect

  vec3 pos = position;

  pos.y += sin(PI*uv.x)*14.;
  pos.z += sin(PI*uv.y)*7.;

  pos.y += sin(uTime) * 0.03;
  vUv.y += sin(uTime) * 0.03;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}