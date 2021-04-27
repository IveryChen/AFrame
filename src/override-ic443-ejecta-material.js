AFRAME.registerComponent('override-ic443-ejecta-material', {
  schema: {
    viewOpacityThresholds: {type: 'vec2', default: {x: 0.0, y: 0.3} },
    distanceOpacityThresholds: {type: 'vec2', default: {x: 2.6, y: 3.4} }
  },

  uniforms: {
    emissionTex: { type: 't' , value: new THREE.TextureLoader().load("../../textures/ic443_ejecta_v1.png")},
    viewOpacityThresholds: {type: 'vec2', value: {x: 0.0, y: 0.3} },
    distanceOpacityThresholds: {type: 'vec2', value: {x: 2.6, y: 3.4} }
  },

  init: function () {

    const vertexShader = `
varying vec2 vUv;
varying float edgeOpacity;

uniform vec2 viewOpacityThresholds;
uniform vec2 distanceOpacityThresholds;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float mapClamped(float value, float min1, float max1, float min2, float max2) {
  return clamp( map( value, min1, max1, min2, max2 ), min2, max2 );
}

float mapSmoothed(float value, float min1, float max1, float min2, float max2) {
  float smoothedValue = smoothstep( min1, max1, value );
  return map( smoothedValue, 0.0, 1.0, min2, max2 );
}

  void main() {

    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    vec3 I = normalize( cameraPosition - worldPosition.xyz );
    float viewAngleFine = dot( I, worldNormal );
    edgeOpacity = smoothstep( 0.2, 0.9, viewAngleFine);

    gl_Position = projectionMatrix * mvPosition;
  }
`;
const fragmentShader = `
// Use low precision.
  precision lowp float;

  float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float mapClamped(float value, float min1, float max1, float min2, float max2) {
  return clamp( map( value, min1, max1, min2, max2 ), min2, max2 );
}

float mapSmoothed(float value, float min1, float max1, float min2, float max2) {
  float smoothedValue = smoothstep( min1, max1, value );
  return map( smoothedValue, 0.0, 1.0, min2, max2 );
}

  uniform sampler2D emissionTex;

  varying vec2 vUv;
  varying float edgeOpacity;

  void main () {

    vec4 srcImg = texture2D(emissionTex, vec2(vUv.x, 1.0 - vUv.y));
    vec3 srcTexture = srcImg.rgb;
    float srcAlpha = srcImg.a;
    float srcIntensity = dot( srcTexture, vec3( 0.3, 0.5, 0.2 ) );
    vec3 srcGrayscale = vec3( srcIntensity );

    float desaturationAmt = mapSmoothed( srcIntensity, 0.65, 0.9, -0.2, 0.5 );

    srcTexture = mix( srcTexture, srcGrayscale, vec3(desaturationAmt) );

    srcTexture *= 1.0;
    srcTexture = pow(srcTexture, vec3(1.0) );
    srcTexture = mix(srcTexture, smoothstep(0.0, 1.0, srcTexture), 0.5);

    gl_FragColor = vec4( srcTexture, srcAlpha * edgeOpacity );
  }
`;

    let fresMaterial  = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });
    fresMaterial.transparent = true;

    this.uniforms.emissionTex.encoding = THREE.linearEncoding;

    let el = this.el;
    let comp = this;
    let data = this.data;
    comp.scene = el.sceneEl.object3D;  
    comp.modelLoaded = false;

    // After gltf model has loaded, modify its materials.
    el.addEventListener('model-loaded', function(ev){
      let mesh = el.getObject3D('mesh'); 
      if (!mesh){return;}
      //console.log(mesh);
      mesh.traverse(function(node){
        if (node.isMesh){

          // get the emissive map: 
          // this.uniforms.emissionTex.value = node.material.emissiveMap;
          // fresMaterial.uniforms = this.uniforms;

          node.material = fresMaterial;
          node.material.depthTest = false;
          // node.material.blending = THREE.AdditiveBlending;
          node.material.side = THREE.FrontSide;

          const tempGeometry = new THREE.Geometry().fromBufferGeometry(node.geometry);

          tempGeometry.mergeVertices();
          tempGeometry.computeVertexNormals();
          tempGeometry.computeFaceNormals();

          node.geometry = new THREE.BufferGeometry().fromGeometry(tempGeometry);

        }
      });
      comp.modelLoaded = true;
    });  
  },

  update: function (data) {
    this.uniforms.viewOpacityThresholds.value = this.data.viewOpacityThresholds;
    this.uniforms.distanceOpacityThresholds.value = this.data.distanceOpacityThresholds;
  },

  tick: function (t) {
  }

});