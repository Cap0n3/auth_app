import FormControl from "@mui/material/FormControl";

const Form = ({ children, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <FormControl
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
                fullWidth
            >
                {children}
            </FormControl>
        </form>
    );
};

export default Form;
