import React from 'react'

const Loader = () => {
    return (
        <div style={{
            position: "fixed",
            width: "100vw",
            height: "calc(100vh - 7.7rem)",
            zIndex: "99",
        }}>
            <div style={{
                height: "3rem",
                width: "9rem",
                backgroundColor: "#978fc7a3",
                position: "fixed",
                left: "45%",
                top: "45%",
                padding:"0.5rem",
                display:"flex",
                borderRadius: "5px",
                border:"2px solid grey"
            }}> 
                <div className="spinner-border mx-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading....</p>
            </div>
        </div>
    )
}

export default Loader
