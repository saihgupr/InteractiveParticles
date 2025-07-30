let particles = [];
let sizeSlider, sizeValueSpan;
let speedSlider, speedValueSpan;
let gravitySlider, gravityValueSpan;
let paletteSelect;

const palettes = {
    'van-gogh': ['#29251d', '#2f3774', '#4c6394', '#7ea4b0', '#cdd27e'],
    'monet': ['#5F9E6E', '#FF3B30', '#3E86A0', '#FFC72C', '#B081C6'],
    'picasso': ['#663a37', '#6a665b', '#c88280', '#4f616b', '#bd705c'],
    'dali': ['#c96b33', '#501f22', '#fadb85', '#000000', '#8d141d'],
    'kahlo': ['#215E9A', '#C62828', '#F9A825', '#6D4C41', '#43A047'],
    'warhol': ['#FF4F8B', '#F7EA00', '#00B2E2', '#A8D800', '#FF6F20'],
    'pollock': ['#AD2F2F', '#FFD577', '#FFF9B7', '#67BFA2', '#615C61'],
    'okeeffe': ['#F2E2C4', '#D9BFA0', '#A67C52', '#734D39', '#40261D'],
    'basquiat': ['#F7F7F7', '#000000', '#D63232', '#0C68A7', '#FCDA05'],
    'kusama': ['#FCDA00', '#FF0000', '#000000', '#FFFFFF', '#FF007F']
};

function setup() {
    createCanvas(windowWidth, windowHeight - 120); // Make space for controls

    sizeSlider = select('#particle-size');
    sizeValueSpan = select('#particle-size-value');
    speedSlider = select('#particle-speed');
    speedValueSpan = select('#particle-speed-value');
    gravitySlider = select('#cursor-gravity');
    gravityValueSpan = select('#cursor-gravity-value');
    paletteSelect = select('#color-palette');

    // Set initial value displays
    sizeValueSpan.html(sizeSlider.value());
    speedValueSpan.html(speedSlider.value());
    gravityValueSpan.html(gravitySlider.value());

    // Update value displays on slider input
    sizeSlider.input(() => sizeValueSpan.html(sizeSlider.value()));
    speedSlider.input(() => {
        speedValueSpan.html(speedSlider.value());
        // Regenerate particles with new speed
        particles = [];
        for (let i = 0; i < 500; i++) {
            particles.push(new Particle());
        }
    });
    gravitySlider.input(() => gravityValueSpan.html(gravitySlider.value()));

    // Re-create particles when palette changes
    paletteSelect.changed(() => {
        particles = [];
        for (let i = 0; i < 500; i++) {
            particles.push(new Particle());
        }
    });

    // Initial particle creation
    for (let i = 0; i < 500; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(17, 17, 17);
    for (let particle of particles) {
        particle.update();
        particle.show();
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        // Scale the speed value for a more manageable velocity
        this.vel = p5.Vector.fromAngle(random(TWO_PI)).mult(speedSlider.value() / 20);
        const selectedPalette = palettes[paletteSelect.value()];
        this.color = random(selectedPalette);
    }

    update() {
        this.pos.add(this.vel);
        this.edges();

        let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
        if (d < 100) {
            let force = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
            force.setMag(gravitySlider.value());
            this.vel.add(force);
        }
    }

    edges() {
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        } else if (this.pos.x > width) {
            this.pos.x = width;
            this.vel.x *= -1;
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        } else if (this.pos.y > height) {
            this.pos.y = height;
            this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, sizeSlider.value());
    }
}