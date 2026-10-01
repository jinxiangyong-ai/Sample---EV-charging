import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <footer className="w-full bg-[#eff4ff] border-t border-[#bbcac0]/30 py-space-lg">
        <div className="w-full max-w-[1440px] mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md text-[#565e74] font-body-sm text-body-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
              VoltPoint EV Network
            </span>
            <span>© 2025 VoltPoint Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-space-lg font-label-md text-label-md flex-wrap">
            <button
              onClick={() => setActiveModal('Grid Telemetry')}
              className="text-[#565e74] hover:text-[#0b1c30] transition-colors cursor-pointer"
            >
              Grid Telemetry
            </button>
            <button
              onClick={() => setActiveModal('Pricing Rates')}
              className="text-[#565e74] hover:text-[#0b1c30] transition-colors cursor-pointer"
            >
              Pricing Rates
            </button>
            <button
              onClick={() => setActiveModal('Network Status')}
              className="text-[#565e74] hover:text-[#0b1c30] transition-colors cursor-pointer"
            >
              Network Status
            </button>
            <button
              onClick={() => setActiveModal('Support')}
              className="text-[#565e74] hover:text-[#0b1c30] transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Info Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <span className="font-title-md text-title-md text-[#0b1c30]">{activeModal}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#565e74] hover:text-[#0b1c30] p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 text-sm text-[#565e74] leading-relaxed">
              {activeModal === 'Grid Telemetry' && (
                <div>
                  <p className="font-semibold text-[#006c4b] mb-1">California ISO (CAISO) Real-Time Integration</p>
                  <p>
                    VoltPoint synchronizes dispenser power throttles with clean green energy generation across NorCal
                    wind and solar farms. Low-peak green energy credits save up to $0.05/kWh when renewables exceed 50%
                    grid load.
                  </p>
                </div>
              )}
              {activeModal === 'Pricing Rates' && (
                <div>
                  <p className="font-semibold text-[#0b1c30] mb-2">Transparent Standard Rates</p>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>Off-Peak (11 PM - 7 AM): $0.28 / kWh</li>
                    <li>Mid-Peak (7 AM - 4 PM): $0.34 / kWh</li>
                    <li>On-Peak (4 PM - 9 PM): $0.44 / kWh</li>
                    <li>Priority Members receive 10% discount on all peak rates.</li>
                  </ul>
                </div>
              )}
              {activeModal === 'Network Status' && (
                <div>
                  <p className="font-semibold text-[#006c4b] mb-1">All Systems Operational (99.8% Uptime)</p>
                  <p>
                    All 18 Northern California hubs operating normally. 42 stalls currently vacant and ready for immediate
                    dispatch. Zero reported hardware faults in the San Francisco metro zone.
                  </p>
                </div>
              )}
              {activeModal === 'Support' && (
                <div>
                  <p className="font-semibold text-[#0b1c30] mb-1">24/7 Driver Operations Desk</p>
                  <p>
                    Need assistance at any dispenser? Call dispatch directly at <strong>1-800-VOLT-NOW</strong> or email
                    dispatch@voltpoint.io. Remote session diagnostics available 24/7.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#00c48c] text-[#004a33] font-bold rounded-full text-sm hover:bg-[#3fdfa5]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
