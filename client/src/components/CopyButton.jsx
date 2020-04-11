import React, { useRef, useState } from 'react';
import { Button, Overlay, Tooltip } from 'react-bootstrap';

const CopyButton = ({ id }) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    const copy = async () => {
        const urly = process.env.REACT_APP_REDIRECT + id;

        await navigator.clipboard.writeText(urly);
        setShow(true);
        setTimeout(() => setShow(false), 750);
    };

    return (
        <>
            <Button ref={target} style={{ marginRight: '5px' }} onClick={copy}>
                Copy
            </Button>

            <Overlay target={target.current} show={show} placement="bottom">
                {(props) => <Tooltip {...props}>Copied to clipboard!</Tooltip>}
            </Overlay>
        </>
    );
};

export default CopyButton;
