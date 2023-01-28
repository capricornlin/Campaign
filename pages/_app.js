import '../styles/globals.css';

import { Navbar, SideBar } from '../components';
import { CampaignProvider } from '../context/campaignContext';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CampaignProvider>
        <div className="relative sm:-8 p-4 bg-black min-h-screen flex flex-row">
          <div className="sm:flex hidden mr-10 relative">
            <SideBar />
          </div>
          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </div>
      </CampaignProvider>
    </>
  );
}

export default MyApp;
