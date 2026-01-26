// @ts-ignore
import React from 'react'
import type { Background, Feature } from '@cucumber/messages'
import { Description } from './html-desc.tsx'
import { StepsDoc } from './html-steps.tsx'
import { ScenarioDoc } from './html-scenario.tsx'

type BackgroundDocProps = { readonly background: Background }

const BackgroundDoc = ({ background }: BackgroundDocProps) => (
    <div>
        <h2>Background</h2>
        <Description description={background.description} />
        <StepsDoc steps={background.steps} />
    </div>
)

type FeatureProps = { readonly feature: Feature }

export const FeatureDoc = ({ feature }: FeatureProps) => (
    <>
        <h1>{feature.name}</h1>
        <Description description={feature.description} />
        {feature.children.map(child => (
            <>
                {child.background && <BackgroundDoc background={child.background} />}
                {child.scenario && <ScenarioDoc scenario={child.scenario} />}
            </>
        ))}
    </>
)
