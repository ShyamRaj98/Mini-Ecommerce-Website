import { useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully!
      </h1>
      <p className="mt-4">Order ID: {id}</p>
    </div>
  );
};

export default OrderSuccess;
