import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";

interface FallingTextProps {
    className?: string;
    text?: string;
    highlightWords?: string[];
    highlightClass?: string;
    trigger?: "auto" | "hover" | "click" | "scroll";
    backgroundColor?: string;
    wireframes?: boolean;
    gravity?: number;
    mouseConstraintStiffness?: number;
    fontSize?: string;
}

const FallingText: React.FC<FallingTextProps> = ({
    className = "",
    text = "",
    highlightWords = [],
    highlightClass = "highlighted",
    trigger = "auto",
    backgroundColor = "transparent",
    wireframes = false,
    gravity = 1,
    mouseConstraintStiffness = 0.2,
    fontSize = "1rem",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [effectStarted, setEffectStarted] = useState(false);

    /** ✅ 텍스트 하이라이트 처리 */
    useEffect(() => {
        if (!textRef.current) return;
        const words = text.split(" ");
        const newHTML = words
            .map((word) => {
                const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
                return `<span class="inline-block mx-[2px] select-none ${isHighlighted ? highlightClass : ""
                    }">${word}</span>`;
            })
            .join(" ");
        textRef.current.innerHTML = newHTML;
    }, [text, highlightWords, highlightClass]);

    /** ✅ 트리거 조건 설정 */
    useEffect(() => {
        if (trigger === "auto") {
            setEffectStarted(true);
            return;
        }
        if (trigger === "scroll" && containerRef.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setEffectStarted(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, [trigger]);

    /** ✅ Matter.js 물리 시뮬레이션 */
    useEffect(() => {
        if (!effectStarted) return;
        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

        const container = containerRef.current!;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width <= 0 || height <= 0) return;

        const engine = Engine.create();
        engine.world.gravity.y = gravity;

        const render = Render.create({
            element: canvasContainerRef.current!,
            engine,
            options: {
                width,
                height,
                background: backgroundColor,
                wireframes,
            },
        });

        const boundary = { isStatic: true, render: { fillStyle: "transparent" } };
        const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundary);
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundary);
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundary);
        const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundary);

        const wordSpans = textRef.current!.querySelectorAll<HTMLSpanElement>("span");
        const wordBodies = Array.from(wordSpans).map((elem) => {
            const rect = elem.getBoundingClientRect();
            const x = rect.left - container.offsetLeft + rect.width / 2;
            const y = rect.top - container.offsetTop + rect.height / 2;

            const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                render: { fillStyle: "transparent" },
                restitution: 0.8,
                frictionAir: 0.01,
            });
            Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
            return { elem, body };
        });

        wordBodies.forEach(({ elem }) => {
            elem.style.position = "absolute";
            elem.style.transform = "none";
        });

        const mouse = Mouse.create(container);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
        });
        render.mouse = mouse;

        World.add(engine.world, [
            floor,
            leftWall,
            rightWall,
            ceiling,
            mouseConstraint,
            ...wordBodies.map((w) => w.body),
        ]);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        const loop = () => {
            wordBodies.forEach(({ body, elem }) => {
                const { x, y, angle } = body.position;
                elem.style.left = `${x}px`;
                elem.style.top = `${y}px`;
                elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
            });
            requestAnimationFrame(loop);
        };
        loop();

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas && canvasContainerRef.current) {
                canvasContainerRef.current.removeChild(render.canvas);
            }
            World.clear(engine.world);
            Engine.clear(engine);
        };
    }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

    const handleTrigger = () => {
        if (!effectStarted && (trigger === "click" || trigger === "hover")) {
            setEffectStarted(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative z-[1] w-full h-full cursor-pointer text-center pt-8 overflow-hidden ${className}`}
            onClick={trigger === "click" ? handleTrigger : undefined}
            onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
        >
            <div
                ref={textRef}
                className="inline-block"
                style={{ fontSize, lineHeight: "1.4" }}
            />
            <div
                ref={canvasContainerRef}
                className="absolute top-0 left-0 z-0"
            />
        </div>
    );
};

export default FallingText;
