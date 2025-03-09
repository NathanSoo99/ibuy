import React from 'react'

import "./PageComponentsCSS/ModalWindow.css"

const ModalWindow = ( { hidden, toggle, Subcomponent, subcomponentProps } ) => {
    return (
        <div>
            {hidden ?
                <div></div>
            :
                <div id="modal">
                    <div className="modal-content">
                        <Subcomponent props={subcomponentProps}/>
                        <button onClick={() => toggle(!hidden)}>Close</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ModalWindow
