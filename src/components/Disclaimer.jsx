import React from 'react';
import { useApiContext } from '../context/ApiContext';

const Disclaimer = () => {
  const { network } = useApiContext();

  return (
    <div className='text-sm text-white flex flex-col gap-4'>
      <span className='text-base font-medium'>Disclaimer: </span>
      Welcome to the launch of the Ordinals project. We are thrilled to
      introduce this innovative platform for inscriptions on the {network} network.
      As we embark on this exciting journey, we want to ensure that our
      users are fully informed about the initial phase of our launch.
      <span className='text-base font-medium'>Data Viewing Notice:</span>
      Please be aware that during the initial stages of our launch, there may be
      instances of data viewing inconsistencies or delays. This is primarily due
      to our newly deployed indexer, which is designed to interpret coin values
      based on the ordering of inscriptions. We are closely monitoring and
      optimizing this process to enhance your experience.{' '}
      <span className='text-base font-medium'>
        Your Inscriptions Are Secure:
      </span>
      We want to assure all our users that despite any temporary data viewing
      challenges, your inscriptions are securely recorded and maintained on the
      {network} network. The integrity and safety of your inscriptions remain our
      top priority.
      <span className='text-base font-medium'>Continuous Improvement:</span>
      Our team is diligently working to resolve any initial hiccups and improve
      the overall functionality of the platform. We appreciate your patience and
      understanding as we refine our systems to better serve your needs.
      <br />
      We encourage our users to stay updated with the latest announcements and
      updates regarding the project. For any assistance or queries, please reach
      out to our support team.
      <br />
      <span className='mt-6 items-center justify-center flex'>
        We thank you for your support and trust in the Ordinals project.
        Together, we look forward to exploring the vast potential of
        inscriptions on the {network} network!
      </span>
    </div>
  );
};
export default Disclaimer;
