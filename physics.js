class Physics {
  static G = 0.9;

  static update(particles, segments) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(Physics.G);
    }

    const rigidity = 5;

    for (let j = 1; j < rigidity; j++) {
      for (let i = 0; i < segments.length; i++) {
        segments[i].update();
      }
    }
  }
}

export default Physics;
