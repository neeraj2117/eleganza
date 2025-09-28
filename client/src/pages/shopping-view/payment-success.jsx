import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize(); // auto-detect screen size

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-50 px-4 relative overflow-hidden">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.2}
      />

      <div className="font-[Rajdhani] shadow-none rounded-2xl p-10 max-w-lg w-full text-center relative z-10">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Thank you for your purchase!  
          Your order has been placed successfully.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/shop/account")}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white w-full sm:w-auto"
          >
            View My Orders
          </Button>
          <Button
            onClick={() => navigate("/shop/home")}
            variant="outline"
            className="w-full cursor-pointer sm:w-auto"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
