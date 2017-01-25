attribute vec2 vertexPos;  // each incoming vertex is (x,y)

void main() {
  gl_PointSize = 3.0;
  gl_Position = vec4 (vertexPos, 0.0, 1.0);
}