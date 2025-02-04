gsap.registerPlugin(Draggable, MorphSVGPlugin);

        document.querySelectorAll('.button').forEach(button => {

            let handle = button.querySelector('.handle'),
                handlePath = handle.querySelector('.background path'),
                drop = button.querySelector('.drop'),
                dropPath = drop.querySelector('.background path');

            let handleTween = gsap.to(handlePath, {
                paused: true,
                morphSVG: 'M5 16C5 9.92487 9.92487 5 16 5H24C30.0751 5 34 9.92487 36 16C36 16 37 18.4379 37 20C37 21.5621 36 24 36 24C34 30.0751 30.0751 35 24 35H16C9.92487 35 5 30.0751 5 24C5 24 5 21.5621 5 20C5 18.4379 5 16 5 16Z'
            });

            let dropTween = gsap.to(dropPath, {
                paused: true,
                morphSVG: 'M4 16C6 9.92487 9.92487 5 16 5H24C30.0751 5 35 9.92487 35 16C35 16 35 18.4379 35 20C35 21.5621 35 24 35 24C35 30.0751 30.0751 35 24 35H16C9.92487 35 6 30.0751 4 24C4 24 3 21.5621 3 20C3 18.4379 4 16 4 16Z'
            });

            gsap.set(handle, {
                x: 0
            });

            Draggable.create(handle, {
                type: 'x',
                bounds: button,
                onDrag(e) {
                    dragging(this.x, button, handle, drop, handleTween, dropTween);
                },
                onRelease(e) {
                    if (!this.hitTest(drop)) {
                        gsap.to(handle, {
                            x: 0,
                            duration: .6,
                            ease: 'elastic.out(1, .75)',
                            onUpdate(e) {
                                dragging(gsap.getProperty(handle, 'x'), button, handle, drop, handleTween, dropTween);
                            }
                        });
                        if (gsap.getProperty(handle, 'x') > 0) {
                            gsap.to(handlePath, {
                                keyframes: [{
                                    morphSVG: 'M5 16C5 9.92487 9.92487 5 16 5H24C30.0751 5 37 9.92487 35 16C35 16 34 18.4379 34 20C34 21.5621 35 24 35 24C37 30.0751 30.0751 35 24 35H16C9.92487 35 5 30.0751 5 24C5 24 5 21.5621 5 20C5 18.4379 5 16 5 16Z',
                                    duration: .2
                                }, {
                                    morphSVG: 'M5 16C5 9.92487 9.92487 5 16 5H24C30.0751 5 35 9.92487 35 16C35 16 35 18.4379 35 20C35 21.5621 35 24 35 24C35 30.0751 30.0751 35 24 35H16C9.92487 35 5 30.0751 5 24C5 24 5 21.5621 5 20C5 18.4379 5 16 5 16Z',
                                    duration: .3
                                }]
                            });
                        }
                    } else {
                        this.disable()
                        gsap.to(handle, {
                            keyframes: [{
                                x: drop.offsetLeft - 8,
                                duration: .6,
                                ease: 'elastic.out(1, .8)'
                            }, {
                                x: button.offsetWidth / 2 - handle.offsetWidth - 20,
                                duration: .3
                            }]
                        });
                        gsap.to(handlePath, {
                            keyframes: [{
                                morphSVG: 'M5 16C3 9.92487 9.92487 5 16 5H24C30.0751 5 35 9.92487 35 16C35 16 35 18.4379 35 20C35 21.5621 35 24 35 24C35 30.0751 30.0751 35 24 35H16C9.92487 35 3 30.0751 5 24C5 24 6 21.5621 6 20C6 18.4379 5 16 5 16Z',
                                duration: .2
                            }, {
                                morphSVG: 'M5 16C5 9.92487 9.92487 5 16 5H24C30.0751 5 35 9.92487 35 16C35 16 35 18.4379 35 20C35 21.5621 35 24 35 24C35 30.0751 30.0751 35 24 35H16C9.92487 35 5 30.0751 5 24C5 24 5 21.5621 5 20C5 18.4379 5 16 5 16Z',
                                duration: .15
                            }]
                        });
                        gsap.to(button, {
                            '--background-opacity': 0,
                            '--progress-opacity': 0,
                            '--handle-blur': 0,
                            '--icon-y': .5,
                            duration: .3,
                            delay: .2
                        });
                        gsap.to(button, {
                            '--icon-rotate': 87,
                            '--icon-offset': 15.5,
                            '--icon-scale': 1.5,
                            duration: .25,
                            delay: .3
                        });
                        gsap.to(button, {
                            '--success-opacity': 1,
                            '--success-scale': 1,
                            '--success-x': 8,
                            duration: .2,
                            delay: .8
                        });
                    }
                }
            });

            button.addEventListener('click', e => {

                if (button.classList.contains('active')) {
                    return
                }

                button.classList.add('active');

                gsap.to(button, {
                    '--handle-drop-opacity': 1,
                    '--default-opacity': 0,
                    '--default-scale': .8,
                    duration: .2
                })
                gsap.to(button, {
                    '--progress-opacity': .5,
                    '--progress-scale': 1,
                    duration: .2,
                    delay: .15
                })

            });

        });

        function dragging(x, button, handle, drop, handleTween, dropTween) {
            let progress = button.offsetWidth - 16 - handle.offsetWidth - drop.offsetWidth - x - 8;

            progress = (12 - (progress > 12 ? 12 : progress < -12 ? -12 : progress)) / 12;
            progress = progress > 1 ? 2 - progress : progress;

            handleTween.progress(progress);
            dropTween.progress(progress);
        }