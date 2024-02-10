import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
       
        const checkDashboardAccess = async () => {
            try {
                const response = await axios.get('http://localhost:4004/dashboard/checkAccess', {
                    withCredentials: true, 
                });

                
                if (response.data.success) {
                    setHasAccess(true);
                }
            } catch (error) {
                console.error('Error checking dashboard access:', error);
            }
        };

        checkDashboardAccess();
    }, []);

    return (
        <div>
            {hasAccess ? (
                <h1>Welcome to the Dashboard!</h1>
            ) : (
                <h1>Sorry, you do not have access to the Dashboard.</h1>
            )}
        </div>
    );
}

export default Dashboard;
