import * as helperFunctions from '../../../js/main-1.js';
import '../../../data/scripts/localCardStorage.js';
import '../../../js/programaticgeneration.js';
import {Outlet} from "react-router";

export function App() {
    return (
        <>
            <div className='background'></div>
            <header className='readable-background'>
                <h1 className='title center'>CARD CONJURER</h1>
            </header>
            <div>
                <svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     xmlnsXlink="http://www.w3.org/1999/xlink"
                     xmlSpace="preserve"
                     className='hamburger' onClick={() => helperFunctions.toggleMenu()}>
                    <path className='line1' d="M10,18L90,18L10,82"/>
                    <path className='line3' d="M10,82L90,82L10,18"/>
                    <path className='line2' d="M10,50L90,50"/>
                </svg>
                <div className='circle'></div>
                <div className='menu menu-hidden'>
                    <div className='main-menu'>
                        <h2>Navigation</h2>
                        <h3><a href="#" hx-get="index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Home</a></h3>
                        <h3><a href="#" hx-get="creator/index.html" hx-target="#content"
                               hx-trigger="click, doCreate from:body" onClick={() => helperFunctions.toggleMenu()}>Card Creator</a></h3>
                        <h3><a href="#" hx-get="print/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Printing Tool</a></h3>
                        <h3><a href="#" hx-get="askurza/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Ask Urza 2.0</a></h3>
                        <h3><a href="#" hx-get="phyrexian/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Phyrexian Generator</a></h3>
                        <h3><a href='#' hx-get="about/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>About Me</a></h3>
                        <h3><a href='#' hx-get="gallery/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Gallery</a></h3>
                        <h3><a href='#' hx-get="theme/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Theme Editor</a></h3>
                        <h3><a href='#' hx-get="legal/index.html" hx-target="#content" hx-trigger="click"
                               onClick={() => helperFunctions.toggleMenu()}>Legal</a></h3>
                    </div>
                </div>
                <div className='notification-container'></div>
            </div>

            <Outlet />

        </>

    );
}