
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rooms } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, ArrowLeft, Check, Shield } from "lucide-react";

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const room = rooms.find(r => r.id === id);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"payment" | "success">("payment");
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 mb-4">Room not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/public/rooms')}
        >
          Back to Rooms
        </Button>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
      });
    }, 2000);
  };
  
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 text-center mb-6">
          Your booking has been successfully processed. Check your email for details.
        </p>
        
        <Card className="mb-6 w-full">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Room Type:</span>
                <span>{room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Number:</span>
                <span>{room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Rent:</span>
                <span>₹{room.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-medium">BK{Math.floor(Math.random() * 10000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mb-8">
          <p>Your booking details have been sent to your email.</p>
          <p className="mt-1">The hostel admin will contact you shortly.</p>
        </div>
        
        <Button 
          className="w-full bg-hostel-primary hover:bg-hostel-secondary"
          onClick={() => navigate('/public')}
        >
          Return to Homepage
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </Button>
      
      <h1 className="text-2xl font-bold">Payment Details</h1>
      
      <Card>
        <CardContent className="p-4">
          <h2 className="font-medium mb-3">Booking Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Room Type:</span>
              <span>{room.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room Charge:</span>
              <span>₹{room.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Security Deposit:</span>
              <span>₹{room.price}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span>₹{room.price * 2}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Payment Method</h2>
            <div className="flex items-center text-sm">
              <Shield size={14} className="mr-1 text-hostel-primary" />
              <span>Secure Payment</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-center text-gray-500">
          <p>Your payment information is securely encrypted.</p>
          <p className="mt-1">You will be charged ₹{room.price * 2} only after admin approval.</p>
        </div>
        
        {/* Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg pb-safe z-10">
          <Button 
            type="submit"
            className="w-full bg-hostel-primary hover:bg-hostel-secondary text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Processing Payment...</>
            ) : (
              <>Pay ₹{room.price * 2}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
