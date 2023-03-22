import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei'
import React, { useState, useEffect  } from 'react';
export default function Experience() {
  const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) 
        {console.log('visible')
          setIsVisible(true);
        } else {console.log('pas visible')
          setIsVisible(false);
        }
      });
    });
    const targetElement = document.querySelector('#pcc');
    observer.observe(targetElement);
  }, []);

  return <>
    {isVisible && (
      <>
        <color args={['#e7e7e7']} attach="background" />

        <Environment preset="city" />

        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[- 0.4, 0.2]}
          azimuth={[- 1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float rotationIntensity={0.7} >
            <rectAreaLight
              width={2.5}
              height={1.65}
              intensity={50}
              color={'#ffffff'}
              rotation={[- 0.1, Math.PI, 0]}
              position={[0, 0.55, - 1.15]}
            />

            <primitive
              object={computer.scene}
              position-y={- 1.2}
            // rotation-x={ 0.13 }
            >
              <Html
                transform
                wrapperClass="htmlScreen"
                distanceFactor={1.2}
                position={[0, 1.43, - 1.4]}
                rotation-x={- 0.256}
              >
                {/* <iframe src="https://bastien-oswald.fr/dart/" /> */}
                <img src="threejs.png" className='certificate' onMouseEnter={() => {
                  document.querySelector('.certificate').classList.add('pointerCursor');
                }} onMouseLeave={() => {
                  document.querySelector('.certificate').classList.remove('pointerCursor');
                }} onClick={() => window.open('https://threejs-journey.com/certificate/view/18192', '_blank')}></img>
              </Html>
            </primitive>


          </Float>
        </PresentationControls>

        <ContactShadows
          position-y={- 1.4}
          opacity={0.4}
          scale={5}
          blur={2.4}
        />

      </>
        )
              }
  </>}