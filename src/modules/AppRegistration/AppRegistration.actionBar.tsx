const AppRegistrationActionBar = () => {
    // These props could be passed via `showBar` fn in AppRegistration.form
    const status = "draft";
    const text = "1/12 questions answered in this section";

    return (
        <div>
            {/* todo: Create chip component */}
            <span
                style={{
                    background: "#D0D3D4",
                    borderRadius: "14px",
                    padding: "5px 12px",
                    marginRight: "10px",
                }}>
                {status}
            </span>
            {text}
        </div>
    );
};

export default AppRegistrationActionBar;
