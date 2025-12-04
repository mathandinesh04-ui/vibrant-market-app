import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OTPInput } from '@/components/OTPInput';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await sendOTP(phone);
    setIsLoading(false);

    if (success) {
      setStep('otp');
      setResendTimer(30);
      toast({
        title: "OTP Sent!",
        description: "Check your phone for the verification code.",
      });
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setIsLoading(true);
    const success = await verifyOTP(phone, otpValue);
    setIsLoading(false);

    if (success) {
      toast({
        title: "Welcome!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    const success = await sendOTP(phone);
    setIsLoading(false);

    if (success) {
      setResendTimer(30);
      setOtp('');
      toast({
        title: "OTP Resent!",
        description: "A new code has been sent to your phone.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-glow">
              <span className="text-4xl">🥬</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">FreshMart</h1>
            <p className="text-muted-foreground mt-2">Fresh groceries, delivered fast</p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-3xl p-8 animate-slide-up">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Sign In</h2>
                  <p className="text-muted-foreground mt-1">Enter your phone number to continue</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter phone number"
                      className="input-field pl-12 text-lg"
                      maxLength={10}
                    />
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || phone.length < 10}
                    className="w-full btn-primary-gradient rounded-xl h-14 text-lg gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Verify OTP</h2>
                  <p className="text-muted-foreground mt-1">
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium text-foreground">+91 {phone}</span>
                  </p>
                </div>

                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                />

                {isLoading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in <span className="font-medium text-foreground">{resendTimer}s</span>
                    </p>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend OTP
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => { setStep('phone'); setOtp(''); }}
                  className="w-full rounded-xl"
                >
                  Change Phone Number
                </Button>
              </div>
            )}
          </div>

          {/* Demo Hint */}
          <div className="text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Demo: Use any 10-digit number, OTP will be shown in alert<br />
              Or use <span className="font-mono bg-muted px-2 py-1 rounded">123456</span> as OTP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
