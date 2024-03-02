import { Modal, Button, Image } from 'antd';
import { useApiContext } from '../context/ApiContext';
import { transactionLink } from '../utils/getExplorerLink';

const SuccessModal = ({ open, setOpen, extrinsicHash, title }) => {
  const { network } = useApiContext();
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <Button className='h-8 w-24' onClick={() => setOpen(false)}>
          ok!
        </Button>
      }>
      <div className='mt-4 flex flex-col items-center justify-center'>
        <div className='-mt-20'>
          <Image src='\assets\success.png' height={100} width={100} />
        </div>
        <span className='text-xl text-green-500 mt-2'>{title}</span>
        <div className=' text-base mt-4'>
          Check tx:
          <a
            href={transactionLink(network, extrinsicHash)}
            target='_blank'
            className='ml-1'
            rel='noreferrer'>
            Transaction link 🔗
          </a>
        </div>
      </div>
    </Modal>
  );
};
export default SuccessModal;
