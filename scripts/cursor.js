function initCustomCursor() {
    const bigBall = document.querySelector('.cursor__ball--big');
    const hoverables = document.querySelectorAll('.hoverable, a, button');

    gsap.set(bigBall, { opacity: 1 });
    
    const onMouseMove = e => {
        // follews with a slight delay
        gsap.to(bigBall, 0.4, {
            x: e.clientX - 20,
            y: e.clientY - 20,
        });
    };

    const scaleBig = s => {
        gsap.to(bigBall, 0.3, { scale: s });
    };

    document.body.addEventListener('mousemove', onMouseMove);

    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => scaleBig(1.8));
        el.addEventListener('mouseleave', () => scaleBig(1));
    });

    document.body.addEventListener('mouseleave', () => {
        gsap.to(bigBall, 0.3, { opacity: 0 });
    });
    document.body.addEventListener('mouseenter', () => {
        gsap.to(bigBall, 0.3, { opacity: 1 });
    });
}

if (typeof gsap !== 'undefined') {
    initCustomCursor();
} else {
    window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') {
            initCustomCursor();
        }
    });
}