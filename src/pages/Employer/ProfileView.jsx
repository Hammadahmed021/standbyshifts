import React, { useEffect, useState } from 'react';
import { fetchSingleDetailEmployer } from '../../utils/Api'; // Adjust this path if necessary
import { CompanyProfiles } from '../../component'; // Import the dynamic layout component

const ProfileView = () => {
  const [profile, setProfile] = useState([]); // Initialize as null to check loading state

  useEffect(() => {
    const getEmployer = async () => {
      try {
        const response = await fetchSingleDetailEmployer();
        setProfile(response); // Set fetched profile data
        console.log(response, 'res');
        
      } catch (error) {
        console.log('Unable to get employer data', error);
      }
    };

    getEmployer();
  }, []);

  const checkLayout = profile?.about?.layout || '1'; // Check layout from profile
  console.log(checkLayout, 'checkLayout');
  
  return (
    <div className="container mx-auto p-6">
      {profile ? (
        <CompanyProfiles profile={profile?.about} layout={checkLayout} />
      ) : (
        <p>Loading...</p> // Show loading text until profile data is available
      )}
    </div>
  );
};

export default ProfileView;
