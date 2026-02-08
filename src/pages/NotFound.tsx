import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, AlertTriangle } from 'lucide-react';
import MetaTags from '../components/MetaTags';

export default function NotFound() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="404 - Boundary Change in Progress | LGR"
        description="The page you're looking for has been abolished following a structural review."
      />
      
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <div className="max-w-2xl w-full bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden">
          {/* Official Looking Header */}
          <div className="bg-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-semibold tracking-tight text-sm uppercase">Notice of Boundary Revision</span>
            </div>
            <span className="text-slate-400 text-xs">Ref: LGR-ERR-404</span>
          </div>

          <div className="p-8 md:p-12 text-center">
            {/* Large 404 Number */}
            <h1 className="text-9xl font-extrabold text-slate-200 mb-4 select-none">404</h1>
            
            <div className="relative -mt-16 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">The page has been abolished.</h2>
              <p className="text-slate-500 mt-4 max-w-md mx-auto">
                Following a structural review and a somewhat controversial public consultation, this URL has been merged into a neighboring department.
              </p>
            </div>

            {/* Funny Status List */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-dashed border-slate-300 text-left">
              <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Possible Outcomes of Investigation:
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  The page is currently undergoing a <strong>Section 114</strong> spending freeze.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  The link was transferred to a new unitary authority without a forwarding address.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  The Secretary of State has directly intervened to block access to this content.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  A committee has been formed to find the page, with a report due in Q3 2027.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm"
              >
                Return to the Head Office
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
              >
                Request a Judicial Review
              </button>
            </div>
            
            <p className="mt-8 text-xs text-slate-400">
              Printed on 100% recycled digital red tape. &copy; 2024 Local Government Reorganisation Content Management Sub-Committee.
            </p>
          </div>
        </div>

        {/* Humor Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Notice of Delay</h3>
              <p className="text-slate-600 text-sm mb-6">
                Your request for a Judicial Review has been received. However, due to a backlog in the Planning Inspectorate, your hearing is scheduled for <strong>January 2031</strong>.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md transition-colors"
              >
                Wait Patiently
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
