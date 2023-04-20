const ProtectedRoute = () => {
    return (
        <div style={{ border: "2px solid #ff3030", padding: "40px" }}>
            <h1>Protected route</h1>
            <p>You must be logged in to view this content</p>
        </div>
    );
};

export default ProtectedRoute;
