

const matter = () => {
  //MATTER

  //global logic

  const matterTemplate = document.querySelector('.matter-template');
  const THICCNESS = 120;

  const getWidth = () => {
    return Math.max(document.documentElement?.clientWidth, window.innerWidth || 0);
  };

  const randomW = () => {
    return Math.random() * matterTemplate.clientWidth;
  };
  const randomH = () => {
    return Math.random() * matterTemplate.clientHeight;
  };

  // random color

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
  }

  // arraysElements

  const largeElements = [
    {
      width: 162,
      height: 60,
    },
    {
      width: 163,
      height: 60,
    },
    {
      width: 328,
      height: 60,
    },
    {
      width: 166,
      height: 60,
    },
    {
      width: 120,
      height: 60,
    },
    {
      width: 275,
      height: 60,
    },
    {
      width: 165,
      height: 60,
    },
    {
      width: 350,
      height: 60,
    },
    {
      width: 388,
      height: 120,
    },
    {
      width: 175,
      height: 60,
    },
    {
      width: 115,
      height: 60,
    },
    {
      width: 170,
      height: 60,
    },
    {
      width: 240,
      height: 60,
    },
    {
      width: 260,
      height: 60,
    },
  ];

  const smallElements = [
    {
      width: 160,
      height: 35,
    },
    {
      width: 95,
      height: 35,
    },
    {
      width: 95,
      height: 35,
    },
    {
      width: 95,
      height: 35,
    },
    {
      width: 183,
      height: 35,
    },
    {
      width: 203,
      height: 35,
    },
    {
      width: 210,
      height: 65,
    },
    {
      width: 102,
      height: 35,
    },
    {
      width: 68,
      height: 35,
    },
    {
      width: 97,
      height: 35,
    },
    {
      width: 150,
      height: 35,
    },
    {
      width: 140,
      height: 35,
    },
    {
      width: 70,
      height: 35,
    },
    {
      width: 97,
      height: 35,
    },
  ];

  // module plugins

  Matter.use('matter-attractors');

  // module aliases

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Bodies = Matter.Bodies;
  const Composite = Matter.Composite;

  // create an engine and settings

  const engine = Engine.create();
  engine.timing.timeScale = 0.8;
  engine.gravity.scale = 0;
  engine.frictionAir = 0;
  engine.frictionStatic = 0.3;

  // create a renderer

  const render = Render.create({
    element: matterTemplate,
    engine: engine,
    options: {
      width: matterTemplate.clientWidth,
      height: matterTemplate.clientHeight,
      background: '#1F1F1F',
      wireframes: false,
      showAngleIndicator: false,
      pixelRatio: 'auto',
    },
  });

  //mouse

  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: {
        visible: false,
      },
    },
  });
  Composite.add(engine.world, mouseConstraint);

  // mouse fix

  mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
  mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);

  // touch fix

  mouseConstraint.mouse.element.removeEventListener('touchstart', mouseConstraint.mouse.mousedown);
  mouseConstraint.mouse.element.removeEventListener('touchmove', mouseConstraint.mouse.mousemove);
  mouseConstraint.mouse.element.removeEventListener('touchend', mouseConstraint.mouse.mouseup);

  mouseConstraint.mouse.element.addEventListener('touchstart', mouseConstraint.mouse.mousedown, { passive: true });
  mouseConstraint.mouse.element.addEventListener('touchmove', (e) => {
    if (mouseConstraint.body) {
      mouseConstraint.mouse.mousemove(e);
    }
  });
  mouseConstraint.mouse.element.addEventListener('touchend', (e) => {
    if (mouseConstraint.body) {
      mouseConstraint.mouse.mouseup(e);
    }
  });

  // fix prevent walls

  const delta = 1000 / 60;
  const subSteps = 3;
  const subDelta = delta / subSteps;

  (function run() {
    window.requestAnimationFrame(run);
    for (let i = 0; i < subSteps; i += 1) {
      Engine.update(engine, subDelta);
    }
  })();

  // create box

  const createElement = (x, y, width, height, color) => {
    const el = Bodies.rectangle(x, y, width, height, {
      render: {
        fillStyle: color,
      },
    });
    Composite.add(engine.world, el);
  };

  // create a body with an attractor

  const attractiveBody = Bodies.circle(matterTemplate.clientWidth / 2, matterTemplate.clientHeight / 2, 0, {
    isStatic: true,
    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-5,
            y: (bodyA.position.y - bodyB.position.y) * 1e-5,
          };
        },
      ],
    },
  });

  Composite.add(engine.world, attractiveBody);

  // create ground, roof, walls

  const ground = Bodies.rectangle(
    matterTemplate.clientWidth / 2,
    matterTemplate.clientHeight + THICCNESS / 2,
    5000,
    THICCNESS,
    {
      isStatic: true,
      render: {
        lineWidth: 10,
        visible: false,
      },
    }
  );

  const roof = Bodies.rectangle(
    0,
    matterTemplate.clientHeight - matterTemplate.clientHeight - THICCNESS / 2,
    5000,
    THICCNESS,
    {
      isStatic: true,
      render: {
        lineWidth: 10,
        visible: false,
      },
    }
  );

  const leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterTemplate.clientHeight / 2,
    THICCNESS,
    matterTemplate.clientHeight * 5,
    {
      isStatic: true,
      render: {
        lineWidth: 10,
        visible: false,
      },
    }
  );

  const rightWall = Bodies.rectangle(
    matterTemplate.clientWidth + THICCNESS / 2,
    matterTemplate.clientHeight / 2,
    THICCNESS,
    matterTemplate.clientHeight * 5,
    {
      isStatic: true,
      render: {
        lineWidth: 10,
        visible: false,
      },
    }
  );

  // add all of the bodies to the world

  Composite.add(engine.world, [ground, roof, leftWall, rightWall]);

  // check width and respawn

  const checkWidth = getWidth();

  const elementsRespawn = (array) => {
    array.forEach((obj) => {
      createElement(randomW(), randomH(), obj.width, obj.height, getRandomColor());
    });
  };

  const respawn = (width) => {
    if (width >= 500) return elementsRespawn(largeElements);
    if (width >= 320) return elementsRespawn(smallElements);
  };

  respawn(checkWidth);

  // run the renderer

  Render.run(render);

  // create runner

  const runner = Runner.create();

  // run the engine

  Runner.run(runner, engine);

  //response

  const handleResize = (matterTemplate) => {
    render.canvas.width = matterTemplate.clientWidth;
    render.canvas.heigth = matterTemplate.clientHeight;
    render.bounds.max.x = matterTemplate.clientWidth;
    render.bounds.max.y = matterTemplate.clientHeight;
    render.options.width = matterTemplate.clientWidth;
    render.options.height = matterTemplate.clientHeight;
    Matter.Render.setPixelRatio(render, window.devicePixelRatio);

    Matter.Body.setPosition(
      ground,
      Matter.Vector.create(matterTemplate.clientWidth / 2, matterTemplate.clientHeight + THICCNESS / 2)
    );

    Matter.Body.setPosition(
      roof,
      Matter.Vector.create(0, matterTemplate.clientHeight - matterTemplate.clientHeight - THICCNESS / 2)
    );

    Matter.Body.setPosition(
      rightWall,
      Matter.Vector.create(matterTemplate.clientWidth + THICCNESS / 2, matterTemplate.clientHeight / 2)
    );

    Matter.Body.setPosition(
      attractiveBody,
      Matter.Vector.create(matterTemplate.clientWidth / 2, matterTemplate.clientHeight / 2)
    );
  };

  window.addEventListener('resize', () => handleResize(matterTemplate));
};

export default matter;
