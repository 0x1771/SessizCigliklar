import React, { useEffect } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import styled, { keyframes } from "styled-components";
import { ReactComponent as WomanSvg } from "./woman.svg"; // Fix the SVG import

const SpinnerDiv = styled.div`
  background: transparent;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Neue Machina";
  font-weight: regular;
  text-align: center;
  z-index: 999;
  pointer-events: none;
`;

const spin = keyframes`
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  } 
  100% {
    transform: rotate(360deg);
  }
`;

const SvgEl = styled(animated.svg)`
  .spinner-circle {
    stroke: #000;
    fill: none;
    stroke-linecap: round;
    stroke-width: 1px;
    stroke-dasharray: 20px 350px;
    transform-origin: center center;
    animation-name: ${spin};
    animation-duration: 0.25s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .red-circle {
    fill: rgb(173, 0, 0);
  }

  .woman {
  }

  .test {
    border: 1px solid green;
  }
`;

const Spinner = (props) => {
    // Fix useTransition API and key parameter
    const transitionsDiv = useTransition(!props.ready, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        trail: 333,
    });

    const [miscProps, setMiscProps] = useSpring(() => ({
        r: 0,
        fill: 0,
        config: { duration: 100 },
    }));

    useEffect(() => {
        if (props.ready) {
            setMiscProps({ r: 30, fill: 1 });
        }
    }, [props.ready, setMiscProps]);

    return (
        <SpinnerDiv>
            {transitionsDiv((style, item) => {
                return (
                    item && (
                        <animated.div style={{ opacity: style.opacity }} className="content">
                            <SvgEl width={60} height={60}>
                                <animated.circle
                                    className="spinner-circle"
                                    cx={30}
                                    cy={30}
                                    r={28}
                                />
                                <animated.circle
                                    className="red-circle"
                                    cx={30}
                                    cy={30}
                                    r={miscProps.r}
                                />
                                <animated.g
                                    style={{
                                        fill: miscProps.fill.to(
                                            (v) => `rgb(${v * 255},${v * 255},${v * 255})`
                                        ),
                                    }}
                                >
                                    <WomanSvg x={12} y={22} className="woman" />
                                </animated.g>
                            </SvgEl>
                        </animated.div>
                    )
                );
            })}
        </SpinnerDiv>
    );
};

export default Spinner;
