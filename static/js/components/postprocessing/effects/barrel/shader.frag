module.exports = "#define GLSLIFY 1\n/* \nuniform vec2 resolution;\nuniform vec2 texelSize;\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float aspect;\nuniform float time;\nuniform sampler2D inputBuffer;\nuniform sampler2D depthBuffer; \n*/\n\nuniform float strength;\n\n" + require('glsl-noise/classic/3d.glsl') + " \n\n /* float random (vec2 st) {\n    return fract(sin(dot(st.xy,  vec2(12.9898,78.233)))* 43758.5453123);\n} */\n\nhighp float rand(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n// Given a vec2 in [-1,+1], generate a texture coord in [0,+1]\nvec2 barrelDistortion( vec2 p, vec2 amt )\n{\n    p = 2.0 * p - 1.0;\n\n    /*\n    const float maxBarrelPower = 5.0;\n\t//note: http://glsl.heroku.com/e#3290.7 , copied from Little Grasshopper\n    float theta  = atan(p.y, p.x);\n    vec2 radius = vec2( length(p) );\n    radius = pow(radius, 1.0 + maxBarrelPower * amt);\n    p.x = radius.x * cos(theta);\n    p.y = radius.y * sin(theta);\n\n\t/*/\n    // much faster version\n    //const float maxBarrelPower = 5.0;\n    //float radius = length(p);\n    float maxBarrelPower = sqrt(5.0);\n    float radius = dot(p,p); //faster but doesn't match above accurately\n    p *= pow(vec2(radius), maxBarrelPower * amt);\n\n    return p * 0.5 + 0.5;\n}\n\n//note: from https://www.shadertoy.com/view/MlSXR3\nvec2 brownConradyDistortion(vec2 uv, float scalar)\n{\n    uv = (uv - 0.5 ) * 2.0;   \n    // positive values of K1 give barrel distortion, negative give pincushion\n    float barrelDistortion1 = -0.02 * scalar; // K1 in text books\n    //float barrelDistortion2 = 0.0 * scalar; // K2 in text books\n    float r2 = dot(uv,uv);\n    uv *= 1.0 + barrelDistortion1 * r2/* +  barrelDistortion2 * r2 * r2 */;\n   return (uv / 2.0) + 0.5;\n}\n\n/* float curve(float x, float e) {\n    return x == 0. ? 0. : pow(e, 10. * x - 10.);\n} */\n\nfloat curve(float t) {\n    return  t * t * t * t * t * t * t;\n}\n\nvoid mainImage( in vec4 fragColor, in vec2 uv, out vec4 outputColor )\n{\n    float offset = 0.;\n    #ifdef e0USE_EDGE_DITHER\n        float ratio = resolution.x / resolution.y;\n        vec2 uvR = vec2(uv.x, uv.y / ratio);\n       /*  float n0 = cnoise(vec3(uvR * 1000., time * 1.4)) * .05; */\n        float n1 = cnoise(vec3(uvR * 5., time * .2)) * .3;\n        float d = curve(distance(uv, vec2(0.5)));\n        offset = d * /* n0 * */ n1;  \n    #endif\n    vec2 distortion = brownConradyDistortion(uv, 5.5 * strength);\n    fragColor = texture2D(inputBuffer, distortion + offset);\n    fragColor.a = 1.;\n    outputColor = fragColor;\n}\n";