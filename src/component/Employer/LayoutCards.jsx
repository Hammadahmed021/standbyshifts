const LayoutCards = ({ profile, layout }) => {
    switch (layout) {
      case "1":
        return (
          <div className="p-4 rounded-lg shadow-lg bg-white max-w-sm">
            <div className="relative">
              <div className="h-28 bg-orange-300 rounded-t-lg"></div>
              <img
                src={profile.logo}
                alt={profile.title}
                className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-16 object-cover rounded-full border-4 border-white"
              />
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold">{profile.title}</h3>
              <p className="text-gray-600 mt-2">{profile.description}</p>
              <div className="mt-4 flex items-center justify-center text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16.88 4.47c.34 0 .68.04 1 .12 1.12.27 2.12 1.2 2.58 2.33.46 1.1.56 2.46.33 3.68a8.09 8.09 0 01-2.22 4.3L12 20l-6.57-5.1a8.09 8.09 0 01-2.22-4.3c-.23-1.22-.13-2.57.33-3.68a3.94 3.94 0 012.58-2.33c.33-.08.67-.12 1-.12h5.88z"
                  />
                </svg>
                {profile.location}
              </div>
            </div>
          </div>
        );
  
      case "2":
        return (
          <div className="p-4 rounded-lg shadow-lg bg-white max-w-sm">
            <div className="relative">
              <div className="h-28 bg-blue-300 rounded-t-lg"></div>
              <img
                src={profile.logo}
                alt={profile.title}
                className="absolute top-8 left-4 w-12 h-12 object-cover rounded-full border-4 border-white"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">{profile.title}</h3>
              <p className="text-gray-600 mt-2">{profile.description}</p>
              <div className="mt-4 flex items-center text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16.88 4.47c.34 0 .68.04 1 .12 1.12.27 2.12 1.2 2.58 2.33.46 1.1.56 2.46.33 3.68a8.09 8.09 0 01-2.22 4.3L12 20l-6.57-5.1a8.09 8.09 0 01-2.22-4.3c-.23-1.22-.13-2.57.33-3.68a3.94 3.94 0 012.58-2.33c.33-.08.67-.12 1-.12h5.88z"
                  />
                </svg>
                {profile.location}
              </div>
            </div>
          </div>
        );
  
      default:
        return <div>No Layout Selected</div>;
    }
  };
  
export default LayoutCards;