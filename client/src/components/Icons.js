import React from 'react'

const Icons = ({setContent, content, themeReducer}) => {
    const reactions = [   
        '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
        '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
        '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵'
    ]
    return (
        <div className = "nav-item dropdown"
        style={{filter: themeReducer ? 'invert(1)': 'invert(0)', opacity: '1'}}>
                   
                    <span className = "nav-link position-relative px-1" id = "navbarDropdown" role = "button" data-toggle = "dropdown" aria-haspopup = "true" aria-expanded = "false" >
                        <span style={{opacity: '0.4'}}>😃</span>
                    </span>

                    <div className = "dropdown-menu" aria-labelledby = "navbarDropdown" >
                        <div className="reactions">
                            {
                                reactions.map((icon) => (
                                    <span key={icon} onClick={() => setContent(content + icon)}>
                                        {icon}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
        </div>
    )
}

export default Icons
