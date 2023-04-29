import { OrbitControls, Stage, Stars } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { Suspense } from 'react'
import { Loading } from './Loading/Loading'
import { Engine } from './Engine/Engine'
import { Canvas } from '@react-three/fiber'
import { Bloom } from '@react-three/postprocessing'
import { Unit } from './units/Unit/Unit'

import { useCallback } from 'react'
import { useGameStore } from '@/store/game/useGameStore'

import _ from 'lodash'

import { SetCamera, SetRenderer, SetScene } from '@/store/game/interface'
import { ThreeEvent } from '@react-three/fiber'
import { RootState } from '@react-three/fiber'

import styles from './Game.module.scss'

export function Game(): JSX.Element {
  console.log('%cGame rendered', 'color: green')

  const onLetsAttackUnit = useCallback(
    (event: ThreeEvent<MouseEvent>): void => {
      console.log(event)
    },
    []
  )

  const setScene: SetScene = useGameStore(({ setScene }) => setScene)
  const setCamera: SetCamera = useGameStore(({ setCamera }) => setCamera)
  const setRenderer: SetRenderer = useGameStore(
    ({ setRenderer }) => setRenderer
  )

  return (
    <div className={styles.container}>
      <Canvas
        shadows
        onCreated={({ gl, scene, camera }: RootState): void => {
          setScene(scene)
          setCamera(camera)
          setRenderer(gl)
        }}
      >
        <OrbitControls />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
        </EffectComposer>
        <color attach={'background'} args={['#15151a']} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <Engine>
          <Stage
            intensity={0.5}
            preset={'rembrandt'}
            adjustCamera={1}
            shadows={{
              type: 'accumulative',
              color: 'black',
              colorBlend: 2,
              opacity: 2,
            }}
            environment={'city'}
          >
            <Suspense fallback={<Loading />}>
              <Unit groupProps={{ onContextMenu: onLetsAttackUnit }} />
            </Suspense>
          </Stage>
        </Engine>
      </Canvas>
    </div>
  )
}