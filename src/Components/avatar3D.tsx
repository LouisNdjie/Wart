import { Canvas} from '@react-three/fiber'
import {useGLTF, OrbitControls, Environment, useFBX, useAnimations} from '@react-three/drei'
import {Suspense, useEffect, useState, useRef} from 'react'
import * as THREE from 'three'

const LoadAvatar = ( ) =>
    {
        const avatar = useGLTF('/model.glb')
        const idleFbx = useFBX('/animations/Idle.fbx')
        const walkFbx = useFBX('/animations/Walking.fbx')

        idleFbx.animations[0].name = 'idle'
        walkFbx.animations[0].name = 'walk'

        const {actions} = useAnimations([idleFbx.animations[0], walkFbx.animations[0]], avatar.scene)

        const [currentAction, setCurrentAction] = useState('idle')

        const previousAction = useRef<string>('')

        useEffect(()=> {
            const keyHandleDown = (event: KeyboardEvent) =>{
                const key = event.key.toLowerCase();
                if (key === 'w')
                    {
                        setCurrentAction('walk');
                    }else if(key === 'i')
                        {
                            setCurrentAction('idle');
                        }
            }
            window.addEventListener('keydown', keyHandleDown)
            return () => {
                window.removeEventListener('keydown', keyHandleDown)
            }
        }, [])
        useEffect(() => {
            const action = actions[currentAction]
            const previous = actions[previousAction.current]

            if (action){
                action.reset().fadeIn(0.5).play()

                if (previous && previous !== action){
                    previous.fadeOut(0.5)
                }
            }
        }, [currentAction])
        return <primitive object={avatar.scene} scale={1.5} position={[0, -1, 0]} />
    }

const Avatar = () =>
    {
        return(
            <div style = {{width: '100vw', height: '100vh'}}>
                <Canvas camera={{position: [0, 2, 5], fov: 50}}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
                        <pointLight position={[-10, -10, -10]} />
                        <Environment preset="city" />
                        <LoadAvatar />
                    </Suspense>
                    <OrbitControls />
                </Canvas>
            </div>
        );
    };
export default Avatar;