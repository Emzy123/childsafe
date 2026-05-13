import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Copy, Shield } from 'lucide-react';
import { Button, Card, CardBody } from '../components/ui';
import toast from 'react-hot-toast';

export default function ReportConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const caseRef = location.state?.caseRef || 'CAB-XXXX-XXXX';

  const handleCopy = () => {
    navigator.clipboard.writeText(caseRef);
    toast.success('Case Reference copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardBody className="py-12 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900">Report Submitted Securely</h2>
          <p className="text-gray-600">
            Thank you for stepping up to protect a child. Your report has been encrypted and sent to the appropriate authorities.
          </p>

          <div className="bg-surface-secondary rounded-lg p-6 my-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Your Case Reference Number</p>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                {caseRef}
              </span>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-primary-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Please save this number. You will need it to track the status of this report anonymously.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link to="/track">
              <Button variant="primary" className="w-full">
                Track This Case
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-6">
            <Shield className="h-4 w-4" />
            <span>End-to-End Encrypted & Anonymous</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
