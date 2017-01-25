const NUM_CIRCLE_POINTS = 12;
const NUM_CIRCLES = 2;

function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js, it returns a WebGLRenderingContext
    let gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl").then((prog) => {
        gl.useProgram(prog);
        // Use black RGB=(0,0,0) for the clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
        gl.viewport(0, 0, canvas.width, canvas.height);

        // clear the color buffer
        gl.clear(gl.COLOR_BUFFER_BIT);

        let vertices = [];
        let rad = 0.5;
        /* the equilateral triangle is inscribed in a circle of a given radius */
        let yCoord = rad * Math.sin(Math.PI / 3);
        vertices.push(rad, 0.0);
        vertices.push(rad / 2, yCoord);
        vertices.push(-rad / 2, yCoord);
        vertices.push(-rad, 0.0);
        vertices.push(-rad / 2, -yCoord);
        vertices.push(rad / 2, -yCoord);

        // create a buffer
        let triangleBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuff);

        // copy the vertices data
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        let circVertices = [];
        let circleRad = 0.8;
        for(let j = 0; j < NUM_CIRCLES; j++) {
            for (let k = 0; k < NUM_CIRCLE_POINTS; k++) {
                let angle = 2 * k * Math.PI / NUM_CIRCLE_POINTS;
                circVertices.push(circleRad * Math.cos(angle), circleRad * Math.sin(angle));
            }
            circleRad += .1;
        }
        let circleBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(circVertices), gl.STATIC_DRAW);

        // obtain a reference to the shader variable (on the GPU)
        let posAttr = gl.getAttribLocation(prog, "vertexPos");
        gl.enableVertexAttribArray(posAttr);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuff);
        gl.vertexAttribPointer(posAttr,
            2,        /* number of components per attribute, in our case (x,y) */
            gl.FLOAT, /* type of each attribute */
            false,    /* does not require normalization */
            0,        /* stride: number of bytes between the beginning of consecutive attributes */
            0);       /* the offset (in bytes) to the first component in the attribute array */
        gl.drawArrays(gl.TRIANGLE_FAN,
            0,        /* starting index in the array */
            6);       /* we are drawing three vertices */

        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff);
        gl.vertexAttribPointer(posAttr,
            2,        /* number of components per attribute, in our case (x,y) */
            gl.FLOAT, /* type of each attribute */
            false,    /* does not require normalization */
            0,        /* stride: number of bytes between the beginning of consecutive attributes */
            0);       /* the offset (in bytes) to the first component in the attribute array */
        gl.drawArrays(gl.POINTS, 0, NUM_CIRCLE_POINTS * NUM_CIRCLES);
    });
}