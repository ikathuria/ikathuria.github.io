// --- Color and style constants ---
const COLORS = {
    background: '#000000',
    text: '#ffffff',
    project: '#ffd54f',
    research: '#4fc3f7',
    resume: '#ce93d8',
    nodeGlow: 0.45,
};
const NODE_TYPES = {
    project: 'Project',
    research: 'Research',
    resume: 'Resume',
    central: 'About',
};
const FONT_FAMILY = 'Space Grotesk, Inter, Arial, sans-serif';

// --- Starfield ---
class Star {
    constructor(width, height) { this.reset(width, height); }
    reset(width, height) {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width;
        this.size = Math.random() * 1.5 + 0.5;
    }
    update(width, height, speed) {
        this.z -= speed;
        if (this.z < 1) this.reset(width, height), this.z = width;
    }
    draw(p5, width, height) {
        p5.push();
        p5.noStroke();
        p5.fill(255, 255, 255, 120);
        let sx = p5.map(this.x / this.z, 0, 1, 0, width) + width / 2;
        let sy = p5.map(this.y / this.z, 0, 1, 0, height) + height / 2;
        let r = this.size * (1 - this.z / width) * 2;
        p5.ellipse(sx, sy, r, r);
        p5.pop();
    }
}

// --- Node ---
class Node {
    constructor(x, y, data, type) {
        this.x = x; this.y = y; this.data = data; this.type = type;
        this.radius = type === 'central' ? 60 : 32;
        this.baseRadius = this.radius;
        this.hovered = false;
        this.connections = [];
        this.angle = 0; // for fixed position
        this.orbitRadius = 0;
        this.related = [];
    }
    connect(node) { this.connections.push(node); }
    setFixed(angle, radius) {
        this.angle = angle; this.orbitRadius = radius;
    }
    update(centerX, centerY, pulse = 1) {
        if (this.type !== 'central') {
            this.x = centerX + Math.cos(this.angle) * this.orbitRadius;
            this.y = centerY + Math.sin(this.angle) * this.orbitRadius;
        }
        // Pulse on hover
        this.radius = this.baseRadius * (this.hovered ? 1.13 : 1) * pulse;
    }
    draw(p5) {
        let color = COLORS[this.type] || COLORS.project;
        p5.drawingContext.shadowBlur = this.hovered ? 32 : 16;
        p5.drawingContext.shadowColor = color;
        p5.noStroke();
        p5.fill(color);
        p5.ellipse(this.x, this.y, this.radius * 2);
        p5.drawingContext.shadowBlur = 0;
        p5.fill(COLORS.text);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(this.type === 'central' ? 24 : 15);
        p5.textFont(FONT_FAMILY);
        let label = this.type === 'central' ? 'ISHANI KATHURIA' : (this.data.title || this.data.repo || this.data.name || '');
        p5.text(label, this.x, this.y);
    }
    checkHover(p5, mouseX, mouseY) {
        const d = p5.dist(this.x, this.y, mouseX, mouseY);
        this.hovered = d < this.radius;
        return this.hovered;
    }
}

// --- Tooltip ---
function showTooltip(text, x, y) {
    const tooltip = document.getElementById('node-tooltip');
    if (!tooltip) return;
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 40}px`;
    tooltip.setAttribute('aria-label', text);
}
function hideTooltip() {
    const tooltip = document.getElementById('node-tooltip');
    if (!tooltip) return;
    tooltip.style.display = 'none';
}

// --- Modal ---
function showNodeModal(node) {
    const modal = new bootstrap.Modal(document.getElementById('nodeInfoModal'));
    const modalTitle = document.querySelector('#nodeInfoModal .modal-title');
    const modalType = document.querySelector('#nodeInfoModal .node-type-tag');
    const modalDescription = document.querySelector('#nodeInfoModal .node-description');
    const modalTechStack = document.querySelector('#nodeInfoModal .node-tech-stack');
    const modalLinks = document.querySelector('#nodeInfoModal .node-links');
    const modalImage = document.querySelector('#nodeInfoModal .node-image');
    if (!modalTitle || !modalType || !modalDescription || !modalTechStack || !modalLinks || !modalImage) {
        console.warn('Modal element missing:', {modalTitle, modalType, modalDescription, modalTechStack, modalLinks, modalImage});
        return;
    }
    // Title
    modalTitle.textContent = node.data.title || node.data.repo || node.data.name || '';
    // Type tag
    modalType.textContent = NODE_TYPES[node.type] || node.type;
    modalType.style.display = 'inline-block';
    modalType.style.background = COLORS[node.type] || COLORS.project;
    modalType.style.color = '#000';
    modalType.style.fontWeight = 'bold';
    modalType.style.borderRadius = '8px';
    modalType.style.padding = '0.2em 0.7em';
    modalType.style.marginBottom = '0.7em';
    modalType.style.marginRight = '0.7em';
    // Description
    modalDescription.textContent = node.data.description || node.data.abstract || 'No description available.';
    // Tech stack
    modalTechStack.innerHTML = '';
    (node.data.stack || node.data.topics || []).forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'tech-badge me-2';
        badge.textContent = tech;
        modalTechStack.appendChild(badge);
    });
    // Links
    modalLinks.innerHTML = '';
    if (node.data.links) {
        if (node.data.links.github) {
            const link = document.createElement('a');
            link.href = node.data.links.github;
            link.className = 'btn btn-outline-light me-2';
            link.target = '_blank';
            link.innerHTML = '<i class="fab fa-github me-2"></i>GitHub';
            modalLinks.appendChild(link);
        }
        if (node.data.links.demo) {
            const link = document.createElement('a');
            link.href = node.data.links.demo;
            link.className = 'btn btn-outline-light me-2';
            link.target = '_blank';
            link.innerHTML = '<i class="fas fa-external-link-alt me-2"></i>Demo';
            modalLinks.appendChild(link);
        }
        if (node.data.links.paper) {
            const link = document.createElement('a');
            link.href = node.data.links.paper;
            link.className = 'btn btn-outline-light me-2';
            link.target = '_blank';
            link.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Paper';
            modalLinks.appendChild(link);
        }
        if (node.data.links.pdf) {
            const link = document.createElement('a');
            link.href = node.data.links.pdf;
            link.className = 'btn btn-outline-light me-2';
            link.target = '_blank';
            link.innerHTML = '<i class="fas fa-file-pdf me-2"></i>PDF';
            modalLinks.appendChild(link);
        }
    }
    // Image (projects only)
    modalImage.innerHTML = '';
    if (node.type === 'project' && node.data.image) {
        const img = document.createElement('img');
        img.src = node.data.image;
        img.alt = node.data.title || 'Project image';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.style.marginTop = '1em';
        modalImage.appendChild(img);
    }
    modal.show();
}

// --- Keyboard navigation and list view ---
let listView = false;
function toggleListView() {
    listView = !listView;
    // TODO: Implement list view rendering
    // For now, just alert
    alert('List view coming soon!');
}

// --- Main p5 sketch ---
let nodes = [];
let centralNode;
let hoveredNode = null;
let stars = [];
const STAR_COUNT = 120;

new p5((p5) => {
    p5.setup = function() {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
        canvas.parent('neural-network');
        p5.background(COLORS.background);
        p5.textFont(FONT_FAMILY);
        // Starfield
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star(p5.width, p5.height));
        // Central node
        const centerX = p5.width / 2, centerY = p5.height / 2;
        centralNode = new Node(centerX, centerY, { title: 'ISHANI KATHURIA' }, 'central');
        nodes = [centralNode];
        // Projects
        const projectData = window.projectData || [];
        projectData.forEach((project, i) => {
            const angle = (i / projectData.length) * p5.TWO_PI;
            const radius = Math.min(p5.width, p5.height) * 0.32;
            const node = new Node(centerX, centerY, project, 'project');
            node.setFixed(angle, radius);
            node.connect(centralNode);
            nodes.push(node);
        });
        // Research
        const researchData = window.researchData || [];
        researchData.forEach((research, i) => {
            const angle = (i / researchData.length) * p5.TWO_PI + Math.PI / 6;
            const radius = Math.min(p5.width, p5.height) * 0.44;
            const node = new Node(centerX, centerY, research, 'research');
            node.setFixed(angle, radius);
            node.connect(centralNode);
            nodes.push(node);
        });
        // Resume node
        const resumeNode = new Node(centerX, centerY, { title: 'Resume', links: { pdf: '/resume' } }, 'resume');
        resumeNode.setFixed(Math.PI / 2, Math.min(p5.width, p5.height) * 0.22);
        resumeNode.connect(centralNode);
        nodes.push(resumeNode);
        // Inter-node connections (same stack)
        for (let i = 1; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].type !== nodes[j].type && nodes[i].data.stack && nodes[j].data.stack) {
                    if (nodes[i].data.stack.some(tech => nodes[j].data.stack.includes(tech))) {
                        nodes[i].connect(nodes[j]);
                        nodes[j].connect(nodes[i]);
                    }
                }
            }
        }
    };
    p5.draw = function() {
        p5.background(COLORS.background);
        for (let star of stars) star.update(p5.width, p5.height, 2), star.draw(p5, p5.width, p5.height);
        // Animate central node (pulse)
        let pulse = 1 + 0.04 * Math.sin(p5.millis() / 400);
        centralNode.baseRadius = 60 * pulse;
        // Update and draw nodes
        const centerX = p5.width / 2, centerY = p5.height / 2;
        nodes.forEach(node => node.update(centerX, centerY, pulse));
        // Draw connections
        p5.stroke(255, 255, 255, 32);
        p5.strokeWeight(1.2);
        nodes.forEach(node => {
            node.connections.forEach(conn => {
                if (node !== conn) p5.line(node.x, node.y, conn.x, conn.y);
            });
        });
        // Draw nodes
        nodes.forEach(node => node.draw(p5));
        // Hover detection
        hoveredNode = null;
        nodes.forEach(node => {
            if (node.checkHover(p5, p5.mouseX, p5.mouseY)) hoveredNode = node;
        });
        // Tooltip
        if (hoveredNode && hoveredNode.type !== 'central') {
            showTooltip(hoveredNode.data.title || hoveredNode.data.repo || hoveredNode.data.name || '', p5.mouseX, p5.mouseY);
            p5.cursor(p5.HAND);
        } else {
            hideTooltip();
            p5.cursor(p5.ARROW);
        }
    };
    p5.mousePressed = function() {
        if (hoveredNode && hoveredNode.type !== 'central') showNodeModal(hoveredNode);
    };
    p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        // Recreate stars for new size
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star(p5.width, p5.height));
    };
});
// --- Keyboard accessibility ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'T' || e.key === 't') toggleListView();
    if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('nodeInfoModal'));
        if (modal) modal.hide();
    }
}); 