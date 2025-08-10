import "../../../js/main-1";
import {
    downloadCard,
    applyMargins,
    artEdited,
    changeArtIndex,
    fetchScryfallData,
    artFromScryfall,
    artistEdited,
    uploadArt,
    fetchSetSymbol,
    drawCard,
    blank,
    autoFitArt,
    getSetSymbolWatermark,
    fixUri,
    imageURL,
    uploadWatermark,
    lockCanvasHeight,
    importChanged,
    changeCardIndex,
    deleteSavedCards,
    loadCardFormatted,
    saveCard,
    deleteCard,
    downloadSavedCards,
    uploadSavedCards,
    toggleCreatorTabs,
    clearFrames,
    autoLoadFrameVersion,
    addFrame,
    loadAvailableCards
} from '../../../js/creator-23.js';
import {frameSearch} from '../../../js/frameSearch.js';
import {toggleCollapse, uploadFiles} from "../../../js/main-1";
import {importCsv, onImportCsv} from "../../../js/programaticgeneration";
import {useEffect} from "react";

export function CardCreator() {
    useEffect(() => {
        loadAvailableCards();
    }, [])

    return (
        <div className='main-content'>
            <div id='frame-element-editor' className='frame-element-editor'>
                <h2 className='frame-element-editor-title'>Frame Image Editor</h2>
                <h2 className='frame-element-editor-close'
                    onClick={() => this.parentElement.classList.remove("opened")}>X</h2>
                <div>
                    <p className='input-description'>X</p>
                    <input id='frame-editor-x' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Y</p>
                    <input id='frame-editor-y' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Width</p>
                    <input id='frame-editor-width' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Height</p>
                    <input id='frame-editor-height' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Opacity</p>
                    <input id='frame-editor-opacity' className='input' type='number' placeholder='Opacity' max='100'
                           min='0'
                           step='1'/>
                </div>
                <div>
                    <p className='input-description'>Erase</p>
                    <label className='checkbox-container input'>Erase Card
                        <input id='frame-editor-erase' type='checkbox' placeholder='Erase'/>
                        <span className='checkmark'></span>
                    </label>
                </div>
                <div>
                    <p className='input-description'>Blending Mode</p>
                    <label className='checkbox-container input'>Preserve Alpha
                        <input id='frame-editor-alpha' type='checkbox' placeholder='Preserve Alpha'/>
                        <span className='checkmark'></span>
                    </label>
                </div>
                <div>
                    <label className='checkbox-container input'>Color Overlay
                        <input id='frame-editor-color-overlay-check' type='checkbox' placeholder='Color Overlay'/>
                        <span className='checkmark'></span>
                    </label>
                    <input id='frame-editor-color-overlay' className='input' type='color' placeholder='Color'
                           value='#000000'/>
                </div>
                <div>
                    <p className='input-description'>HSL Adjustments</p>
                    <input id='frame-editor-hsl-hue-slider' className='input' type='range' min='-180' max='180'
                           value='0'
                           step='1'/>
                    <input id='frame-editor-hsl-hue' className='input' type='number' min='-180' max='180' value='0'
                           step='1'/>
                    <input id='frame-editor-hsl-saturation-slider' className='input' type='range' min='-100' max='100'
                           value='0' step='1'/>
                    <input id='frame-editor-hsl-saturation' className='input' type='number' min='-100' max='100'
                           value='0'
                           step='1'/>
                    <input id='frame-editor-hsl-lightness-slider' className='input' type='range' min='-100' max='100'
                           value='0' step='1'/>
                    <input id='frame-editor-hsl-lightness' className='input' type='number' min='-100' max='100'
                           value='0'
                           step='1'/>
                </div>
                <div>
                    <p className='input-description'>Select and remove masks</p>
                    <select id='frame-editor-masks' className='input margin-bottom'></select>
                    <button onClick='frameElementMaskRemoved();' className='input'>Remove mask</button>
                </div>
                <div className='drop-area'>
                    <p className='margin-bottom padding input-description'>Drag and drop masks to add</p>
                    <input type='file' multiple accept='.png, .svg, .jpg, .jpeg, .bmp' placeholder='File Upload'
                           className='input' onInput='uploadFiles(event.target.files, uploadMaskOption);'
                           data-dropFunction='uploadMaskOption' data-otherParams=''/>
                </div>
            </div>
            <div id='textbox-editor' className='textbox-editor'>
                <h2 className='textbox-editor-title'>Textbox Editor</h2>
                <h2 className='textbox-editor-close' onClick='this.parentElement.classList.remove("opened");'>X</h2>
                <div>
                    <p className='input-description'>X</p>
                    <input id='textbox-editor-x' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Y</p>
                    <input id='textbox-editor-y' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Width</p>
                    <input id='textbox-editor-width' className='input' type='number' placeholder='X' step='1'/>
                </div>
                <div>
                    <p className='input-description'>Height</p>
                    <input id='textbox-editor-height' className='input' type='number' placeholder='X' step='1'/>
                </div>
            </div>
            {/*!--Regular stuff --*/}
            <div id='creator-main' className='creator-grid'>
                <div id="creator-canvas-wrapper" className="creator-canvas-wrapper">
                    <canvas className='creator-canvas canvas-lock box-shadow' id='previewCanvas' width='1005'
                            height='1407'></canvas>
                </div>
                <div className='creator-menu'>
                    <div id='creator-menu-tabs' className='creator-menu-tabs'>
                        <button className='creator-menu-item readable-background selected'
                                onClick={e => toggleCreatorTabs(e, "import")}>Import/Save
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "frame")}>Frame
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "text")}>Text
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "art")}>Art
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "setSymbol")}>Set Symbol
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "watermark")}>Watermark
                        </button>
                        <button className='creator-menu-item readable-background'
                                onClick={e => toggleCreatorTabs(e, "bottomInfo")}>Collector
                        </button>
                        {/*<button className='creator-menu-item readable-background'
                                 onClick={e => toggleCreatorTabs(e, "tutorial")}>Tutorial</button>*/}
                    </div>
                    <div id='creator-menu-sections' className='margin-bottom'>
                        <div id='creator-menu-frame' className='hidden'>
                            <div className='readable-background margin-bottom padding'>
                                <p className='margin-bottom padding input-description'>
                                    Select a Frame Group and a Frame Pack, or type to search. Then you may Load the
                                    selected Frame Version (loading the frame version configures text placement, art
                                    size, etc...)</p>
                                <div className='input-grid margin-bottom'>
                                    <select id='selectFrameGroup'
                                            onChange={e => loadScript("/js/frames/group" + e.target.value + ".js")}
                                            className='input'>
                                        <option disabled>Standard Frames</option>
                                        <option value='Standard-3'>Regular</option>
                                        <option value='Token-2'>Tokens</option>
                                        <option value='Saga-1'>Sagas</option>
                                        <option value='Planeswalker'>Planeswalkers</option>
                                        <option value='Modal-1'>Modal DFC's</option>
                                        <option value='DFC'>Transform</option>
                                        <option disabled>Special Frames</option>
                                        <option value='Showcase-5'>Showcase Frames</option>
                                        <option value='UniversesBeyond'>Universes Beyond</option>
                                        <option value='Promo-2'>Promos (Tall Art)</option>
                                        <option value='Textless-4'>Textless/Fullart</option>
                                        <option disabled>Other Frames</option>
                                        <option value='Custom'>Custom</option>
                                        <option value='Misc-2'>Old/Misc</option>
                                        <option value='Accurate'>Accurate Frames</option>
                                        <option value='Margin'>1/8th Inch Margin</option>
                                        <option disabled>Other Games</option>
                                        <option value='FleshAndBlood'>Flesh and Blood</option>
                                    </select>
                                    <select id='selectFramePack'
                                            onChange={e => loadScript("/js/frames/pack" + e.target.value + ".js")}
                                            className='input'></select>
                                    <div className="autocomplete"><input id='frameSearch'
                                                                         onChange={(e) => frameSearch(e.target.value)}
                                                                         type='text' className='input'
                                                                         placeholder='Search Frames...'/></div>
                                </div>
                                <div className='input-grid margin-bottom'>
                                    <button id='loadFrameVersion' className='input'>Load Frame Version</button>
                                </div>
                                <p className='input-description margin-bottom'>Automatically load Frame Version when
                                    loading
                                    Frame Packs</p>
                                <label className='checkbox-container input'>Auto load
                                    <input id='autoLoadFrameVersion' type='checkbox' onChange={autoLoadFrameVersion}
                                           checked/>
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='input-description margin-bottom'>Clear all frames</p>
                                <button id='clearFrame' onClick={clearFrames} className='input'>Clear frames</button>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='margin-bottom padding input-description'>Select a Frame Image and a Mask,
                                    then
                                    add it to your card</p>
                                <div className='split-grid margin-bottom'>
                                    <div id='frame-picker' className='frame-picker'></div>
                                    <div id='mask-picker' className='mask-picker'></div>
                                </div>
                                <div className='input-grid margin-bottom'>
                                    <button id='addToFull' className='input' onClick={addFrame}>Add Frame to Card
                                    </button>
                                    <button id='addToRightHalf' className='input'
                                            onClick='addFrame([{src:"/img/frames/maskRightHalf.png", name:"Right Half"}])'>Add
                                        Frame to Card (Right Half)
                                    </button>
                                </div>
                                <p className='collapsible collapsed padding input-description'
                                   onClick='toggleCollapse(event);'>More options</p>
                                <div>
                                    <div className='input-grid margin-bottom'>
                                        <button id='addToLeftHalf' className='input'
                                                onClick='addFrame([{src:"/img/frames/maskLeftHalf.png", name:"Left Half"}])'>Add
                                            Frame to Card (Left Half)
                                        </button>
                                        <button id='addToMiddleThird' className='input'
                                                onClick='addFrame([{src:"/img/frames/maskMiddleThird.png", name:"Middle Third"}])'>Add
                                            Frame to Card (Middle Third)
                                        </button>
                                        <button id='addToTopHalf' className='input'
                                                onClick='addFrame([{src:"/img/frames/maskTopHalf.png", name:"Top Half"}])'>Add
                                            Frame to Card (Top Half)
                                        </button>
                                        <button id='addToBottomHalf' className='input'
                                                onClick='addFrame([{src:"/img/frames/maskBottomHalf.png", name:"Bottom Half"}])'>Add
                                            Frame to Card (Bottom Half)
                                        </button>
                                    </div>
                                    <p className='padding input-description'>You can now double click frames and masks
                                        to
                                        add them to the card. You can do so while holding the shift, control, or alt
                                        keys to add to the right half, left half, or middle third, respectively.</p>
                                </div>
                                <p id='selectedPreview' className='padding input-description'>(Selected: White Frame, No
                                    Mask)</p>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Drag to reorder frame images</p>
                                <div id='frame-list' className='frame-list margin-bottom'></div>
                                <p className='padding input-description'>You may also click to edit opacity, position,
                                    size,
                                    and more</p>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Upload custom frame images</p>
                                <div className='input-grid'>
                                    <div className='padding drop-area'>
                                        <p className='margin-bottom padding input-description'>Drag and drop</p>
                                        <input type='file' multiple accept='.png, .svg, .jpg, .jpeg, .bmp'
                                               placeholder='File Upload' className='input'
                                               onInput='uploadFiles(event.target.files, uploadFrameOption);'
                                               data-dropFunction='uploadFrameOption' data-otherParams=''/>
                                    </div>
                                    <div>
                                        <input type='url' placeholder='Via URL' className='input'
                                               onChange='imageURL(this.value, uploadFrameOption);'/>
                                    </div>
                                </div>
                            </div>
                            <div className='readable-background padding'>
                                <p className='input-description margin-bottom'>Rounded Corners (When Downloaded)</p>
                                <label className='checkbox-container input margin-bottom'>Rounded Corners
                                    <input id='rounded-corners' checked="true" type='checkbox'
                                           onChange='setRoundedCorners(this.checked);'/>
                                    <span className='checkmark'></span>
                                </label>
                                <p className='input-description margin-bottom'>Show guidelines for text, art, watermark,
                                    and
                                    set symbols</p>
                                <label className='checkbox-container input margin-bottom'>Guidelines
                                    <input id='show-guidelines' type='checkbox' onChange={drawCard}/>
                                    <span className='checkmark'></span>
                                </label>
                                <p className='input-description margin-bottom'>Highlight transparencies in card</p>
                                <label className='checkbox-container input'>Transparencies
                                    <input id='highlight-transparencies' type='checkbox'
                                           onChange='toggleCardBackgroundColor(this.checked);'/>
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                        </div>
                        <div id='creator-menu-text' className='hidden'>
                            <div className='margin-bottom'>
                                <p className='margin-bottom padding input-description'>Select a text area to edit</p>
                                <div id='text-options'></div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Update card frame</p>
                                <button className='input margin-bottom' onClick='textEditUpdateBuffer();'>Update card
                                    frame
                                </button>
                                <p className='margin-bottom padding input-description'>Enter card text</p>
                                <textarea id='text-editor' className='input margin-bottom'
                                          onInput='textEdited();'></textarea>
                                <div className='padding input-grid'>
                                    <button className='input' onClick="toggleTextTag('i');">Italic</button>
                                    <button className='input' onClick="toggleTextTag('bold');">Bold</button>
                                </div>
                                <p className='margin-bottom padding input-description'>Edit the placement and size of
                                    the
                                    selected textbox</p>
                                <button className='input' onClick='textboxEditor();'>Edit Bounds</button>
                                <p className='margin-bottom padding input-description'>Adjust font size</p>
                                <input id="text-editor-font-size" className="input" type="number" placeholder="0"
                                       value="0"
                                       step="1" onChange="fontSizedEdited();"/>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='collapsible collapsed padding input-description'
                                   onClick='toggleCollapse(event);'>
                                    Text Code / Mana Symbol Code Reference
                                </p>
                                <div className='padding'>
                                    <p className='margin-top'>Text Codes:</p>
                                    <div className='text-codes margin-bottom padding'>
                                        <p>Code</p><p>Result</p>
                                        <p>{'{cardname}'}</p><p>Inserts the name of the card (or use a tilde: ~)</p>
                                        <p>{'{-}'}</p><p>Inserts an em-dash</p>
                                        <p>{'{i}'}</p><p>Italicizes text</p>
                                        <p>{'{/i}'}</p><p>Removes italicization</p>
                                        <p>{'{bold}'}</p><p>Bolds text</p>
                                        <p>{'{/bold}'}</p><p>Removes bold</p>
                                        <p>{'{lns}'}</p><p>Moves to the next line without an extra space (stands for
                                        line-no-space)</p>
                                        <p>{'{divider}'}</p><p>Moves to the next line and draws the flavor text bar</p>
                                        <p>{'{flavor}'}</p><p>Moves to the next line, draws the flavor text bar, and
                                        italicizes</p>
                                        <p>{'{oldflavor}'}</p><p>Italicizes and adds line breaks</p>
                                        <p>{'{fontsize#pt}'}</p><p>Changes the font size to #pt (absolute)</p>
                                        <p>{'{fontsize#}'}</p><p>Changes the font size by # pixels (relative - use
                                        negative
                                        integers to shrink text - ie {'{fontsize - 12}'})</p>
                                        <p>{'{fontcolor___}'}</p>
                                        <p>Changes the font color to ___ (ie
                                            '{'{fontcolor#00FF00}'}')</p>
                                        <p>{'{left}'}</p><p>Aligns text to the left</p>
                                        <p>{'{center}'}</p><p>Aligns text to the center</p>
                                        <p>{'{right}'}</p><p>Aligns text to the right</p>
                                        <p>{'{justify-left}'}</p><p>Justifies text to the left</p>
                                        <p>{'{justify-center}'}</p><p>Justifies text to the center</p>
                                        <p>{'{justify-right}'}</p><p>Justifies text to the right</p>
                                        <p>{'{permashift#,$}'}</p><p>Moves the text # pixels right and $ pixels down.
                                        Recommended for moving the text over large distances</p>
                                        <p>{'{up#}'}</p><p>Moves the text # pixels up</p>
                                        <p>{'{down#}'}</p><p>Moves the text # pixels down</p>
                                        <p>{'{left#}'}</p><p>Moves the text # pixels left</p>
                                        <p>{'{right#}'}</p><p>Moves the text # pixels right</p>
                                        <p>{'{shadow#}'}</p><p>Changes the shadow distance to # (use {'{shadow0}'} to
                                        remove the
                                        shadow)</p>
                                        <p>{'{shadowcolor#}'}</p><p>Changes the shadow color to #</p>
                                        <p>{'{outline#}'}</p><p>Changes the Outline Width to # (enables it if not
                                        already
                                        enabled)</p>
                                        <p>{'{outlinecolor___}'}</p><p>Changes the Outline Color to ___ (ie
                                        '{'{outlinecolorblue}'}'</p>
                                        <p>{'{bullet}'}</p><p>Does bullet point •</p>
                                        <p>{'{indent}'}</p><p>Indents the rest of the paragraph to the current point</p>
                                        <p>{'{/indent}'}</p><p>Removes paragraph indendation</p>
                                        <p>{'{kerning#}'}</p><p>Changes the kerning (letter spacing) to #</p>
                                        <p>{'{roll___}'}</p><p>Used for dice-rolling cards (like from AFR) - whatever
                                        you
                                        fill in for '___' will be bolded, and alternating paragraphs will be shaded.</p>
                                        <p>Notes</p><p>For colors, you may use HTML color codes (ie 'green'), hex color
                                        codes (ie '#00FF00'), or rgb (ie 'rgb(0,255,0)'')</p>
                                    </div>
                                    <p>Mana Symbol Codes:</p>
                                    <div className='text-codes padding'>
                                        <p>Code</p><p>Result</p>
                                        <p>{'{1}, {2}... {20}'}</p><p>Generic mana (works for numbers 1 through 20)</p>
                                        <p>{'{w}, {u}, {b}, {r}, {g}'}</p><p>Colored mana</p>
                                        <p>{'{wu}, {wb}, {ub}... {2w}, {2u}...'}</p><p>Hybrid mana</p>
                                        <p>{'{pw}, {pu}...'}</p><p>Phyrexian mana</p>
                                        <p>{'{wup}, {wbp}, {ubp}...'}</p><p>Hybrid phyrexian mana</p>
                                        <p>{'{t}, {untap}'}</p><p>Respective tapping-related symbol</p>
                                        <p>{'{oldtap}, {originaltap}'}</p><p>Old tap symbols</p>
                                        <p>{'{x}, {y}, {z}'}</p><p>Respective variable-related symbol</p>
                                        <p>{'{c}'}</p><p>Colorless-specific mana</p>
                                        <p>{'{s}'}</p><p>Snow mana</p>
                                        <p>{'{e}'}</p><p>Energy symbol</p>
                                        <p>{'{+1}'}</p><p>+1 loyalty icon</p>
                                        <p>{'{planeswalker}'}</p><p>Planeswalker icon</p>
                                        <p>{'{chaos}'}</p><p>Chaos symbol (planechase)</p>
                                        <p>{'{p}'}</p><p>Bloomburrow pawprint symbol</p>
                                        <p>Notes</p><p>Hybrid/Phyrexian mana only works with WUBRG</p>
                                    </div>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <label className='checkbox-container input'>Hide reminder text
                                    <input id='hide-reminder-text' type='checkbox' onChange='textEdited();'/>
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <label className='checkbox-container input'>Auto-italicize reminder text
                                    <input id='italicize-reminder-text' type='checkbox' onChange='textEdited();'/>
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding'>
                                <p className='padding input-description'>Add a textbox to your card</p>
                                <div className='padding input-grid'>
                                    <button className='input' onClick='addTextbox("Nickname");'>Nickname</button>
                                    <button className='input' onClick='addTextbox("Power/Toughness");'>Power/Toughness
                                    </button>
                                    <button className='input' onClick='addTextbox("DateStamp");'>Date Stamp</button>
                                </div>
                            </div>
                        </div>
                        <div id='creator-menu-art' className='hidden'>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Choose/upload your art</p>
                                <div className='input-grid margin-bottom'>
                                    <div className='padding drop-area'>
                                        <p className='margin-bottom padding input-description'>Drag and drop</p>
                                        <input type='file' multiple accept='.png, .svg, .jpg, .jpeg, .bmp'
                                               placeholder='File Upload' className='input'
                                               onInput='uploadFiles(event.target.files, uploadArt, document.querySelector("#art-update-autofit").checked ? "autoFit" : "");'
                                               data-dropFunction='uploadArt' data-otherParams='autoFit'/>
                                    </div>
                                    <div>
                                        <input type='url' placeholder='Via URL' className='input'
                                               onChange='imageURL(this.value, uploadArt, document.querySelector("#art-update-autofit").checked ? "autoFit" : "");'/>
                                        <p className='input-description margin-bottom'></p>
                                        <label className='checkbox-container input'>Autofit when setting art
                                            <input id='art-update-autofit' type='checkbox' onChange='setAutofit();'/>
                                            <span className='checkmark'></span>
                                        </label>
                                    </div>
                                    <button className='input margin-bottom' onClick='pasteArt();'>Paste from clipboard
                                    </button>
                                </div>
                                <p className='margin-bottom padding input-description'>Or enter a card name</p>
                                <input id='art-name' type='text' placeholder='Enter Card Name'
                                       className='input margin-bottom'
                                       onChange={e =>fetchScryfallData(e.target.value, artFromScryfall, 'art')}/>
                                <p className='padding margin-bottom input-description'>Select a specific card art to
                                    load</p>
                                <select className='input margin-bottom' id='art-index'
                                        onChange={changeArtIndex}></select>
                                <p className='margin-bottom padding input-description'>And credit the artist</p>
                                <div className='input-grid'>
                                    <input id='art-artist' type='text' className='input'
                                           onInput={e => artistEdited(e.target.value)}
                                           placeholder='Artist'/>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Position/scale your art (X, Y,
                                    Scale,
                                    Rotation)<br/>Art is now visually adjustable! Click and drag anywhere on the card to
                                    move your art around. Hold shift while doing so to scale, or control to rotate.</p>
                                <div className='input-grid margin-bottom'>
                                    <input id='art-x' type='number' className='input' onInput={artEdited} value={0}/>
                                    <input id='art-y' type='number' className='input' onInput={artEdited} value={0}/>
                                    <input id='art-zoom' type='number' className='input' onInput={artEdited}
                                           value={100}
                                           step={0.1} min={0}/>
                                    <input id='art-rotate' type='number' className='input' onInput={artEdited}
                                           value={0} step={1} min={0} max={360}/>
                                </div>
                                <div className='input-grid'>
                                    <button className='input' onClick={autoFitArt}>Auto Fit Art</button>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description margin-bottom'>Make the art grayscale</p>
                                <label className='checkbox-container input'>Grayscale
                                    <input id='grayscale-art' type='checkbox' onChange={drawCard}
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='padding margin-bottom input-description'>Clears the art, making it
                                    blank</p>
                                <button className='input margin-bottom' onClick={() => uploadArt(blank.src)}>Remove Art
                                </button>
                            </div>
                            <div className='readable-background padding'>
                                <p className='input-description margin-bottom'>Show guidelines for text, art, watermark,
                                    and
                                    set symbols</p>
                                <label className='checkbox-container input'>Guidelines
                                    <input id='show-guidelines-2' type='checkbox' onChange={drawCard}
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                        </div>
                        <div id='creator-menu-setSymbol' className='hidden'>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Choose/upload your set symbol</p>
                                <div className='input-grid margin-bottom'>
                                    <div className='padding drop-area'>
                                        <p className='margin-bottom padding input-description'>Drag and drop</p>
                                        <input type='file' multiple accept='.png, .svg, .jpg, .jpeg, .bmp'
                                               placeholder='File Upload' className='input'
                                               onInput={(e) => uploadFiles(e.target.files, uploadSetSymbol, "resetSetSymbol")}
                                               data-dropFunction='uploadSetSymbol' data-otherParams='resetSetSymbol'
                                            /></div>
                                    <div>
                                        <input type='url' placeholder='Via URL' className='input'
                                               onChange={e => imageURL(e.target.value, uploadSetSymbol, "resetSetSymbol")}
                                            /></div>
                                </div>
                                <p className='margin-bottom padding input-description'>Or enter a set code/rarity</p>
                                <div className='input-grid margin-bottom'>
                                    <input id='set-symbol-code' type='text' placeholder='Set Code' className='input'
                                           onChange={fetchSetSymbol}
                                        /> <input id='set-symbol-rarity' type='text' placeholder='Rarity'
                                                  className='input'
                                                  onChange={fetchSetSymbol}
                                        /></div>
                                <p className='margin-bottom padding input-description'>Load set symbols from:</p>
                                <div className='input-grid margin-bottom'>
                                    <select id='set-symbol-source' className='input' onChange={fetchSetSymbol}>
                                        <option value='cardconjurer'>CardConjurer</option>
                                        <option value='gatherer'>Gatherer</option>
                                        <option value='hexproof'>Hexproof.io</option>
                                    </select>
                                </div>
                                <p className='collapsible collapsed padding input-description'
                                   onClick='toggleCollapse(event);'>
                                    How to find set codes
                                </p>
                                <div className='padding'>
                                    <p className='margin-top'>Set codes are the two-three character combinations that
                                        represent sets. For sets released after 2015, the three-character set code can
                                        be found in the lower left hand corner.</p>
                                    <p className='margin-top'>For older sets, the code may be different depending on
                                        your
                                        use:</p>
                                    <p className='margin-top padding'>Set symbol images are named using the same codes
                                        as used in
                                        <a className='underline' href='https://scryfall.com/sets'
                                           target='_blank'>Scryfall</a>.</p>
                                    <p className='padding'>
                                        For watermarks, please reference
                                        <a className='underline'
                                           href='https://keyrune.andrewgioia.com/icons.html'
                                           target='_blank'>Keyrune</a>.
                                    </p>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Position/scale your Set Symbol
                                    (X, Y,
                                    Scale)</p>
                                <div className='input-grid margin-bottom'>
                                    <input id='setSymbol-x' type='number' className='input' onInput='setSymbolEdited();'
                                           value={0}/>
                                    <input id='setSymbol-y' type='number' className='input' onInput='setSymbolEdited();'
                                           value={0}/>
                                    <input id='setSymbol-zoom' type='number' className='input'
                                           onInput='setSymbolEdited();'
                                           value={100} step={0.1} min={0}/>
                                </div>
                                <div className='input-grid'>
                                    <button className='input' onClick='resetSetSymbol();'>Reset Set Symbol</button>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='padding margin-bottom input-description'>Clears the Set Symbol, making it
                                    blank</p>
                                <button className='input margin-bottom' onClick='uploadSetSymbol(blank.src);'>Remove Set
                                    Symbol
                                </button>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description margin-bottom'>Click and drag to move set symbol instead
                                    of
                                    art (hold shift to zoom)</p>
                                <label className='checkbox-container input margin-bottom'>Click and drag to move set
                                    symbol
                                    instead of art
                                    <input id='drag-target-setSymbol' type='checkbox'
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding'>
                                <p className='input-description margin-bottom'>Lock the set symbol code (saves between
                                    reloads)</p>
                                <label className='checkbox-container input margin-bottom'>Lock set symbol code
                                    <input id='lockSetSymbolCode' type='checkbox' onChange='lockSetSymbolCode();'
                                        /> <span className='checkmark'></span>
                                </label>
                                <p className='input-description margin-bottom'>Lock the set symbol URL (saves between
                                    reloads)</p>
                                <label className='checkbox-container input'>Lock set symbol URL
                                    <input id='lockSetSymbolURL' type='checkbox' onChange='lockSetSymbolURL();'
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                        </div>
                        <div id='creator-menu-watermark' className='hidden'>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Choose/upload your watermark</p>
                                <div className='input-grid'>
                                    <div className='padding drop-area'>
                                        <p className='margin-bottom padding input-description'>Drag and drop</p>
                                        <input type='file' multiple accept='.png, .svg, .jpg, .jpeg, .bmp'
                                               placeholder='File Upload' className='input'
                                               onInput={e => uploadFiles(e.target.files!, uploadWatermark, "resetWatermark")}
                                               data-dropFunction='uploadWatermark' data-otherParams='resetWatermark'
                                            /></div>
                                    <div>
                                        <input type='url' placeholder='Via URL' className='input margin-bottom'
                                               onChange={e => imageURL(e.target.value, uploadWatermark, "resetWatermark")}
                                            /> <input type='text' placeholder='Via Set Code' className='input'
                                                      onChange={e => getSetSymbolWatermark(e.target.value)}
                                            /></div>
                                </div>
                                <p className='margin-bottom padding input-description'>Select lore-based watermarks</p>
                                <select className='input padding margin-bottom'
                                        onChange={e => getSetSymbolWatermark(fixUri(e.target.value))}>
                                    <option disabled selected='selected'>None</option>
                                    <option disabled>General</option>
                                    <option value="/img/watermarks/planeswalker.svg">Planeswalker</option>
                                    <option value="/img/watermarks/desparked-planeswalker.svg">Desparked Planeswalker
                                    </option>
                                    <option value="/img/watermarks/misc-star.svg">DCI Star</option>
                                    <option value="/img/watermarks/misc-dci.svg">DCI Logo</option>
                                    <option disabled>Monocolors</option>
                                    <option value="/img/watermarks/w.svg">White</option>
                                    <option value="/img/watermarks/u.svg">Blue</option>
                                    <option value="/img/watermarks/b.svg">Black</option>
                                    <option value="/img/watermarks/r.svg">Red</option>
                                    <option value="/img/watermarks/g.svg">Green</option>
                                    <option value="/img/watermarks/c.svg">Colorless</option>
                                    <option disabled>Mechanics</option>
                                    <option value="/img/watermarks/ability-foretell.svg">Foretell</option>
                                    <option disabled>Phyrexian/Mirrodin</option>
                                    <option value="/img/watermarks/phyrexian.svg">Phyrexian</option>
                                    <option value="/img/watermarks/mirran.svg">Mirran</option>
                                    <option disabled>Guilds (Ravnica)</option>
                                    <option value="/img/watermarks/guild-azorius.svg">Azorius</option>
                                    <option value="/img/watermarks/guild-dimir.svg">Dimir</option>
                                    <option value="/img/watermarks/guild-rakdos.svg">Rakdos</option>
                                    <option value="/img/watermarks/guild-gruul.svg">Gruul</option>
                                    <option value="/img/watermarks/guild-selesnya.svg">Selesnya</option>
                                    <option value="/img/watermarks/guild-orzhov.svg">Orzhov</option>
                                    <option value="/img/watermarks/guild-izzet.svg">Izzet</option>
                                    <option value="/img/watermarks/guild-golgari.svg">Golgari</option>
                                    <option value="/img/watermarks/guild-boros.svg">Boros</option>
                                    <option value="/img/watermarks/guild-simic.svg">Simic</option>
                                    <option disabled>Schools (Strixhaven)</option>
                                    <option value="/img/watermarks/school-silverquill.svg">Silverquill</option>
                                    <option value="/img/watermarks/school-prismari.svg">Prismari</option>
                                    <option value="/img/watermarks/school-witherbloom.svg">Witherbloom</option>
                                    <option value="/img/watermarks/school-lorehold.svg">Lorehold</option>
                                    <option value="/img/watermarks/school-quandrix.svg">Quandrix</option>
                                    <option disabled>Families (New Capenna)</option>
                                    <option value="/img/watermarks/family-brokers.svg">Brokers</option>
                                    <option value="/img/watermarks/family-obscura.svg">Obscura</option>
                                    <option value="/img/watermarks/family-maestros.svg">Maestros</option>
                                    <option value="/img/watermarks/family-riveteers.svg">Riveteers</option>
                                    <option value="/img/watermarks/family-cabaretti.svg">Cabaretti</option>
                                    <option disabled>Clans (Tarkir - Old Timeline)</option>
                                    <option value="/img/watermarks/clan-abzan.svg">Abzan</option>
                                    <option value="/img/watermarks/clan-jeskai.svg">Jeskai</option>
                                    <option value="/img/watermarks/clan-sultai.svg">Sultai</option>
                                    <option value="/img/watermarks/clan-mardu.svg">Mardu</option>
                                    <option value="/img/watermarks/clan-temur.svg">Temur</option>
                                    <option disabled>Clans (Tarkir - New Timeline)</option>
                                    <option value="/img/watermarks/clan-ojutai.svg">Ojutai</option>
                                    <option value="/img/watermarks/clan-silumgar.svg">Silumgar</option>
                                    <option value="/img/watermarks/clan-kolaghan.svg">Kolaghan</option>
                                    <option value="/img/watermarks/clan-atarka.svg">Atarka</option>
                                    <option value="/img/watermarks/clan-dromoka.svg">Dromoka</option>
                                    <option disabled>Poleis (Theros)</option>
                                    <option value="/img/watermarks/polis-akros.svg">Akros</option>
                                    <option value="/img/watermarks/polis-meletis.svg">Meletis</option>
                                    <option value="/img/watermarks/polis-setessa.svg">Setessa</option>
                                    <option disabled>Unstable Factions (Bablovia)</option>
                                    <option value="/img/watermarks/faction-order-of-the-widget.svg">Order of the
                                        Widget
                                    </option>
                                    <option value="/img/watermarks/faction-agents-of-sneak.svg">Agents of S.N.E.A.K.
                                    </option>
                                    <option value="/img/watermarks/faction-league-of-dastardly-doom.svg">League of
                                        Dastardly Doom
                                    </option>
                                    <option value="/img/watermarks/faction-goblin-explosioneers.svg">Goblin
                                        Explosioneers
                                    </option>
                                    <option value="/img/watermarks/faction-crossbreed-labs.svg">Crossbreed Labs</option>
                                    <option disabled>Custome</option>
                                    <option value="/img/watermarks/purple.svg">Purple Mana</option>
                                </select>
                                <p className='collapsible collapsed padding input-description'
                                   onClick='toggleCollapse(event);'>
                                    How to find set codes
                                </p>
                                <div className='padding'>
                                    <p className='margin-top'>Set codes are the two-three character combinations that
                                        represent sets. For sets released after 2015, the three-character set code can
                                        be found in the lower left hand corner.</p>
                                    <p className='margin-top'>For older sets, the code may be different depending on
                                        your
                                        use:</p>
                                    <p className='margin-top padding'>Set symbol images are named using the same codes
                                        as
                                        used in <a className='underline' href='https://scryfall.com/sets'
                                                   target='_blank'>Scryfall</a>.</p>
                                    <p className='padding'>For watermarks, please reference <a className='underline'
                                                                                               href='https://keyrune.andrewgioia.com/icons.html'
                                                                                               target='_blank'>Keyrune</a>.
                                    </p>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Select watermark colors (left,
                                    right)</p>
                                <div className='input-grid margin-bottom'>
                                    <select className='input' id='watermark-left'
                                            onChange='watermarkLeftColor(this.value);'>
                                        <option value="none">None</option>
                                        <option value="default">Actual Image</option>
                                        <option value="#b79d58" selected="selected">White</option>
                                        <option value="#8cacc5">Blue</option>
                                        <option value="#5e5e5e">Black</option>
                                        <option value="#c66d39">Red</option>
                                        <option value="#598c52">Green</option>
                                        <option value="#cab34d">Gold</option>
                                        <option value="#647d86">Artifact/Colorless</option>
                                        <option value="#5e5448">Land</option>
                                        <option value="#ffffff">True White</option>
                                        <option value="#000000">True Black</option>
                                    </select>
                                    <select className='input' id='watermark-right'
                                            onChange='watermarkRightColor(this.value);'>
                                        <option value="none" selected="selected">None</option>
                                        <option value="default">Actual Image</option>
                                        <option value="#b79d58">White</option>
                                        <option value="#8cacc5">Blue</option>
                                        <option value="#5e5e5e">Black</option>
                                        <option value="#c66d39">Red</option>
                                        <option value="#598c52">Green</option>
                                        <option value="#cab34d">Gold</option>
                                        <option value="#647d86">Artifact/Colorless</option>
                                        <option value="#5e5448">Land</option>
                                        <option value="#ffffff">True White</option>
                                        <option value="#000000">True Black</option>
                                    </select>
                                </div>
                                <p className='margin-bottom padding input-description'>Or choose them manually (left,
                                    right)</p>
                                <div className='input-grid margin-bottom'>
                                    <input className='input' type='color' placeholder='Color' value='#000000'
                                           onChange='watermarkLeftColor(this.value);'
                                        /> <input className='input' type='color' placeholder='Color' value='#000000'
                                                  onChange='watermarkRightColor(this.value);'
                                        /></div>
                                <p className='margin-bottom padding input-description'>And enter an opacity</p>
                                <div className='input-grid margin-bottom'>
                                    <input id='watermark-opacity' type='number' className='input'
                                           onInput='watermarkEdited();' value={40} step={1} min={0} max={100} />
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='margin-bottom padding input-description'>Position/scale your watermark (X,
                                    Y,
                                    Scale)</p>
                                <div className='input-grid margin-bottom'>
                                    <input
                                        id='watermark-x'
                                        type='number'
                                        className='input'
                                        onInput='watermarkEdited();'
                                        value={0}/>
                                    <input id='watermark-y' type='number' className='input'
                                               onInput='watermarkEdited();'
                                               value={0}/>
                                            <input id='watermark-zoom' type='number' className='input'
                                                   onInput='watermarkEdited();'
                                                   value={100} step={0.1} min={0} />
                                </div>
                                <div className='input-grid'>
                                    <button className='input' onClick='resetWatermark();'>Reset Watermark</button>
                                </div>
                            </div>
                            <div className='readable-background padding'>
                                <p className='padding margin-bottom input-description'>Clears the watermark, making it
                                    blank</p>
                                <button className='input margin-bottom' onClick='uploadWatermark(blank.src);'>Remove
                                    Watermark
                                </button>
                            </div>
                        </div>
                        <div id='creator-menu-bottomInfo' className='hidden'>
                            <div className='readable-background padding margin-bottom'>
                                <p className='padding margin-bottom input-description'>Enter the card number, rarity,
                                    set
                                    code, language, and artist's name</p>
                                <div className='padding input-grid'>
                                    <input id='info-number' type='text' className='input' onInput='bottomInfoEdited();'
                                       placeholder='Number' value=''/>
                                    <input id='info-rarity' type='text' className='input'
                                              onInput='bottomInfoEdited();' placeholder='Rarity' value='P'/>
                                    <input id='info-note' type='text' className='input'
                                              onInput='bottomInfoEdited();'
                                              placeholder='Note' value=''/>
                                </div>
                                <div className='padding input-grid'>
                                    <input id='info-set' type='text' className='input' onInput='bottomInfoEdited();'
                                           placeholder='Set' value='MTG' />
                                        <input id='info-language' type='text' className='input'
                                                  onInput='bottomInfoEdited();' placeholder='Language' value='EN'
                                        /> <input id='info-artist' type='text' className='input'
                                                  onInput='artistEdited(this.value);' placeholder='Artist'
                                        /></div>
                                <div className='padding input-grid'>
                                    <input id='info-year' type='number' className='input' onInput='bottomInfoEdited();'
                                           placeholder='0' value='1993'
                                        /></div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description margin-bottom'>Enable importing collector
                                    information</p>
                                <label className='checkbox-container input margin-bottom'>Enable imports
                                    <input id='enableImportCollectorInfo' type='checkbox'
                                           onChange='enableImportCollectorInfo();'
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description margin-bottom'>Collector info style</p>
                                <label className='checkbox-container input margin-bottom'>Use new (post-ONE) collector
                                    info
                                    style
                                    <input id='enableNewCollectorStyle' type='checkbox'
                                           onChange='enableNewCollectorInfoStyle();'
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description margin-bottom'>Show collector info</p>
                                <label className='checkbox-container input margin-bottom'>Show collector info (uncheck
                                    to
                                    hide)
                                    <input id='enableCollectorInfo' type='checkbox' onChange='enableCollectorInfo();'
                                        /> <span className='checkmark'></span>
                                </label>
                            </div>

                            <div className='readable-background padding margin-bottom'>
                                <p className='padding input-description'>Serial Number (leave both blank to hide)</p>
                                <div className='padding input-grid'>
                                    <input id='serial-number' type='number' className='input'
                                           onInput='serialInfoEdited();'
                                           placeholder='001' min='0' value=''
                                        /> <input id='serial-total' type='number' className='input'
                                                  onInput='serialInfoEdited();' placeholder='500' min='0' value=''
                                        /></div>

                                <p className='padding input-description'>Placement (X, Y, Scale)</p>
                                <div className='padding input-grid'>
                                    <input id='serial-x' type='number' className='input' onInput='serialInfoEdited();'
                                           min='0' value='172'
                                        /> <input id='serial-y' type='number' className='input'
                                                  onInput='serialInfoEdited();' min='0' value='1383'
                                        /> <input id='serial-scale' type='number' className='input'
                                                  onInput='serialInfoEdited();' min='0' step='0.01' value='1'
                                        /></div>
                                <div className='padding input-grid'>
                                    <button className='input' onClick='resetSerial();'>Reset Serial Number Placement
                                    </button>
                                </div>
                            </div>

                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description padding margin-bottom'>Toggle between star (seen on
                                    foils)
                                    and dot (seen on regular cards)</p>
                                <div className='padding'>
                                    <button className='input padding' onClick='toggleStarDot();'>Toggle Star/Dot
                                    </button>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='input-description padding margin-bottom'>Save current collector info as
                                    default</p>
                                <div className='padding'>
                                    <button className='input padding' onClick='setDefaultCollector();'>Save as Default
                                    </button>
                                </div>
                                <p className='input-description padding margin-bottom'>Clear your saved default
                                    collector
                                    info</p>
                                <div className='padding'>
                                    <button className='input padding' onClick='removeDefaultCollector();'>Clear Saved
                                        Defaults
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id='creator-menu-import'>
                            <div className='readable-background padding margin-bottom'>
                                <p className='padding input-description'>Automatically update frame</p>
                                <div className='padding input-grid'>
                                    <select id="autoFrame" className="input" onChange="setAutoFrame()">
                                        <option value="false">Disabled</option>
                                        <option value="M15Regular-1">Regular</option>
                                        <option value="M15BoxTopper">Extended Art</option>
                                        <option value="M15ExtendedArtShort">Extended Art (Shorter Textbox)</option>
                                        <option value="UB">Universes Beyond</option>
                                        <option value="Etched">Etched</option>
                                        <option value="Borderless">Borderless (Alt)</option>
                                        <option value="BorderlessUB">Borderless (Alt) (Universes Beyond)</option>
                                        <option value="Praetors">Phyrexian</option>
                                        <option value="8th">8th Edition</option>
                                        <option value="Seventh">Seventh Edition</option>

                                        <option disabled>Redone frames</option>
                                        <option value="M15RegularNew">Regular (Accurate)</option>
                                        <option value="FullArtNew">Full art (Accurate)</option>
                                        <option value="UBNew">Universes Beyond (Accurate)</option>

                                        <option disabled>Custom frames</option>
                                        <option value="Circuit">Circuit</option>
                                        <option value="M15Eighth">M15-Eighth</option>
                                        <option value="M15EighthUB">M15-Eighth Universes Beyond</option>
                                    </select>
                                </div>
                                <div className='padding input-grid'>
                                    <label className='checkbox-container input'>Use Nyx frame for all Enchantments
                                        (where
                                        applicable)
                                        <input id='autoframe-always-nyx' type='checkbox'
                                               onChange={e => setAutoframeNyx(e.target.checked)}
                                            /> <span className='checkmark'></span>
                                    </label>
                                </div>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='padding margin-bottom input-description'>Load a saved card</p>

                                <select
                                    id='load-card-options'
                                    className='input margin-bottom'
                                    //onChange = 'loadCard(this.value);'
                                    onChange={e => loadCardFormatted(e.target.value)}>
                                </select>

                                <p className='padding input-description'>Import or reset</p>
                                <div className="input-grid">
                                    <button className='input margin-bottom' onClick={importCsv}>Import CSV</button>
                                    <button className='input margin-bottom' onClick={deleteSavedCards}>Delete All
                                        Cards
                                    </button>
                                </div>

                                <input id="import-csv-input" type="file" accept=".csv" hidden
                                       onInput={onImportCsv}/>

                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='collapsible collapsed padding input-description'
                                   onClick={toggleCollapse}>
                                    Save or delete current card
                                </p>
                                <div className='padding'>
                                    <p className='padding margin-bottom input-description'>Save your current card</p>
                                    <button className='input margin-bottom' onClick={saveCard} id='savebutton'>Save
                                        Card
                                    </button>

                                    <p className='padding margin-bottom input-description'>Delete selected card</p>
                                    <button className='input' onClick={deleteCard}>Delete Card</button>
                                </div>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='collapsible collapsed padding input-description'
                                   onClick={toggleCollapse}>Download all saved cards</p>
                                <div className='padding'>
                                    <button className='input margin-bottom' onClick={downloadSavedCards}>Download All
                                    </button>
                                    <p className='padding margin-bottom input-description'>Upload previously downloaded
                                        file
                                        of saved cards (downloaded from above)</p>
                                    <input type='file' accept='.cardconjurer,.txt' className='input margin-bottom'
                                           onInput={uploadSavedCards}
                                        /></div>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='collapsible collapsed padding margin-bottom input-description'>Import a
                                    real
                                    card by name</p>
                                <div className='padding'>
                                    <input id='import-name' className='input margin-bottom' type='text'
                                           onChange={importChanged} placeholder='Enter Card Name'
                                        /> <label className='checkbox-container input margin-bottom'>Include all unique
                                        prints as options
                                        <input id='importAllPrints' type='checkbox' onChange={importChanged}
                                            /> <span className='checkmark'></span>
                                    </label>
                                        <p className='padding margin-bottom input-description'>Select a specific card to
                                            import</p>
                                        <select className='input margin-bottom' id='import-index'
                                                onChange={changeCardIndex}></select>
                                        <p className='padding input-description'>Select a language for card imports (not
                                            all
                                            languages will always be available)</p>
                                        <select className='input' id='import-language' onChange={importChanged}>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="it">Italian</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="ja">Japanese</option>
                                            <option value="ko">Korean</option>
                                            <option value="ru">Russian</option>
                                            <option value="zhs">Simplified Chinese</option>
                                            <option value="zht">Traditional Chinese</option>
                                            <option value="ph">Phyrexian</option>
                                        </select>
                                </div>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='padding margin-bottom input-description'>Paste full text</p>
                                <button className='input margin-bottom' onClick='pasteCardText();'>Paste card</button>
                            </div>
                            <div className='readable-background margin-bottom padding'>
                                <p className='padding margin-bottom input-description'>Save your current card</p>
                                <button className='input margin-bottom' onClick='saveCard();'>Save Card</button>
                                <p className='padding margin-bottom input-description'>Delete selected card</p>
                                <button className='input' onClick='deleteCard();'>Delete Card</button>
                            </div>
                            <div className='readable-background padding margin-bottom'>
                                <p className='collapsible collapsed padding input-description'
                                   onClick='toggleCollapse(event);'>
                                    How are my cards saved?
                                </p>
                                <div className='padding'>
                                    <p className='margin-top'>Cards are saved on your computer under your browser's
                                        localstorage, which usually has a limit of 5MB and cannot be changed.</p>
                                    <p className='margin-top'>Unfortunately, this means that if you save a lot of cards,
                                        you
                                        could run out of space.</p>
                                    <p className='margin-top'>Your localstorage runs out of space especially fast when
                                        you
                                        upload images directly from your computer, because the image itself has to be
                                        saved. However, if possible, uploading images via URL will save massive amounts
                                        of space, allowing you to save many more cards.</p>
                                    <p className='margin-top'>And if you do run out of space, don't worry! You can
                                        download
                                        all saved cards then delete all saved cards, freeing up all 5MB of space. And
                                        when you'd like to edit the cards you previously downloaded/deleted, you can
                                        reupload them via the file upload (under "Upload previously downloaded
                                        cards").</p>
                                </div>
                            </div>
                        </div>
                        <div id='creator-menu-tutorial' className='hidden'>
                            {/*<div className='padding readable-background margin-bottom'>

                                <p className='padding input-description'>This video is currently outdated, but still
                                    reflects the general process for making cards</p>
                            </div>
                                <div className='padding readable-background margin-bottom'>
                                <p className='padding input-description'>The biggest difference is that you must click the "Load Frame Version" button after selecting your frame pack to load necessary details, such as text placement.</p>
                                </div>*/}
                            <div className='padding readable-background margin-bottom'>
                                <p className='padding input-description'>Here is a tutorial that covers the basics of
                                    using
                                    Card Conjurer:</p>
                            </div>
                            <div className='video'>
                                <iframe width="560" height="315" frameBorder="0" allow="encrypted-media"
                                        allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="creator-save">
                <div className="creator-save-actions">
                    <button className='creator-save-button primary' id='downloadJpg'
                            onClick={() => downloadCard(false, true)}>Download JPG
                    </button>
                    {/*
                    <button className='creator-save-button' onClick='downloadCard(true);' id='downloadAlt'>Click here for an alternative download</p>

                    <label className='checkbox-container input margin-bottom'>800 DPI
                        <input id='high-res' type='checkbox' onChange='toggleHighRes();'>
                        <span className='checkmark'></span>
                    </label>
                    */}

                    <button className='creator-save-button primary' onClick={() => downloadCard()}>Download hi-res PNG
                    </button>
                    <div className='creator-actions-separator'></div>
                    <button className='creator-save-button secondary' onClick={() => applyMargins()}>Apply margins</button>
                </div>
            </div>
            <div id="creator-canvas-settings">
                <div>
                    <label className='checkbox-container input'>
                        Lock canvas height
                        <input id='canvas-lock-height' checked type='checkbox' onClick={lockCanvasHeight}
                               aria-label='Lock canvas height'/>
                        <span className='checkmark'></span>
                    </label>
                </div>
            </div>
        </div>
    );
}