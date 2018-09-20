"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 8;

var theta = 0.0;
var thetaLoc; 

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var radius = 0.8;
    var vertices = [
        vec2(radius * Math.cos(5 * Math.PI / 6), radius * Math.sin(- Math.PI/6) ),
        vec2(  0,  radius ),
        vec2(radius * Math.cos(- Math.PI / 6), radius * Math.sin(- Math.PI / 6))
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.01;
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    window.requestAnimFrame(render);
}
