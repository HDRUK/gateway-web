const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>
            &copy;HDR UK {currentYear}. All rights reserved.
        </div>
    );
};

export default Footer;
