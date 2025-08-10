export function Start() {
    return (<>
        <div id="content">
            <div className='layer center'></div>
            <div className='layer center'>
                <h1>Welcome to Card Conjurer</h1>
                <h3>The custom Magic: The Gathering card creator</h3>
            </div>
            <div className='layer center'></div>
            <div className='layer readable-background center'>
                <div className='sample-grid'>
                    <div className='animated-scene'><img src='img/samples/sample1.png' className='animated-card-1'/>
                    </div>
                    <div className='vertical-center'>
                        <h1 className='padding margin-bottom'>Choose from a Variety of Card Frames</h1>
                        <h3 className='padding margin-bottom'>Card Conjurer offers Expeditions, Inventions, Showcase
                            Frames, and so much more. <a href="#" hx-get="creator" hx-target="#content"
                                                         hx-trigger="click">Take a look</a>!</h3>
                    </div>
                </div>
            </div>
            <div className='layer center'>
                <div className='sample-grid right'>
                    <div className='vertical-center'>
                        <h1 className='padding margin-bottom'>Customize to Your Heart's Content</h1>
                        <h3 className='padding margin-bottom'>With Card Conjurer's level of customization, you'll
                            have
                            endless options when designing your dream cards. <a href="#" hx-get="creator"
                                                                                hx-target="#content"
                                                                                hx-trigger="click">Try
                                it out</a>!</h3>
                    </div>
                    <div className='animated-scene'><img src='img/samples/sample2.png'
                                                         className='animated-card-1 animation-delay-2'/></div>
                </div>
            </div>
            <div className='layer readable-background center'>
                <div className='sample-grid'>
                    <div className='animated-scene'><img src='img/samples/sample3.png'
                                                         className='animated-card-1 animation-delay-4'/></div>
                    <div className='vertical-center'>
                        <h1 className='padding margin-bottom'>Bling Out Existing Favorites</h1>
                        <h3 className='padding margin-bottom'>Easily import vital information from existing cards,
                            then
                            redesign them. <a href="#" hx-get="creator" hx-target="#content" hx-trigger="click">Go
                                on,
                                do it</a>!</h3>
                    </div>
                </div>
            </div>
            <div className='layer center'>
                <h1 className='margin-bottom'>Ready?</h1>
                <a href="#" hx-get="creator" hx-target="#content" hx-trigger="click"><h1>Get Started</h1></a>
            </div>
        </div>
    </>)
}