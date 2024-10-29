import Background from "components/background";
import Landing from "components/landing";
import Lines from "components/lines";
import AudioStory from "components/stories/audio";
import VideoStory from "components/stories/video";
import { useStore } from "hooks/use-store";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import Grid from "services/grid";
import * as THREE from "three";
import issues from "services/issues";
import { useThree } from "react-three-fiber";

// This offset will move all the children down a bit...
const yOffset = -3;

const StoryBrowser = observer((props) => {
    const store = useStore();
    const state = useThree();

    // Set the background color when the component mounts
    useEffect(() => {
        state.gl.setClearColor(0xffffff, 0);
    }, [state.gl]);

    // Handle route changes and set the active item in the store
    useEffect(() => {
        const id = props.pathname.replace("/", "");
        store.setActiveId(id);
    }, [props.pathname, store]);

    // Update the camera position when the active item or camera hint ID changes
    useEffect(() => {
        const item = storyPositions.find((item) => item.id === store.activeId);
        if (item) {
            store.setActivePosition(
                new THREE.Vector3(item.position.x, item.position.y + yOffset, 0)
            );
        }
    }, [store.activeId, store.cameraHintId]);

    // Initialize layout and positions for video and audio stories
    const [layout] = useState(() => {
        const grid = new Grid(4, "hi ram!");

        const initialBox = issues.MOBILE
            ? new THREE.Vector2(5, 5)
            : new THREE.Vector2(8, 5);
        grid.addBox(initialBox);
        grid.stepNulls(4);

        let videoPositions = new Array(store.content.video.length).fill();
        videoPositions = videoPositions.map(() => {
            const position = grid.addBox(new THREE.Vector2(4, 4));
            grid.stepRandomNulls(0, 1);
            return position;
        });

        grid.computePartitions();
        grid.subDividePartitions(4);
        let partitions = grid.allocateRandomPartitions(grid.partitions.length, 2);
        partitions = partitions.sort((a, b) => {
            const aPos = a.getCenter(new THREE.Vector2());
            const bPos = b.getCenter(new THREE.Vector2());
            if (aPos.y === bPos.y) {
                return aPos.x > bPos.x ? 1 : -1;
            } else {
                return aPos.y > bPos.y ? 1 : -1;
            }
        });

        store.setCameraBounds(grid.getBounds());

        return {
            videos: videoPositions,
            audio: partitions,
        };
    });

    // Memoize the creation of video and audio stories for better performance
    const [stories, storyPositions] = useMemo(() => {
        const storyPositions = [];
        const videos =
            store.content &&
            store.content.video.map((props, i) => {
                const position2d = layout.videos[i];
                storyPositions.push({
                    id: props.id,
                    position: position2d,
                });
                return (
                    <VideoStory
                        id={props.id}
                        isActive={props.id === store.activeId}
                        key={`video-${i}`}
                        type="video"
                        position={[position2d.x, position2d.y + yOffset, 0]}
                        subtitles={props.subtitles}
                        hero={props.hero}
                    />
                );
            });

        let contentIndex = 0;
        let hasFoundActive = false;
        const audio = layout.audio.map((partition, i) => {
            const props = store.content.audio[contentIndex];
            const position2d = partition.getCenter(new THREE.Vector2());
            const size = partition.getSize(new THREE.Vector2());
            const cameraHintId = `${props.id}-${i}`;

            const isActive = (() => {
                if (store.cameraHintId) {
                    return (
                        props.id === store.activeId &&
                        cameraHintId === store.cameraHintId
                    );
                } else {
                    return props.id === store.activeId && !hasFoundActive;
                }
            })();
            if (isActive) hasFoundActive = true;

            const story = (
                <AudioStory
                    cameraHintId={cameraHintId}
                    id={props.id}
                    isActive={isActive}
                    key={`audio-${i}`}
                    type="audio"
                    direction={i % 2 === 0 ? -1 : 1}
                    position={[position2d.x, position2d.y + yOffset, 0]}
                    quality={props.quality}
                    tickerText={props.text.ticker}
                    dimensions={[size.x, 1]}
                />
            );
            storyPositions.push({
                cameraHintId,
                id: props.id,
                position: position2d,
            });
            contentIndex++;
            if (contentIndex >= store.content.audio.length) contentIndex = 0;
            return story;
        });
        return [[...videos, ...audio], storyPositions];
    }, [store.activeId, layout.audio, layout.videos]);

    return (
        <>
            <Landing position={[0, 0.5, 0]} />
            {stories}
            <Lines />
            <Background position={[0, 0, -25]} />
        </>
    );
});

export default StoryBrowser;
