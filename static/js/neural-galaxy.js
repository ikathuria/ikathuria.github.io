class NeuralNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connections = [];
    this.radius = 2;
    this.hovered = false;
  }

  connect(node) {
    this.connections.push(node);
  }

  draw(p5) {
    // Draw connections
    p5.stroke(255, 20);
    p5.strokeWeight(0.5);
    this.connections.forEach(node => {
      p5.line(this.x, this.y, node.x, node.y);
    });

    // Draw node
    p5.noStroke();
    if (this.hovered) {
      p5.fill(0, 255, 157);
      p5.ellipse(this.x, this.y, this.radius * 3);
    } else {
      p5.fill(255, 100);
      p5.ellipse(this.x, this.y, this.radius);
    }
  }

  checkHover(p5, mouseX, mouseY) {
    const d = p5.dist(this.x, this.y, mouseX, mouseY);
    this.hovered = d < 10;
    return this.hovered;
  }
}

let nodes = [];
let hoveredNode = null;

function setup(p5) {
  const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
  canvas.parent('neural-galaxy');
  p5.background(10);

  // Create nodes
  const numNodes = 50;
  for (let i = 0; i < numNodes; i++) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    nodes.push(new NeuralNode(x, y));
  }

  // Create connections
  nodes.forEach(node => {
    const numConnections = p5.floor(p5.random(1, 4));
    for (let i = 0; i < numConnections; i++) {
      const randomNode = nodes[p5.floor(p5.random(nodes.length))];
      if (randomNode !== node) {
        node.connect(randomNode);
      }
    }
  });
}

function draw(p5) {
  p5.background(10, 10, 10, 20);

  // Update and draw nodes
  nodes.forEach(node => {
    node.draw(p5);
  });

  // Check for hover
  hoveredNode = null;
  nodes.forEach(node => {
    if (node.checkHover(p5, p5.mouseX, p5.mouseY)) {
      hoveredNode = node;
    }
  });
}

function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
} 