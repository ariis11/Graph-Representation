import { useState } from 'react';

import Switch from '@mui/material/Switch';

export default function SwitchInput({ text, onToggle }) {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(prevValue => !prevValue);
        onToggle();
    };

    return (
        <div className='switch-input'>
            <p>{text}</p>
            <Switch
                checked={checked}
                onClick={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
    );
}