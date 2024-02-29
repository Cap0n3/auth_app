import FormControl from '@mui/material/FormControl';

const Form = ({ children, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <FormControl sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '300px',
            }}>
                {children}
            </FormControl>
        </form>
    );
}

export default Form;